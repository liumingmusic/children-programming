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
  W, H, PLAYER_SIZE, PLAYER_Y, MAX_LIVES, MAX_LEVEL,
  type GameState, type Input, createState, step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function MeteorDodge() {
  const { high, submit } = useHighScore("meteor-dodge");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
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
      bgRef.current = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.4,
        s: 18 + Math.random() * 44,
      }));
    }

    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#1a1140");
    grad.addColorStop(1, "#070418");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (const st of bgRef.current) {
      const y = (st.y + s.t * st.s) % H;
      ctx.beginPath();
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 流星
    for (const m of s.meteors) {
      const g = ctx.createRadialGradient(m.x, m.y, 1, m.x, m.y, m.r * 2.2);
      g.addColorStop(0, "#ffd65a");
      g.addColorStop(0.5, "rgba(255,150,60,0.7)");
      g.addColorStop(1, "rgba(255,120,40,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 小飞船（玩家）
    const cx = s.playerX + PLAYER_SIZE / 2;
    const cy = PLAYER_Y + PLAYER_SIZE / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "#4FD1C5";
    ctx.beginPath();
    ctx.moveTo(0, -PLAYER_SIZE / 2);
    ctx.lineTo(PLAYER_SIZE / 2, PLAYER_SIZE / 2);
    ctx.lineTo(-PLAYER_SIZE / 2, PLAYER_SIZE / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#E1F5EE";
    ctx.beginPath();
    ctx.arc(0, -2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

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
    setPhase("playing");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") {
        keysRef.current.left = true;
        inputRef.current.targetX = null;
      }
      if (k === "arrowright" || k === "d") {
        keysRef.current.right = true;
        inputRef.current.targetX = null;
      }
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
    const x = ((e.clientX - rect.left) / rect.width) * W - PLAYER_SIZE / 2;
    inputRef.current.targetX = x;
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

    if (ns.dodged > prev.dodged) {
      spawnBurst(particlesRef.current, ns.playerX + PLAYER_SIZE / 2, H - 6, "#4FD1C5", 6, 120);
      if (ns.combo >= 3 && !muted) sfx.combo(ns.combo);
    }
    if (ns.lives < prev.lives) {
      if (!muted) sfx.miss();
      triggerShake();
      spawnBurst(particlesRef.current, ns.playerX + PLAYER_SIZE / 2, PLAYER_Y, "#FC8181", 14, 200);
    }
    if (ns.level > prev.level) {
      if (ns.level >= MAX_LEVEL) {
        showBanner("🏆 全部通关！继续躲");
        if (!muted) sfx.win();
      } else {
        showBanner(`第 ${ns.level} 关 · 流星更猛`);
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
        <div className="text-5xl">☄️🚀</div>
        <p className="max-w-sm text-[#5F5E5A]">
          操控<span className="font-medium text-[#4FD1C5]">小飞船</span>左右躲闪流星雨，活得越久得分越高。
          累计躲过的流星越多，关卡越高、流星越快越密；<span className="font-medium text-[#B7791F]">连续躲过</span>还有连击加分。被砸中扣一颗心。
        </p>
        <p className="text-sm text-[#5F5E5A]">💡 用 ← → / A D，手机直接拖动飞船</p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始躲避
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">💥 飞船被流星击中！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={finalScore} />
          <Stat label="历史最高" value={best} />
          <Stat label="到达关卡" value={`第 ${s.level} 关`} />
          <Stat label="最高连击" value={s.comboBest} />
          <Stat label="躲过流星" value={s.dodged} />
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

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <div className="text-xs text-[#5F5E5A]">{label}</div>
      <div className="text-xl font-semibold text-[#04342C]">{value}</div>
    </div>
  );
}
