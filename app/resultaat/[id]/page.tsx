import { FeedbackPlaceholder } from "@/components/feedback/FeedbackPlaceholder";
import { FollowUpRequest } from "@/components/follow-up/FollowUpRequest";
import { ResourceList } from "@/components/resources/ResourceList";
import { PageShell } from "@/components/ui/PageShell";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type GuidanceResultJson = {
  title?: string;
  personalGreeting?: string;
  summary?: string;
  emotionalImportant?: string;
  attentionFirst?: string;
  practicalUrgent?: string;
  canWait?: string;
  firstStep?: string;
  steps?: string[];
  oneThingNotToCarryAlone?: string;
  nextQuestion?: string;
  monitor?: string;
  whenToSeekHelp?: string;
  questions?: string[];
  boundaries?: string[];
  resources?: Array<{
    title: string;
    description: string;
    url?: string;
    crisis?: boolean;
  }>;
};

export default async function ResultaatPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const { data: result, error } = await supabase
    .from("guidance_results")
    .select("id, session_id, title, summary, result_json")
    .eq("id", id)
    .single();

  if (error || !result) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-5 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Resultaat niet gevonden</h1>
          <p className="mt-4 text-kompas-muted">
            Het gevraagde overzicht kon niet worden geladen. Controleer de link of start een nieuw gesprek.
          </p>
        </section>
      </PageShell>
    );
  }

  const resultJson = result.result_json as GuidanceResultJson;
  const steps = resultJson.steps ?? [];
  const questions = resultJson.questions ?? [];
  const boundaries = resultJson.boundaries ?? [];
  const resources = resultJson.resources ?? [];
  const keyThemes = [
    resultJson.emotionalImportant,
    resultJson.practicalUrgent,
    resultJson.oneThingNotToCarryAlone
  ]
    .filter(Boolean)
    .join(" | ");
  const urgencyLevel =
    resultJson.whenToSeekHelp?.toLowerCase().includes("onveilig") ||
    resultJson.whenToSeekHelp?.toLowerCase().includes("draagkracht op")
      ? "middel"
      : "laag";

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 py-10 md:py-14">
        <div className="rounded-xl border border-kompas-line/90 bg-kompas-paper/95 p-6 shadow-soft md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-kompas-green">Eerste overzicht</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {result.title}
          </h1>
        {resultJson.personalGreeting ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-kompas-ink">{resultJson.personalGreeting}</p>
        ) : null}
        </div>

        <div className="mt-6 space-y-4 md:space-y-5">
          <section className="rounded-xl border border-kompas-line/90 bg-kompas-paper/95 p-5 shadow-soft md:p-6">
            <h2 className="text-lg font-semibold">Wat ik denk dat er gebeurt</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{result.summary}</p>
          </section>

          <section className="rounded-xl border border-kompas-line bg-white/80 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Wat nu het moeilijkst lijkt</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.emotionalImportant}</p>
          </section>

          <section className="rounded-xl border border-kompas-line bg-white/80 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Wat eerst aandacht verdient</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.attentionFirst}</p>
          </section>

          <section className="rounded-xl border border-kompas-line bg-white/80 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Wat misschien niet vandaag opgelost hoeft te worden</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.canWait}</p>
          </section>

          <section className="rounded-xl border border-kompas-green/20 bg-kompas-greenSoft/70 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Een stap voor deze week</h2>
            <p className="mt-2 text-lg leading-8 text-kompas-ink">{resultJson.firstStep}</p>
          </section>

          <section className="rounded-xl border border-kompas-line bg-kompas-paper/95 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Praktische volgende stappen</h2>
            <ol className="mt-4 space-y-3 text-kompas-muted">
              {steps.map((step, index) => (
                <li key={`${index}-${step}`} className="flex gap-3 rounded-lg bg-white/80 p-3 leading-6">
                  <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-kompas-greenSoft text-center text-xs font-semibold leading-6 text-kompas-green">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-kompas-line bg-white/80 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Een ding dat je niet alleen hoeft te dragen</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.oneThingNotToCarryAlone}</p>
          </section>

          <section className="rounded-xl border border-kompas-line bg-white/80 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Een ding om te onthouden</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.nextQuestion}</p>
          </section>

          <section className="rounded-xl border border-kompas-line bg-white/80 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Wat je kan observeren zonder jezelf te veroordelen</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.monitor}</p>
          </section>

          <section className="rounded-xl border border-kompas-line bg-kompas-paper/95 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Vragen om voor te bereiden</h2>
            <ul className="mt-3 space-y-2 text-kompas-muted">
              {questions.map((question) => (
                <li key={question} className="rounded-lg bg-white/80 px-4 py-3 leading-6">
                  {question}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-kompas-line bg-white/80 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Wanneer je best iemand inschakelt</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.whenToSeekHelp}</p>
          </section>

          <section className="rounded-xl border border-kompas-line bg-kompas-paper/95 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Hulplijnen of organisaties die kunnen passen</h2>
            <p className="mt-2 text-sm text-kompas-muted">
              Deze bronnen zijn breed erkend in Vlaanderen/Belgie, maar moeten voor een bredere lancering
              opnieuw manueel gecontroleerd worden.
            </p>
            <div className="mt-4">
              <ResourceList resources={resources} />
            </div>
          </section>

          <section className="rounded-xl border border-kompas-line bg-white/80 p-5 md:p-6">
            <h2 className="text-lg font-semibold">Wat FamilieKompas wel en niet doet</h2>
            <ul className="mt-3 space-y-2 text-kompas-muted">
              {boundaries.map((boundary) => (
                <li key={boundary} className="leading-6">
                  {boundary}
                </li>
              ))}
            </ul>
          </section>

          <FeedbackPlaceholder sessionId={result.session_id} guidanceResultId={result.id} />
          <FollowUpRequest
            sessionId={result.session_id}
            guidanceResultId={result.id}
            keyThemes={keyThemes}
            urgencyLevel={urgencyLevel}
            suggestedNextStep={resultJson.oneThingNotToCarryAlone ?? "Bekijk of opvolging passend is."}
          />
        </div>
      </section>
    </PageShell>
  );
}
