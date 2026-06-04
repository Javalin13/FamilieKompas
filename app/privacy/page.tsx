import { PageShell } from "@/components/ui/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
        <div className="mt-5 space-y-4 leading-7 text-kompas-muted">
          <p>
            Deze MVP-pagina is een placeholder voor de definitieve privacyverklaring. Voor de eerste lancering
            moet deze tekst juridisch en inhoudelijk worden nagekeken.
          </p>
          <p>
            FamilieKompas verzamelt in deze fase alleen informatie die nodig is om een eerste overzicht en
            volgende stap te tonen. Er worden nog geen gebruikersaccounts gebouwd.
          </p>
          <p>
            Verzoeken rond inzage of verwijdering worden in de MVP handmatig verwerkt via het contactadres van
            de oprichter.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
