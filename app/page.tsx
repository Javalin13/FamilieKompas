import Link from "next/link";
import { landingCopy } from "@/content/nl/landing";
import { PageShell } from "@/components/ui/PageShell";
import { BoundaryNotice } from "@/components/ui/BoundaryNotice";

export default function HomePage() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-[1.15fr_0.85fr] md:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-kompas-green">
            {landingCopy.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {landingCopy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-kompas-muted">
            {landingCopy.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/gesprek"
              className="rounded-md bg-kompas-green px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              {landingCopy.primaryAction}
            </Link>
            <Link
              href="/voorwaarden"
              className="rounded-md border border-kompas-line bg-kompas-paper px-5 py-3 text-sm font-semibold text-kompas-ink"
            >
              {landingCopy.secondaryAction}
            </Link>
          </div>
          <p className="mt-6 text-sm text-kompas-muted">{landingCopy.trustLine}</p>
        </div>
        <BoundaryNotice />
      </section>
    </PageShell>
  );
}
