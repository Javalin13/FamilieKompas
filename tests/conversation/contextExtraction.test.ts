import assert from "node:assert/strict";
import {
  buildNextAssistantMessage,
  extractConversationContext
} from "../../lib/conversation/contextExtraction";

const messages = [
  {
    role: "assistant" as const,
    content: "Welkom. Vertel rustig wat er speelt."
  },
  {
    role: "user" as const,
    content:
      "Ik ben een alleenstaande moeder. Mijn zoon is 8 jaar. Op school zeggen ze dat hij gedragsproblemen heeft. Ik ben uitgeput. Ik heb al met de leerkracht gesproken. Ik weet niet meer wat ik moet doen."
  }
];

const context = extractConversationContext(messages);

assert.equal(context.parentRole, "alleenstaande moeder");
assert.equal(context.familySituation, "alleenstaande ouder");
assert.deepEqual(context.childAges, ["8 jaar"]);
assert.ok(context.peopleInvolved.includes("school"));
assert.ok(context.peopleInvolved.includes("leerkracht"));
assert.equal(context.childRole, "zoon");
assert.equal(context.emotionalState, "uitputting");
assert.ok(context.emotionalSignals.includes("uitputting"));
assert.ok(context.keyConcerns.includes("zorgen over gedrag"));
assert.ok(context.patterns.includes("zorgdrager-overbelasting"));
assert.ok(context.patterns.includes("school-gedrag-spanningsveld"));
assert.ok(context.attemptedActions.some((action) => action.includes("leerkracht")));
assert.equal(context.mode, "stappen");
assert.ok(context.perspective?.includes("niet noodzakelijk hetzelfde probleem"));

const nextMessage = buildNextAssistantMessage(context, 1);
assert.ok(!nextMessage.includes("Ben je moeder"));
assert.ok(!nextMessage.includes("Welke leeftijd"));
assert.ok(nextMessage.includes("alleenstaande moeder"));
