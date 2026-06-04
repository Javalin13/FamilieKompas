import { verifiedResources } from "@/content/nl/resources";

export type ConversationAnswers = Record<string, string>;

function clean(value: string | undefined) {
  return value?.trim();
}

function buildSummary(answers: ConversationAnswers) {
  const situation = clean(answers.situation);
  const family = clean(answers.family);
  const children = clean(answers.children);

  if (!situation) {
    return "Je beschrijft een situatie die nu moeilijk of onduidelijk aanvoelt.";
  }

  const context = [family ? `Betrokken: ${family}.` : null, children ? `Kinderen/leeftijd: ${children}.` : null]
    .filter(Boolean)
    .join(" ");

  return `${situation}${context ? ` ${context}` : ""}`;
}

function selectRelevantResources(answers: ConversationAnswers) {
  const combined = Object.values(answers).join(" ").toLowerCase();
  const topicHints = [
    combined.includes("opvoed") || combined.includes("gedrag") ? "opvoeding" : null,
    combined.includes("geweld") || combined.includes("misbruik") ? "veiligheid" : null,
    combined.includes("alleen") || combined.includes("vast") ? "ondersteuning" : null,
    combined.includes("jongere") || combined.includes("kind") ? "jongeren" : null
  ].filter(Boolean);

  const matches = verifiedResources.filter((resource) =>
    resource.topics.some((topic) => topicHints.includes(topic))
  );

  return (matches.length > 0 ? matches : verifiedResources.filter((resource) => !resource.crisis)).slice(0, 4);
}

export function buildStaticGuidanceResult(answers: ConversationAnswers) {
  const hardest = clean(answers.hardest);
  const tried = clean(answers.tried);
  const support = clean(answers.support);

  const summary = buildSummary(answers);
  const firstStep =
    "Neem eerst tien minuten om de situatie kort op papier te zetten: wat gebeurt er, wie is betrokken, wat is vandaag het belangrijkste, en welke hulpvraag wil je stellen?";

  return {
    title: "Je eerste overzicht",
    summary,
    important: hardest
      ? `Op basis van wat je invulde lijkt dit nu het zwaarste punt: ${hardest}. Begin daar, zonder meteen alles tegelijk te willen oplossen.`
      : "Het belangrijkste is nu om de situatie kleiner te maken: wat moet vandaag aandacht krijgen, en wat kan wachten tot morgen of een volgende werkdag?",
    firstStep,
    steps: [
      tried
        ? `Noteer wat je al geprobeerd hebt, zodat je dat niet opnieuw hoeft uit te leggen: ${tried}.`
        : "Noteer kort wat je al geprobeerd hebt, ook als het maar kleine stappen waren.",
      support
        ? `Zet je gewenste volgende stap om in een concrete actie: ${support}.`
        : "Kies een eerste contactpunt: school, huisarts, CAW, Opvoedingslijn of iemand in je omgeving die praktisch kan meedenken.",
      "Bereid een kort bericht of gesprek voor met drie zinnen: wat er speelt, wat je nodig hebt, en welke vraag je wilt stellen."
    ],
    whenToSeekHelp:
      "Zoek professionele of dringende hulp als iemand onveilig is, als je bang bent voor geweld of misbruik, als er sprake is van zelfbeschadiging of zelfmoordgedachten, of als je merkt dat je dit niet meer alleen kunt dragen.",
    questions: [
      "Wat is volgens u de beste eerste stap?",
      "Welke informatie moet ik vooraf verzamelen?",
      "Wie kan ons verder ondersteunen als dit niet snel verbetert?"
    ],
    resources: selectRelevantResources(answers),
    boundaries: [
      "Dit overzicht is geen therapie, diagnose, juridisch advies of medisch advies.",
      "Het is een eerste ordening op basis van wat je invulde. Bij onmiddellijk gevaar neem je contact op met 112 of een professionele hulpdienst."
    ]
  };
}
