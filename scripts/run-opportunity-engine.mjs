import { readFile, writeFile } from "node:fs/promises";
import { buildOpportunityReport } from "../ai/agents/trend-agent/opportunity-engine.mjs";

const input = await readFile(
  new URL("../ai/data/sample-trends.json", import.meta.url),
  "utf8"
);

const trends = JSON.parse(input);
const report = buildOpportunityReport(trends);

await writeFile(
  new URL("../ai/reports/latest-opportunities.json", import.meta.url),
  JSON.stringify(report, null, 2)
);

console.log("\nCalcuio Opportunity Engine\n");
console.log(JSON.stringify(report, null, 2));
console.log("\nReport saved to ai/reports/latest-opportunities.json");
