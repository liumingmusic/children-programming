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
  W, H, BAR_X, BAR_Y, BAR_W, BAR_H, ZONE_HALF, MAX_MISS, MAX_LEVEL,
  type GameState, type Input, createState, step,
} from "./logic";

type Phase = "idle" | "playing" | "result";

export default function Fishing() {
  const { high, submit } = useHighScore("fishing");
  const [phase, setPhase] = useState<Phase>("idle");
  const [finalScore, setFinalScore] = useState(0);
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const prevRef = useRef<GameState>(createState());
  const reelRef = useRef(false);
  const endedRef = useRef(false);
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
      bgRef.current = Array.from({ length: 45 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.4,
        s: 14 + Math.random() * 38,
      }));
    }

    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0b3a5a");
    grad.addColorStop(1, "#04101f");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (const st of bgRef.current) {
      const y = (st.y + s.t * st.s) % H;
      ctx.beginPath();
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 水面
    ctx.fillStyle = "rgba(79,209,197,0.18)";
    ctx.fillRect(0, BAR_Y - 120, W, 120);

    // 鱼跳出水面的反馈
    if (s.flash > 0 && s.flashGood) {
      const a = s.flash / 0.4;
      ctx.globalAlpha = a;
      ctx.fillStyle = "#FFD65A";
      ctx.font = "30px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("🐟 +" + s.lastValue, W / 2, BAR_Y - 150);
      ctx.globalAlpha = 1;
    }

    // 光条
    ctx.fillStyle = "#16324f";
    ctx.fillRect(BAR_X, BAR_Y, BAR_W, BAR_H);
    // 绿区（随关卡变窄）
    ctx.fillStyle = "rgba(79,209,197,0.85)";
    ctx.fillRect(BAR_X + BAR_W / 2 - s.zoneHalf, BAR_Y, s.zoneHalf * 2, BAR_H);
    // 指针
    const px = BAR_X + s.pos;
    ctx.fillStyle = "#FFD65A";
    ctx.fillRect(px - 3, BAR_Y - 6, 6, BAR_H + 12);
    ctx.beginPath();
    ctx.moveTo(px, BAR_Y - 6);
    ctx.lineTo(px + 7, BAR_Y - 16);
    ctx.lineTo(px - 7, BAR_Y - 16);
    ctx.closePath();
    ctx.fill();

    // 鱼竿与线
    ctx.strokeStyle = "#E1F5EE";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 40);
    ctx.lineTo(W / 2, BAR_Y - 60);
    ctx.stroke();

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
    ctx.fillText(`失误 ${s.misses}/${MAX_MISS}`, W - 12, 44);
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
    reelRef.current = false;
    particlesRef.current = [];
    setFinalScore(0);
    setPhase("playing");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === " " || k === "enter" || k === "arrowup") {
        e.preventDefault();
        reelRef.current = true;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    reelRef.current = true;
  };

  useGameLoop((dt) => {
    const s = stateRef.current;
    if (!s.alive) {
      end();
      return;
    }
    const input: Input = { reel: reelRef.current };
    reelRef.current = false;
    const prev = prevRef.current;
    const ns = step(s, Math.min(dt, 0.034), input);
    stepParticles(particlesRef.current, dt);

    if (ns.catches > prev.catches) {
      if (!muted) sfx.catch();
      spawnBurst(particlesRef.current, W / 2, BAR_Y - 60, "#4FD1C5", 12, 200);
      if (ns.combo >= 3 && !muted) sfx.combo(ns.combo);
    }
    if (ns.misses > prev.misses) {
      if (!muted) sfx.miss();
      spawnBurst(particlesRef.current, W / 2, BAR_Y, "#FC8181", 12, 180);
    }
    if (ns.level > prev.level) {
      if (ns.level >= MAX_LEVEL) {
        showBanner("🏆 全部通关！继续钓");
        if (!muted) sfx.win();
      } else {
        showBanner(`第 ${ns.level} 关 · 绿区更窄`);
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
        <div className="text-5xl">🎣🐟</div>
        <p className="max-w-sm text-[#5F5E5A]">
          看准<span className="font-medium text-[#4FD1C5]">黄色指针</span>滑进中间绿色光圈，
          立刻<span className="font-medium text-[#0F6E56]">收竿</span>！钓到的鱼越多关卡越高、光圈越窄；
          <span className="font-medium text-[#B7791F]">连续钓到</span>还有连击倍率，鱼更大分更高。失误 {MAX_MISS} 次结束。
        </p>
        <p className="text-sm text-[#5F5E5A]">💡 用 空格 / 点击屏幕 收竿</p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始钓鱼
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">🫥 鱼儿都跑光啦！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={finalScore} />
          <Stat label="历史最高" value={best} />
          <Stat label="钓到鱼" value={s.catches} />
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
        className="relative w-full max-w-md overflow-hidden rounded-2xl"
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
