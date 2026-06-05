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
    servicesContacted: [],
    emotionalState: clean(answers.hardest),
    emotionalSignals: clean(answers.hardest) ? [String(clean(answers.hardest))] : [],
    attemptedActions: clean(answers.tried) ? [String(clean(answers.tried))] : [],
    desiredOutcome: clean(answers.support),
    keyConcerns: [],
    patterns: [],
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
    return `${context.preferredName}, dank je om dit te delen. Het klinkt alsof je al veel hebt proberen dragen voordat je hier terechtkwam.`;
  }

  if (context.parentRole) {
    return "Dank je om dit te vertellen. Ik wil eerst recht doen aan wat dit van jou vraagt, nog voor er over stappen of oplossingen gesproken wordt.";
  }

  return "Dank je om dit te vertellen. Je hoeft dit niet perfect te formuleren om toch begrepen te worden.";
}

function buildAcknowledgement(context: ConversationContext, firstMessage: string) {
  if (context.perspective) {
    return "Wat ik geloof dat je nu draagt: niet alleen de zorg over wat er gebeurt, maar ook de last van moeten blijven zoeken terwijl je draagkracht al onder druk staat.";
  }

  const concerns =
    context.keyConcerns.length > 0
      ? ` De kern lijkt te raken aan ${context.keyConcerns.slice(0, 2).join(" en ")}.`
      : "";
  const emotional =
    context.emotionalSignals.length > 0
      ? ` De emotionele laag die opvalt: ${context.emotionalSignals.slice(0, 2).join(" en ")}.`
      : "";

  return `Wat ik geloof dat je nu draagt: ${firstMessage}${concerns}${emotional}`;
}

function buildImportant(context: ConversationContext) {
  if (context.patterns.includes("school-gedrag-spanningsveld") && context.patterns.includes("zorgdrager-overbelasting")) {
    return "Onder de oppervlakte lijken er twee vragen door elkaar te lopen: wat vraagt deze situatie van je kind, en hoeveel kun jij nog alleen blijven dragen? Het eerste verdient aandacht, maar het tweede bepaalt of je die aandacht ook kunt blijven geven. De eerste helderheid zit in die twee sporen uit elkaar halen.";
  }

  if (context.patterns.includes("isolatie-of-steunnetwerkgat")) {
    return "Onder de oppervlakte lijkt het niet alleen te gaan over wat er gebeurt, maar over hoeveel je alleen moet dragen. Een steunnetwerkgat maakt gewone opvoedingsvragen sneller uitputtend.";
  }

  if (context.emotionalSignals.length > 0) {
    const concern =
      context.keyConcerns.length > 0
        ? ` Tegelijk speelt er inhoudelijk ${context.keyConcerns.slice(0, 2).join(" en ")}.`
        : "";
    return `Onder de oppervlakte valt vooral de combinatie op van ${context.emotionalSignals.slice(0, 2).join(" en ")}.${concern} Dat zegt niets diagnostisch over jou of je kind; het helpt wel om te zien dat je eerst draagkracht en overzicht nodig hebt voordat je grote beslissingen neemt.`;
  }

  return "Onder de oppervlakte lijkt vooral de onduidelijkheid zwaar te wegen: wat moet eerst, wie kan helpen, en wat mag even blijven liggen. Die onduidelijkheid kan op zichzelf al veel energie vragen.";
}

function buildPracticalUrgency(context: ConversationContext) {
  if (context.attemptedActions.length > 0) {
    const contacted =
      context.servicesContacted.length > 0
        ? ` Je noemde al contact met: ${context.servicesContacted.join(", ")}.`
        : "";
    return `Praktisch verdient vooral aandacht dat je niet opnieuw vanaf nul moet beginnen. Je hebt al geprobeerd: ${context.attemptedActions.join(" / ")}.${contacted} Zet dat kort onder elkaar, niet als bewijs dat je genoeg deed, maar om de volgende persoon sneller te laten begrijpen waar je vastloopt.`;
  }

  return "Praktisch is de eerste urgentie niet om alles op te lossen, maar om een eerste gesprekspartner te kiezen. Denk aan school, huisarts, CAW, Opvoedingslijn of iemand uit je netwerk die rustig kan meedenken.";
}

