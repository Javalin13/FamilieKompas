import assert from "node:assert/strict";
import { detectSafetyRisk } from "../../lib/safety/dutchSafetyRules";

const safetyCases = [
  { text: "Ik denk aan zelfmoord en weet niet wat te doen.", riskType: "zelfmoord" },
  { text: "Ik wil mezelf pijn doen en snijden in mezelf.", riskType: "zelfbeschadiging" },
  { text: "Mijn partner slaat mij en er is geweld thuis.", riskType: "geweld" },
  { text: "Er is seksueel misbruik gebeurd.", riskType: "misbruik" },
  { text: "Mijn kind wordt geslagen en is onveilig.", riskType: "kindveiligheid" },
  { text: "Iemand is bewusteloos en ademt niet.", riskType: "acute_medische_nood" }
];

for (const safetyCase of safetyCases) {
  const result = detectSafetyRisk(safetyCase.text);
  assert.equal(result.triggered, true, `Expected safety trigger for: ${safetyCase.text}`);
  assert.equal(result.riskType, safetyCase.riskType);
  assert.ok(result.matchedTerms.length > 0);
}

const safeResult = detectSafetyRisk("Ik ben bezorgd over school en wil een gesprek voorbereiden.");
assert.equal(safeResult.triggered, false);
assert.equal(safeResult.riskType, null);
