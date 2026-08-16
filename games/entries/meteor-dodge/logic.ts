// 躲避流星 · 纯函数核心（无 DOM 可测试）。
// 玩家在底部左右移动，流星从顶部落下，碰到扣命，漏过不扣分。分 = 存活时间 + 连击躲避加分。
// 增强：5 关按累计躲过的流星数递进（流星更快更密）+ 连击倍率（连续躲过累积加分）。

import { comboMult as comboMultFn, levelTarget as levelTargetFn, MAX_LEVEL as MAX_LEVEL_FN } from "@/games/lib/enhance";

export const MAX_LEVEL = MAX_LEVEL_FN;
export const comboMult = comboMultFn;
/** 第 level 关需累计躲过的流星数。 */
export function levelTargetFor(level: number): number {
  return levelTargetFn(10, 10, level);
}

export const W = 360;
export const H = 540;
export const PLAYER_SIZE = 40;
export const PLAYER_Y = H - PLAYER_SIZE - 16;
export const PLAYER_SPEED = 320;
export const MAX_LIVES = 3;
export const SCORE_PER_SEC = 10;
export const FALL_BASE = 150;
export const FALL_MAX = 360;
export const FALL_RAMP = 6;

export interface Meteor {
  id: number;
  x: number;
  y: number;
  r: number;
  speed: number;
}

export interface GameState {
  t: number;
  score: number;
  lives: number;
  alive: boolean;
  playerX: number;
  meteors: Meteor[];
  nextId: number;
  spawnTimer: number;
  fallSpeed: number;
  level: number;
  levelTarget: number;
  dodged: number;
  combo: number;
  comboBest: number;
  cleared: boolean;
  rng: () => number;
}

export interface Input {
  dir: number; // -1 | 0 | 1
  targetX: number | null;
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

export function createState(seed?: number): GameState {
  const rng = seed == null ? Math.random : mulberry32(seed);
  return {
    t: 0,
    score: 0,
    lives: MAX_LIVES,
    alive: true,
    playerX: W / 2 - PLAYER_SIZE / 2,
    meteors: [],
    nextId: 1,
    spawnTimer: 0.6,
    fallSpeed: FALL_BASE,
    level: 1,
    levelTarget: levelTargetFor(1),
    dodged: 0,
    combo: 0,
    comboBest: 0,
    cleared: false,
    rng,
  };
}

function aabb(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  const t = s.t + dt;

  // 玩家移动
  let playerX = s.playerX;
  if (input.targetX != null) {
    const d = input.targetX - (playerX + PLAYER_SIZE / 2);
    const mv = PLAYER_SPEED * dt;
    playerX += Math.max(-mv, Math.min(mv, d));
  } else {
    playerX += input.dir * PLAYER_SPEED * dt;
  }
  playerX = Math.max(0, Math.min(W - PLAYER_SIZE, playerX));

  // 流星下落
  const fallSpeed = Math.min(FALL_MAX, FALL_BASE + t * FALL_RAMP + (s.level - 1) * 40);
  let lives = s.lives;
  let dodged = s.dodged;
  let combo = s.combo;
  let comboBest = s.comboBest;
  let level = s.level;
  let levelTarget = s.levelTarget;
  let cleared = s.cleared;
  let points = s.score - Math.floor(s.t * SCORE_PER_SEC); // 现有连击加分部分
  const remaining: Meteor[] = [];
  const pb = { x: playerX, y: PLAYER_Y, w: PLAYER_SIZE, h: PLAYER_SIZE };
  for (const m of s.meteors) {
    const ny = m.y + m.speed * dt;
    const mb = { x: m.x - m.r, y: ny - m.r, w: m.r * 2, h: m.r * 2 };
    if (aabb(pb.x, pb.y, pb.w, pb.h, mb.x, mb.y, mb.w, mb.h)) {
      lives -= 1; // 被砸中
      combo = 0;
    } else if (ny - m.r > H) {
      // 成功躲过：连击 + 加分
      dodged += 1;
      combo += 1;
      comboBest = Math.max(comboBest, combo);
      points += Math.round(5 * comboMult(combo));
    } else {
      remaining.push({ ...m, y: ny });
    }
  }

  // 关卡递进
  while (level < MAX_LEVEL && dodged >= levelTarget) {
    level += 1;
    levelTarget = levelTargetFor(level);
  }
  if (level >= MAX_LEVEL && dodged >= levelTargetFor(MAX_LEVEL)) cleared = true;

  // 生成流星（关卡越高越密）
  let nextId = s.nextId;
  let spawnTimer = s.spawnTimer - dt;
  if (spawnTimer <= 0) {
    const r = 9 + s.rng() * 9;
    const x = r + s.rng() * (W - 2 * r);
    remaining.push({ id: nextId++, x, y: -r, r, speed: fallSpeed });
    spawnTimer = Math.max(0.22, 0.75 - t * 0.01 - (level - 1) * 0.05);
  }

  const alive = lives > 0;
  const score = Math.floor(t * SCORE_PER_SEC) + points;

  return {
    ...s, t, fallSpeed, playerX, meteors: remaining,
    nextId, spawnTimer, lives, alive, score,
    level, levelTarget, dodged, combo, comboBest, cleared,
  };
}
