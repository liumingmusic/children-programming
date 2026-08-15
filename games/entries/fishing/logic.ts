// 钓鱼 · 纯函数核心（无 DOM 可测试）。
// 节奏收竿玩法：底部光条上有一个来回滑动的指针，绿区在中央。
// 指针进入绿区时收竿 -> 钓到鱼（按大小计分）；否则算失误。失误满则结束。

export const W = 360;
export const H = 540;
export const BAR_W = 280;
export const BAR_H = 26;
export const BAR_X = (W - BAR_W) / 2;
export const BAR_Y = H - 150;
export const ZONE_HALF = 34; // 绿区半宽
export const MARKER_SPEED = 3.0; // 弧度/秒
export const MAX_MISS = 5;
export const REEL_COOLDOWN = 0.35;
export const FISH_MIN = 10;
export const FISH_MAX = 30;

export interface GameState {
  t: number;
  score: number;
  catches: number;
  misses: number;
  alive: boolean;
  pos: number; // 指针在光条上的位置 0..BAR_W
  cooldown: number;
  rng: () => number;
  lastValue: number;
  flash: number; // 命中/失误的视觉反馈计时
  flashGood: boolean;
}

export interface Input {
  reel: boolean;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function markerPos(t: number): number {
  return ((Math.sin(t * MARKER_SPEED) + 1) / 2) * BAR_W;
}

export function createState(seed?: number): GameState {
  const rng = seed == null ? Math.random : mulberry32(seed);
  return {
    t: 0,
    score: 0,
    catches: 0,
    misses: 0,
    alive: true,
    pos: markerPos(0),
    cooldown: 0,
    rng,
    lastValue: 0,
    flash: 0,
    flashGood: true,
  };
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  const t = s.t + dt;
  const pos = markerPos(t);

  let score = s.score;
  let catches = s.catches;
  let misses = s.misses;
  let lastValue = s.lastValue;
  let flash = Math.max(0, s.flash - dt);
  let flashGood = s.flashGood;
  let cooldown = Math.max(0, s.cooldown - dt);

  if (input.reel && cooldown <= 0) {
    const center = BAR_W / 2;
    cooldown = REEL_COOLDOWN;
    if (Math.abs(pos - center) <= ZONE_HALF) {
      const value = FISH_MIN + Math.floor(s.rng() * (FISH_MAX - FISH_MIN + 1));
      score += value;
      catches += 1;
      lastValue = value;
      flash = 0.4;
      flashGood = true;
    } else {
      misses += 1;
      lastValue = 0;
      flash = 0.4;
      flashGood = false;
    }
  }

  const alive = misses < MAX_MISS;
  return { ...s, t, pos, score, catches, misses, alive, cooldown, lastValue, flash, flashGood };
}
