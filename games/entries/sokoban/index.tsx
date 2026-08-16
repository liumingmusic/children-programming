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
  CELL,
  LEVELS,
  LEVEL_COUNT,
  type GameState,
  type Input,
  createState,
  step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function Sokoban() {
  const { high, submit } = useHighScore("sokoban");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const stateRef = useRef<GameState>(createState(LEVELS[0]));
  const prevRef = useRef<GameState>(createState(LEVELS[0]));
  const moveRef = useRef<Input["move"]>(null);
  const btnRef = useRef<Input["move"]>(null);
  const endedRef = useRef(false);
  const totalRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const W = stateRef.current.cols * CELL;
  const Hh = stateRef.current.rows * CELL;

  const { canvasRef, ensureSize } = useCanvasRef(W, Hh);

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

    ctx.clearRect(0, 0, W, Hh);
    ctx.fillStyle = "#10203a";
    ctx.fillRect(0, 0, W, Hh);

    for (let y = 0; y < s.rows; y++)
      for (let x = 0; x < s.cols; x++) {
        const px = x * CELL;
        const py = y * CELL;
        if (s.walls[y][x]) {
          ctx.fillStyle = "#2b3a55";
          ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
        } else {
          ctx.fillStyle = "#16304f";
          ctx.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
        }
        if (s.targets[y][x]) {
          ctx.strokeStyle = "#4FD1C5";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(px + CELL / 2, py + CELL / 2, CELL * 0.28, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (s.boxes[y][x]) {
          ctx.fillStyle = "#F6AD55";
          ctx.fillRect(px + 6, py + 6, CELL - 12, CELL - 12);
          ctx.strokeStyle = "#b9742f";
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 6, py + 6, CELL - 12, CELL - 12);
          ctx.beginPath();
          ctx.moveTo(px + 6, py + 6);
          ctx.lineTo(px + CELL - 6, py + CELL - 6);
          ctx.moveTo(px + CELL - 6, py + 6);
          ctx.lineTo(px + 6, py + CELL - 6);
          ctx.stroke();
        }
      }

    // 玩家
    const cx = s.player.x * CELL + CELL / 2;
    const cy = s.player.y * CELL + CELL / 2;
    ctx.fillStyle = "#FFD65A";
    ctx.beginPath();
    ctx.arc(cx, cy, CELL * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0a1428";
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 3, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 粒子
    drawParticles(ctx, particlesRef.current);

    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`第 ${levelIndex + 1}/${LEVEL_COUNT} 关`, 8, 22);
    ctx.fillText(`步数 ${s.moves}`, 8, 42);
    if (s.combo > 1) {
      ctx.fillStyle = "#FFD65A";
      ctx.textAlign = "right";
      ctx.fillText(`连击 ×${s.combo}`, W - 8, 22);
    }
  }, [W, Hh, levelIndex]);

  const start = useCallback(() => {
    endedRef.current = false;
    const s0 = createState(LEVELS[0]);
    stateRef.current = s0;
    prevRef.current = s0;
    moveRef.current = null;
    btnRef.current = null;
    totalRef.current = 0;
    particlesRef.current = [];
    setLevelIndex(0);
    setFinalScore(0);
    setPhase("playing");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") moveRef.current = 0;
      else if (k === "arrowright" || k === "d") moveRef.current = 1;
      else if (k === "arrowdown" || k === "s") moveRef.current = 2;
      else if (k === "arrowleft" || k === "a") moveRef.current = 3;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pressBtn = (m: Input["move"]) => () => {
    btnRef.current = m;
  };

  useGameLoop(() => {
    const s = stateRef.current;
    const mv = btnRef.current ?? moveRef.current;
    const input: Input = { move: mv };
    const prev = prevRef.current;
    const ns = step(s, 0, input);
    stepParticles(particlesRef.current, 1 / 60);
    moveRef.current = null;
    btnRef.current = null;

    if (ns.placed > prev.placed) {
      if (!muted) sfx.catch();
      const cx = ns.player.x * CELL + CELL / 2;
      const cy = ns.player.y * CELL + CELL / 2;
      spawnBurst(particlesRef.current, cx, cy, "#4FD1C5", 12, 200);
      if (ns.combo >= 3 && !muted) sfx.combo(ns.combo);
    }

    if (ns.won) {
      totalRef.current += Math.max(0, 1000 - ns.moves * 5) + ns.score;
      if (levelIndex < LEVEL_COUNT - 1) {
        const next = levelIndex + 1;
        const nxt = createState(LEVELS[next]);
        stateRef.current = nxt;
        prevRef.current = nxt;
        setLevelIndex(next);
        showBanner(`第 ${levelIndex + 1} 关完成！进入第 ${next + 1} 关`);
        if (!muted) sfx.levelup();
      } else {
        if (endedRef.current) return;
        endedRef.current = true;
        setFinalScore(totalRef.current);
        submit(totalRef.current);
        setPhase("result");
        if (!muted) sfx.win();
      }
      return;
    }

    stateRef.current = ns;
    prevRef.current = ns;
    draw(ns);
  }, phase === "playing");

  const best = Math.max(high, finalScore);
  const s = stateRef.current;

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">📦🧒</div>
        <p className="max-w-sm text-[#5F5E5A]">
          把<span className="font-medium text-[#F6AD55]">所有箱子</span>推到
          <span className="font-medium text-[#4FD1C5]">绿色圆圈</span>上就过关。共 {LEVEL_COUNT} 关，
          <span className="font-medium text-[#B7791F]">连续把箱子推上目标</span>有连击加分。注意：箱子不能拉，只能推！
        </p>
        <p className="text-sm text-[#5F5E5A]">💡 方向键 / WASD，手机用下方按钮</p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始推箱子
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">🏆 全部 {LEVEL_COUNT} 关通关！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次总分" value={finalScore} />
          <Stat label="历史最高" value={best} />
          <Stat label="到达关卡" value={`第 ${LEVEL_COUNT} 关`} />
          <Stat label="最高连击" value={s.comboBest} />
        </div>
        <button
          onClick={start}
          className="mt-2 rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          再玩一次
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2 w-full max-w-md">
        <div className="rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-center text-sm text-[#0F6E56]">
          历史最高 {high} ｜ 第 {levelIndex + 1}/{LEVEL_COUNT} 关 ｜ 连击 {s.combo}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <SoundToggle />
        </div>
      </div>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl" style={{ aspectRatio: `${W} / ${Hh}` }}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {banner && <LevelBanner key={banner.key} text={banner.text} />}
      </div>
      <div className="mt-3 grid w-full max-w-[240px] grid-cols-3 gap-2">
        <div />
        <Pad label="↑" onDown={pressBtn(0)} />
        <div />
        <Pad label="←" onDown={pressBtn(3)} />
        <Pad label="↓" onDown={pressBtn(2)} />
        <Pad label="→" onDown={pressBtn(1)} />
      </div>
    </div>
  );
}

function Pad({ label, onDown }: { label: string; onDown: () => void }) {
  return (
    <button
      onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) => { e.preventDefault(); onDown(); }}
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
