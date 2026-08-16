"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import { useCanvasRef } from "@/games/hooks/useCanvasRef";
import {
  sfx,
  spawnBurst,
  stepParticles,
  drawParticles,
  useMuted,
  type Particle,
} from "@/games/hooks/useGameJuice";
import LevelBanner from "@/games/components/LevelBanner";
import SoundToggle from "@/games/components/SoundToggle";
import {
  W, H, COLS, ROWS, CELL, ROTATIONS, MAX_LEVEL,
  type GameState, type Input, createState, step, cellsOf,
} from "./logic";

type Phase = "idle" | "playing" | "result";

const COLORS = ["", "#4FD1C5", "#FFD65A", "#B794F4", "#68D391", "#FC8181", "#63B3ED", "#F6AD55"];

export default function Tetris() {
  const { high, submit } = useHighScore("tetris");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const prevRef = useRef<GameState>(createState());
  const keysRef = useRef({ left: false, right: false, rotate: false, soft: false, hard: false });
  const btnRef = useRef({ left: false, right: false, rotate: false, soft: false, hard: false });
  const endedRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  }, []);

  const draw = useCallback((s: GameState) => {
    if (!ensureSize()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a1428";
    ctx.fillRect(0, 0, W, H);

    // 网格底
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let x = 1; x < COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 1; y < ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }

    // 已落定方块
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        const v = s.board[y][x];
        if (v) drawCell(ctx, x, y, COLORS[v]);
      }

    // 当前方块
    for (const { x, y } of cellsOf(s.cur)) {
      if (y >= 0) drawCell(ctx, x, y, COLORS[ROTATIONS[s.cur.type][s.cur.rot][y - s.cur.y][x - s.cur.x]]);
    }

    // 粒子
    drawParticles(ctx, particlesRef.current);

    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`第 ${s.level}/${MAX_LEVEL} 关`, 8, 22);
    ctx.fillText(`分数 ${s.score}`, 8, 42);
    ctx.fillText(`消行 ${s.lines}/${s.levelTarget}`, 8, 62);
    if (s.combo > 1) {
      ctx.fillStyle = "#FFD65A";
      ctx.textAlign = "right";
      ctx.fillText(`连击 ×${s.combo}`, W - 8, 22);
    }
  }, []);

  const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, 3);
  };

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
    const s0 = createState();
    stateRef.current = s0;
    prevRef.current = s0;
    keysRef.current = { left: false, right: false, rotate: false, soft: false, hard: false };
    btnRef.current = { left: false, right: false, rotate: false, soft: false, hard: false };
    particlesRef.current = [];
    setFinalScore(0);
    setPhase("playing");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keysRef.current.left = true;
      if (k === "arrowright" || k === "d") keysRef.current.right = true;
      if (k === "arrowup" || k === "x") { keysRef.current.rotate = true; e.preventDefault(); }
      if (k === "arrowdown" || k === "s") keysRef.current.soft = true;
      if (k === " ") { keysRef.current.hard = true; e.preventDefault(); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keysRef.current.left = false;
      if (k === "arrowright" || k === "d") keysRef.current.right = false;
      if (k === "arrowup" || k === "x") keysRef.current.rotate = false;
      if (k === "arrowdown" || k === "s") keysRef.current.soft = false;
      if (k === " ") keysRef.current.hard = false;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const holdBtn = (key: keyof typeof btnRef.current, v: boolean) => () => {
    btnRef.current[key] = v;
  };

  useGameLoop((dt) => {
    const s = stateRef.current;
    if (!s.alive) {
      end();
      return;
    }
    const k = keysRef.current;
    const b = btnRef.current;
    const input: Input = {
      left: k.left || b.left,
      right: k.right || b.right,
      rotate: k.rotate || b.rotate,
      soft: k.soft || b.soft,
      hard: k.hard || b.hard,
    };
    const prev = prevRef.current;
    const ns = step(s, Math.min(dt, 0.034), input);
    stepParticles(particlesRef.current, dt);

    // 事件反馈
    if (ns.lines > prev.lines) {
      if (!muted) sfx.brick();
      spawnBurst(particlesRef.current, W / 2, H - 30, "#FFD65A", 18, 240);
      if (ns.combo >= 3 && !muted) sfx.combo(ns.combo);
    }
    if (ns.level > prev.level) {
      if (ns.level >= MAX_LEVEL) {
        showBanner("🏆 全部通关！继续挑战");
        if (!muted) sfx.win();
      } else {
        showBanner(`第 ${ns.level} 关 · 下落更快`);
        if (!muted) sfx.levelup();
      }
    }

    stateRef.current = ns;
    prevRef.current = ns;
    draw(ns);
    if (!ns.alive) end();
  }, phase === "playing");

  const best = Math.max(high, finalScore);
  const s = stateRef.current;

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🧱</div>
        <p className="max-w-sm text-[#5F5E5A]">
          旋转下落的方块，<span className="font-medium text-[#0F6E56]">填满一整行</span>就能消除得分。
          累计消除行数越多，关卡越高、下落越快；连续消行还有<span className="font-medium text-[#B7791F]">连击倍率</span>加分。
          ← → 移动，↑ 旋转，↓ 加速，空格 直接落底。
        </p>
        <p className="text-sm text-[#5F5E5A]">💡 手机用下方按钮操作</p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始游戏
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">🪦 叠到顶啦！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={finalScore} />
          <Stat label="历史最高" value={best} />
          <Stat label="消除行数" value={s.lines} />
          <Stat label="到达关卡" value={`第 ${s.level} 关`} />
          <Stat label="最高连击" value={s.comboBest} />
          <Stat label="通关" value={s.cleared ? "已达成 🏆" : "未达成"} />
        </div>
        <button
          onClick={start}
          className="mt-2 rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          再来一局
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2 w-full max-w-md">
        <div className="rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-center text-sm text-[#0F6E56]">
          历史最高 {high} ｜ 第 {s.level}/{MAX_LEVEL} 关 ｜ 连击 {s.combo}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <SoundToggle />
        </div>
      </div>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {banner && <LevelBanner key={banner.key} text={banner.text} />}
      </div>
      <div className="mt-3 grid w-full max-w-md grid-cols-5 gap-2">
        <Pad label="←" onDown={holdBtn("left", true)} onUp={holdBtn("left", false)} />
        <Pad label="↻" onDown={holdBtn("rotate", true)} onUp={holdBtn("rotate", false)} />
        <Pad label="→" onDown={holdBtn("right", true)} onUp={holdBtn("right", false)} />
        <Pad label="↓" onDown={holdBtn("soft", true)} onUp={holdBtn("soft", false)} />
        <Pad label="⤓" onDown={holdBtn("hard", true)} onUp={holdBtn("hard", false)} />
      </div>
    </div>
  );
}

function Pad({ label, onDown, onUp }: { label: string; onDown: () => void; onUp: () => void }) {
  return (
    <button
      onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) => { e.preventDefault(); onDown(); }}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
      className="rounded-xl bg-[#0F6E56] py-3 text-lg font-semibold text-white active:bg-[#085041]"
    >
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <div className="text-xs text-[#5F5E5A]">{label}</div>
      <div className="text-xl font-semibold text-[#04342C]">{value}</div>
    </div>
  );
}
