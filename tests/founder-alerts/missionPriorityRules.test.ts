import assert from "node:assert/strict";
import { detectMissionPriority } from "../../lib/founder-alerts/missionPriorityRules";

const priorityCases = [
  { text: "Ik ben een alleenstaande moeder en ik sta er alleen voor.", reason: "alleenstaande_ouder" },
  { text: "Ik ben een alleenstaande vader zonder steunnetwerk.", reason: "alleenstaande_ouder" },
  { text: "Mijn kind heeft een ontwikkelingsachterstand.", reason: "kind_met_achterstand" },
  { text: "Mijn kind met gedragsproblemen is niet meer handelbaar.", reason: "gedragsproblemen" },
  { text: "Ik ben een vastgelopen ouder en ten einde raad.", reason: "ouder_vastgelopen" },
  { text: "Ons gezin heeft geen steunnetwerk.", reason: "geen_steunnetwerk" }
];

for (const priorityCase of priorityCases) {
  const result = detectMissionPriority(priorityCase.text);
  assert.equal(result.triggered, true, `Expected mission-priority trigger for: ${priorityCase.text}`);
  assert.equal(result.reason, priorityCase.reason);
  assert.ok(result.matchedTerms.length > 0);
}

const normalResult = detectMissionPriority("Ik wil graag een oudercontact voorbereiden.");
assert.equal(normalResult.triggered, false);
assert.equal(normalResult.reason, null);
