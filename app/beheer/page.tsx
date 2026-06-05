import { PageShell } from "@/components/ui/PageShell";
import { logoutAdmin, markFounderAlertResolved } from "@/app/actions";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/admin/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BeheerPage() {
  const cookieStore = await cookies();
  if (!verifyAdminCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect("/beheer/login?next=%2Fbeheer");
  }

  let alerts: Array<{
    id: string;
    priority: string;
    reason: string;
    summary: string;
    status: string;
    created_at: string;
  }> = [];
  let followUps: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    municipality: string | null;
    preferred_contact: string;
    requested_follow_up: string;
    reason: string | null;
    key_themes: string | null;
    urgency_level: string;
    suggested_next_step: string | null;
    status: string;
    created_at: string;
  }> = [];
  let configurationError: string | null = null;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("founder_alerts")
      .select("id, priority, reason, summary, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      configurationError = error.message;
    } else {
      alerts = data ?? [];
    }

    const { data: followUpData, error: followUpError } = await supabase
      .from("follow_up_requests")
      .select(
        "id, first_name, last_name, email, phone, municipality, preferred_contact, requested_follow_up, reason, key_themes, urgency_level, suggested_next_step, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (followUpError) {
      configurationError = followUpError.message;
    } else {
      followUps = followUpData ?? [];
    }
  } catch (error) {
    configurationError =
      error instanceof Error ? error.message : "Founder alerts konden niet worden geladen.";
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-kompas-green">Beheer</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Founder alerts</h1>
            <p className="mt-3 max-w-2xl text-kompas-muted">
              Eenvoudige lijst met opgeslagen missie- en veiligheidsmeldingen. Deze pagina is beschermd met een
              MVP-wachtwoordpoort.
            </p>
          </div>
          <form action={logoutAdmin}>
            <button className="rounded-md border border-kompas-line bg-kompas-paper px-4 py-2 text-sm font-semibold">
              Uitloggen
            </button>
          </form>
        </div>

        {configurationError ? (
          <div className="mt-6 rounded-lg border border-kompas-safety bg-kompas-paper p-5 text-sm text-kompas-safety">
            Supabase is nog niet correct geconfigureerd: {configurationError}
          </div>
        ) : null}

        <section className="mt-6">
          <h2 className="text-xl font-semibold">Opvolgingsvragen</h2>
          <div className="mt-3 space-y-3">
            {followUps.length === 0 && !configurationError ? (
              <p className="rounded-lg border border-kompas-line bg-kompas-paper p-5 text-kompas-muted">
                Er zijn nog geen opvolgingsvragen.
              </p>
            ) : null}

            {followUps.map((request) => (
              <article key={request.id} className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-kompas-greenSoft px-3 py-1 text-xs font-semibold uppercase text-kompas-green">
                    Urgentie: {request.urgency_level}
                  </span>
                  <span className="rounded-full border border-kompas-line px-3 py-1 text-xs font-semibold uppercase text-kompas-muted">
                    Status: {request.status}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold">
                  {request.first_name} {request.last_name}
                </h3>
                <p className="mt-1 text-sm text-kompas-muted">
                  {request.email}
                  {request.phone ? ` / ${request.phone}` : ""}
                  {request.municipality ? ` / ${request.municipality}` : ""}
                </p>
                <p className="mt-2 text-sm text-kompas-muted">Voorkeurscontact: {request.preferred_contact}</p>
                <p className="mt-3 whitespace-pre-line text-sm text-kompas-muted">
                  Waarom: {request.reason ?? request.requested_follow_up}
                  {"\n"}Thema's: {request.key_themes ?? "Niet opgegeven"}
                  {"\n"}Voorgestelde volgende stap: {request.suggested_next_step ?? "Niet opgegeven"}
                </p>
                <p className="mt-2 text-xs text-kompas-muted">
                  Aangemaakt: {new Date(request.created_at).toLocaleString("nl-BE")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-6 space-y-3">
          {alerts.length === 0 && !configurationError ? (
            <p className="rounded-lg border border-kompas-line bg-kompas-paper p-5 text-kompas-muted">
              Er zijn nog geen founder alerts.
            </p>
          ) : null}

          {alerts.map((alert) => (
            <article key={alert.id} className="rounded-lg border border-kompas-line bg-kompas-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-kompas-greenSoft px-3 py-1 text-xs font-semibold uppercase text-kompas-green">
                      Prioriteit: {alert.priority}
                    </span>
                    <span className="rounded-full border border-kompas-line px-3 py-1 text-xs font-semibold uppercase text-kompas-muted">
                      Status: {alert.status}
                    </span>
                  </div>
                  <h2 className="mt-3 font-semibold">{alert.reason}</h2>
                  <p className="mt-1 max-w-2xl whitespace-pre-line text-sm text-kompas-muted">
                    {alert.summary}
                  </p>
                  <p className="mt-2 text-xs text-kompas-muted">
                    Aangemaakt: {new Date(alert.created_at).toLocaleString("nl-BE")}
                  </p>
                </div>
              </div>
              {alert.status !== "gesloten" ? (
                <form action={markFounderAlertResolved.bind(null, alert.id)} className="mt-4">
                  <button className="rounded-md border border-kompas-line bg-white px-3 py-2 text-sm font-semibold">
                    Markeer als gesloten
                  </button>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
