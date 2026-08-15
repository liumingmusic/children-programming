// 太空跑酷 · 纯函数核心（无 DOM 可测试）。
// 竖屏逻辑分辨率。玩家固定在左侧，小行星从右向左飞来，跳跃躲避。

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

  // 小行星左移
  const obstacles = s.obstacles
    .map((o) => ({ ...o, x: o.x - OBST_SPEED * dt }))
    .filter((o) => o.x + o.w > -20);

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

  // 生成小行星
  let spawnTimer = s.spawnTimer - dt;
  let nextGap = s.nextGap;
  if (spawnTimer <= 0) {
    const w = 22 + s.rng() * 22;
    const h = 34 + s.rng() * 56;
    obstacles.push({ x: W + 10, w, h });
    spawnTimer = nextGap;
    nextGap = 0.8 + s.rng() * 0.9;
  }

  const alive = lives > 0;
  const score = Math.floor(t * SCORE_PER_SEC);

  return {
    ...s, t, py, vy, grounded, obstacles,
    spawnTimer, nextGap, lives, hitCooldown, alive, score,
  };
}
