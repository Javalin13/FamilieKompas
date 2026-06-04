"use client";

import { FormEvent, useState, useTransition } from "react";
import { submitConversation } from "@/app/actions";
import { conversationQuestions, urgencyQuestions } from "@/content/nl/conversation";

type Answers = Record<string, string>;

export function ConversationShell() {
  const [answers, setAnswers] = useState<Answers>({});
  const [urgent, setUrgent] = useState("nee");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await submitConversation({ answers, urgent });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5 shadow-soft">
        <h2 className="text-xl font-semibold">Vertel kort wat er speelt</h2>
        <p className="mt-2 text-sm leading-6 text-kompas-muted">
          Je antwoorden worden opgeslagen zodat FamilieKompas een eerste overzicht kan tonen en duidelijke
          veiligheidsmeldingen kan opvolgen.
        </p>
      </section>

      {conversationQuestions.map((question) => (
        <label key={question.id} className="block rounded-lg border border-kompas-line bg-kompas-paper p-5">
          <span className="block text-base font-semibold">{question.label}</span>
          <span className="mt-1 block text-sm text-kompas-muted">{question.helper}</span>
          <textarea
            className="mt-4 min-h-24 w-full rounded-md border border-kompas-line bg-white p-3 text-sm outline-none focus:border-kompas-green"
            value={answers[question.id] ?? ""}
            onChange={(event) => updateAnswer(question.id, event.target.value)}
            placeholder="Schrijf hier je antwoord..."
          />
        </label>
      ))}

      <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
        <h2 className="text-lg font-semibold">Eerst even veiligheid</h2>
        <ul className="mt-3 space-y-2 text-sm text-kompas-muted">
          {urgencyQuestions.map((question) => (
            <li key={question}>- {question}</li>
          ))}
        </ul>
        <div className="mt-4 flex gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="urgent"
              value="nee"
              checked={urgent === "nee"}
              onChange={() => setUrgent("nee")}
            />
            Nee, niet onmiddellijk
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="urgent"
              value="ja"
              checked={urgent === "ja"}
              onChange={() => setUrgent("ja")}
            />
            Ja, mogelijk wel
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-kompas-green px-5 py-3 text-sm font-semibold text-white shadow-soft md:w-auto"
      >
        {isPending ? "Bezig met opslaan..." : "Toon mijn eerste overzicht"}
      </button>
      {error ? <p className="text-sm font-semibold text-kompas-safety">{error}</p> : null}
    </form>
  );
}
