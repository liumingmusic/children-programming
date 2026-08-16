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
  W,
  H,
  SHIP_Y,
  SHIP_W,
  SHIP_H,
  MAX_LEVEL,
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
  const [muted, toggleMute] = useMuted();
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);
  // 窄屏（手机）检测：竖屏手机屏幕小，星球赛车竖着玩太憋屈，引导用平板/电脑。
  const [isNarrow, setIsNarrow] = useState(false);

  const { canvasRef, ensureSize } = useCanvasRef(W, H);
  const stateRef = useRef<GameState>(createState());
  const prevRef = useRef<GameState>(createState());
  const inputRef = useRef<Input>({ dir: 0, targetX: null });
  const keysRef = useRef({ left: false, right: false });
  const pointerDownRef = useRef(false);
  const endedRef = useRef(false);
  const bgRef = useRef<BgStar[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  }, []);

  // 监听视口宽度：手机（≤640px，多为竖屏）直接提示用更大屏设备，不进入游戏。
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const draw = useCallback((s: GameState) => {
    if (!ensureSize()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (bgRef.current.length === 0) {
      bgRef.current = Array.from({ length: 70 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.4,
        s: 20 + Math.random() * 50,
      }));
    }

    ctx.clearRect(0, 0, W, H);

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
    ctx.fillText(`⭐ ${s.collected}/${s.levelTarget}`, W - 12, 44);
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
    const prev = prevRef.current;
    const ns = step(s, Math.min(dt, 0.034), input);
    stepParticles(particlesRef.current, dt);

    if (ns.collected > prev.collected) {
      if (!muted) sfx.catch();
      spawnBurst(particlesRef.current, ns.shipX, SHIP_Y - 10, "#FFD65A", 12, 200);
      if (ns.combo >= 3 && !muted) sfx.combo(ns.combo);
    }
    if (ns.level > prev.level) {
      if (ns.level >= MAX_LEVEL) {
        showBanner("🏆 全部通关！继续飞");
        if (!muted) sfx.win();
      } else {
        showBanner(`第 ${ns.level} 关 · 陨石更密`);
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

  // 手机端：屏幕太小，星球赛车体验不好，引导用平板/电脑访问。
  if (isNarrow) {
    return (
      <div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
        <div className="text-5xl">📱🚀</div>
        <p className="max-w-xs text-[#5F5E5A]">
          手机屏幕有点小，星球赛车玩着费劲～
        </p>
        <p className="max-w-xs text-[#5F5E5A]">
          建议用 <span className="font-medium text-[#0F6E56]">平板</span> 或{" "}
          <span className="font-medium text-[#0F6E56]">电脑</span> 打开，体验更顺畅！
        </p>
      </div>
    );
  }

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🚀🪐</div>
        <p className="max-w-sm text-[#5F5E5A]">
          驾驶<span className="font-medium text-[#0F6E56]">二零飞船</span>绕星球飞行！
          左右移动躲开<span className="font-medium text-[#8a8f99]">陨石</span>，吃掉
          <span className="font-medium text-[#FFD65A]">星星</span>加分。收集星星越多关卡越高、世界越快；
          <span className="font-medium text-[#B7791F]">连续吃星</span>还有连击加分。撞到陨石就结束，看你能跑多远！
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
        {high > 0 && <p className="text-sm text-[#5F5E56]">历史最高分：{high}</p>}
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
          <Stat label="收集星星" value={s.collected} />
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

  // playing
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
