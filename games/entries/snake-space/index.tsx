"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  W,
  H,
  CELL,
  COLS,
  ROWS,
  MAX_LEVEL,
  comboMult,
  levelTargetFor,
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
  const [finalPoints, setFinalPoints] = useState(0);
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const inputRef = useRef<Input>({ dx: 0, dy: 0 });
  const endedRef = useRef(false);
  const bgRef = useRef<{ x: number; y: number; r: number; s: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  }, []);

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

    // 连击浮字
    if (s.combo >= 3) {
      const h = s.snake[0];
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#FFE9A8";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${s.combo} 连击!`, h.x * CELL + CELL / 2, h.y * CELL - 4);
      ctx.restore();
    }

    // 粒子
    drawParticles(ctx, particlesRef.current);

    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`长度 ${s.snake.length} ｜ 分 ${s.points}`, 12, 28);
  }, []);

  const end = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    const s = stateRef.current;
    setFinalScore(s.score);
    setFinalPoints(s.points);
    submit(s.points);
    setPhase("result");
  }, [submit]);

  const start = useCallback(() => {
    endedRef.current = false;
    stateRef.current = createState();
    inputRef.current = { dx: 1, dy: 0 };
    particlesRef.current = [];
    setFinalScore(0);
    setFinalPoints(0);
    setBanner(null);
    setPhase("playing");
  }, []);

  const timeRef = useRef(0);
  useGameLoop((dt) => {
    const prev = stateRef.current;
    if (!prev.alive) {
      end();
      return;
    }
    const ns = step(prev, Math.min(dt, 0.05), inputRef.current);

    // 事件反馈
    if (ns.score > prev.score) {
      const h = ns.snake[0];
      spawnBurst(particlesRef.current, h.x * CELL + CELL / 2, h.y * CELL + CELL / 2, "#FFD65A", 10, 150);
      sfx.catch();
      if (comboMult(ns.combo) > comboMult(prev.combo)) {
        sfx.combo(ns.combo);
        spawnBurst(particlesRef.current, h.x * CELL + CELL / 2, h.y * CELL + CELL / 2, "#FFE9A8", 16, 220);
      }
    }
    if (ns.level > prev.level) {
      showBanner(`第 ${ns.level} 关`);
      sfx.levelup();
    }
    if (ns.cleared && !prev.cleared) {
      showBanner("🏆 全部通关！继续挑战");
      sfx.win();
    }

    stateRef.current = ns;
    timeRef.current += dt;
    stepParticles(particlesRef.current, dt);
    draw(ns, timeRef.current);
    if (!ns.alive) end();
  }, phase === "playing");

  const best = Math.max(high, finalPoints);
  const s = stateRef.current;

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🐍⭐</div>
        <p className="max-w-sm text-[#5F5E5A]">
          操控<span className="font-medium text-[#0F6E56]">小蛇</span>在星海里游动，吃下
          <span className="font-medium text-[#FFD65A]">星星</span>就会变长。连续吃到会累积
          <span className="font-medium text-[#FFD65A]">连击倍率</span>，撞墙或撞到自己就结束！
        </p>
        <p className="text-sm text-[#5F5E5A]">
          共 {MAX_LEVEL} 关，每关要吃到更多星星，且蛇游得更快，看你能冲到第几关！
        </p>
        <p className="text-sm text-[#5F5E5A]">
          💡 用 <span className="font-mono">↑ ↓ ← →</span> 或 <span className="font-mono">W A S D</span>
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={start}
            className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
          >
            开始游戏
          </button>
          <SoundToggle />
        </div>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{best}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">💥 撞到了！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次长度" value={finalScore + 3} />
          <Stat label="本次得分" value={finalPoints} />
          <Stat label="到达关卡" value={`第 ${s.level} 关`} />
          <Stat label="最高连击" value={s.comboBest} />
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
      <div className="mb-2 flex w-full max-w-md items-center justify-between rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-sm text-[#0F6E56]">
        <span>
          第 {s.level}/{MAX_LEVEL} 关 ｜ 长度 {s.snake.length}
          {s.cleared ? " ｜ 🏆已通关" : ""}
        </span>
        <span className="flex items-center gap-2">
          <span>连击 {s.combo}{comboMult(s.combo) > 1 ? ` ×${comboMult(s.combo).toFixed(1)}` : ""}</span>
          <SoundToggle />
        </span>
      </div>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl"
        style={{ aspectRatio: `${COLS} / ${ROWS}`, touchAction: "none" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {banner && <LevelBanner key={banner.key} text={banner.text} tone="#0F6E56" />}
      </div>
    </div>
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
