"use server";

import { redirect } from "next/navigation";
import { clearAdminCookie, setAdminCookie } from "@/lib/admin/auth";
import {
  buildGuidanceResult,
  type ConversationContext,
  type ConversationMessage
} from "@/lib/conversation/conversationIntelligence";
import { detectMissionPriority } from "@/lib/founder-alerts/missionPriorityRules";
import { detectSafetyRisk } from "@/lib/safety/dutchSafetyRules";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ConversationPayload = {
  messages: ConversationMessage[];
  context: ConversationContext;
};

function buildFounderAlertSummary(input: {
  context: ConversationContext;
  userText: string;
  priority: "crisis" | "hoog";
  flagReason: string;
  matchedTerms?: string[];
}) {
  const { context, userText, priority, flagReason, matchedTerms = [] } = input;
  const matched = matchedTerms.length > 0 ? matchedTerms.join(", ") : "Geen specifieke term opgeslagen.";
  const nextStep =
    priority === "crisis"
      ? "Controleer of de veiligheidsflow correct werd getoond. Geen normale guidance opvolgen alsof dit een gewone case is."
      : "Bekijk of de output voldoende duidelijk is en of er een betere hulpbron of verwijzing nodig is.";

  return [
    `Prioriteit: ${priority}`,
    `Waarom geflagd: ${flagReason}`,
    `Wat gebeurde er: ${userText || "Geen gebruikersbericht opgeslagen."}`,
    `Context: ${context.summary || "Geen contextsamenvatting beschikbaar."}`,
    `Modus: ${context.mode}`,
    `Gedetecteerde termen: ${matched}`,
    `Voorgestelde reviewstap: ${nextStep}`
  ].join("\n");
}

export async function submitConversation(payload: ConversationPayload) {
  const supabase = getSupabaseServerClient();
  const userMessages = payload.messages.filter((message) => message.role === "user");
  const combinedText = userMessages.map((message) => message.content).join("\n");
  const safety = detectSafetyRisk(combinedText);
  const missionPriority = detectMissionPriority(combinedText);
  const safetyTriggered = safety.triggered;
  const safetyReason = safety.riskType;

  const { data: session, error: sessionError } = await supabase
    .from("conversation_sessions")
    .insert({
      status: safetyTriggered ? "safety_escalated" : "completed",
      safety_flag: safetyTriggered,
      safety_reason: safetyReason,
      mission_priority: missionPriority.triggered,
      mission_priority_reason: missionPriority.reason,
      context_json: payload.context,
      completed_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    throw new Error(sessionError?.message ?? "Kon gesprek niet opslaan.");
  }

  const persistedMessages = payload.messages.map((message) => ({
    session_id: session.id,
    role: message.role,
    content: message.content,
    safety_flag: safetyTriggered
  }));

  const finalAssistantMessage = {
    session_id: session.id,
    role: "assistant" as const,
    content: safetyTriggered
      ? "Veiligheidsflow gestart op basis van duidelijke risicosignalen."
      : "Eerste persoonlijk overzicht aangemaakt op basis van het gesprek.",
    safety_flag: safetyTriggered
  };

  const { error: messagesError } = await supabase
    .from("conversation_messages")
    .insert([...persistedMessages, finalAssistantMessage]);

  if (messagesError) {
    throw new Error(messagesError.message);
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
        context: payload.context,
        userText: combinedText,
        priority: "crisis",
        flagReason: `Veiligheidsmelding: ${safetyReason}`,
        matchedTerms: safety.matchedTerms
      })
    });

    redirect(`/veiligheid?session=${session.id}`);
  }

  const result = buildGuidanceResult({
    context: payload.context,
    messages: payload.messages
  });

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
        context: payload.context,
        userText: combinedText,
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

export async function submitFollowUpRequest(payload: {
  sessionId: string;
  guidanceResultId: string;
  requestedFollowUp: "later_op_terugkomen" | "verdere_opvolging";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  municipality?: string;
  preferredContact: string;
  reason?: string;
  keyThemes?: string;
  urgencyLevel?: "laag" | "middel" | "hoog";
  suggestedNextStep?: string;
}) {
  const supabase = getSupabaseServerClient();
  const fullName = `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim();
  const urgencyLevel = payload.urgencyLevel ?? "middel";
  const reason =
    payload.reason?.trim() ||
    (payload.requestedFollowUp === "verdere_opvolging"
      ? "Gebruiker vraagt verdere opvolging na het overzicht."
      : "Gebruiker wil later op deze situatie terugkomen.");
  const keyThemes = payload.keyThemes?.trim() || "Niet gespecificeerd.";
  const suggestedNextStep =
    payload.suggestedNextStep?.trim() ||
    "Bekijk de gekoppelde sessie en bepaal of een korte menselijke opvolging passend is.";

  const { data: followUp, error: followUpError } = await supabase
    .from("follow_up_requests")
    .insert({
      session_id: payload.sessionId,
      guidance_result_id: payload.guidanceResultId,
      requested_follow_up: payload.requestedFollowUp,
      first_name: payload.firstName.trim(),
      last_name: payload.lastName.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      municipality: payload.municipality?.trim() || null,
      preferred_contact: payload.preferredContact,
      reason,
      key_themes: keyThemes,
      urgency_level: urgencyLevel,
      suggested_next_step: suggestedNextStep
    })
    .select("id")
    .single();

  if (followUpError || !followUp) {
    throw new Error(followUpError?.message ?? "Kon opvolgingsvraag niet opslaan.");
  }

  const { data: alert, error: alertError } = await supabase
    .from("founder_alerts")
    .insert({
      session_id: payload.sessionId,
      priority: urgencyLevel === "hoog" ? "hoog" : "middel",
      reason: "Opvolgingsvraag na FamilieKompas-overzicht",
      summary: [
        `Naam: ${fullName}`,
        `Contact: ${payload.email.trim()}${payload.phone?.trim() ? ` / ${payload.phone.trim()}` : ""}`,
        `Gemeente: ${payload.municipality?.trim() || "Niet opgegeven"}`,
        `Voorkeurscontact: ${payload.preferredContact}`,
        `Vraag: ${reason}`,
        `Thema's: ${keyThemes}`,
        `Urgentie: ${urgencyLevel}`,
        `Voorgestelde volgende stap: ${suggestedNextStep}`
      ].join("\n")
    })
    .select("id")
    .single();

  if (alertError || !alert) {
    throw new Error(alertError?.message ?? "Kon founder alert voor opvolging niet opslaan.");
  }

  await supabase
    .from("follow_up_requests")
    .update({ founder_alert_id: alert.id })
    .eq("id", followUp.id);

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