function buildCanWait(context: ConversationContext) {
  if (context.mode === "verhaal") {
    return "Een volledig plan hoeft vandaag nog niet. Ook verklaringen, schuldvragen en grote beslissingen mogen even wachten. Eerst is het genoeg om woorden te geven aan wat er speelt en wat jou nu het meest uitput.";
  }

  return "Je hoeft vandaag niet het hele gezinsprobleem op te lossen. Wat mogelijk mag wachten: definitieve conclusies, lange gesprekken met iedereen tegelijk, en perfecte uitleg. Wat wel helpt: een kleine stap die wat ademruimte geeft.";
}

function buildFirstStep(context: ConversationContext) {
  if (context.mode === "verhaal") {
    return "Neem vanavond tien minuten om zonder oordeel op te schrijven wat je eigenlijk zou willen dat iemand begreep. Sluit af met een eenvoudige zin: wat heb ik nu nodig om de avond iets rustiger door te komen?";
  }

  if (context.mode === "stappen") {
    return "Kies een eerste contact voor morgen, maar hou het zacht en klein: wat speelt er, wat heb je al geprobeerd, en welke steun heb je nodig om niet alleen verder te moeten zoeken?";
  }

  return "Schrijf op een blad drie korte kolommen: wat draag ik, wat hoort bij anderen, en wat vraagt vandaag als eerste aandacht? Hou het bewust klein.";
}

function buildSteps(context: ConversationContext) {
  const firstContact =
    context.peopleInvolved.includes("school") || context.peopleInvolved.includes("leerkracht")
      ? "Vraag een kort overleg met de leerkracht of zorgcoordinator en benoem twee sporen: wat ziet school bij je kind, en welke steun is nodig zodat jij dit niet alleen blijft dragen?"
      : "Kies een laagdrempelig eerste contactpunt: CAW, Opvoedingslijn, huisarts of iemand die praktisch kan meedenken.";

  return [
    context.attemptedActions.length > 0
      ? "Maak een korte lijst van wat al geprobeerd is, met datum of volgorde als je die weet. Zo wordt je verhaal lichter om te dragen en makkelijker uit te leggen."
      : "Noteer wat je al geprobeerd hebt, ook als het nog weinig of onsamenhangend voelt. Kleine pogingen tellen mee.",
    firstContact,
    context.patterns.includes("zorgdrager-overbelasting")
      ? "Kies een ding dat je deze week niet meer alleen wil dragen en vraag daar concreet hulp bij."
      : context.desiredOutcome
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

function buildOneThingNotToCarryAlone(context: ConversationContext) {
  if (context.patterns.includes("school-gedrag-spanningsveld")) {
    return "Draag het schoolstuk niet alleen. Vraag niet alleen wat moeilijk loopt, maar ook wie mee kan kijken naar de eerstvolgende haalbare ondersteuning.";
  }

  if (context.patterns.includes("zorgdrager-overbelasting")) {
    return "Draag je eigen uitputting niet als bijzaak. Die is deel van de situatie en mag expliciet benoemd worden wanneer je hulp vraagt.";
  }

  return "Draag de ordening niet alleen. Het is redelijk om iemand te vragen om met jou te helpen bepalen wat eerst komt.";
}

function buildNextQuestion(context: ConversationContext) {
  if (context.patterns.includes("school-gedrag-spanningsveld") && context.patterns.includes("zorgdrager-overbelasting")) {
    return "Welke steun zou maken dat je dit gesprek niet meer vanuit uitputting hoeft te voeren?";
  }

  if (context.patterns.includes("isolatie-of-steunnetwerkgat")) {
    return "Wie kan deze week een klein stukje mee dragen, ook als die persoon het probleem niet kan oplossen?";
  }

  return "Wat zou het verschil maken tussen nog een dag overleven en morgen een klein beetje meer richting voelen?";
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
    oneThingNotToCarryAlone: buildOneThingNotToCarryAlone(context),
    nextQuestion: buildNextQuestion(context),
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
