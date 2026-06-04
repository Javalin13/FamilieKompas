"use client";

import { useState, useTransition } from "react";
import { submitFeedback } from "@/app/actions";
import { feedbackCopy } from "@/content/nl/feedback";

export function FeedbackPlaceholder({
  sessionId,
  guidanceResultId
}: {
  sessionId: string;
  guidanceResultId: string;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function saveFeedback(rating: string) {
    setChoice(rating);
    setError(null);

    startTransition(async () => {
      try {
        await submitFeedback({ sessionId, guidanceResultId, rating });
      } catch (feedbackError) {
        setError(
          feedbackError instanceof Error ? feedbackError.message : "Feedback kon niet worden opgeslagen."
        );
      }
    });
  }

  return (
    <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
      <h2 className="text-lg font-semibold">{feedbackCopy.title}</h2>
      <p className="mt-2 text-sm text-kompas-muted">{feedbackCopy.intro}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[feedbackCopy.positive, feedbackCopy.neutral, feedbackCopy.negative].map((label) => (
          <button
            key={label}
            type="button"
            disabled={isPending}
            onClick={() => saveFeedback(label)}
            className="rounded-md border border-kompas-line bg-white px-3 py-2 text-sm hover:border-kompas-green"
          >
            {label}
          </button>
        ))}
      </div>
      {choice ? <p className="mt-3 text-sm text-kompas-green">Feedback opgeslagen: {choice}</p> : null}
      {error ? <p className="mt-3 text-sm font-semibold text-kompas-safety">{error}</p> : null}
    </section>
  );
}
