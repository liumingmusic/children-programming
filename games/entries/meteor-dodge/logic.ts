// 躲避流星 · 纯函数核心（无 DOM 可测试）。
// 玩家在底部左右移动，流星从顶部落下，碰到扣命，漏过不扣分。分 = 存活时间。

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
  const fallSpeed = Math.min(FALL_MAX, FALL_BASE + t * FALL_RAMP);

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
  let lives = s.lives;
  const remaining: Meteor[] = [];
  const pb = { x: playerX, y: PLAYER_Y, w: PLAYER_SIZE, h: PLAYER_SIZE };
  for (const m of s.meteors) {
    const ny = m.y + m.speed * dt;
    const mb = { x: m.x - m.r, y: ny - m.r, w: m.r * 2, h: m.r * 2 };
    if (aabb(pb.x, pb.y, pb.w, pb.h, mb.x, mb.y, mb.w, mb.h)) {
      lives -= 1; // 被砸中
    } else if (ny - m.r > H) {
      // 漏过，无惩罚
    } else {
      remaining.push({ ...m, y: ny });
    }
  }

  // 生成流星
  let nextId = s.nextId;
  let spawnTimer = s.spawnTimer - dt;
  if (spawnTimer <= 0) {
    const r = 9 + s.rng() * 9;
    const x = r + s.rng() * (W - 2 * r);
    remaining.push({ id: nextId++, x, y: -r, r, speed: fallSpeed });
    spawnTimer = Math.max(0.28, 0.75 - t * 0.01);
  }

  const alive = lives > 0;
  const score = Math.floor(t * SCORE_PER_SEC);

  return {
    ...s, t, fallSpeed, playerX, meteors: remaining,
    nextId, spawnTimer, lives, alive, score,
  };
}
