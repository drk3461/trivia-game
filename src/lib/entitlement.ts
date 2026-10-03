// Stage 2: unlock = DEV_UNLOCK env flag, or a flag in localStorage.
// Stage 3 replaces this with the device-locked signed token.
export function isUnlocked(): boolean {
  if (process.env.NEXT_PUBLIC_DEV_UNLOCK === "true") return true;
  try { return localStorage.getItem("trivia.unlocked") === "1"; } catch { return false; }
}
