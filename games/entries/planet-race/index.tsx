"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import {
  W,
  H,
  SHIP_Y,
  SHIP_W,
  SHIP_H,
  createState,
  step,
  type GameState,
  type Input,
} from "./logic";

type Phase = "idle" | "playing" | "result";

interface BgStar {
  x: number;
  y: number;
  r: number;
  s: number;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a2) * r * 0.45, cy + Math.sin(a2) * r * 0.45);
  }
  ctx.closePath();
  ctx.fill();
}

export default function PlanetRace() {
  const { high, submit } = useHighScore("planet-race");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(createState());
  const inputRef = useRef<Input>({ dir: 0, targetX: null });
  const keysRef = useRef({ left: false, right: false });
  const pointerDownRef = useRef(false);
  const endedRef = useRef(false);
  const bgRef = useRef<BgStar[]>([]);

  // 配置画布尺寸 + 背景星点（仅在飞船组件挂载时一次）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    bgRef.current = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      s: 20 + Math.random() * 50,
    }));
  }, []);

  const draw = useCallback((s: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 太空背景
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0b1f3a");
    grad.addColorStop(1, "#050a18");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 顶部星球弧（造物星球主题绿）
    ctx.fillStyle = "#0F6E56";
    ctx.beginPath();
    ctx.arc(W / 2, -H * 0.32, H * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(225,245,238,0.18)";
    ctx.beginPath();
    ctx.arc(W / 2 - 40, -H * 0.36, H * 0.16, 0, Math.PI * 2);
    ctx.fill();

    // 背景星点（随时间下滚）
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    for (const st of bgRef.current) {
      const y = (st.y + s.t * st.s) % H;
      ctx.beginPath();
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 障碍
    for (const o of s.obstacles) {
      if (o.kind === "rock") {
        ctx.fillStyle = "#8a8f99";
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#6b707a";
        ctx.beginPath();
        ctx.arc(o.x - o.r * 0.3, o.y - o.r * 0.2, o.r * 0.3, 0, Math.PI * 2);
        ctx.arc(o.x + o.r * 0.35, o.y + o.r * 0.25, o.r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.save();
        ctx.shadowColor = "rgba(255,214,90,0.9)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#FFD65A";
        drawStar(ctx, o.x, o.y, o.r);
        ctx.restore();
      }
    }

    // 飞船（二零）
    const sx = s.shipX;
    ctx.save();
    ctx.translate(sx, SHIP_Y);
    ctx.fillStyle = "#E1F5EE";
    ctx.beginPath();
    ctx.moveTo(0, -SHIP_H / 2);
    ctx.lineTo(SHIP_W / 2, SHIP_H / 2);
    ctx.lineTo(-SHIP_W / 2, SHIP_H / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#0F6E56";
    ctx.beginPath();
    ctx.arc(0, -2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,170,60,0.9)";
    ctx.beginPath();
    ctx.moveTo(-8, SHIP_H / 2);
    ctx.lineTo(0, SHIP_H / 2 + 14 + Math.random() * 6);
    ctx.lineTo(8, SHIP_H / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`得分 ${s.score}`, 12, 28);
    ctx.textAlign = "right";
    ctx.fillText(`⭐ ${s.collected}`, W - 12, 28);
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
    setFinalScore(0);
    setPhase("playing");
  }, []);

  // 键盘
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

  // 指针（触屏/鼠标）：拖动飞船
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
    const ns = step(s, Math.min(dt, 0.034), input);
    stateRef.current = ns;
    draw(ns);
    if (!ns.alive) end();
  }, phase === "playing");

  const best = Math.max(high, finalScore);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🚀🪐</div>
        <p className="max-w-sm text-[#5F5E5A]">
          驾驶<span className="font-medium text-[#0F6E56]">二零飞船</span>绕星球飞行！
          左右移动躲开<span className="font-medium text-[#8a8f99]">陨石</span>，
          吃掉<span className="font-medium text-[#FFD65A]">星星</span>加分。撞到陨石就结束，看你能跑多远！
        </p>
        <p className="text-sm text-[#5F5E5A]">
          💡 用 <span className="font-mono">← →</span> 或 <span className="font-mono">A D</span>，手机直接拖动飞船
        </p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始飞行
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">💥 飞船坠毁！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={finalScore} />
          <Stat label="历史最高" value={best} />
          <Stat label="收集星星" value={stateRef.current.collected} />
          <Stat label="坚持时间" value={`${stateRef.current.t.toFixed(1)}s`} />
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

  // playing
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 w-full max-w-md rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-center text-sm text-[#0F6E56]">
        历史最高 {high} ｜ 撞到陨石就结束，收集星星得分
      </div>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl"
        style={{ aspectRatio: "2 / 3", touchAction: "none" }}
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
