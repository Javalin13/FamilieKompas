import Link from "next/link";
import { ResourceList } from "@/components/resources/ResourceList";
import { PageShell } from "@/components/ui/PageShell";
import { safetyCopy } from "@/content/nl/safety";

export default function VeiligheidPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 py-10 md:py-14">
        <div className="rounded-xl border border-kompas-safety/70 bg-kompas-paper/95 p-6 shadow-soft md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-kompas-safety">Veiligheid</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{safetyCopy.title}</h1>
          <p className="mt-5 max-w-3xl leading-7 text-kompas-muted">{safetyCopy.intro}</p>
          <p className="mt-5 rounded-lg bg-kompas-sand p-4 font-semibold leading-7 text-kompas-safety">
            {safetyCopy.emergency}
          </p>
          <p className="mt-4 leading-7 text-kompas-muted">{safetyCopy.next}</p>
        </div>

        <section className="mt-6 rounded-xl border border-kompas-line bg-kompas-paper/95 p-5 md:p-6">
          <h2 className="text-lg font-semibold">Dringende hulpbronnen</h2>
          <p className="mt-2 text-sm leading-6 text-kompas-muted">
            Deze lijst bevat breed erkende Belgische en Vlaamse hulpbronnen. FamilieKompas kiest niet voor jou
            welke dienst past, maar helpt je om sneller een veilige richting te zien.
          </p>
          <div className="mt-4">
            <ResourceList crisisOnly />
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-kompas-line bg-kompas-paper/95 p-5 md:p-6">
          <h2 className="text-lg font-semibold">Andere ondersteuning wanneer het niet acuut is</h2>
          <p className="mt-2 text-sm leading-6 text-kompas-muted">
            Als er geen onmiddellijk gevaar is, kunnen deze diensten helpen om te praten, opvoedingsvragen te
            verkennen of sociale/familiale ondersteuning te vinden.
          </p>
          <div className="mt-4">
            <ResourceList supportOnly />
          </div>
        </section>

        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-kompas-green">
          Terug naar start
        </Link>
      </section>
    </PageShell>
  );
}
