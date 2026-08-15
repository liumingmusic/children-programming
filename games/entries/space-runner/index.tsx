"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import {
  W, H, GROUND_Y, PW, PH, PX, MAX_LIVES,
  type GameState, type Input, createState, step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function SpaceRunner() {
  const { high, submit } = useHighScore("space-runner");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(createState());
  const jumpRef = useRef(false);
  const endedRef = useRef(false);
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
      r: Math.random() * 1.3 + 0.4,
      s: 16 + Math.random() * 40,
    }));
  }, []);

  const draw = useCallback((s: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`距离 ${s.score}`, 12, 28);
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
    jumpRef.current = false;
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
    const ns = step(s, Math.min(dt, 0.034), input);
    stateRef.current = ns;
    draw(ns);
    if (!ns.alive) end();
  }, phase === "playing");

  const best = Math.max(high, finalScore);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🏃‍🚀</div>
        <p className="max-w-sm text-[#5F5E5A]">
          小宇航员在太空中狂奔，<span className="font-medium text-[#0F6E56]">点击 / 空格</span>
          起跳，躲开飞来的小行星！撞到会扣一颗心。
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
          <Stat label="剩余生命" value={stateRef.current.lives} />
          <Stat label="总生命" value={MAX_LIVES} />
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
        历史最远 {high} ｜ 撞到小行星扣 1 颗心，共 {MAX_LIVES} 颗
      </div>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl"
        style={{ aspectRatio: `${W} / ${H}`, touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <div className="text-xs text-[#5F5E5A]">{label}</div>
      <div className="text-xl font-semibold text-[#04342C]">{value}</div>
    </div>
  );
}
