export type MissionPriorityDetection = {
  triggered: boolean;
  reason: string | null;
  matchedTerms: string[];
};

const missionPriorityTerms: Record<string, string[]> = {
  alleenstaande_ouder: ["alleenstaande moeder", "alleenstaande vader", "alleenstaande ouder"],
  kind_met_achterstand: ["kind met achterstand", "ontwikkelingsachterstand", "leerachterstand"],
  gedragsproblemen: [
    "kind met gedragsproblemen",
    "gedragsproblemen",
    "agressief gedrag",
    "woedeaanvallen",
    "niet meer handelbaar"
  ],
  ouder_vastgelopen: [
    "vastgelopen ouder",
    "volledig vastgelopen",
    "ik kan niet meer",
    "ik ben op",
    "ten einde raad",
    "helemaal vast"
  ],
  geen_steunnetwerk: [
    "geen steunnetwerk",
    "zonder steunnetwerk",
    "niemand helpt",
    "sta er alleen voor",
    "geen familie"
  ]
};

export function detectMissionPriority(text: string): MissionPriorityDetection {
  const normalized = text.toLowerCase();

  for (const [reason, terms] of Object.entries(missionPriorityTerms)) {
    const matchedTerms = terms.filter((term) => normalized.includes(term));
    if (matchedTerms.length > 0) {
      return {
        triggered: true,
        reason,
        matchedTerms
      };
    }
  }

  return {
    triggered: false,
    reason: null,
    matchedTerms: []
  };
}
