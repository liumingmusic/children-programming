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
  W, H, GROUND_Y, PW, PH, PX, MAX_LIVES, MAX_LEVEL,
  type GameState, type Input, createState, step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function SpaceRunner() {
  const { high, submit } = useHighScore("space-runner");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);
  const [shake, setShake] = useState(false);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const prevRef = useRef<GameState>(createState());
  const jumpRef = useRef(false);
  const endedRef = useRef(false);
  const bgRef = useRef<{ x: number; y: number; r: number; s: number }[]>([]);
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

    if (bgRef.current.length === 0) {
      bgRef.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.4,
        s: 16 + Math.random() * 40,
      }));
    }

    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#11254a");
    grad.addColorStop(1, "#070d1f");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    for (const st of bgRef.current) {
      const y = (st.y + s.t * st.s) % H;
      ctx.beginPath();
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 地面
    ctx.fillStyle = "#1d3a6b";
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = "#2b5599";
    ctx.fillRect(0, GROUND_Y, W, 4);

    // 小行星
    for (const o of s.obstacles) {
      const cx = o.x + o.w / 2;
      const cy = GROUND_Y - o.h / 2;
      ctx.fillStyle = "#8a8f99";
      ctx.beginPath();
      ctx.ellipse(cx, cy, o.w / 2, o.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6b7079";
      ctx.beginPath();
      ctx.arc(cx - o.w * 0.15, cy - o.h * 0.1, Math.min(o.w, o.h) * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }

    // 小宇航员（玩家）
    const blink = s.hitCooldown > 0 && Math.floor(s.t * 10) % 2 === 0;
    if (!blink) {
      const px = PX + PW / 2;
      const py = s.py;
      ctx.fillStyle = "#FFD65A";
      ctx.beginPath();
      ctx.arc(px, py + 9, 9, 0, Math.PI * 2); // 头盔
      ctx.fill();
      ctx.fillStyle = "#0F6E56";
      ctx.fillRect(PX + PW / 2 - 10, py + 16, 20, PH - 16); // 身体
      ctx.fillStyle = "#E1F5EE";
      ctx.fillRect(PX + PW / 2 - 13, py + 18, 5, 12); // 左手
      ctx.fillRect(PX + PW / 2 + 8, py + 18, 5, 12); // 右手
    }

    // 粒子
    drawParticles(ctx, particlesRef.current);

    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`第 ${s.level}/${MAX_LEVEL} 关`, 12, 24);
    ctx.fillText(`距离 ${s.score}`, 12, 44);
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
    submit(s.score);
    setPhase("result");
  }, [submit]);

  const start = useCallback(() => {
    endedRef.current = false;
    const s0 = createState();
    stateRef.current = s0;
    prevRef.current = s0;
    jumpRef.current = false;
    particlesRef.current = [];
    setFinalScore(0);
    setPhase("playing");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === " " || k === "arrowup" || k === "w") {
        e.preventDefault();
        jumpRef.current = true;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    jumpRef.current = true;
  };

  useGameLoop((dt) => {
    const s = stateRef.current;
    if (!s.alive) {
      end();
      return;
    }
    const input: Input = { jump: jumpRef.current };
    jumpRef.current = false;
    const prev = prevRef.current;
    const ns = step(s, Math.min(dt, 0.034), input);
    stepParticles(particlesRef.current, dt);

    if (ns.cleared > prev.cleared) {
      spawnBurst(particlesRef.current, W - 10, GROUND_Y - 10, "#4FD1C5", 6, 120);
      if (ns.combo >= 3 && !muted) sfx.combo(ns.combo);
    }
    if (ns.lives < prev.lives) {
      if (!muted) sfx.miss();
      triggerShake();
      spawnBurst(particlesRef.current, PX + PW / 2, s.py + PH / 2, "#FC8181", 14, 200);
    }
    if (ns.level > prev.level) {
      if (ns.level >= MAX_LEVEL) {
        showBanner("🏆 全部通关！继续跑");
        if (!muted) sfx.win();
      } else {
        showBanner(`第 ${ns.level} 关 · 小行星更猛`);
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
        <div className="text-5xl">🏃‍🚀</div>
        <p className="max-w-sm text-[#5F5E5A]">
          小宇航员在太空中狂奔，<span className="font-medium text-[#0F6E56]">点击 / 空格</span>
          起跳，躲开飞来的小行星！累计躲过越多关卡越高、小行星越快越密；
          <span className="font-medium text-[#B7791F]">连续躲过</span>还有连击加分。撞到会扣一颗心。
        </p>
        <p className="text-sm text-[#5F5E5A]">💡 用 空格 / ↑ / 点击屏幕 跳跃</p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始狂奔
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最远：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">🌠 跑到极限啦！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次距离" value={finalScore} />
          <Stat label="历史最远" value={best} />
          <Stat label="到达关卡" value={`第 ${s.level} 关`} />
          <Stat label="最高连击" value={s.comboBest} />
          <Stat label="躲过小行星" value={s.cleared} />
          <Stat label="通关" value={s.won ? "已达成 🏆" : "未达成"} />
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
          历史最远 {high} ｜ 第 {s.level}/{MAX_LEVEL} 关 ｜ 连击 {s.combo}
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
          className="absolute inset-0 h-full w-full"
        />
        {banner && <LevelBanner key={banner.key} text={banner.text} />}
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
