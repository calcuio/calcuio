import { readFile } from "node:fs/promises";
import { analyzeTrends } from "../ai/agents/trend-agent/index.mjs";

const input = await readFile(
  new URL("../ai/data/sample-trends.json", import.meta.url),
  "utf8"
);

const trends = JSON.parse(input);
const opportunities = analyzeTrends(trends);

console.log("\nCalcuio AI — Trend Opportunities\n");
console.table(opportunities);
