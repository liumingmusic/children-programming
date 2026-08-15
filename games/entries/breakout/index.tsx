"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import {
  W,
  H,
  PADDLE_W,
  PADDLE_H,
  PADDLE_Y,
  BALL_R,
  MAX_LIVES,
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(createState());
  const inputRef = useRef<Input>({ dir: 0, targetX: null });
  const keysRef = useRef({ left: false, right: false });
  const pointerDownRef = useRef(false);
  const endedRef = useRef(false);
  const timeRef = useRef(0);
  const bgRef = useRef<{ x: number; y: number; r: number; s: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    bgRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.3,
      s: 15 + Math.random() * 40,
    }));
  }, []);

  const draw = useCallback((s: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    setWon(s.won);
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
    setFinalScore(0);
    setWon(false);
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
    const s = stateRef.current;
    if (!s.alive || s.won) {
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
    timeRef.current += dt;
    draw(ns);
    if (!ns.alive || ns.won) end();
  }, phase === "playing");

  const best = Math.max(high, finalScore);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🧱🚀</div>
        <p className="max-w-sm text-[#5F5E5A]">
          移动<span className="font-medium text-[#0F6E56]">挡板</span>把小球弹起来，击碎顶部所有
          <span className="font-medium">砖块</span>！球掉下去就少一条命，共 {MAX_LIVES} 条命。
        </p>
        <p className="text-sm text-[#5F5E5A]">
          💡 用 <span className="font-mono">← →</span> 或 <span className="font-mono">A D</span>，手机直接拖动挡板
        </p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始打砖块
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">{won ? "🎉 全部击碎！" : "💥 球掉下去了！"}</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={finalScore} />
          <Stat label="历史最高" value={best} />
          <Stat label="剩余生命" value={stateRef.current.lives} />
          <Stat label="砖块清光" value={won ? "是" : "否"} />
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
        历史最高 {high} ｜ 击碎全部砖块获胜
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
