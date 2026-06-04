import { BoundaryNotice } from "@/components/ui/BoundaryNotice";
import { PageShell } from "@/components/ui/PageShell";

export default function VoorwaardenPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Grenzen van FamilieKompas</h1>
        <p className="mt-4 leading-7 text-kompas-muted">
          FamilieKompas helpt ouders en gezinnen om een moeilijke situatie te ordenen en een volgende stap te
          vinden. Het platform vervangt geen professionele hulp.
        </p>
        <div className="mt-6">
          <BoundaryNotice />
        </div>
      </section>
    </PageShell>
  );
}
