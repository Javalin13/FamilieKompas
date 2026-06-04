"use server";

import { redirect } from "next/navigation";
import { clearAdminCookie, setAdminCookie } from "@/lib/admin/auth";
import { buildStaticGuidanceResult } from "@/lib/guidance/staticGuidance";
import { detectMissionPriority } from "@/lib/founder-alerts/missionPriorityRules";
import { detectSafetyRisk } from "@/lib/safety/dutchSafetyRules";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ConversationPayload = {
  answers: Record<string, string>;
  urgent: string;
};

function summarizeAnswers(answers: Record<string, string>) {
  const situation = answers.situation?.trim();
  const hardest = answers.hardest?.trim();

  if (situation && hardest) {
    return `${situation}\n\nMoeilijkste punt: ${hardest}`;
  }

  return situation || hardest || "Geen samenvatting beschikbaar.";
}

function buildFounderAlertSummary(input: {
  answers: Record<string, string>;
  priority: "crisis" | "hoog";
  flagReason: string;
  matchedTerms?: string[];
}) {
  const { answers, priority, flagReason, matchedTerms = [] } = input;
  const situation = answers.situation?.trim() || "Niet ingevuld.";
  const hardest = answers.hardest?.trim() || "Niet ingevuld.";
  const support = answers.support?.trim() || "Niet ingevuld.";
  const matched = matchedTerms.length > 0 ? matchedTerms.join(", ") : "Geen specifieke term opgeslagen.";
  const nextStep =
    priority === "crisis"
      ? "Controleer of de veiligheidsflow correct werd getoond. Geen normale guidance opvolgen alsof dit een gewone case is."
      : "Bekijk of de output voldoende duidelijk is en of er een betere hulpbron of verwijzing nodig is.";

  return [
    `Prioriteit: ${priority}`,
    `Waarom geflagd: ${flagReason}`,
    `Wat gebeurde er: ${situation}`,
    `Moeilijkste punt: ${hardest}`,
    `Gewenste volgende stap: ${support}`,
    `Gedetecteerde termen: ${matched}`,
    `Voorgestelde reviewstap: ${nextStep}`
  ].join("\n");
}

export async function submitConversation(payload: ConversationPayload) {
  const supabase = getSupabaseServerClient();
  const combinedText = Object.values(payload.answers).join("\n");
  const safety = detectSafetyRisk(combinedText);
  const missionPriority = detectMissionPriority(combinedText);
  const safetyTriggered = safety.triggered || payload.urgent === "ja";
  const safetyReason = safety.riskType ?? (payload.urgent === "ja" ? "door_gebruiker_aangegeven" : null);

  const { data: session, error: sessionError } = await supabase
    .from("conversation_sessions")
    .insert({
      status: safetyTriggered ? "safety_escalated" : "completed",
      safety_flag: safetyTriggered,
      safety_reason: safetyReason,
      mission_priority: missionPriority.triggered,
      mission_priority_reason: missionPriority.reason,
      completed_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    throw new Error(sessionError?.message ?? "Kon gesprek niet opslaan.");
  }

  const userMessages = Object.entries(payload.answers)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => ({
      session_id: session.id,
      role: "user" as const,
      content: `${key}: ${value}`,
      safety_flag: safetyTriggered
    }));

  const assistantMessage = {
    session_id: session.id,
    role: "assistant" as const,
    content: safetyTriggered
      ? "Veiligheidsflow gestart op basis van duidelijke risicosignalen."
      : "Eerste overzicht aangemaakt op basis van het gesprek.",
    safety_flag: safetyTriggered
  };

  if (userMessages.length > 0) {
    const { error: messagesError } = await supabase
      .from("conversation_messages")
      .insert([...userMessages, assistantMessage]);

    if (messagesError) {
      throw new Error(messagesError.message);
    }
  }

  if (safetyTriggered) {
    await supabase.from("safety_events").insert({
      conversation_id: session.id,
      risk_type: safetyReason,
      risk_level: "crisis",
      action_taken: "veiligheidspagina_getoond"
    });

    await supabase.from("founder_alerts").insert({
      session_id: session.id,
      priority: "crisis",
      reason: `Veiligheidsmelding: ${safetyReason}`,
      summary: buildFounderAlertSummary({
        answers: payload.answers,
        priority: "crisis",
        flagReason: `Veiligheidsmelding: ${safetyReason}`,
        matchedTerms: safety.matchedTerms
      })
    });

    redirect(`/veiligheid?session=${session.id}`);
  }

  const result = buildStaticGuidanceResult(payload.answers);

  const { data: guidanceResult, error: resultError } = await supabase
    .from("guidance_results")
    .insert({
      session_id: session.id,
      title: result.title,
      summary: result.summary,
      result_json: result
    })
    .select("id")
    .single();

  if (resultError || !guidanceResult) {
    throw new Error(resultError?.message ?? "Kon resultaat niet opslaan.");
  }

  if (missionPriority.triggered) {
    await supabase.from("founder_alerts").insert({
      session_id: session.id,
      priority: "hoog",
      reason: `Missie-prioriteit: ${missionPriority.reason}`,
      summary: buildFounderAlertSummary({
        answers: payload.answers,
        priority: "hoog",
        flagReason: `Missie-prioriteit: ${missionPriority.reason}`,
        matchedTerms: missionPriority.matchedTerms
      })
    });
  }

  redirect(`/resultaat/${guidanceResult.id}`);
}

export async function submitFeedback(payload: {
  sessionId: string;
  guidanceResultId: string;
  rating: string;
  note?: string;
}) {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.from("feedback_entries").insert({
    session_id: payload.sessionId,
    guidance_result_id: payload.guidanceResultId,
    rating: payload.rating,
    note: payload.note?.trim() || null
  });

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true };
}

export async function markFounderAlertResolved(alertId: string) {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("founder_alerts")
    .update({
      status: "gesloten",
      resolved_at: new Date().toISOString()
    })
    .eq("id", alertId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/beheer");
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    redirect("/beheer/login?error=ADMIN_PASSWORD%20ontbreekt");
  }

  if (password !== configuredPassword) {
    redirect("/beheer/login?error=Ongeldig%20wachtwoord");
  }

  await setAdminCookie();
  redirect(nextPath.startsWith("/beheer") ? nextPath : "/beheer");
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/beheer/login");
}
