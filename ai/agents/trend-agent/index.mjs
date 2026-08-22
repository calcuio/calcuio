const MIN_SCORE = 7;

function scoreOpportunity(trend) {
  const demand = Number(trend.demand ?? 0);
  const growth = Number(trend.growth ?? 0);
  const competition = Number(trend.competition ?? 0);
  const utilityFit = Number(trend.utilityFit ?? 0);
  const evergreen = Number(trend.evergreen ?? 0);

  const score =
    demand * 0.30 +
    growth * 0.20 +
    (10 - competition) * 0.15 +
    utilityFit * 0.25 +
    evergreen * 0.10;

  return Number(score.toFixed(2));
}

function analyzeTrends(trends) {
  return trends
    .map((trend) => ({
      ...trend,
      opportunityScore: scoreOpportunity(trend),
    }))
    .filter((trend) => trend.opportunityScore >= MIN_SCORE)
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export { analyzeTrends };
