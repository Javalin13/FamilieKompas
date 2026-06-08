"use client";

import { FormEvent, useState, useTransition } from "react";
import { submitFollowUpRequest } from "@/app/actions";

type FollowUpChoice = "voldoende" | "later_op_terugkomen" | "verdere_opvolging";

export function FollowUpRequest({
  sessionId,
  guidanceResultId,
  keyThemes,
  urgencyLevel,
  suggestedNextStep
}: {
  sessionId: string;
  guidanceResultId: string;
  keyThemes: string;
  urgencyLevel: "laag" | "middel" | "hoog";
  suggestedNextStep: string;
}) {
  const [choice, setChoice] = useState<FollowUpChoice>("voldoende");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (choice === "voldoende") {
      setSubmitted(true);
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await submitFollowUpRequest({
          sessionId,
          guidanceResultId,
          requestedFollowUp: choice,
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          municipality: String(formData.get("municipality") ?? ""),
          preferredContact: String(formData.get("preferredContact") ?? "email"),
          reason:
            choice === "verdere_opvolging"
              ? "Gebruiker vraagt verdere opvolging na het FamilieKompas-overzicht."
              : "Gebruiker wil later op deze situatie terugkomen.",
          keyThemes,
          urgencyLevel,
          suggestedNextStep
        });
        setSubmitted(true);
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Je opvolgingsvraag kon niet worden opgeslagen."
        );
      }
    });
  }

  if (submitted) {
    return (
      <section className="rounded-xl border border-kompas-green/20 bg-kompas-greenSoft/70 p-5 md:p-6">
        <h2 className="text-lg font-semibold">Dank je</h2>
        <p className="mt-2 leading-7 text-kompas-muted">
          Je keuze is opgeslagen. Als je verdere opvolging vroeg, wordt dit zichtbaar gemaakt voor de founder.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-kompas-line/90 bg-kompas-paper/95 p-5 shadow-soft md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kompas-green">Rustige opvolging</p>
      <h2 className="text-lg font-semibold">Wil je dat FamilieKompas dit verder opvolgt?</h2>
      <p className="mt-2 text-sm leading-6 text-kompas-muted">
        Je hoeft pas gegevens achter te laten als je later wil terugkomen of verdere opvolging wenst.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-2 text-sm">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-kompas-line bg-white/80 p-3">
            <input
              type="radio"
              name="followUpChoice"
              checked={choice === "voldoende"}
              onChange={() => setChoice("voldoende")}
            />
            Dit is voldoende
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-kompas-line bg-white/80 p-3">
            <input
              type="radio"
              name="followUpChoice"
              checked={choice === "later_op_terugkomen"}
              onChange={() => setChoice("later_op_terugkomen")}
            />
            Ik wil hier later op terugkomen
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-kompas-line bg-white/80 p-3">
            <input
              type="radio"
              name="followUpChoice"
              checked={choice === "verdere_opvolging"}
              onChange={() => setChoice("verdere_opvolging")}
            />
            Ik wil graag verdere opvolging
          </label>
        </div>

        {choice !== "voldoende" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold">
              Voornaam
              <input name="firstName" required className="mt-1 w-full rounded-lg border border-kompas-line bg-white p-3 outline-none focus:border-kompas-green" />
            </label>
            <label className="text-sm font-semibold">
              Achternaam
              <input name="lastName" required className="mt-1 w-full rounded-lg border border-kompas-line bg-white p-3 outline-none focus:border-kompas-green" />
            </label>
            <label className="text-sm font-semibold">
              E-mail
              <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-kompas-line bg-white p-3 outline-none focus:border-kompas-green" />
            </label>
            <label className="text-sm font-semibold">
              Telefoon optioneel
              <input name="phone" className="mt-1 w-full rounded-lg border border-kompas-line bg-white p-3 outline-none focus:border-kompas-green" />
            </label>
            <label className="text-sm font-semibold">
              Gemeente optioneel
              <input name="municipality" className="mt-1 w-full rounded-lg border border-kompas-line bg-white p-3 outline-none focus:border-kompas-green" />
            </label>
            <label className="text-sm font-semibold">
              Voorkeurscontact
              <select name="preferredContact" className="mt-1 w-full rounded-lg border border-kompas-line bg-white p-3 outline-none focus:border-kompas-green">
                <option value="email">E-mail</option>
                <option value="telefoon">Telefoon</option>
              </select>
            </label>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-kompas-green px-4 py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-50"
        >
          {isPending ? "Bezig met opslaan..." : "Bewaar mijn keuze"}
        </button>
        {error ? <p className="text-sm font-semibold text-kompas-safety">{error}</p> : null}
      </form>
    </section>
  );
}
