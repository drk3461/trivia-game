"use client";
import { useEffect, useRef } from "react";

export default function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const x = c.getContext("2d")!;
    const fit = () => { c.width = innerWidth; c.height = innerHeight; }; fit(); addEventListener("resize", fit);
    const cols = ["#ffd23f", "#19c3e6", "#f2358d", "#7be05a", "#ffffff"];
    const bits = Array.from({ length: 160 }, () => ({ x: Math.random() * c.width, y: -Math.random() * c.height, w: 6 + Math.random() * 8, h: 10 + Math.random() * 10, vy: 2 + Math.random() * 4, vx: -1.5 + Math.random() * 3, r: Math.random() * 6, vr: -0.2 + Math.random() * 0.4, col: cols[Math.floor(Math.random() * cols.length)] }));
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const loop = () => {
      x.clearRect(0, 0, c.width, c.height);
      for (const b of bits) {
        if (!still) { b.y += b.vy; b.x += b.vx; b.r += b.vr; if (b.y > c.height) { b.y = -20; b.x = Math.random() * c.width; } }
        x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.fillStyle = b.col; x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); x.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", fit); };
  }, []);
  return <canvas ref={ref} className="confetti" aria-hidden />;
}
