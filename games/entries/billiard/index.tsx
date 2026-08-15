"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import {
  W,
  H,
  BALL_R,
  type GameState,
  createState,
  step,
  shoot,
} from "./logic";

export default function Billiard() {
  const { high, submit } = useHighScore("billiard");
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [collisions, setCollisions] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(createState());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const draw = useCallback((s: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0e3b2e";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#1f6b52";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, W - 6, H - 6);
    const [a, b] = s.balls;
    // 白球
    ctx.beginPath();
    ctx.arc(a.x, a.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = "#F4FAF7";
    ctx.fill();
    // 星球
    ctx.beginPath();
    ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD65A";
    ctx.fill();
    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`碰撞 ${s.collisions}`, 12, 28);
  }, []);

  const reset = useCallback(() => {
    stateRef.current = createState();
    setCollisions(0);
  }, []);

  const launch = useCallback(() => {
    reset();
    setPhase("playing");
  }, [reset]);

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const tx = ((e.clientX - rect.left) / rect.width) * W;
    const ty = ((e.clientY - rect.top) / rect.height) * H;
    stateRef.current = shoot(stateRef.current, tx, ty);
  };

  useGameLoop((dt) => {
    const prev = stateRef.current.collisions;
    const ns = step(stateRef.current, Math.min(dt, 0.034));
    stateRef.current = ns;
    if (ns.collisions > prev) {
      setCollisions(ns.collisions);
      submit(ns.collisions);
    }
    draw(ns);
  }, phase === "playing");

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🔵⚪</div>
        <p className="max-w-sm text-[#5F5E5A]">
          点击桌面任意位置，<span className="font-medium text-[#0F6E56]">白球</span>就会朝那个方向冲出去，
          撞到<span className="font-medium text-[#FFD65A]">星球</span>时，两者的速度会交换——这就是动量守恒！
        </p>
        <p className="text-sm text-[#5F5E5A]">💡 手机直接点桌面发射，看两球怎么弹</p>
        <button
          onClick={launch}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始实验
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高碰撞：{high}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex w-full max-w-md items-center justify-between rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-sm text-[#0F6E56]">
        <span>
          碰撞 {collisions} ｜ 最高 {high}
        </span>
        <button
          onClick={reset}
          className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#0F6E56] hover:bg-white"
        >
          重新摆放
        </button>
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
      <p className="mt-2 text-center text-xs text-[#5F5E5A]">点桌面发射白球，撞星球看速度交换</p>
    </div>
  );
}
