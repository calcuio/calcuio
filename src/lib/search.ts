import type { Tool } from '@/types';
import { tools } from '@/data/tools';

export interface SearchResult {
  tool: Tool;
  score: number;
  matchedOn: string[];
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function searchTools(query: string, limit = 8): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const tool of tools) {
    const name = normalize(tool.name);
    const keywords = tool.keywords.map(normalize);
    const synonyms = tool.synonyms.map(normalize);
    const intents = tool.intentPhrases.map(normalize);
    const description = normalize(tool.description);
    const matchedOn: string[] = [];
    let score = 0;

    // Exact name match
    if (name === q) {
      score += 100;
      matchedOn.push('name');
    } else if (name.startsWith(q)) {
      score += 80;
      matchedOn.push('name');
    } else if (name.includes(q)) {
      score += 60;
      matchedOn.push('name');
    }

    // Intent phrase match (highest for natural language)
    for (const intent of intents) {
      if (intent === q) {
        score += 95;
        matchedOn.push('intent');
      } else if (intent.includes(q) || q.includes(intent)) {
        score += 70;
        matchedOn.push('intent');
      }
    }

    // Synonym match
    for (const syn of synonyms) {
      if (syn === q) {
        score += 75;
        matchedOn.push('synonym');
      } else if (syn.includes(q) || q.includes(syn)) {
        score += 50;
        matchedOn.push('synonym');
      }
    }

    // Keyword match
    for (const kw of keywords) {
      if (kw === q) {
        score += 65;
        matchedOn.push('keyword');
      } else if (q.includes(kw) || kw.includes(q)) {
        score += 35;
        matchedOn.push('keyword');
      }
    }

    // Description partial match
    if (description.includes(q)) {
      score += 20;
      matchedOn.push('description');
    }

    // Fuzzy match on name (typo tolerance)
    if (score === 0 && q.length > 2) {
      const distance = levenshtein(q, name);
      const maxDistance = Math.max(1, Math.floor(name.length / 4));
      if (distance <= maxDistance) {
        score += 25 - distance * 5;
        matchedOn.push('fuzzy');
      }
    }

    // Token-based matching for multi-word queries
    const qTokens = q.split(' ');
    if (qTokens.length > 1) {
      let tokenMatches = 0;
      for (const token of qTokens) {
        if (token.length < 2) continue;
        if (name.includes(token) || keywords.some((k) => k.includes(token)) || synonyms.some((s) => s.includes(token))) {
          tokenMatches++;
        }
      }
      if (tokenMatches > 0) {
        score += tokenMatches * 15;
        matchedOn.push('tokens');
      }
    }

    if (score > 0) {
      results.push({ tool, score, matchedOn: [...new Set(matchedOn)] });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function getSuggestions(query: string): string[] {
  const q = normalize(query);
  if (!q) return [];
  const suggestions = new Set<string>();
  for (const tool of tools) {
    for (const intent of tool.intentPhrases) {
      if (intent.includes(q) || q.includes(intent.split(' ')[0])) {
        suggestions.add(intent);
      }
    }
    for (const syn of tool.synonyms) {
      if (syn.includes(q)) {
        suggestions.add(syn);
      }
    }
  }
  return Array.from(suggestions).slice(0, 5);
}
