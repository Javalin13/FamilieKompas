import { verifiedResources } from "@/content/nl/resources";
import type { ConversationContext, ConversationMessage } from "@/lib/conversation/contextExtraction";

export type ConversationAnswers = Record<string, string>;

type GuidanceInput =
  | ConversationAnswers
  | {
      answers: ConversationAnswers;
      context: ConversationContext;
      messages: ConversationMessage[];
    };

function clean(value: string | undefined) {
  return value?.trim();
}

function isStructuredInput(input: GuidanceInput): input is {
  answers: ConversationAnswers;
  context: ConversationContext;
  messages: ConversationMessage[];
} {
  return "answers" in input && "context" in input && "messages" in input;
}

function buildFallbackContext(answers: ConversationAnswers): ConversationContext {
  return {
    parentRole: clean(answers.family),
    childAges: clean(answers.children) ? [String(clean(answers.children))] : [],
    peopleInvolved: clean(answers.family) ? [String(clean(answers.family))] : [],
    emotionalState: clean(answers.hardest),
    attemptedActions: clean(answers.tried) ? [String(clean(answers.tried))] : [],
    desiredOutcome: clean(answers.support),
    keyConcerns: [],
    mode: "structuur",
    summary: clean(answers.situation) ?? "Je beschrijft een situatie die nu moeilijk of onduidelijk aanvoelt."
  };
}

function getInput(input: GuidanceInput) {
  if (isStructuredInput(input)) {
    return input;
  }

  return {
    answers: input,
    context: buildFallbackContext(input),
    messages: []
  };
}

function firstUserText(messages: ConversationMessage[], answers: ConversationAnswers, context: ConversationContext) {
  return (
    messages.find((message) => message.role === "user" && message.content.trim().length > 0)?.content.trim() ||
    clean(answers.situation) ||
    context.summary
  );
}

function selectRelevantResources(context: ConversationContext, answers: ConversationAnswers) {
  const combined = `${context.summary} ${Object.values(answers).join(" ")}`.toLowerCase();
  const topicHints = [
    combined.includes("opvoed") || combined.includes("gedrag") ? "opvoeding" : null,
    combined.includes("geweld") || combined.includes("misbruik") ? "veiligheid" : null,
    combined.includes("alleen") || combined.includes("vast") ? "ondersteuning" : null,
    combined.includes("jongere") || combined.includes("kind") ? "jongeren" : null,
    combined.includes("school") || combined.includes("leerkracht") ? "opvoeding" : null
  ].filter(Boolean);

  const matches = verifiedResources.filter((resource) =>
    resource.topics.some((topic) => topicHints.includes(topic))
  );

  return (matches.length > 0 ? matches : verifiedResources.filter((resource) => !resource.crisis)).slice(0, 4);
}

function buildPersonalGreeting(context: ConversationContext) {
  if (context.preferredName) {
    return `${context.preferredName}, dank je om dit zo rustig mogelijk onder woorden te brengen.`;
  }

  if (context.parentRole) {
    return `Dank je om dit te vertellen. Ik lees dit vanuit jouw situatie als ${context.parentRole}.`;
  }

  return "Dank je om dit te vertellen. Je hoeft dit niet perfect te formuleren om toch een eerste richting te vinden.";
}

function buildAcknowledgement(context: ConversationContext, firstMessage: string) {
  const childPart = context.childAges.length > 0 ? ` Je noemt een kind van ${context.childAges.join(", ")}.` : "";
  const peoplePart =
    context.peopleInvolved.length > 0 ? ` Betrokkenen die ik meeneem: ${context.peopleInvolved.join(", ")}.` : "";
  const concernPart =
    context.keyConcerns.length > 0 ? ` De kern lijkt te raken aan ${context.keyConcerns.join(", ")}.` : "";

  return `${firstMessage}${childPart}${peoplePart}${concernPart}`;
}

function buildImportant(context: ConversationContext) {
  if (context.emotionalState) {
    const concern =
      context.keyConcerns.length > 0
        ? ` Tegelijk speelt er inhoudelijk ${context.keyConcerns.slice(0, 2).join(" en ")}.`
        : "";
    return `Wat waarschijnlijk het zwaarst weegt, is niet alleen het probleem zelf, maar de combinatie met ${context.emotionalState}.${concern} Dat zegt niets diagnostisch over jou of je kind; het helpt wel om te zien dat je eerst draagkracht en overzicht nodig hebt voordat je grote beslissingen neemt.`;
  }

  return "Wat waarschijnlijk zwaar weegt, is de onduidelijkheid: wat moet eerst, wie kan helpen, en wat mag even blijven liggen. Die onduidelijkheid kan op zichzelf al veel energie vragen.";
}

