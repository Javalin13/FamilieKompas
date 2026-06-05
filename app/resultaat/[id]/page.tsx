import { FeedbackPlaceholder } from "@/components/feedback/FeedbackPlaceholder";
import { ResourceList } from "@/components/resources/ResourceList";
import { PageShell } from "@/components/ui/PageShell";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type GuidanceResultJson = {
  title?: string;
  personalGreeting?: string;
  summary?: string;
  emotionalImportant?: string;
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

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-kompas-green">Eerste overzicht</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{result.title}</h1>
        {resultJson.personalGreeting ? (
          <p className="mt-4 leading-7 text-kompas-ink">{resultJson.personalGreeting}</p>
        ) : null}

        <div className="mt-8 space-y-5">
          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5 shadow-soft">
            <h2 className="text-lg font-semibold">Wat ik geloof dat je nu draagt</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{result.summary}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Wat onder de oppervlakte belangrijk lijkt</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.emotionalImportant}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Wat lijkt praktisch dringend?</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.practicalUrgent}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Wat misschien niet vandaag opgelost hoeft te worden</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.canWait}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Een zachte stap voor vandaag</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.firstStep}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Praktische volgende stappen</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-kompas-muted">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Een ding dat je niet alleen hoeft te dragen</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.oneThingNotToCarryAlone}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Een vraag die richting kan geven</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.nextQuestion}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Wat je kan observeren zonder jezelf te veroordelen</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.monitor}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Vragen om voor te bereiden</h2>
            <ul className="mt-3 space-y-2 text-kompas-muted">
              {questions.map((question) => (
                <li key={question}>- {question}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Wanneer je best iemand inschakelt</h2>
            <p className="mt-2 leading-7 text-kompas-muted">{resultJson.whenToSeekHelp}</p>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Hulplijnen of organisaties die kunnen passen</h2>
            <p className="mt-2 text-sm text-kompas-muted">
              Deze bronnen zijn breed erkend in Vlaanderen/Belgie, maar moeten voor een bredere lancering
              opnieuw manueel gecontroleerd worden.
            </p>
            <div className="mt-4">
              <ResourceList resources={resources} />
            </div>
          </section>

          <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
            <h2 className="text-lg font-semibold">Wat FamilieKompas wel en niet doet</h2>
            <ul className="mt-3 space-y-2 text-kompas-muted">
              {boundaries.map((boundary) => (
                <li key={boundary}>- {boundary}</li>
              ))}
            </ul>
          </section>

          <FeedbackPlaceholder sessionId={result.session_id} guidanceResultId={result.id} />
        </div>
      </section>
    </PageShell>
  );
}
