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
      <section className="mx-auto max-w-md px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-kompas-green">Beheer</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin toegang</h1>
        <p className="mt-3 text-kompas-muted">
          Deze MVP gebruikt een eenvoudige wachtwoordpoort. Geen gebruikersaccounts, geen uitgebreid dashboard.
        </p>

        <form action={loginAdmin} className="mt-6 rounded-lg border border-kompas-line bg-kompas-paper p-5 shadow-soft">
          <input type="hidden" name="next" value={params.next ?? "/beheer"} />
          <label className="block">
            <span className="text-sm font-semibold">Admin wachtwoord</span>
            <input
              type="password"
              name="password"
              className="mt-2 w-full rounded-md border border-kompas-line bg-white p-3 outline-none focus:border-kompas-green"
              required
            />
          </label>
          {params.error ? <p className="mt-3 text-sm font-semibold text-kompas-safety">{params.error}</p> : null}
          <button className="mt-4 rounded-md bg-kompas-green px-4 py-2 text-sm font-semibold text-white">
            Inloggen
          </button>
        </form>
      </section>
    </PageShell>
  );
}
