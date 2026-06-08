import { loginAdmin } from "@/app/actions";
import { PageShell } from "@/components/ui/PageShell";

export default async function BeheerLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-5 py-12 md:py-16">
        <div className="rounded-xl border border-kompas-line/90 bg-kompas-paper/95 p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-kompas-green">Beheer</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin toegang</h1>
          <p className="mt-3 leading-7 text-kompas-muted">
            Deze MVP gebruikt een eenvoudige wachtwoordpoort. Geen gebruikersaccounts, geen uitgebreid dashboard.
          </p>

        <form action={loginAdmin} className="mt-6">
          <input type="hidden" name="next" value={params.next ?? "/beheer"} />
          <label className="block">
            <span className="text-sm font-semibold">Admin wachtwoord</span>
            <input
              type="password"
              name="password"
              className="mt-2 w-full rounded-lg border border-kompas-line bg-white p-3 outline-none focus:border-kompas-green focus:ring-2 focus:ring-kompas-greenSoft"
              required
            />
          </label>
          {params.error ? <p className="mt-3 text-sm font-semibold text-kompas-safety">{params.error}</p> : null}
          <button className="mt-4 rounded-lg bg-kompas-green px-4 py-2.5 text-sm font-semibold text-white shadow-soft">
            Inloggen
          </button>
        </form>
        </div>
      </section>
    </PageShell>
  );
}
