import {
  buildNextAssistantMessage,
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

export function generateAssistantReply(messages: ConversationMessage[]) {
  const context = extractConversationContext(messages);
  const userMessageCount = messages.filter((message) => message.role === "user").length;

  return buildNextAssistantMessage(context, userMessageCount);
}

export function decideNextConversationStep(messages: ConversationMessage[]): ConversationDecision {
  const context = extractConversationContext(messages);
  const userMessageCount = messages.filter((message) => message.role === "user").length;

  return {
    canCreateGuidance: userMessageCount > 0,
    nextPrompt: userMessageCount > 0 ? buildNextAssistantMessage(context, userMessageCount) : null
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
