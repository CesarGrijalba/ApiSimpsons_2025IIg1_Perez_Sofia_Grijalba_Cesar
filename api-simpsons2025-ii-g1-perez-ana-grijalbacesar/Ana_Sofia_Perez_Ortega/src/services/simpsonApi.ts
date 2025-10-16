// src/services/simpsonApi.ts
export const BASE = "https://thesimpsonsapi.com/api";

export const img = (p?: string | null) =>
  p ? `https://thesimpsonsapi.com${p}` : "/placeholder.jpg";

/* -------- Characters -------- */
export type Character = {
  id: number;
  name: string;
  age?: number;
  occupation?: string;
  status?: string;
  gender?: string;
  portrait_path?: string | null;
  phrases?: string[];
};

export async function listCharacters(page = 1): Promise<Character[]> {
  const r = await fetch(`${BASE}/characters?page=${page}`);
  if (!r.ok) throw new Error("characters fetch failed");
  return (await r.json()) as Character[];
}

export async function getCharacter(id: number): Promise<Character> {
  const r = await fetch(`${BASE}/characters/${id}`);
  if (!r.ok) throw new Error("character fetch failed");
  return (await r.json()) as Character;
}

/* -------- Locations -------- */
export type Location = {
  id: number;
  name: string;
  description?: string;
  image_path?: string | null;
  portrait_path?: string | null;
  type?: string;
};

export async function listLocations(page = 1): Promise<Location[]> {
  const r = await fetch(`${BASE}/locations?page=${page}`);
  if (!r.ok) throw new Error("locations fetch failed");
  return (await r.json()) as Location[];
}

/* -------- Episodes -------- */
export type Episode = {
  id: number;
  name: string;
  season?: number;
  episode?: number;
  air_date?: string;
  synopsis?: string;
  image_path?: string | null;
};

export async function listEpisodes(page = 1): Promise<Episode[]> {
  const r = await fetch(`${BASE}/episodes?page=${page}`);
  if (!r.ok) throw new Error("episodes fetch failed");
  return (await r.json()) as Episode[];
}

/* -------- Fallback de frase por nombre -------- */
export async function randomQuoteByName(name: string): Promise<string | null> {
  try {
    const q = await fetch(
      `https://thesimpsonsquoteapi.glitch.me/quotes?character=${encodeURIComponent(name)}`
    );
    if (!q.ok) return null;
    const arr = await q.json();
    return Array.isArray(arr) && arr[0]?.quote ? arr[0].quote : null;
  } catch {
    return null;
  }
}
