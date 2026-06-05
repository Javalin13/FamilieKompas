export type ConversationMode = "verhaal" | "structuur" | "stappen" | "onbekend";

export type ConversationContext = {
  preferredName?: string;
  parentRole?: string;
  childRole?: string;
  childAges: string[];
  familySituation?: string;
  supportNetwork?: string;
  relationshipStatus?: string;
  custodySituation?: string;
  peopleInvolved: string[];
  servicesContacted: string[];
  emotionalState?: string;
  emotionalSignals: string[];
  pressureSources: string[];
  attemptedActions: string[];
  desiredOutcome?: string;
  underlyingNeeds: string[];
  keyConcerns: string[];
  narrativeThemes: string[];
  centralQuestion?: string;
  patterns: string[];
  perspective?: string;
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

const serviceTerms = [
  "caw",
  "opvoedingslijn",
  "huisarts",
  "clb",
  "school",
  "leerkracht",
  "zorgleerkracht",
  "psycholoog",
  "therapeut",
  "bemiddelaar",
  "ocmw"
];

const emotionalTerms = [
  { term: "uitgeput", value: "uitputting" },
  { term: "overweldigd", value: "overweldiging" },
  { term: "vastgelopen", value: "vastlopen" },
  { term: "bang", value: "angst" },
  { term: "boos", value: "frustratie" },
  { term: "kwaad", value: "frustratie" },
  { term: "schaam", value: "schaamte" },
  { term: "schuld", value: "schuldgevoel" },
  { term: "verdrietig", value: "verdriet" },
  { term: "alleen", value: "eenzaamheid" },
  { term: "ten einde raad", value: "machteloosheid" },
  { term: "ik kan niet meer", value: "draagkracht onder druk" },
  { term: "ik ben op", value: "draagkracht onder druk" },
  { term: "machteloos", value: "machteloosheid" },
  { term: "hopeloos", value: "hopeloosheid" },
  { term: "verwarring", value: "verwarring" },
  { term: "paniek", value: "paniek" }
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

const pressureTerms = [
  { term: "school", value: "schooldruk" },
  { term: "leerkracht", value: "schoolcommunicatie" },
  { term: "geld", value: "financiele druk" },
  { term: "factuur", value: "financiele druk" },
  { term: "woning", value: "woonstress" },
  { term: "werk", value: "werkdruk" },
  { term: "scheiding", value: "relatieconflict" },
  { term: "co-ouder", value: "co-ouderschapsdruk" },
  { term: "gezondheid", value: "gezondheidsdruk" },
  { term: "niemand", value: "sociale isolatie" },
  { term: "alleen", value: "sociale isolatie" }
];

const needTerms = [
  { term: "weet niet", value: "richting" },
  { term: "wat moet ik doen", value: "richting" },
  { term: "structuur", value: "structuur" },
  { term: "overzicht", value: "structuur" },
  { term: "gerust", value: "geruststelling" },
  { term: "helpen", value: "steun" },
  { term: "steun", value: "steun" },
  { term: "opgelucht", value: "verlichting" },
  { term: "luisteren", value: "validatie" },
  { term: "begrijpt", value: "erkenning" }
];

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalize(text: string) {
  return text.toLowerCase();
}

function firstValueMatch(text: string, terms: Array<{ term: string; value: string }>) {
  return terms.find(({ term }) => text.includes(term))?.value;
}

function extractPreferredName(text: string) {
  const match = text.match(/\b(?:ik heet|mijn naam is)\s+([A-Za-zÀ-ÖØ-öø-ÿ'-]{2,30})/i);
  return match?.[1];
}

function extractChildAges(text: string) {
  const matches = Array.from(text.matchAll(/\b(\d{1,2})\s*(?:jaar|j)\b/gi)).map((match) => `${match[1]} jaar`);
  return unique(matches);
}

function extractChildRole(text: string) {
  if (text.includes("zoon")) return "zoon";
  if (text.includes("dochter")) return "dochter";
  if (text.includes("kind")) return "kind";
  return undefined;
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

function extractSupportNetwork(text: string) {
  if (text.includes("geen steunnetwerk") || text.includes("zonder steunnetwerk")) return "geen steunnetwerk genoemd";
  if (text.includes("sta er alleen voor") || text.includes("niemand helpt") || text.includes("helemaal alleen")) {
    return "weinig of geen steun ervaren";
  }
  if (text.includes("familie helpt") || text.includes("vrienden helpen")) return "steun uit omgeving genoemd";
  return undefined;
}

function extractRelationshipStatus(text: string) {
  if (text.includes("gescheiden") || text.includes("scheiding")) return "gescheiden of in scheiding";
  if (text.includes("alleenstaande")) return "alleenstaand ouderschap";
  if (text.includes("nieuwe partner") || text.includes("samengesteld gezin")) return "samengesteld gezin";
  return undefined;
}

function extractCustodySituation(text: string) {
  if (text.includes("co-ouderschap") || text.includes("co ouderschap")) return "co-ouderschap";
  if (text.includes("week om week")) return "week-om-weekregeling";
  if (text.includes("omgangsregeling")) return "omgangsregeling";
  return undefined;
}

function buildPatterns(input: {
  normalized: string;
  emotionalSignals: string[];
  keyConcerns: string[];
  pressureSources: string[];
  supportNetwork?: string;
  servicesContacted: string[];
  attemptedActions: string[];
}) {
  const patterns = [
    input.emotionalSignals.some((signal) =>
      ["uitputting", "overweldiging", "draagkracht onder druk", "machteloosheid"].includes(signal)
    )
      ? "zorgdrager-overbelasting"
      : null,
    input.supportNetwork?.includes("weinig") || input.supportNetwork?.includes("geen")
      ? "isolatie-of-steunnetwerkgat"
      : null,
    input.keyConcerns.some((concern) => concern.includes("school")) &&
    input.keyConcerns.some((concern) => concern.includes("gedrag"))
      ? "school-gedrag-spanningsveld"
      : null,
    input.keyConcerns.some((concern) => concern.includes("ontwikkeling"))
      ? "ontwikkelingszorg"
      : null,
    input.keyConcerns.some((concern) => concern.includes("gedrag") || concern.includes("agressie"))
      ? "gedragszorg"
      : null,
    input.servicesContacted.length === 0 && input.normalized.includes("weet niet")
      ? "ondersteuningsroute-onduidelijk"
      : null,
    input.attemptedActions.length > 0 && input.normalized.includes("geen vooruitgang")
      ? "pogingen-zonder-voelbare-vooruitgang"
      : null,
    input.normalized.includes("weet niet") || input.normalized.includes("wat moet ik doen")
      ? "beslissingsverlamming"
      : null,
    input.pressureSources.length > 1 && input.emotionalSignals.length > 0
      ? "meervoudige-druk"
      : null
  ].filter((pattern): pattern is string => Boolean(pattern));

  return unique(patterns);
}

function buildNarrativeThemes(input: {
  patterns: string[];
  emotionalSignals: string[];
  pressureSources: string[];
  supportNetwork?: string;
}) {
  return unique([
    input.patterns.includes("zorgdrager-overbelasting") ? "alles alleen dragen" : "",
    input.patterns.includes("school-gedrag-spanningsveld") ? "zorgen over kind en school" : "",
    input.patterns.includes("isolatie-of-steunnetwerkgat") || input.supportNetwork ? "gebrek aan steun" : "",
    input.patterns.includes("beslissingsverlamming") ? "verlies van richting" : "",
    input.pressureSources.length > 1 ? "druk van meerdere kanten" : "",
    input.emotionalSignals.includes("angst") ? "angst voor wat dit betekent" : "",
    input.emotionalSignals.includes("schuldgevoel") || input.emotionalSignals.includes("schaamte")
      ? "twijfel aan zichzelf"
      : ""
  ]);
}

function buildCentralQuestion(input: {
  patterns: string[];
  emotionalSignals: string[];
  supportNetwork?: string;
  keyConcerns: string[];
}) {
  if (input.patterns.includes("school-gedrag-spanningsveld") && input.emotionalSignals.includes("uitputting")) {
    return "Kan ik mijn kind helpen zonder hier zelf aan onderdoor te gaan?";
  }

  if (input.patterns.includes("isolatie-of-steunnetwerkgat") || input.supportNetwork?.includes("geen")) {
    return "Sta ik hier alleen voor?";
  }

  if (input.emotionalSignals.includes("schuldgevoel") || input.emotionalSignals.includes("schaamte")) {
    return "Doe ik iets verkeerd, of vraagt deze situatie meer steun dan ik alleen kan geven?";
  }

  if (input.patterns.includes("beslissingsverlamming")) {
    return "Wat is nu de eerste stap die genoeg is?";
  }

  if (input.keyConcerns.length > 0) {
    return "Wat vraagt nu eerst aandacht, en wat mag nog even wachten?";
  }

  return undefined;
}

function buildPerspective(input: {
  parentRole?: string;
  childRole?: string;
  childAges: string[];
  patterns: string[];
  keyConcerns: string[];
  emotionalSignals: string[];
}) {
  const childLabel = input.childRole ? `je ${input.childRole}` : "je kind";

  if (input.patterns.includes("school-gedrag-spanningsveld") && input.patterns.includes("zorgdrager-overbelasting")) {
    const age = input.childAges.length > 0 ? ` van ${input.childAges.join(", ")}` : "";
    return `Wat opvalt: school maakt zich zorgen over ${childLabel}${age}, terwijl jij tegelijk veel alleen lijkt te dragen. Die twee dingen kunnen samenhangen, maar het zijn niet noodzakelijk hetzelfde probleem. Er is de vraag wat je kind nodig heeft, en er is de vraag hoeveel jij nog alleen kan dragen.`;
  }

  if (input.patterns.includes("isolatie-of-steunnetwerkgat")) {
    return "Wat opvalt: de situatie lijkt zwaarder te worden doordat je er weinig steun rond voelt. Dan gaat het niet alleen over het gezinsprobleem zelf, maar ook over het ontbreken van mensen die mee helpen dragen.";
  }

  if (input.patterns.includes("beslissingsverlamming")) {
    return "Wat opvalt: je zoekt niet zomaar informatie, maar richting. Wanneer er te veel tegelijk speelt, kan de eerste taak zijn om te kiezen wat vandaag niet hoeft.";
  }

  if (input.emotionalSignals.length > 0 && input.keyConcerns.length > 0) {
    return `Wat opvalt: ${input.keyConcerns[0]} vraagt aandacht, maar de emotionele druk eromheen lijkt minstens even belangrijk. Eerst helder krijgen wat het zwaarst weegt kan meer helpen dan meteen harder zoeken naar oplossingen.`;
  }

  return undefined;
}

function buildContextSummary(context: Omit<ConversationContext, "summary">, fallback: string) {
  const parts = [
    context.preferredName ? `Naam: ${context.preferredName}` : null,
    context.parentRole ? `Rol: ${context.parentRole}` : null,
    context.childRole ? `Kindrol: ${context.childRole}` : null,
    context.familySituation ? `Gezinssituatie: ${context.familySituation}` : null,
    context.relationshipStatus ? `Relatiestatus: ${context.relationshipStatus}` : null,
    context.custodySituation ? `Regeling: ${context.custodySituation}` : null,
    context.supportNetwork ? `Steunnetwerk: ${context.supportNetwork}` : null,
    context.childAges.length > 0 ? `Leeftijd kind(eren): ${context.childAges.join(", ")}` : null,
    context.peopleInvolved.length > 0 ? `Betrokkenen: ${context.peopleInvolved.join(", ")}` : null,
    context.servicesContacted.length > 0 ? `Contacten/diensten: ${context.servicesContacted.join(", ")}` : null,
    context.pressureSources.length > 0 ? `Drukbronnen: ${context.pressureSources.join(", ")}` : null,
    context.underlyingNeeds.length > 0 ? `Onderliggende noden: ${context.underlyingNeeds.join(", ")}` : null,
    context.keyConcerns.length > 0 ? `Belangrijke zorgen: ${context.keyConcerns.join(", ")}` : null,
    context.narrativeThemes.length > 0 ? `Narratieve thema's: ${context.narrativeThemes.join(", ")}` : null,
    context.centralQuestion ? `Centrale vraag: ${context.centralQuestion}` : null,
    context.patterns.length > 0 ? `Patronen: ${context.patterns.join(", ")}` : null,
    context.perspective ? `Perspectief: ${context.perspective}` : null,
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
  const emotionalSignals = unique(emotionalTerms.filter(({ term }) => normalized.includes(term)).map(({ value }) => value));
  const keyConcerns = unique(concernTerms.filter(({ term }) => normalized.includes(term)).map(({ value }) => value));
  const pressureSources = unique(pressureTerms.filter(({ term }) => normalized.includes(term)).map(({ value }) => value));
  const underlyingNeeds = unique(needTerms.filter(({ term }) => normalized.includes(term)).map(({ value }) => value));
  const servicesContacted = unique(serviceTerms.filter((term) => normalized.includes(term)));
  const supportNetwork = extractSupportNetwork(normalized);
  const attemptedActions = unique(extractAttemptedActions(userText));
  const patterns = buildPatterns({
    normalized,
    emotionalSignals,
    keyConcerns,
    pressureSources,
    supportNetwork,
    servicesContacted,
    attemptedActions
  });
  const narrativeThemes = buildNarrativeThemes({
    patterns,
    emotionalSignals,
    pressureSources,
    supportNetwork
  });
  const contextWithoutSummary = {
    preferredName: extractPreferredName(userText),
    parentRole,
    childRole: extractChildRole(normalized),
    childAges: extractChildAges(userText),
    familySituation: extractFamilySituation(normalized),
    supportNetwork,
    relationshipStatus: extractRelationshipStatus(normalized),
    custodySituation: extractCustodySituation(normalized),
    peopleInvolved: unique(peopleTerms.filter((term) => normalized.includes(term))),
    servicesContacted,
    emotionalState: firstValueMatch(normalized, emotionalTerms),
    emotionalSignals,
    pressureSources,
    attemptedActions,
    desiredOutcome: extractDesiredOutcome(userText),
    underlyingNeeds,
    keyConcerns,
    narrativeThemes,
    centralQuestion: buildCentralQuestion({
      patterns,
      emotionalSignals,
      supportNetwork,
      keyConcerns
    }),
    patterns,
    perspective: buildPerspective({
      parentRole,
      childRole: extractChildRole(normalized),
      childAges: extractChildAges(userText),
      patterns,
      keyConcerns,
      emotionalSignals
    }),
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
