"use client";
import { useEffect, useMemo, useState } from "react";
import { ALL, COUNTRIES, REGIONS, Cat } from "@/lib/categories";
import { buildBoard, pickFreeCountry, Tile } from "@/lib/game";
import { isUnlocked } from "@/lib/entitlement";
import { play, setSound, soundOn } from "@/lib/sound";
import { t } from "@/lib/i18n";
import Confetti from "./Confetti";

type Screen = "start" | "pick" | "board" | "question" | "winner";

export default function Game() {
  const [screen, setScreen] = useState<Screen>("start");
  const [names, setNames] = useState(["", ""]);
  const [freeId, setFreeId] = useState<string>();
  const [picks, setPicks] = useState<string[]>([]);
  const [tiles, setTiles] = useState<Tile[][]>([]);
  const [scores, setScores] = useState([0, 0]);
  const [turn, setTurn] = useState(0);
  const [active, setActive] = useState<[number, number] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [sound, setSoundState] = useState(true);
  const [dark, setDark] = useState(true);
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUnlocked(isUnlocked()); setSoundState(soundOn());
    const th = localStorage.getItem("trivia.theme") || "dark"; setDark(th === "dark");
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; localStorage.setItem("trivia.theme", dark ? "dark" : "light"); }, [dark]);

  const team = (i: number) => names[i].trim() || t(i === 0 ? "teamA" : "teamB");
  const cats = picks.map((id) => ALL.find((c) => c.id === id)!);
  const locked = (c: Cat) => !unlocked && (c.isCountry ? c.id !== freeId : c.paid);
  const pickTeam = picks.length % 2;

  function begin() { play("tap"); setPicks([]); setScores([0, 0]); setTurn(0); setFreeId(pickFreeCountry(COUNTRIES)); setScreen("pick"); }
  function choose(c: Cat) {
    if (locked(c)) { play("nobody"); setUnlockOpen(true); return; }
    if (picks.includes(c.id) || picks.length >= 4) return;
    play("tap"); setPicks([...picks, c.id]);
  }
  function startBoard() { play("tap"); setTiles(buildBoard(cats)); setTurn(0); setScreen("board"); }
  function openTile(c: number, r: number) { if (tiles[c][r].used) return; play("tap"); setActive([c, r]); setRevealed(false); setScreen("question"); }
  function award(winner: number | null) {
    const [c, r] = active!; const pts = tiles[c][r].q.level;
    const next = tiles.map((col, ci) => col.map((tile, ri) => (ci === c && ri === r ? { ...tile, used: true, by: winner ?? undefined } : tile)));
    setTiles(next); play(winner === null ? "nobody" : "correct");
    if (winner !== null) setScores((s) => s.map((v, i) => (i === winner ? v + pts : v)));
    setTurn((x) => 1 - x); setActive(null);
    if (next.every((col) => col.every((tile) => tile.used))) { setTimeout(() => play("win"), 300); setScreen("winner"); } else setScreen("board");
  }

  const shown = useMemo(() => ALL.filter((c) => (region === "All" || c.group === region) && c.name.toLowerCase().includes(search.toLowerCase())), [region, search]);
  const tile = active ? tiles[active[0]][active[1]] : null;
  const winnerIdx = scores[0] === scores[1] ? -1 : scores[0] > scores[1] ? 0 : 1;

  return (
    <main className="app">
      <header className="top">
        <strong className="logo">{t("title")}</strong>
        <div className="toggles">
          <button className="chip" aria-pressed={sound} onClick={() => { setSound(!sound); setSoundState(!sound); }}>{sound ? "🔊" : "🔇"} {t("sound")}</button>
          <button className="chip" onClick={() => setDark(!dark)}>{dark ? "🌙 " + t("dark") : "☀️ " + t("light")}</button>
        </div>
      </header>

      {["board", "question"].includes(screen) && (
        <section className="scores" aria-live="polite">
          {[0, 1].map((i) => (
            <div key={i} className={`score team${i} ${turn === i && screen === "board" ? "on" : ""}`}>
              <span>{team(i)}</span><b>{scores[i]}</b>
            </div>
          ))}
        </section>
      )}

      {screen === "start" && (
        <section className="stage center">
          <h1 className="hero">{t("title")}</h1>
          <p className="sub">{t("tagline")}</p>
          {[0, 1].map((i) => (
            <input key={i} className={`field team${i}`} placeholder={`${t(i === 0 ? "teamA" : "teamB")} - ${t("teamNamePlaceholder")}`} value={names[i]} maxLength={20}
              onChange={(e) => setNames(names.map((n, j) => (j === i ? e.target.value : n)))} aria-label={t(i === 0 ? "teamA" : "teamB")} />
          ))}
          <button className="big" onClick={begin}>{t("startGame")}</button>
        </section>
      )}

      {screen === "pick" && (
        <section className="stage">
          <h2 className={`turnline team${pickTeam}`}>{picks.length < 4 ? t("pickTurn", { team: team(pickTeam), n: picks.length + 1 }) : t("pickTitle")}</h2>
          <div className="picked">{[0, 1, 2, 3].map((i) => <span key={i} className={`slot team${i % 2}`}>{cats[i] ? `${cats[i].emoji} ${cats[i].name}` : "?"}</span>)}</div>
          <input className="field" placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={t("search")} />
          <div className="chips">{["All", "General", ...REGIONS].map((r) => <button key={r} className="chip" aria-pressed={region === r} onClick={() => setRegion(r)}>{r === "All" ? t("all") : r}</button>)}</div>
          <div className="grid">
            {shown.map((c) => {
              const isLocked = locked(c); const taken = picks.includes(c.id); const free = c.id === freeId;
              return (
                <button key={c.id} className={`cat ${taken ? "taken" : ""} ${free ? "free" : ""}`} disabled={taken} onClick={() => choose(c)}>
                  <span className="emo">{isLocked ? "🔒" : c.emoji}</span>
                  <span className="nm">{c.name}</span>
                  {free && <small className="badge">{t("freeCountry")}</small>}
                </button>
              );
            })}
          </div>
          {picks.length === 4 && <button className="big" onClick={startBoard}>{t("startBoard")}</button>}
        </section>
      )}

      {screen === "board" && (
        <section className="stage">
          <h2 className={`turnline team${turn}`}>{t("pickTile", { team: team(turn) })}</h2>
          <div className="board">
            {cats.map((c, ci) => (
              <div key={c.id} className="col">
                <div className={`head team${ci % 2}`}><span>{c.emoji}</span><b>{c.name}</b></div>
                {tiles[ci]?.map((tl, ri) => (
                  <button key={ri} className={`tile ${tl.used ? "used" : ""}`} disabled={tl.used} onClick={() => openTile(ci, ri)} aria-label={`${c.name} ${ri + 1} ${t("points")}`}>
                    {tl.used ? "" : ri + 1}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {screen === "question" && tile && (
        <section className="stage center">
          <div className="qmeta">{cats[active![0]].emoji} {cats[active![0]].name} · {tile.q.level} {t("points")}</div>
          {tile.q.image && <img className="qimg" src={tile.q.image} alt="" />}
          <h2 className="q">{tile.q.question}</h2>
          {!revealed ? (
            <button className="big" onClick={() => { play("reveal"); setRevealed(true); }}>{t("reveal")}</button>
          ) : (
            <>
              <div className="ans"><b>{tile.q.answer}</b><p>{tile.q.explanation}</p></div>
              <h3>{t("whoGotIt")}</h3>
              <div className="row">
                <button className="big team0" onClick={() => award(0)}>{team(0)}</button>
                <button className="big team1" onClick={() => award(1)}>{team(1)}</button>
                <button className="big ghost" onClick={() => award(null)}>{t("nobody")}</button>
              </div>
            </>
          )}
        </section>
      )}

      {screen === "winner" && (
        <section className="stage center">
          <Confetti />
          <h1 className="hero">{winnerIdx < 0 ? t("tie") : t("winner", { team: team(winnerIdx) })}</h1>
          <div className="final">{[0, 1].map((i) => <div key={i} className={`score team${i} ${winnerIdx === i ? "on" : ""}`}><span>{team(i)}</span><b>{scores[i]}</b></div>)}</div>
          <button className="big" onClick={() => setScreen("start")}>{t("playAgain")}</button>
        </section>
      )}

      {unlockOpen && (
        <div className="overlay" role="dialog" aria-modal="true" onClick={() => setUnlockOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h2>{t("unlockTitle")}</h2>
            <p>{t("unlockBody")}</p>
            <p className="note">{t("unlockSoon")}</p>
            <button className="big" onClick={() => setUnlockOpen(false)}>{t("close")}</button>
          </div>
        </div>
      )}
    </main>
  );
}
