import {
  contextToLegacyAnswers,
  extractConversationContext,
  type ConversationContext,
  type ConversationMessage
} from "@/lib/conversation/contextExtraction";
import { buildStaticGuidanceResult } from "@/lib/guidance/staticGuidance";

export type ConversationDecision = {
  canCreateGuidance: boolean;
  nextPrompt: string | null;
};

type EmpathicMode = "listen" | "direction";

function hasPattern(context: ConversationContext, pattern: string) {
  return context.patterns.includes(pattern);
}

function decideEmpathicMode(context: ConversationContext, userMessageCount: number): EmpathicMode {
  if (userMessageCount <= 1 && context.mode !== "stappen") {
    return "listen";
  }

  if (userMessageCount <= 1 && hasPattern(context, "zorgdrager-overbelasting")) {
    return "listen";
  }

  return "direction";
}

function buildValidation(context: ConversationContext) {
  if (hasPattern(context, "zorgdrager-overbelasting") && hasPattern(context, "school-gedrag-spanningsveld")) {
    return "Dat klinkt ontzettend zwaar om tegelijk bezorgd te zijn om je kind en het gevoel te hebben dat jij degene bent die alles moet blijven dragen.";
  }

  if (hasPattern(context, "isolatie-of-steunnetwerkgat")) {
    return "Dat klinkt heel eenzaam om mee rond te lopen, zeker als je het gevoel hebt dat er weinig mensen echt naast je staan.";
  }

  if (context.emotionalSignals.includes("schuldgevoel") || context.emotionalSignals.includes("schaamte")) {
    return "Dat kan heel pijnlijk zijn, vooral als je ondertussen ook nog probeert overeind te blijven en het goed te doen.";
  }

  if (context.emotionalSignals.length > 0) {
    return "Het klinkt alsof je al een tijd veel spanning meedraagt en dat dit niet zomaar een klein praktisch probleem is.";
  }

  return "Dank je om dit zo open te vertellen. Er zit genoeg in je verhaal om eerst rustig bij stil te staan.";
}

function buildUnderstanding(context: ConversationContext) {
  if (hasPattern(context, "school-gedrag-spanningsveld") && hasPattern(context, "zorgdrager-overbelasting")) {
    return "Wat ik begrijp: er ligt druk vanuit school, maar de zwaardere laag lijkt dat jij ondertussen moet blijven functioneren terwijl je nog niet weet wie er echt naast je staat.";
  }

  if (hasPattern(context, "isolatie-of-steunnetwerkgat")) {
    return "Wat ik begrijp: de situatie zelf is moeilijk, maar het ontbreken van steun maakt ze nog zwaarder dan ze op papier misschien lijkt.";
  }

  if (hasPattern(context, "beslissingsverlamming")) {
    return "Wat ik begrijp: je zoekt niet nog meer losse informatie, maar iemand die helpt bepalen wat nu eerst komt.";
  }

  if (context.keyConcerns.length > 0) {
    return `Wat ik begrijp: ${context.keyConcerns.slice(0, 2).join(" en ")} vragen aandacht, maar het gaat waarschijnlijk ook over hoe draagbaar dit voor jou nog voelt.`;
  }

  return "Wat ik begrijp: er speelt genoeg tegelijk om eerst rust en richting te zoeken, nog voor er een groot plan nodig is.";
}

function buildInterpretation(context: ConversationContext) {
  if (context.perspective) {
    return context.perspective.replace("Wat opvalt: ", "Een mogelijke manier om hiernaar te kijken: ");
  }

  if (context.emotionalSignals.includes("schuldgevoel") || context.emotionalSignals.includes("schaamte")) {
    return "Een mogelijke valkuil is dat je dit te snel als persoonlijk falen gaat dragen. Wat je beschrijft kan ook betekenen dat de situatie meer steun, afstemming of structuur vraagt dan een ouder alleen kan leveren.";
  }

  if (context.emotionalSignals.includes("frustratie") && context.keyConcerns.length > 0) {
    return "Het kan helpen om frustratie niet alleen als boosheid te zien, maar als een signaal dat iets al te lang zonder helder vervolg blijft liggen.";
  }

  return "Een manier om hiernaar te kijken: probeer het probleem niet meteen op te lossen, maar onderscheid eerst wat bij je kind hoort, wat bij de omgeving hoort, en wat jij momenteel alleen aan het dragen bent.";
}

function buildReflectionQuestion(context: ConversationContext, mode: EmpathicMode) {
  if (hasPattern(context, "zorgdrager-overbelasting") && hasPattern(context, "school-gedrag-spanningsveld")) {
    return mode === "listen"
      ? "Wat zou het meeste opluchten als het morgen een beetje lichter werd: meer duidelijkheid rond je kind, of meer steun rond jou?"
      : "Wat maakt je op dit moment het meest bang: wat dit betekent voor je kind, of hoe lang jij dit nog alleen kan blijven dragen?";
  }

  if (hasPattern(context, "isolatie-of-steunnetwerkgat")) {
    return "Als er vandaag een betrouwbare volwassene naast je stond, welk stuk zou dan meteen lichter voelen?";
  }

  if (hasPattern(context, "beslissingsverlamming")) {
    return "Welke keuze zou vandaag al genoeg zijn, zelfs als de rest nog onduidelijk blijft?";
  }

  if (context.attemptedActions.length === 0) {
    return "Wat heb je al geprobeerd, ook al voelde het klein of onaf?";
  }

  return "Welke vraag zou je aan een professional willen stellen als je maar een kwartier had?";
}

function buildDirection(context: ConversationContext) {
  if (hasPattern(context, "school-gedrag-spanningsveld")) {
    return "De richting lijkt nu: niet harder zoeken naar een etiket, maar een kort gesprek voorbereiden waarin school, jouw draagkracht en de eerste steun rond je kind samen bekeken worden.";
  }

  if (hasPattern(context, "isolatie-of-steunnetwerkgat")) {
    return "De richting lijkt nu: eerst een steunpunt zoeken, nog voor je het hele probleem probeert op te lossen.";
  }

  return "De richting lijkt nu: maak het kleiner, kies een eerste gesprekspartner, en bepaal wat vandaag niet hoeft.";
}

export function generateAssistantReply(messages: ConversationMessage[]) {
  const context = extractConversationContext(messages);
  const userMessageCount = messages.filter((message) => message.role === "user").length;

  if (userMessageCount === 0) {
    return "Welkom. Vertel rustig wat er speelt. Je mag zoveel of zo weinig vertellen als je wil.";
  }

  const mode = decideEmpathicMode(context, userMessageCount);
  const response = [buildValidation(context), buildUnderstanding(context), buildInterpretation(context)];

  if (mode === "direction") {
    response.push(buildDirection(context));
  }

  response.push(buildReflectionQuestion(context, mode));

  return response.join(" ");
}

export function decideNextConversationStep(messages: ConversationMessage[]): ConversationDecision {
  const context = extractConversationContext(messages);
  const userMessageCount = messages.filter((message) => message.role === "user").length;

  return {
    canCreateGuidance: userMessageCount > 0,
    nextPrompt: userMessageCount > 0 ? generateAssistantReply(messages) : null
  };
}

export function buildGuidanceResult(input: {
  context: ConversationContext;
  messages: ConversationMessage[];
}) {
  return buildStaticGuidanceResult({
    answers: contextToLegacyAnswers(input.context, input.messages),
    context: input.context,
    messages: input.messages
  });
}

export {
  contextToLegacyAnswers,
  extractConversationContext,
  type ConversationContext,
  type ConversationMessage
};
