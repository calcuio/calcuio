import { analyzeTrends } from "./index.mjs";

function buildOpportunityReport(trends) {
  const opportunities = analyzeTrends(trends);

  return {
    generatedAt: new Date().toISOString(),
    totalSignals: trends.length,
    qualifiedOpportunities: opportunities.length,
    opportunities: opportunities.map((item) => ({
      name: item.name,
      score: item.opportunityScore,
      recommendation:
        item.opportunityScore >= 8.5
          ? "HIGH_PRIORITY"
          : "RESEARCH_MORE",
    })),
  };
}

export { buildOpportunityReport };
