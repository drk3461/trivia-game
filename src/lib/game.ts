import { Cat, Q } from "./categories";

export type Tile = { q: Q; used: boolean; by?: number };

const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// Draw one random question per level for each chosen category. Never repeats within a game.
export function buildBoard(cats: Cat[]): Tile[][] {
  return cats.map((c) => [1, 2, 3, 4].map((lvl) => {
    const pool = c.questions.filter((q) => q.level === lvl);
    return { q: shuffle(pool)[0], used: false };
  }));
}

export const pickFreeCountry = (countries: Cat[]) => shuffle(countries)[0]?.id;
