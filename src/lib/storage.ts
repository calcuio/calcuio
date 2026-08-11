const FAV_KEY = 'calcuio:favorites';
const RECENT_KEY = 'calcuio:recent';
const MAX_RECENT = 12;

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') as string[];
  } catch {
    return [];
  }
}

export function toggleFavorite(toolId: string): string[] {
  const favs = getFavorites();
  const next = favs.includes(toolId) ? favs.filter((f) => f !== toolId) : [...favs, toolId];
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

export function isFavorite(toolId: string): boolean {
  return getFavorites().includes(toolId);
}

export interface RecentEntry {
  id: string;
  ts: number;
}

export function getRecent(): RecentEntry[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as RecentEntry[];
  } catch {
    return [];
  }
}

export function addRecent(toolId: string): RecentEntry[] {
  const entries = getRecent().filter((e) => e.id !== toolId);
  const next = [{ id: toolId, ts: Date.now() }, ...entries].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

export function clearRecent(): void {
  localStorage.removeItem(RECENT_KEY);
}
