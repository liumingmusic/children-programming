"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import { useCanvasRef } from "@/games/hooks/useCanvasRef";
import { sfx, spawnBurst, stepParticles, drawParticles, useMuted, type Particle } from "@/games/hooks/useGameJuice";
import LevelBanner from "@/games/components/LevelBanner";
import SoundToggle from "@/games/components/SoundToggle";
import {
  W,
  H,
  BASKET_W,
  BASKET_H,
  BASKET_Y,
  MAX_LIVES,
  MAX_LEVEL,
  comboMult,
  levelTargetFor,
  type GameState,
  type Input,
  createState,
  step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a2) * r * 0.45, cy + Math.sin(a2) * r * 0.45);
  }
  ctx.closePath();
}

export default function StarCatch() {
  const { high, submit } = useHighScore("star-catch");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const inputRef = useRef<Input>({ dir: 0, targetX: null });
  const keysRef = useRef({ left: false, right: false });
  const pointerDownRef = useRef(false);
  const endedRef = useRef(false);
  const bgRef = useRef<{ x: number; y: number; r: number; s: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const flashRef = useRef(0);
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

    if (bgRef.current.length === 0) {
      bgRef.current = Array.from({ length: 60 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.4,
        s: 20 + Math.random() * 50,
      }));
    }

    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0b1f3a");
    grad.addColorStop(1, "#050a18");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    for (const st of bgRef.current) {
      const y = (st.y + s.t * st.s) % H;
      ctx.beginPath();
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 星星
    ctx.save();
    ctx.shadowColor = "rgba(255,214,90,0.9)";
    ctx.shadowBlur = 12;
    for (const st of s.stars) {
      ctx.fillStyle = "#FFD65A";
      drawStar(ctx, st.x, st.y, st.r);
    }
    ctx.restore();

    // 篮子（二零的小船）
    const bx = s.basketX - BASKET_W / 2;
    const by = BASKET_Y - BASKET_H / 2;
    ctx.fillStyle = "#E1F5EE";
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + BASKET_W, by);
    ctx.lineTo(bx + BASKET_W - 8, by + BASKET_H);
    ctx.lineTo(bx + 8, by + BASKET_H);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#0F6E56";
    ctx.beginPath();
    ctx.arc(s.basketX, by + 4, 7, 0, Math.PI * 2);
    ctx.fill();

    // 连击浮字
    if (s.combo >= 3) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#FFE9A8";
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${s.combo} 连击!`, s.basketX, BASKET_Y - 26 - (s.combo % 5) * 2);
      ctx.restore();
    }

    // 粒子
    drawParticles(ctx, particlesRef.current);

    // 漏接红闪
    if (flashRef.current > 0) {
      ctx.fillStyle = `rgba(216,90,48,${flashRef.current * 0.5})`;
      ctx.fillRect(0, 0, W, H);
    }

    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`得分 ${s.score}`, 12, 28);
    ctx.textAlign = "right";
    ctx.fillText(`❤ ${s.lives}`, W - 12, 28);
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
    inputRef.current = { dir: 0, targetX: null };
    keysRef.current = { left: false, right: false };
    pointerDownRef.current = false;
    particlesRef.current = [];
    flashRef.current = 0;
    setFinalScore(0);
    setBanner(null);
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
    const x = ((e.clientX - rect.left) / rect.width) * W;
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
    const d = Math.min(dt, 0.034);
    const prev = stateRef.current;
    if (!prev.alive) {
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
    const ns = step(prev, d, input);

    // 事件反馈
    if (ns.combo > prev.combo) {
      spawnBurst(particlesRef.current, ns.basketX, BASKET_Y, "#FFD65A", 10, 150);
      sfx.catch();
      if (comboMult(ns.combo) > comboMult(prev.combo)) {
        sfx.combo(ns.combo);
        spawnBurst(particlesRef.current, ns.basketX, BASKET_Y, "#FFE9A8", 16, 220);
      }
    }
    if (ns.lives < prev.lives) {
      sfx.miss();
      flashRef.current = 0.25;
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
    flashRef.current = Math.max(0, flashRef.current - d);
    stepParticles(particlesRef.current, d);
    draw(ns);
    if (!ns.alive) end();
  }, phase === "playing");

  const best = Math.max(high, finalScore);
  const s = stateRef.current;
  const prevThresh = s.level > 1 ? levelTargetFor(s.level - 1) : 0;
  const inLevel = Math.min(s.caught - prevThresh, s.levelTarget - prevThresh);
  const goal = s.levelTarget - prevThresh;

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🌟🧺</div>
        <p className="max-w-sm text-[#5F5E5A]">
          左右移动<span className="font-medium text-[#0F6E56]">小篮子</span>，接住天上掉下来的
          <span className="font-medium text-[#FFD65A]">星星</span>！连续接住会累积
          <span className="font-medium text-[#FFD65A]">连击倍率</span>，漏掉三颗就结束。
        </p>
        <p className="text-sm text-[#5F5E5A]">
          共 {MAX_LEVEL} 关，每关都要接住更多星星，看你能冲到第几关！
        </p>
        <p className="text-sm text-[#5F5E5A]">
          💡 用 <span className="font-mono">← →</span> 或 <span className="font-mono">A D</span>，手机直接拖动篮子
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={start}
            className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
          >
            开始接星星
          </button>
          <SoundToggle />
        </div>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">😿 星星都溜走了！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={finalScore} />
          <Stat label="历史最高" value={best} />
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
          第 {s.level} 关 ｜ 本关 {inLevel}/{goal}
          {s.cleared ? " ｜ 🏆已通关" : ""}
        </span>
        <span className="flex items-center gap-2">
          <span>连击 {s.combo}{comboMult(s.combo) > 1 ? ` ×${comboMult(s.combo).toFixed(1)}` : ""}</span>
          <SoundToggle />
        </span>
      </div>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl"
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
