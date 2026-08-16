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
  PADDLE_W,
  PADDLE_H,
  PADDLE_Y,
  BALL_R,
  MAX_LIVES,
  MAX_LEVEL,
  comboMult,
  type GameState,
  type Input,
  createState,
  step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function Breakout() {
  const { high, submit } = useHighScore("breakout");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [won, setWon] = useState(false);
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const inputRef = useRef<Input>({ dir: 0, targetX: null });
  const keysRef = useRef({ left: false, right: false });
  const pointerDownRef = useRef(false);
  const endedRef = useRef(false);
  const timeRef = useRef(0);
  const bgRef = useRef<{ x: number; y: number; r: number; s: number }[]>([]);
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

    if (bgRef.current.length === 0) {
      bgRef.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.3,
        s: 15 + Math.random() * 40,
      }));
    }

    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0b1f3a");
    grad.addColorStop(1, "#050a18");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (const st of bgRef.current) {
      const y = (st.y + timeRef.current * st.s) % H;
      ctx.beginPath();
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 砖块
    for (const b of s.bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }

    // 挡板
    ctx.fillStyle = "#E1F5EE";
    ctx.fillRect(s.paddleX - PADDLE_W / 2, PADDLE_Y - PADDLE_H / 2, PADDLE_W, PADDLE_H);

    // 球
    ctx.fillStyle = "#FFD65A";
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    // 连击浮字
    if (s.combo >= 3) {
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "#FFE9A8";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${s.combo} 连击!`, s.ballX, s.ballY - 16);
      ctx.restore();
    }

    // 粒子
    drawParticles(ctx, particlesRef.current);

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
    setWon(s.cleared);
    submit(s.score);
    setPhase("result");
  }, [submit]);

  const start = useCallback(() => {
    endedRef.current = false;
    stateRef.current = createState();
    inputRef.current = { dir: 0, targetX: null };
    keysRef.current = { left: false, right: false };
    pointerDownRef.current = false;
    timeRef.current = 0;
    particlesRef.current = [];
    setFinalScore(0);
    setWon(false);
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
    if (!prev.alive || prev.cleared) {
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

    // 事件反馈：砖块被击碎（分数增加）→ 找刚消失的砖位置迸发粒子
    if (ns.score > prev.score) {
      for (const b of prev.bricks) {
        if (b.alive) {
          const still = ns.bricks.find((x) => x.id === b.id);
          if (!still || !still.alive) {
            spawnBurst(particlesRef.current, b.x + b.w / 2, b.y + b.h / 2, b.color, 12, 160);
          }
        }
      }
      sfx.brick();
      if (comboMult(ns.combo) > comboMult(prev.combo)) sfx.combo(ns.combo);
    }
    if (ns.combo < prev.combo && prev.combo >= 3) sfx.miss();
    if (ns.level > prev.level) {
      showBanner(`第 ${ns.level} 关`);
      sfx.levelup();
    }
    if (ns.cleared && !prev.cleared) {
      showBanner("🏆 全部通关！");
      sfx.win();
    }

    stateRef.current = ns;
    timeRef.current += d;
    stepParticles(particlesRef.current, d);
    draw(ns);
    if (!ns.alive || ns.cleared) end();
  }, phase === "playing");

  const best = Math.max(high, finalScore);
  const s = stateRef.current;

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🧱🚀</div>
        <p className="max-w-sm text-[#5F5E5A]">
          移动<span className="font-medium text-[#0F6E56]">挡板</span>把小球弹起来，击碎顶部所有
          <span className="font-medium">砖块</span>！连续击碎不丢球会累积
          <span className="font-medium text-[#FFD65A]">连击倍率</span>。
        </p>
        <p className="text-sm text-[#5F5E5A]">
          共 {MAX_LEVEL} 关，每关多一行砖、球也更快，看你能打到第几关！
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={start}
            className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
          >
            开始打砖块
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
        <div className="text-4xl">{won ? "🎉 全部通关！" : "💥 球掉下去了！"}</div>
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
          第 {s.level}/{MAX_LEVEL} 关 ｜ 剩 {s.bricks.filter((b) => b.alive).length} 块
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
