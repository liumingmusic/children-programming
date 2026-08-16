"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import { useCanvasRef } from "@/games/hooks/useCanvasRef";
import {
  W,
  H,
  CELL,
  COLS,
  ROWS,
  type GameState,
  type Input,
  createState,
  step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function SnakeSpace() {
  const { high, submit } = useHighScore("snake-space");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const inputRef = useRef<Input>({ dx: 0, dy: 0 });
  const endedRef = useRef(false);
  const bgRef = useRef<{ x: number; y: number; r: number; s: number }[]>([]);

  // 键盘：方向键 / WASD 设定移动方向
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") inputRef.current = { dx: 0, dy: -1 };
      else if (k === "arrowdown" || k === "s") inputRef.current = { dx: 0, dy: 1 };
      else if (k === "arrowleft" || k === "a") inputRef.current = { dx: -1, dy: 0 };
      else if (k === "arrowright" || k === "d") inputRef.current = { dx: 1, dy: 0 };
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const draw = useCallback((s: GameState, t: number) => {
    if (!ensureSize()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (bgRef.current.length === 0) {
      bgRef.current = Array.from({ length: 40 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        s: 12 + Math.random() * 30,
      }));
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#050a18";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (const st of bgRef.current) {
      const y = (st.y + t * st.s) % H;
      ctx.beginPath();
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 食物（星星）
    ctx.fillStyle = "#FFD65A";
    ctx.beginPath();
    ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // 蛇
    s.snake.forEach((c, i) => {
      ctx.fillStyle = i === 0 ? "#0F6E56" : "#5DCAA5";
      const px = c.x * CELL + 1;
      const py = c.y * CELL + 1;
      ctx.fillRect(px, py, CELL - 2, CELL - 2);
    });

    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`长度 ${s.score + 3}`, 12, 28);
  }, []);

  const end = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    const s = stateRef.current;
    setFinalScore(s.score);
    submit(s.score);
    setPhase("result");
  }, [submit]);

  const start = useCallback(() => {
    endedRef.current = false;
    stateRef.current = createState();
    inputRef.current = { dx: 1, dy: 0 };
    setFinalScore(0);
    setPhase("playing");
  }, []);

  const timeRef = useRef(0);
  useGameLoop((dt) => {
    const s = stateRef.current;
    if (!s.alive) {
      end();
      return;
    }
    const ns = step(s, Math.min(dt, 0.05), inputRef.current);
    stateRef.current = ns;
    timeRef.current += dt;
    draw(ns, timeRef.current);
    if (!ns.alive) end();
  }, phase === "playing");

  const best = Math.max(high, finalScore);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🐍⭐</div>
        <p className="max-w-sm text-[#5F5E5A]">
          操控<span className="font-medium text-[#0F6E56]">小蛇</span>在星海里游动，吃下
          <span className="font-medium text-[#FFD65A]">星星</span>就会变长。撞墙或撞到自己就结束！
        </p>
        <p className="text-sm text-[#5F5E5A]">
          💡 用 <span className="font-mono">↑ ↓ ← →</span> 或 <span className="font-mono">W A S D</span>
        </p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始游戏
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高长度：{high + 3}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">💥 撞到了！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次长度" value={finalScore + 3} />
          <Stat label="历史最长" value={best + 3} />
        </div>
        <button
          onClick={start}
          className="mt-2 rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          再来一次
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 w-full max-w-md rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-center text-sm text-[#0F6E56]">
        历史最长 {high + 3} ｜ 吃星星变长，别撞墙
      </div>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl"
        style={{ aspectRatio: `${COLS} / ${ROWS}`, touchAction: "none" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <div className="text-xs text-[#5F5E5A]">{label}</div>
      <div className="text-xl font-semibold text-[#04342C]">{value}</div>
    </div>
  );
}
