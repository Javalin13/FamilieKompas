export type ConversationMode = "verhaal" | "structuur" | "stappen" | "onbekend";

export type ConversationContext = {
  preferredName?: string;
  parentRole?: string;
  childAges: string[];
  familySituation?: string;
  peopleInvolved: string[];
  emotionalState?: string;
  attemptedActions: string[];
  desiredOutcome?: string;
  keyConcerns: string[];
  mode: ConversationMode;
  summary: string;
};

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

const roleTerms = [
  { term: "alleenstaande moeder", value: "alleenstaande moeder" },
  { term: "alleenstaande vader", value: "alleenstaande vader" },
  { term: "alleenstaande ouder", value: "alleenstaande ouder" },
  { term: "moeder", value: "moeder" },
  { term: "vader", value: "vader" },
  { term: "pleegouder", value: "pleegouder" },
  { term: "stiefouder", value: "stiefouder" },
  { term: "ouder", value: "ouder" },
  { term: "verzorger", value: "verzorger" }
];

const peopleTerms = [
  "kind",
  "zoon",
  "dochter",
  "partner",
  "ex-partner",
  "co-ouder",
  "school",
  "leerkracht",
  "zorgleerkracht",
  "familie",
  "grootouders",
  "caw",
  "huisarts"
];

const emotionalTerms = [
  "uitgeput",
  "overweldigd",
  "vastgelopen",
  "bang",
  "boos",
  "verdrietig",
  "alleen",
  "ten einde raad",
  "ik kan niet meer",
  "ik ben op",
  "machteloos",
  "paniek"
];

const concernTerms = [
  { term: "gedragsproblemen", value: "zorgen over gedrag" },
  { term: "agressief", value: "agressie of hevige reacties" },
  { term: "woedeaanvallen", value: "woedeaanvallen" },
  { term: "school", value: "druk of zorgen rond school" },
  { term: "leerkracht", value: "contact met school" },
  { term: "scheiding", value: "scheiding of co-ouderschap" },
  { term: "co-ouder", value: "co-ouderschap" },
  { term: "angst", value: "angst of spanning" },
  { term: "achterstand", value: "ontwikkeling of leerachterstand" },
  { term: "geld", value: "financiele druk" },
  { term: "woning", value: "woonstress" }
];

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalize(text: string) {
  return text.toLowerCase();
}

function firstMatch(text: string, terms: string[]) {
  return terms.find((term) => text.includes(term));
}

