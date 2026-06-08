import Link from "next/link";
import { landingCopy } from "@/content/nl/landing";
import { PageShell } from "@/components/ui/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-kompas-green">
            {landingCopy.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            {landingCopy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-kompas-muted">
            {landingCopy.intro}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/gesprek"
              className="rounded-lg bg-kompas-green px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-kompas-green/95 focus:outline-none focus:ring-2 focus:ring-kompas-green focus:ring-offset-2 focus:ring-offset-kompas-cream"
            >
              {landingCopy.primaryAction}
            </Link>
            <Link
              href="/voorwaarden"
              className="rounded-lg border border-kompas-line bg-kompas-paper px-5 py-3 text-sm font-semibold text-kompas-ink transition hover:border-kompas-green/40 hover:bg-white"
            >
              {landingCopy.secondaryAction}
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold text-kompas-green">
            <span className="rounded-full bg-kompas-greenSoft px-3 py-1.5">Geen therapie</span>
            <span className="rounded-full bg-kompas-greenSoft px-3 py-1.5">Geen diagnose</span>
            <span className="rounded-full bg-kompas-greenSoft px-3 py-1.5">Wel rust en richting</span>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-kompas-muted">{landingCopy.trustLine}</p>
        </div>
        <aside className="rounded-xl border border-kompas-line/90 bg-kompas-paper/95 p-6 shadow-soft md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-kompas-green">Na de uren</p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">Eerst rust, dan richting.</h2>
          <p className="mt-5 leading-7 text-kompas-muted">
            Je hoeft niet meteen te weten bij welke dienst je moet zijn. Begin met vertellen wat er gebeurt.
            FamilieKompas helpt je het kleiner maken: wat is belangrijk, wat kan wachten, en welke eerste stap
            past vandaag?
          </p>
          <div className="mt-6 rounded-lg bg-kompas-greenSoft/70 p-4 text-sm leading-6 text-kompas-ink">
            Vertel vrij. Het gesprek helpt ordenen voordat er iets van je verwacht wordt.
          </div>
          <p className="mt-5 text-sm leading-6 text-kompas-muted">
            Bij duidelijke veiligheidszorgen verwijst FamilieKompas naar erkende hulpbronnen en wordt normale
            begeleiding niet verdergezet.
          </p>
        </aside>
      </section>
    </PageShell>
  );
}