function buildPracticalUrgency(context: ConversationContext) {
  if (context.attemptedActions.length > 0) {
    return `Praktisch is belangrijk dat je niet opnieuw vanaf nul moet beginnen. Je hebt al geprobeerd: ${context.attemptedActions.join(" / ")}. Zet dat kort onder elkaar, zodat een leerkracht, CAW, huisarts, Opvoedingslijn of andere ondersteuner meteen ziet dat er al beweging is geweest.`;
  }

  return "Praktisch is de eerste urgentie niet om alles op te lossen, maar om een eerste gesprekspartner te kiezen. Denk aan school, huisarts, CAW, Opvoedingslijn of iemand uit je netwerk die rustig kan meedenken.";
}

function buildCanWait(context: ConversationContext) {
  if (context.mode === "verhaal") {
    return "Een volledig plan hoeft vandaag nog niet. Ook verklaringen, schuldvragen en grote beslissingen mogen even wachten. Eerst is het genoeg om woorden te geven aan wat er speelt en wat jou nu het meest uitput.";
  }

  return "Je hoeft vandaag niet het hele gezinsprobleem op te lossen. Wat kan wachten: definitieve conclusies, lange gesprekken met iedereen tegelijk, en perfecte uitleg. Wat wel helpt: een kleine stap die overzicht geeft.";
}

function buildFirstStep(context: ConversationContext) {
  if (context.mode === "verhaal") {
    return "Neem vanavond tien minuten om zonder oordeel verder op te schrijven wat je kwijt wil. Sluit af met een eenvoudige zin: wat heb ik nu nodig om de avond iets rustiger door te komen?";
  }

  if (context.mode === "stappen") {
    return "Kies een eerste contact voor morgen en schrijf drie zinnen klaar: wat er speelt, wat je al probeerde, en welke concrete vraag je wil stellen.";
  }

  return "Schrijf op een blad drie korte kolommen: wat speelt er, wie is betrokken, en wat moet eerst aandacht krijgen. Hou het bewust klein.";
}

function buildSteps(context: ConversationContext) {
  const firstContact =
    context.peopleInvolved.includes("school") || context.peopleInvolved.includes("leerkracht")
      ? "Vraag een kort overleg met de leerkracht of zorgcoordinator en neem je kernvraag mee."
      : "Kies een laagdrempelig eerste contactpunt: CAW, Opvoedingslijn, huisarts of iemand die praktisch kan meedenken.";

  return [
    context.attemptedActions.length > 0
      ? "Maak een korte lijst van wat al geprobeerd is, met datum of volgorde als je die weet. Zo wordt je verhaal lichter om te dragen en makkelijker uit te leggen."
      : "Noteer wat je al geprobeerd hebt, ook als het nog weinig of onsamenhangend voelt. Kleine pogingen tellen mee.",
    firstContact,
    context.desiredOutcome
      ? `Maak je hulpvraag concreet vanuit wat je zelf noemt: ${context.desiredOutcome}. Vraag niet om alles tegelijk, maar om hulp bij die eerste richting.`
      : "Formuleer een hulpvraag in een zin: wat heb ik nu nodig om de volgende stap te kunnen zetten?"
  ];
}

function buildMonitor(context: ConversationContext) {
  const concern =
    context.keyConcerns.length > 0
      ? ` rond ${context.keyConcerns[0]}`
      : "";

  return `Observeer de komende dagen zonder jezelf te veroordelen: wanneer loopt de spanning op${concern}, wat helpt heel even om te zakken, en bij wie wordt het iets makkelijker om helder te blijven? Schrijf alleen feiten en kleine signalen op, geen harde conclusies.`;
}

export function buildStaticGuidanceResult(input: GuidanceInput) {
  const { answers, context, messages } = getInput(input);
  const firstMessage = firstUserText(messages, answers, context);

  return {
    title: "Je eerste rustige overzicht",
    personalGreeting: buildPersonalGreeting(context),
    summary: buildAcknowledgement(context, firstMessage),
    emotionalImportant: buildImportant(context),
    practicalUrgent: buildPracticalUrgency(context),
    canWait: buildCanWait(context),
    firstStep: buildFirstStep(context),
    steps: buildSteps(context),
    monitor: buildMonitor(context),
    whenToSeekHelp:
      "Schakel iemand in wanneer de situatie onveilig voelt, wanneer spanning of conflict snel oploopt, wanneer je bang bent voor geweld of misbruik, wanneer zelfbeschadiging of zelfmoordgedachten spelen, bij medische nood, of wanneer je merkt dat je draagkracht op is. Dat hoeft geen grote stap te zijn: een eerste contact met school, huisarts, CAW, Opvoedingslijn of een hulplijn kan al genoeg zijn om niet alleen verder te moeten zoeken.",
    questions: [
      "Wat is volgens u de beste eerste stap voor deze situatie?",
      "Welke informatie moet ik vooraf verzamelen?",
      "Wie kan ons verder ondersteunen als dit niet snel verbetert?"
    ],
    resources: selectRelevantResources(context, answers),
    boundaries: [
      "FamilieKompas biedt ordening, reflectie en praktische richting. Het is geen therapie, diagnose, juridisch advies of medisch advies.",
      "Bij onmiddellijk gevaar neem je contact op met 112 of een professionele hulpdienst."
    ]
  };
}
