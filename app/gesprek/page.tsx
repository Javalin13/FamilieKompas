import { ConversationShell } from "@/components/conversation/ConversationShell";
import { PageShell } from "@/components/ui/PageShell";
import { BoundaryNotice } from "@/components/ui/BoundaryNotice";

export default function GesprekPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-kompas-green">Gesprek</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Een rustige eerste ordening</h1>
          <p className="mt-3 text-kompas-muted">
            Beantwoord enkele vragen. Je hoeft geen perfecte uitleg te geven.
          </p>
        </div>
        <div className="mb-6">
          <BoundaryNotice />
        </div>
        <ConversationShell />
      </section>
    </PageShell>
  );
}
