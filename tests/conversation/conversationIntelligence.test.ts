import assert from "node:assert/strict";
import {
  buildGuidanceResult,
  decideNextConversationStep,
  extractConversationContext,
  generateAssistantReply
} from "../../lib/conversation/conversationIntelligence";

const messages = [
  {
    role: "assistant" as const,
    content: "Welkom. Vertel rustig wat er speelt."
  },
  {
    role: "user" as const,
    content:
      "Ik ben een alleenstaande moeder. Mijn zoon is 8 jaar. Op school zeggen ze dat hij gedragsproblemen heeft. Ik ben uitgeput. Ik heb al met de leerkracht gesproken."
  }
];

const context = extractConversationContext(messages);
const reply = generateAssistantReply(messages);
const decision = decideNextConversationStep(messages);
const result = buildGuidanceResult({ context, messages });

assert.ok(reply.includes("alleenstaande moeder"));
assert.ok(reply.includes("gedrag") || reply.includes("school"));
assert.ok(!reply.includes("Ben je moeder"));
assert.equal(decision.canCreateGuidance, true);
assert.ok(result.summary.includes("alleenstaande moeder") || result.summary.includes("zoon"));
assert.ok(result.emotionalImportant.length > 80);
