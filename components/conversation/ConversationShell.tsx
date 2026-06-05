"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { submitConversation } from "@/app/actions";
import {
  buildNextAssistantMessage,
  extractConversationContext,
  type ConversationMessage
} from "@/lib/conversation/contextExtraction";

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
  const [isPending, startTransition] = useTransition();

  const userMessageCount = messages.filter((message) => message.role === "user").length;
  const context = useMemo(() => extractConversationContext(messages), [messages]);
  const canShowResult = userMessageCount > 0;

  function addUserMessage(content: string) {
    const userMessage: ConversationMessage = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    const updatedContext = extractConversationContext(updatedMessages);
    const assistantContent = buildNextAssistantMessage(updatedContext, userMessageCount + 1);

    setMessages([...updatedMessages, { role: "assistant", content: assistantContent }]);
  }

  function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setDraft("");
    setError(null);
    addUserMessage(content);
  }

  function handleModeClick(content: string) {
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
    <section className="space-y-5">
      <div className="rounded-lg border border-kompas-line bg-kompas-paper p-4 shadow-soft">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-kompas-green text-white"
                    : "border border-kompas-line bg-white text-kompas-ink"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {context.mode === "onbekend" && userMessageCount > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {modeOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => handleModeClick(option.value)}
                className="rounded-full border border-kompas-line bg-kompas-greenSoft px-3 py-2 text-xs font-semibold text-kompas-green"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <form onSubmit={handleMessageSubmit} className="rounded-lg border border-kompas-line bg-kompas-paper p-4">
        <label htmlFor="conversation-message" className="block text-sm font-semibold">
          Schrijf in je eigen woorden
        </label>
        <textarea
          id="conversation-message"
          className="mt-3 min-h-32 w-full rounded-md border border-kompas-line bg-white p-3 text-sm outline-none focus:border-kompas-green"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Bijvoorbeeld: Ik ben een alleenstaande moeder. Mijn zoon is 8..."
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-kompas-green px-5 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Verstuur
          </button>
          <p className="text-xs leading-5 text-kompas-muted">
            FamilieKompas onthoudt wat je hier schrijft binnen dit gesprek en vraagt niet opnieuw wat al duidelijk is.
          </p>
        </div>
      </form>

      <div className="rounded-lg border border-kompas-line bg-kompas-paper p-4">
        <p className="text-sm leading-6 text-kompas-muted">
          Sommige situaties verdienen extra aandacht. Wanneer duidelijke veiligheids- of missieprioriteitssignalen
          zichtbaar zijn, kan FamilieKompas die markeren voor verdere opvolging.
        </p>
        <button
          type="button"
          disabled={!canShowResult || isPending}
          onClick={handleResultSubmit}
          className="mt-4 w-full rounded-md bg-kompas-green px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        >
          {isPending ? "Bezig met opslaan..." : "Toon mijn eerste overzicht"}
        </button>
        {!canShowResult ? (
          <p className="mt-2 text-xs text-kompas-muted">Vertel eerst kort wat er speelt.</p>
        ) : null}
        {error ? <p className="mt-3 text-sm font-semibold text-kompas-safety">{error}</p> : null}
      </div>
    </section>
  );
}
