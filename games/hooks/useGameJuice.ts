"use client";

import { useSyncExternalStore } from "react";

// 游戏「手感增强」工具包：
//  - sfx：WebAudio 合成音效，无需任何音频文件，首次用户手势后惰性初始化 AudioContext
//  - 粒子特效：spawnBurst / stepParticles / drawParticles（canvas 游戏用）
//  - useMuted：跨游戏共享的静音开关（模块级单例）
//
// 设计原则：所有函数对 SSR / 静态导出安全（window 访问都做了守卫）。

let ctx: AudioContext | null = null;
let muted = false;
const listeners = new Set<() => void>();

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  return ctx;
}

/** 播放一个单音。muted 时直接返回。 */
export function playTone(
  freq: number,
  dur = 0.12,
  type: OscillatorType = "sine",
  gain = 0.15
) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(ac.destination);
  const t = ac.currentTime;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** 按序列播放一串音（用于过关 / 通关旋律）。 */
function seq(
  notes: number[],
  stepMs: number,
  dur = 0.14,
  type: OscillatorType = "triangle",
  gain = 0.16
) {
  notes.forEach((f, i) => setTimeout(() => playTone(f, dur, type, gain), i * stepMs));
}

/** 一组儿童友好的音效预设。 */
export const sfx = {
  catch: () => playTone(680, 0.1, "triangle", 0.16),
  combo: (n: number) => playTone(520 + Math.min(n, 12) * 55, 0.08, "square", 0.13),
  miss: () => playTone(150, 0.2, "sawtooth", 0.12),
  brick: () => playTone(420, 0.07, "square", 0.12),
  merge: (value: number) =>
    playTone(Math.min(220 + Math.log2(Math.max(2, value)) * 80, 1200), 0.1, "sine", 0.16),
  pocket: () => playTone(300, 0.12, "sine", 0.18),
  tap: () => playTone(880, 0.08, "sine", 0.16),
  perfect: () => playTone(880, 0.1, "sine", 0.18),
  good: () => playTone(660, 0.1, "sine", 0.16),
  levelup: () => seq([523, 659, 784], 110),
  win: () => seq([523, 659, 784, 1047], 130, 0.18),
};

// ---------------------------------------------------------------- 粒子特效

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  color: string;
}

/** 在 (x,y) 处迸发一簇粒子。 */
export function spawnBurst(
  arr: Particle[],
  x: number,
  y: number,
  color: string,
  n = 12,
  speed = 140
) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = speed * (0.35 + Math.random() * 0.65);
    arr.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 0,
      max: 0.45 + Math.random() * 0.35,
      r: 2 + Math.random() * 2.5,
      color,
    });
  }
}

/** 推进粒子生命周期（带轻微重力）。 */
export function stepParticles(arr: Particle[], dt: number) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const p = arr[i];
    p.life += dt;
    if (p.life >= p.max) {
      arr.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 320 * dt;
  }
}

/** 把粒子画到当前 2D 上下文。 */
export function drawParticles(ctx: CanvasRenderingContext2D, arr: Particle[]) {
  for (const p of arr) {
    const a = 1 - p.life / p.max;
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------- 静音开关

function emit() {
  listeners.forEach((l) => l());
}

/** 跨游戏共享的静音状态（模块级单例，整个会话生效）。 */
export function useMuted(): readonly [boolean, () => void] {
  const mutedState = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => muted,
    () => muted
  );
  const toggle = () => {
    muted = !muted;
    emit();
  };
  return [mutedState, toggle] as const;
}
