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

  return `${firstMessage}${childPart}${peoplePart}`;
}

function buildImportant(context: ConversationContext) {
  if (context.emotionalState) {
    return `Emotioneel lijkt vooral ${context.emotionalState} belangrijk. Dat is geen diagnose, maar wel een signaal dat de situatie eerst kleiner en draaglijker moet worden gemaakt.`;
  }

  return "Emotioneel lijkt vooral de onduidelijkheid belangrijk: wat moet eerst, wie kan helpen, en wat kan even wachten?";
}

function buildPracticalUrgency(context: ConversationContext) {
  if (context.attemptedActions.length > 0) {
    return `Praktisch is het belangrijk dat je niet opnieuw vanaf nul moet beginnen. Je hebt al geprobeerd: ${context.attemptedActions.join(" / ")}. Dat kan je straks kort meenemen naar school, CAW, de Opvoedingslijn of een andere ondersteuner.`;
  }

  return "Praktisch is de eerste urgentie om helder te krijgen wie de beste eerste gesprekspartner is: school, huisarts, CAW, Opvoedingslijn of iemand uit je netwerk.";
}

function buildCanWait(context: ConversationContext) {
  if (context.mode === "verhaal") {
    return "Een volledig plan hoeft nog niet meteen. Eerst mag er ruimte zijn om te benoemen wat er speelt en wat je nu het meest uitput.";
  }

  return "Alles tegelijk oplossen kan wachten. Begin met een kleine stap die vandaag overzicht geeft; grotere beslissingen kunnen pas daarna.";
}

function buildFirstStep(context: ConversationContext) {
  if (context.mode === "verhaal") {
    return "Neem tien minuten om zonder oordeel verder op te schrijven wat je kwijt wil. Eindig met een zin: wat heb ik vanavond nodig om iets rustiger te worden?";
  }

  if (context.mode === "stappen") {
    return "Kies een eerste contact voor morgen en schrijf drie zinnen klaar: wat er speelt, wat je al probeerde, en welke vraag je wil stellen.";
  }

  return "Schrijf op een blad drie kolommen: wat speelt er, wie is betrokken, en wat moet als eerste aandacht krijgen. Hou het kort.";
}

function buildSteps(context: ConversationContext) {
  const firstContact =
    context.peopleInvolved.includes("school") || context.peopleInvolved.includes("leerkracht")
      ? "Vraag een kort overleg met de leerkracht of zorgcoordinator en neem je kernvraag mee."
      : "Kies een laagdrempelig eerste contactpunt: CAW, Opvoedingslijn, huisarts of iemand die praktisch kan meedenken.";

  return [
    context.attemptedActions.length > 0
      ? "Maak een korte lijst van wat al geprobeerd is, zodat je jezelf niet opnieuw hoeft te herhalen."
      : "Noteer wat je al geprobeerd hebt, ook als het nog weinig of onsamenhangend voelt.",
    firstContact,
    context.desiredOutcome
      ? `Maak je hulpvraag concreet vanuit wat je zelf noemt: ${context.desiredOutcome}.`
      : "Formuleer een hulpvraag in een zin: wat heb ik nu nodig om de volgende stap te kunnen zetten?"
  ];
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
    monitor:
      "Let de komende dagen op terugkerende momenten waarop de spanning stijgt, wat helpt om even te zakken, en welke afspraken of contacten echt verschil maken.",
    whenToSeekHelp:
      "Zoek professionele of dringende hulp als iemand onveilig is, als je bang bent voor geweld of misbruik, als er sprake is van zelfbeschadiging of zelfmoordgedachten, bij medische nood, of als je merkt dat je dit niet meer alleen kunt dragen.",
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
