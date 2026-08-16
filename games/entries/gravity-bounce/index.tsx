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
  W,
  H,
  BALL_R,
  PADDLE_H,
  PADDLE_Y,
  MAX_LIVES,
  MAX_LEVEL,
  type GameState,
  type Input,
  createState,
  step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function GravityBounce() {
  const { high, submit } = useHighScore("gravity-bounce");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [finalBounces, setFinalBounces] = useState(0);
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);
  const [shake, setShake] = useState(false);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const prevRef = useRef<GameState>(createState());
  const inputRef = useRef<Input>({ dir: 0, targetX: null });
  const keysRef = useRef({ left: false, right: false });
  const pointerDownRef = useRef(false);
  const endedRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  }, []);

  const triggerShake = useCallback(() => {
    setShake(true);
    if (shakeTimer.current) clearTimeout(shakeTimer.current);
    shakeTimer.current = setTimeout(() => setShake(false), 400);
  }, []);

  const draw = useCallback((s: GameState) => {
    if (!ensureSize()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1f3a";
    ctx.fillRect(0, 0, W, H);
    // 挡板
    ctx.fillStyle = "#E1F5EE";
    roundRect(ctx, s.paddleX - s.paddleW / 2, PADDLE_Y - PADDLE_H / 2, s.paddleW, PADDLE_H, 8);
    ctx.fill();
    // 小球
    ctx.beginPath();
    ctx.arc(s.x, s.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD65A";
    ctx.fill();
    // 粒子
    drawParticles(ctx, particlesRef.current);
    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`第 ${s.level}/${MAX_LEVEL} 关`, 12, 24);
    ctx.fillText(`得分 ${s.score}`, 12, 44);
    if (s.combo > 1) {
      ctx.fillStyle = "#FFD65A";
      ctx.textAlign = "right";
      ctx.fillText(`连击 ×${s.combo}`, W - 12, 24);
    }
    ctx.fillStyle = "#E1F5EE";
    ctx.textAlign = "right";
    ctx.fillText(`❤ ${s.lives}`, W - 12, 44);
  }, []);

  const end = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    const s = stateRef.current;
    setFinalScore(s.score);
    setFinalBounces(s.bounces);
    submit(s.score);
    setPhase("result");
  }, [submit]);

  const start = useCallback(() => {
    endedRef.current = false;
    const s0 = createState();
    stateRef.current = s0;
    prevRef.current = s0;
    inputRef.current = { dir: 0, targetX: null };
    keysRef.current = { left: false, right: false };
    pointerDownRef.current = false;
    particlesRef.current = [];
    setFinalScore(0);
    setFinalBounces(0);
    setPhase("playing");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keysRef.current.left = true;
      if (k === "arrowright" || k === "d") keysRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keysRef.current.left = false;
      if (k === "arrowright" || k === "d") keysRef.current.right = false;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const updateTarget = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    inputRef.current.targetX = ((e.clientX - rect.left) / rect.width) * W;
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    pointerDownRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateTarget(e);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing" || !pointerDownRef.current) return;
    updateTarget(e);
  };
  const onPointerUp = () => {
    pointerDownRef.current = false;
    inputRef.current.targetX = null;
  };

  useGameLoop((dt) => {
    const s = stateRef.current;
    if (!s.alive) {
      end();
      return;
    }
    const keys = keysRef.current;
    let dir = 0;
    if (keys.left) dir -= 1;
    if (keys.right) dir += 1;
    const input: Input =
      inputRef.current.targetX != null
        ? { dir: 0, targetX: inputRef.current.targetX }
        : { dir, targetX: null };
    const prev = prevRef.current;
    const ns = step(s, Math.min(dt, 0.034), input);
    stepParticles(particlesRef.current, dt);

    if (ns.bounces > prev.bounces) {
      if (!muted) sfx.brick();
      spawnBurst(particlesRef.current, ns.x, ns.y, "#FFD65A", 12, 200);
    }
    if (ns.lives < prev.lives) {
      if (!muted) sfx.miss();
      triggerShake();
    }
    if (ns.level > prev.level) {
      if (ns.level >= MAX_LEVEL) {
        showBanner("🏆 全部通关！继续接球");
        if (!muted) sfx.win();
      } else {
        showBanner(`第 ${ns.level} 关 · 挡板变窄`);
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
        <div className="text-5xl">🟢</div>
        <p className="max-w-sm text-[#5F5E5A]">
          小球在<span className="font-medium text-[#0F6E56]">重力</span>作用下往下掉，移动挡板把它
          <span className="font-medium text-[#FFD65A]">弹得更高</span>！累计接住越多关卡越高、挡板越窄；
          <span className="font-medium text-[#B7791F]">连续接住</span>还有连击加分。漏接三次就结束。
        </p>
        <p className="text-sm text-[#5F5E5A]">
          💡 用 <span className="font-mono">← →</span> 或 <span className="font-mono">A D</span>，手机直接拖动挡板
        </p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始弹球
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">😿 小球溜走啦！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={finalScore} />
          <Stat label="历史最高" value={best} />
          <Stat label="弹跳次数" value={finalBounces} />
          <Stat label="到达关卡" value={`第 ${s.level} 关`} />
          <Stat label="最高连击" value={s.comboBest} />
          <Stat label="通关" value={s.cleared ? "已达成 🏆" : "未达成"} />
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
      <div className="relative mb-2 w-full max-w-md">
        <div className="rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-center text-sm text-[#0F6E56]">
          历史最高 {high} ｜ 第 {s.level}/{MAX_LEVEL} 关 ｜ 连击 {s.combo}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <SoundToggle />
        </div>
      </div>
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl ${shake ? "animate-shake" : ""}`}
        style={{ aspectRatio: `${W} / ${H}`, touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          className="absolute inset-0 h-full w-full"
        />
        {banner && <LevelBanner key={banner.key} text={banner.text} />}
      </div>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <div className="text-xs text-[#5F5E5A]">{label}</div>
      <div className="text-xl font-semibold text-[#04342C]">{value}</div>
    </div>
  );
}
