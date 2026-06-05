import assert from "node:assert/strict";
import { buildStaticGuidanceResult } from "../../lib/guidance/staticGuidance";

const result = buildStaticGuidanceResult({
  situation: "Mijn kind heeft gedragsproblemen op school en ik weet niet wie ik moet contacteren.",
  family: "ouder, kind en school",
  children: "8 jaar",
  hardest: "Ik voel mij vastgelopen en alleen.",
  tried: "Ik heb al met de leerkracht gesproken.",
  support: "Ik wil weten welke eerste stap ik morgen kan zetten."
});

assert.equal(result.title, "Je eerste rustige overzicht");
assert.ok(result.summary.length > 20);
assert.ok(result.emotionalImportant.includes("draagkracht") || result.emotionalImportant.includes("onduidelijkheid"));
assert.ok(result.attentionFirst.length > 20);
assert.ok(result.practicalUrgent.length > 20);
assert.ok(result.canWait.length > 20);
assert.ok(result.firstStep.length > 20);
assert.ok(result.steps.length >= 3);
assert.ok(result.oneThingNotToCarryAlone.length > 20);
assert.ok(result.nextQuestion.length > 20);
assert.ok(result.nextQuestion.includes("steun") || result.nextQuestion.includes("richting"));
assert.ok(result.monitor.length > 20);
assert.ok(result.whenToSeekHelp.includes("zelfmoordgedachten"));
assert.ok(result.questions.length >= 3);
assert.ok(result.resources.length > 0);
assert.ok(result.boundaries.some((boundary) => boundary.includes("geen therapie")));
