export type SafetyDetection = {
  triggered: boolean;
  riskType: string | null;
  matchedTerms: string[];
};

const safetyTerms: Record<string, string[]> = {
  zelfmoord: [
    "zelfmoord",
    "zelfdoding",
    "suicide",
    "suïcide",
    "ik wil dood",
    "ik wil er niet meer zijn",
    "niet meer leven",
    "een einde maken",
    "uit het leven stappen"
  ],
  zelfbeschadiging: [
    "zelfbeschadiging",
    "zelfverwonding",
    "mezelf pijn doen",
    "mezelf verwonden",
    "snijden in mezelf",
    "automutilatie"
  ],
  kindveiligheid: [
    "kindermishandeling",
    "kind in gevaar",
    "kind wordt geslagen",
    "mijn kind wordt geslagen",
    "verwaarlozing",
    "kind verwaarloosd",
    "onveilig voor mijn kind"
  ],
  geweld: [
    "geweld",
    "bedreigd",
    "bedreiging",
    "slaan",
    "geslagen",
    "schoppen",
    "aanvallen",
    "mishandeld",
    "mishandeling"
  ],
  misbruik: [
    "misbruik",
    "aangerand",
    "aanranding",
    "verkrachting",
    "seksueel misbruik",
    "grensoverschrijdend gedrag"
  ],
  huiselijk_geweld: [
    "huiselijk geweld",
    "partnergeweld",
    "intrafamiliaal geweld",
    "thuis geweld",
    "geweld thuis",
    "mijn partner slaat"
  ],
  acute_medische_nood: [
    "medische nood",
    "medische noodsituatie",
    "ademt niet",
    "bewusteloos",
    "overdosis",
    "hartaanval",
    "beroerte",
    "ernstig gewond"
  ]
};

export function detectSafetyRisk(text: string): SafetyDetection {
  const normalized = text.toLowerCase();

  for (const [riskType, terms] of Object.entries(safetyTerms)) {
    const matchedTerms = terms.filter((term) => normalized.includes(term));
    if (matchedTerms.length > 0) {
      return {
        triggered: true,
        riskType,
        matchedTerms
      };
    }
  }

  return {
    triggered: false,
    riskType: null,
    matchedTerms: []
  };
}
