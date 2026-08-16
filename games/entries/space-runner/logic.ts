// 太空跑酷 · 纯函数核心（无 DOM 可测试）。
// 竖屏逻辑分辨率。玩家固定在左侧，小行星从右向左飞来，跳跃躲避。
// 增强：5 关按累计躲过的小行星数递进（更快更密）+ 连击倍率（连续躲过累积加分）。

import { comboMult as comboMultFn, levelTarget as levelTargetFn, MAX_LEVEL as MAX_LEVEL_FN } from "@/games/lib/enhance";

export const MAX_LEVEL = MAX_LEVEL_FN;
export const comboMult = comboMultFn;
/** 第 level 关需累计躲过的小行星数。 */
export function levelTargetFor(level: number): number {
  return levelTargetFn(8, 8, level);
}

export const W = 360;
export const H = 540;
export const GROUND_Y = H - 56;
export const PW = 34;
export const PH = 40;
export const PX = 90; // 玩家左上角 x
export const GRAVITY = 1800;
export const JUMP_V = 720;
export const OBST_SPEED = 210;
export const MAX_LIVES = 3;
export const SCORE_PER_SEC = 120;
export const HIT_COOLDOWN = 1.2;

export interface Obstacle {
  x: number;
  w: number;
  h: number;
}

export interface GameState {
  t: number;
  score: number;
  lives: number;
  alive: boolean;
  py: number; // 玩家左上角 y
  vy: number;
  grounded: boolean;
  obstacles: Obstacle[];
  spawnTimer: number;
  nextGap: number;
  hitCooldown: number;
  level: number;
  levelTarget: number;
  cleared: number; // 躲过的小行星数
  combo: number;
  comboBest: number;
  won: boolean; // 通关
  rng: () => number;
}

export interface Input {
  jump: boolean;
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
    py: GROUND_Y - PH,
    vy: 0,
    grounded: true,
    obstacles: [],
    spawnTimer: 0.9,
    nextGap: 1.4,
    hitCooldown: 0,
    level: 1,
    levelTarget: levelTargetFor(1),
    cleared: 0,
    combo: 0,
    comboBest: 0,
    won: false,
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
  const obstSpeed = OBST_SPEED + (s.level - 1) * 30;

  // 重力 / 跳跃
  let py = s.py;
  let vy = s.vy;
  let grounded = s.grounded;
  if (input.jump && grounded) {
    vy = -JUMP_V;
    grounded = false;
  }
  vy += GRAVITY * dt;
  py += vy * dt;
  if (py + PH >= GROUND_Y) {
    py = GROUND_Y - PH;
    vy = 0;
    grounded = true;
  }

  // 小行星左移 + 统计躲过数
  const moved = s.obstacles.map((o) => ({ ...o, x: o.x - obstSpeed * dt }));
  const passed = moved.filter((o) => o.x + o.w <= -20).length;
  const obstacles = moved.filter((o) => o.x + o.w > -20);

  // 碰撞
  let lives = s.lives;
  let hitCooldown = Math.max(0, s.hitCooldown - dt);
  const pb = { x: PX, y: py, w: PW, h: PH };
  if (hitCooldown <= 0) {
    for (const o of obstacles) {
      const ob = { x: o.x, y: GROUND_Y - o.h, w: o.w, h: o.h };
      if (aabb(pb.x, pb.y, pb.w, pb.h, ob.x, ob.y, ob.w, ob.h)) {
        lives -= 1;
        hitCooldown = HIT_COOLDOWN;
        break;
      }
    }
  }

  // 生成小行星（关卡越高越密）
  let spawnTimer = s.spawnTimer - dt;
  let nextGap = s.nextGap;
  if (spawnTimer <= 0) {
    const w = 22 + s.rng() * 22;
    const h = 34 + s.rng() * 56;
    obstacles.push({ x: W + 10, w, h });
    spawnTimer = nextGap;
    nextGap = Math.max(0.5, 0.8 + s.rng() * 0.9 - (s.level - 1) * 0.06);
  }

  // 躲过 + 连击 + 关卡递进
  let cleared = s.cleared + passed;
  let combo = s.combo;
  let comboBest = s.comboBest;
  let level = s.level;
  let levelTarget = s.levelTarget;
  let won = s.won;
  let points = s.score - Math.floor(s.t * SCORE_PER_SEC);
  if (passed > 0) {
    for (let i = 0; i < passed; i++) {
      combo += 1;
      comboBest = Math.max(comboBest, combo);
      points += Math.round(5 * comboMult(combo));
    }
    while (level < MAX_LEVEL && cleared >= levelTarget) {
      level += 1;
      levelTarget = levelTargetFor(level);
    }
    if (level >= MAX_LEVEL && cleared >= levelTargetFor(MAX_LEVEL)) won = true;
  }
  // 被击中则连击清零
  if (lives < s.lives) combo = 0;

  const alive = lives > 0;
  const score = Math.floor(t * SCORE_PER_SEC) + points;

  return {
    ...s, t, py, vy, grounded, obstacles,
    spawnTimer, nextGap, lives, hitCooldown, alive, score,
    level, levelTarget, cleared, combo, comboBest, won,
  };
}
