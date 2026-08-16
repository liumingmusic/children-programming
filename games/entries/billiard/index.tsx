"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import { useCanvasRef } from "@/games/hooks/useCanvasRef";
import { sfx, spawnBurst, stepParticles, drawParticles, type Particle } from "@/games/hooks/useGameJuice";
import LevelBanner from "@/games/components/LevelBanner";
import SoundToggle from "@/games/components/SoundToggle";
import {
  W,
  H,
  BALL_R,
  LEVEL_COUNT,
  POT_PER_LEVEL,
  type GameState,
  createState,
  step,
  shoot,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function Billiard() {
  const { high, submit } = useHighScore("billiard");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState({ challenge: true }));
  const prevRef = useRef<GameState>(createState({ challenge: true }));
  const endedRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((text: string) => {
    setBanner({ text, key: Date.now() + Math.random() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  }, []);

  const draw = useCallback((s: GameState) => {
    if (!ensureSize()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0e3b2e";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#1f6b52";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, W - 6, H - 6);

    // 袋口
    for (const p of s.pockets) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "#06251b";
      ctx.fill();
    }

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

    // 连击浮字
    if (s.combo >= 2) {
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "#FFE9A8";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${s.combo} 连击!`, b.x, b.y - 22);
      ctx.restore();
    }

    // 粒子
    drawParticles(ctx, particlesRef.current);

    // HUD
    ctx.fillStyle = "#E1F5EE";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`得分 ${s.score}`, 12, 26);
    ctx.textAlign = "right";
    ctx.fillText(`第 ${s.level}/${LEVEL_COUNT} 关`, W - 12, 26);
    ctx.textAlign = "left";
    ctx.fillText(`进袋 ${s.pottedLevel}/${POT_PER_LEVEL}`, 12, 46);
    if (s.combo >= 2) {
      ctx.textAlign = "right";
      ctx.fillStyle = "#FFD65A";
      ctx.fillText(`连击 x${s.combo}`, W - 12, 46);
    }
  }, []);

  const end = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    const s = stateRef.current;
    setFinalScore(s.score);
    setCleared(s.cleared);
    submit(s.score);
    setPhase("result");
  }, [submit]);

  const start = useCallback(() => {
    endedRef.current = false;
    const init = createState({ challenge: true });
    stateRef.current = init;
    prevRef.current = init;
    particlesRef.current = [];
    setFinalScore(0);
    setCleared(false);
    setBanner(null);
    setPhase("playing");
  }, []);

  const whiteSpeed = (s: GameState) => Math.hypot(s.balls[0].vx, s.balls[0].vy);

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    const s = stateRef.current;
    if (s.cleared || s.over) return;
    if (whiteSpeed(s) > 40) return; // 白球还在动，等它停下再击
    const rect = e.currentTarget.getBoundingClientRect();
    const tx = ((e.clientX - rect.left) / rect.width) * W;
    const ty = ((e.clientY - rect.top) / rect.height) * H;
    stateRef.current = shoot(s, tx, ty);
  };

  useGameLoop((dt) => {
    const d = Math.min(dt, 0.034);
    const s = stateRef.current;
    if (s.cleared || s.over) {
      end();
      return;
    }
    const ns = step(s, d);

    // 事件检测
    const prev = prevRef.current;
    if (ns.lastPocket && ns.potted > prev.potted) {
      spawnBurst(particlesRef.current, ns.lastPocket.x, ns.lastPocket.y, "#FFD65A", 16, 180);
      sfx.pocket();
      if (ns.combo >= 2) sfx.combo(ns.combo);
    }
    if (ns.level > prev.level) {
      sfx.levelup();
      showBanner(`第 ${ns.level} 关！`);
    }
    if (ns.cleared && !prev.cleared) {
      sfx.win();
      showBanner("🏆 全部通关！");
    }

    stateRef.current = ns;
    prevRef.current = ns;
    stepParticles(particlesRef.current, d);
    draw(ns);
    if (ns.cleared || ns.over) end();
  }, phase === "playing");

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🔵⚪🕳️</div>
        <p className="max-w-sm text-[#5F5E5A]">
          点击桌面任意位置，<span className="font-medium text-[#0F6E56]">白球</span>就会朝那个方向冲出去，
          把<span className="font-medium text-[#FFD65A]">星球</span>撞进四个角落的
          <span className="font-medium">袋口</span>！共 {LEVEL_COUNT} 关，每关进 {POT_PER_LEVEL} 个、
          限定击球数，连续进袋有<span className="font-medium text-[#FFD65A]">连击加分</span>。
        </p>
        <p className="text-sm text-[#5F5E5A]">💡 手机直接点桌面发射；白球停下才能再打</p>
        <div className="flex items-center gap-3">
          <button
            onClick={start}
            className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
          >
            开始挑战
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
        <div className="text-4xl">{cleared ? "🏆 通关啦！" : "💥 击球用完了"}</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={finalScore} />
          <Stat label="历史最高" value={Math.max(high, finalScore)} />
          <Stat label="累计进袋" value={stateRef.current.potted} />
          <Stat label="最高连击" value={stateRef.current.comboBest} />
          <Stat label="到达关卡" value={stateRef.current.cleared ? `${LEVEL_COUNT}★` : stateRef.current.level} />
          <Stat label="剩余击球" value={Math.max(0, stateRef.current.shotMax - stateRef.current.shots)} />
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

  const s = stateRef.current;
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex w-full max-w-md items-center justify-between rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-sm text-[#0F6E56]">
        <span>
          第 {s.level}/{LEVEL_COUNT} 关 ｜ 进袋 {s.pottedLevel}/{POT_PER_LEVEL} ｜ 剩 {Math.max(0, s.shotMax - s.shots)} 杆
        </span>
        <SoundToggle />
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
        {banner && <LevelBanner key={banner.key} text={banner.text} tone="#0F6E56" />}
      </div>
      <p className="mt-2 text-center text-xs text-[#5F5E5A]">
        点桌面发射白球，把星球撞进角落袋口（白球停下才能再打）
      </p>
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