function extractPreferredName(text: string) {
  const match = text.match(/\b(?:ik heet|mijn naam is)\s+([A-Za-zÀ-ÖØ-öø-ÿ'-]{2,30})/i);
  return match?.[1];
}

function extractChildAges(text: string) {
  const matches = Array.from(text.matchAll(/\b(\d{1,2})\s*(?:jaar|j)\b/gi)).map((match) => `${match[1]} jaar`);
  return unique(matches);
}

function extractAttemptedActions(originalText: string) {
  const sentences = originalText
    .split(/[.!?\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences.filter((sentence) => {
    const text = normalize(sentence);
    return (
      text.includes("al ") ||
      text.includes("geprobeerd") ||
      text.includes("gesproken") ||
      text.includes("contact") ||
      text.includes("gebeld")
    );
  });
}

function inferMode(text: string): ConversationMode {
  if (text.includes("verhaal kwijt") || text.includes("luisteren") || text.includes("even kwijt")) {
    return "verhaal";
  }

  if (text.includes("structuur") || text.includes("ordenen") || text.includes("overzicht")) {
    return "structuur";
  }

  if (
    text.includes("eerste stappen") ||
    text.includes("volgende stap") ||
    text.includes("wat moet ik doen") ||
    text.includes("wat ik moet doen") ||
    text.includes("actie") ||
    text.includes("praktisch")
  ) {
    return "stappen";
  }

  return "onbekend";
}

function extractDesiredOutcome(originalText: string) {
  const sentences = originalText
    .split(/[.!?\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences.find((sentence) => {
    const text = normalize(sentence);
    return (
      text.includes("ik wil") ||
      text.includes("ik zoek") ||
      text.includes("ik heb nodig") ||
      text.includes("helpen") ||
      text.includes("volgende stap")
    );
  });
}

function extractFamilySituation(text: string) {
  if (text.includes("alleenstaande")) return "alleenstaande ouder";
  if (text.includes("gescheiden") || text.includes("scheiding")) return "gescheiden of gescheiden aan het worden";
  if (text.includes("co-ouder") || text.includes("co ouderschap")) return "co-ouderschap";
  if (text.includes("nieuw samengesteld") || text.includes("samengesteld gezin")) return "samengesteld gezin";
  if (text.includes("geen steunnetwerk") || text.includes("sta er alleen voor")) return "weinig steunnetwerk";
  return undefined;
}

function buildContextSummary(context: Omit<ConversationContext, "summary">, fallback: string) {
  const parts = [
    context.preferredName ? `Naam: ${context.preferredName}` : null,
    context.parentRole ? `Rol: ${context.parentRole}` : null,
    context.familySituation ? `Gezinssituatie: ${context.familySituation}` : null,
    context.childAges.length > 0 ? `Leeftijd kind(eren): ${context.childAges.join(", ")}` : null,
    context.peopleInvolved.length > 0 ? `Betrokkenen: ${context.peopleInvolved.join(", ")}` : null,
    context.keyConcerns.length > 0 ? `Belangrijke zorgen: ${context.keyConcerns.join(", ")}` : null,
    context.emotionalState ? `Emotionele druk: ${context.emotionalState}` : null,
    context.attemptedActions.length > 0 ? `Al geprobeerd: ${context.attemptedActions.join(" / ")}` : null,
    context.desiredOutcome ? `Gewenste richting: ${context.desiredOutcome}` : null,
    context.mode !== "onbekend" ? `Gewenste modus: ${context.mode}` : null
  ].filter(Boolean);

  return parts.length > 0 ? parts.join("\n") : fallback.trim();
}

export function extractConversationContext(messages: ConversationMessage[]): ConversationContext {
  const userText = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n");
  const normalized = normalize(userText);
  const parentRole = roleTerms.find(({ term }) => normalized.includes(term))?.value;
  const mode = inferMode(normalized);
  const contextWithoutSummary = {
    preferredName: extractPreferredName(userText),
    parentRole,
    childAges: extractChildAges(userText),
    familySituation: extractFamilySituation(normalized),
    peopleInvolved: unique(peopleTerms.filter((term) => normalized.includes(term))),
    emotionalState: firstMatch(normalized, emotionalTerms),
    attemptedActions: unique(extractAttemptedActions(userText)),
    desiredOutcome: extractDesiredOutcome(userText),
    keyConcerns: unique(concernTerms.filter(({ term }) => normalized.includes(term)).map(({ value }) => value)),
    mode
  };

  return {
    ...contextWithoutSummary,
    summary: buildContextSummary(contextWithoutSummary, userText)
  };
}

export function buildNextAssistantMessage(context: ConversationContext, userMessageCount: number) {
  if (userMessageCount === 0) {
    return "Welkom. Vertel rustig wat er speelt. Je mag zoveel of zo weinig vertellen als je wil.";
  }

  const role = context.parentRole ? `als ${context.parentRole}` : "vanuit jouw plek als ouder of verzorger";
  const child = context.childAges.length > 0 ? ` Je noemt een kind van ${context.childAges.join(", ")}.` : "";
  const concerns =
    context.keyConcerns.length > 0
      ? ` Ik neem vooral mee: ${context.keyConcerns.slice(0, 2).join(" en ")}.`
      : "";
  const emotion = context.emotionalState
    ? ` Het lijkt niet alleen over de praktische situatie te gaan, maar ook over hoe ${context.emotionalState} dit nu voelt.`
    : " Het lijkt niet alleen te gaan over wat er moet gebeuren, maar ook over de druk van het alleen moeten uitzoeken.";
  const tried =
    context.attemptedActions.length > 0
      ? " Je hebt al iets geprobeerd; je hoeft dat hier niet opnieuw te bewijzen, ik neem het mee."
      : "";
  const acknowledgement = `Ik hoor dat je dit ${role} vertelt.${child}${concerns}${emotion}${tried}`;

  const missingQuestions = [
    context.mode === "onbekend"
      ? "Wil je vooral even je verhaal kwijt, structuur krijgen, of meteen eerste stappen zien?"
      : null,
    !context.emotionalState ? "Wat weegt er op dit moment het zwaarst?" : null,
    context.peopleInvolved.length === 0 ? "Wie is hierbij betrokken?" : null,
    context.attemptedActions.length === 0 ? "Wat heb je al geprobeerd, ook al was het klein?" : null,
    !context.desiredOutcome ? "Wat zou vandaag al een kleine verlichting brengen?" : null
  ].filter(Boolean);

  if (missingQuestions.length === 0) {
    return `${acknowledgement} Ik heb genoeg om een eerste rustig overzicht te maken. Aanvullen mag altijd, maar je hoeft jezelf niet te herhalen.`;
  }

  const nextQuestion = missingQuestions[0];
  return `${acknowledgement} ${nextQuestion}`;
}

export function contextToLegacyAnswers(context: ConversationContext, messages: ConversationMessage[]) {
  const firstUserMessage =
    messages.find((message) => message.role === "user" && message.content.trim().length > 0)?.content ?? "";

  return {
    situation: firstUserMessage || context.summary,
    family: [context.parentRole, context.familySituation, ...context.peopleInvolved].filter(Boolean).join(", "),
    children: context.childAges.join(", "),
    hardest: context.emotionalState ?? "",
    tried: context.attemptedActions.join(" / "),
    support: context.desiredOutcome ?? (context.mode !== "onbekend" ? context.mode : "")
  };
}
