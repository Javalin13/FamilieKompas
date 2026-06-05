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

assert.ok(reply.includes("gedrag") || reply.includes("school"));
assert.ok(reply.includes("twee lagen") || reply.includes("niet noodzakelijk hetzelfde probleem"));
assert.ok(reply.includes("Wat doet het meest pijn"));
assert.ok(!reply.includes("De richting lijkt nu"));
assert.ok(!reply.includes("Ben je moeder"));
assert.ok(!reply.includes("Welke leeftijd"));
assert.equal(decision.canCreateGuidance, true);
assert.ok(result.summary.includes("niet noodzakelijk hetzelfde probleem"));
assert.ok(result.emotionalImportant.length > 80);
assert.ok(result.oneThingNotToCarryAlone.includes("school"));
