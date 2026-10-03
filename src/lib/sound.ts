let ctx: AudioContext | null = null;
export const soundOn = () => typeof window !== "undefined" && localStorage.getItem("trivia.sound") !== "off";
export const setSound = (on: boolean) => localStorage.setItem("trivia.sound", on ? "on" : "off");

function tone(freq: number, start: number, dur: number, type: OscillatorType = "triangle", vol = 0.15) {
  const a = ctx!; const o = a.createOscillator(); const g = a.createGain();
  o.type = type; o.frequency.value = freq; o.connect(g); g.connect(a.destination);
  const t = a.currentTime + start;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t); o.stop(t + dur);
}
const SOUNDS: Record<string, [number, number, number][]> = {
  tap: [[520, 0, 0.08]],
  reveal: [[392, 0, 0.1], [523, 0.1, 0.18]],
  correct: [[523, 0, 0.12], [659, 0.12, 0.12], [784, 0.24, 0.25]],
  nobody: [[220, 0, 0.2], [165, 0.18, 0.3]],
  win: [[523, 0, 0.15], [659, 0.15, 0.15], [784, 0.3, 0.15], [1047, 0.45, 0.5]],
};
export function play(name: keyof typeof SOUNDS) {
  if (!soundOn()) return;
  try { ctx = ctx || new (window.AudioContext || (window as any).webkitAudioContext)(); SOUNDS[name].forEach(([f, s, d]) => tone(f, s, d)); } catch {}
}
