"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { submitConversation } from "@/app/actions";
import {
  decideNextConversationStep,
  extractConversationContext,
  generateAssistantReply,
  type ConversationMessage
} from "@/lib/conversation/conversationIntelligence";

const initialAssistantMessage =
  "Welkom. Vertel rustig wat er speelt. Je mag zoveel of zo weinig vertellen als je wil.";

const modeOptions = [
  { label: "Mijn verhaal kwijt", value: "Ik wil vooral even mijn verhaal kwijt." },
  { label: "Structuur krijgen", value: "Ik wil vooral structuur krijgen." },
  { label: "Eerste stappen zien", value: "Ik wil vooral eerste stappen zien." }
];

export function ConversationShell() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { role: "assistant", content: initialAssistantMessage }
  ]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isPending, startTransition] = useTransition();

  const userMessageCount = messages.filter((message) => message.role === "user").length;
  const context = useMemo(() => extractConversationContext(messages), [messages]);
  const decision = useMemo(() => decideNextConversationStep(messages), [messages]);
  const canShowResult = decision.canCreateGuidance;
  const composerPlaceholder =
    userMessageCount === 0
      ? "Bijvoorbeeld: Ik ben een alleenstaande moeder. Mijn zoon is 8..."
      : "Schrijf gerust verder. FamilieKompas neemt mee wat je eerder zei.";

  function addUserMessage(content: string) {
    const userMessage: ConversationMessage = { role: "user", content };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsThinking(true);

    window.setTimeout(() => {
      setMessages([...updatedMessages, { role: "assistant", content: generateAssistantReply(updatedMessages) }]);
      setIsThinking(false);
    }, 420);
  }

  function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isThinking) return;

    setDraft("");
    setError(null);
    addUserMessage(content);
  }

  function handleModeClick(content: string) {
    if (isThinking) return;
    addUserMessage(content);
  }

  function handleResultSubmit() {
    setError(null);

    startTransition(async () => {
      try {
        await submitConversation({ messages, context });
      } catch (submissionError) {
        const digest =
          typeof submissionError === "object" && submissionError && "digest" in submissionError
            ? String(submissionError.digest)
            : "";
        if (digest.startsWith("NEXT_REDIRECT")) {
          throw submissionError;
        }
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Er ging iets mis bij het bewaren van het gesprek."
        );
      }
    });
  }

  return (
    <section className="mx-auto flex min-h-[72vh] max-w-4xl flex-col overflow-hidden rounded-xl border border-kompas-line/90 bg-kompas-paper/95 shadow-soft">
      <div className="border-b border-kompas-line/80 bg-white/50 px-5 py-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-kompas-green">FamilieKompas luistert mee</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-kompas-muted">
          Je hoeft niets perfect te formuleren. Aanvullen, corrigeren of gewoon verder vertellen mag altijd.
        </p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 md:px-7 md:py-8">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[92%] md:max-w-[74%] ${message.role === "assistant" ? "space-y-2" : ""}`}>
              {message.role === "assistant" ? (
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-kompas-green">
                  FamilieKompas
                </p>
              ) : null}
              <div
                className={`rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-[0_1px_0_rgba(36,52,47,0.04)] ${
                  message.role === "user"
                    ? "rounded-br-md bg-kompas-green text-white"
                    : "rounded-bl-md border border-kompas-line bg-white/95 text-kompas-ink"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isThinking ? (
          <div className="flex justify-start">
            <div className="max-w-[76%] space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-kompas-green">FamilieKompas</p>
              <div className="rounded-2xl rounded-bl-md border border-kompas-line bg-white/95 px-4 py-3 text-sm text-kompas-muted">
                Neemt even mee wat je net schreef...
              </div>
            </div>
          </div>
        ) : null}

        {context.mode === "onbekend" && userMessageCount > 0 && !isThinking ? (
          <div className="flex flex-wrap gap-2 rounded-xl border border-kompas-green/10 bg-kompas-greenSoft/65 p-4">
            <p className="w-full text-xs font-semibold text-kompas-green">
              Wat heb je nu het meest nodig?
            </p>
            {modeOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => handleModeClick(option.value)}
                className="rounded-full border border-kompas-line bg-kompas-paper px-3 py-2 text-xs font-semibold text-kompas-green transition hover:border-kompas-green/40 hover:bg-white"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="border-t border-kompas-line bg-kompas-paper/95 p-4 md:p-6">
        <form onSubmit={handleMessageSubmit} className="space-y-3">
          <label htmlFor="conversation-message" className="sr-only">
            Schrijf verder
          </label>
          <textarea
            id="conversation-message"
            className="min-h-32 w-full resize-none rounded-xl border border-kompas-line bg-white p-4 text-[15px] leading-7 outline-none transition focus:border-kompas-green focus:ring-2 focus:ring-kompas-greenSoft"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={composerPlaceholder}
          />
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md text-xs leading-5 text-kompas-muted">
              FamilieKompas onthoudt deze gesprekscontext. Je mag aanvullen; herhalen hoeft niet.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isThinking}
                className="rounded-lg bg-kompas-green px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-kompas-green/95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isThinking ? "Even aan het luisteren..." : "Stuur aanvulling"}
              </button>
              <button
                type="button"
                disabled={!canShowResult || isPending || isThinking}
                onClick={handleResultSubmit}
                className="rounded-lg border border-kompas-line bg-white px-4 py-2.5 text-sm font-semibold text-kompas-ink transition hover:border-kompas-green/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Overzicht maken..." : "Maak mijn rustige overzicht"}
              </button>
            </div>
          </div>
        </form>

        <p className="mt-3 text-xs leading-5 text-kompas-muted">
          Sommige situaties verdienen extra aandacht. Bij duidelijke veiligheids- of missieprioriteitssignalen kan
          FamilieKompas die markeren voor verdere opvolging.
        </p>
        {!canShowResult ? <p className="mt-2 text-xs text-kompas-muted">Vertel eerst kort wat er speelt.</p> : null}
        {error ? <p className="mt-3 text-sm font-semibold text-kompas-safety">{error}</p> : null}
      </div>
    </section>
  );
}
