// 接星星 · 纯函数核心（可无 DOM 测试）。
// 竖屏逻辑分辨率，组件按 devicePixelRatio 缩放渲染。

export const W = 360;
export const H = 540;
export const BASKET_W = 78;
export const BASKET_H = 30;
export const BASKET_Y = H - 48;
export const BASKET_SPEED = 360; // 篮子横向速度 px/s
export const STAR_R = 13;
export const FALL_BASE = 150;
export const FALL_MAX = 380;
export const FALL_RAMP = 7; // 每秒加速 px/s
export const MAX_LIVES = 3;

export interface Star {
  id: number;
  x: number;
  y: number;
  r: number;
  speed: number;
}

export interface GameState {
  basketX: number;
  t: number;
  score: number;
  caught: number;
  lives: number;
  alive: boolean;
  stars: Star[];
  nextId: number;
  spawnTimer: number;
  fallSpeed: number;
}

export interface Input {
  dir: number; // -1 | 0 | 1
  targetX: number | null;
}

export function createState(): GameState {
  return {
    basketX: W / 2,
    t: 0,
    score: 0,
    caught: 0,
    lives: MAX_LIVES,
    alive: true,
    stars: [],
    nextId: 1,
    spawnTimer: 0.5,
    fallSpeed: FALL_BASE,
  };
}

/** 篮子（矩形）与星星（圆）碰撞：星星落入篮子口区域即接住。 */
export function caught(s: GameState, star: Star): boolean {
  const bx = s.basketX;
  const half = BASKET_W / 2;
  const top = BASKET_Y - BASKET_H / 2;
  const bottom = BASKET_Y + BASKET_H / 2;
  return (
    star.x >= bx - half &&
    star.x <= bx + half &&
    star.y + star.r >= top &&
    star.y - star.r <= bottom
  );
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  const t = s.t + dt;
  const fallSpeed = Math.min(FALL_MAX, FALL_BASE + t * FALL_RAMP);

  // 篮子横向移动
  let basketX = s.basketX;
  if (input.targetX != null) {
    const d = input.targetX - basketX;
    const mv = BASKET_SPEED * dt;
    basketX += Math.max(-mv, Math.min(mv, d));
  } else {
    basketX += input.dir * BASKET_SPEED * dt;
  }
  basketX = Math.max(BASKET_W / 2, Math.min(W - BASKET_W / 2, basketX));

  // 星星下落
  let lives = s.lives;
  let caughtCount = s.caught;
  const remaining: Star[] = [];
  for (const st of s.stars) {
    const ny = st.y + st.speed * dt;
    if (caught(s, { ...st, y: ny })) {
      caughtCount += 1;
    } else if (ny - st.r > H) {
      lives -= 1; // 漏接
    } else {
      remaining.push({ ...st, y: ny });
    }
  }

  // 生成星星
  let nextId = s.nextId;
  let spawnTimer = s.spawnTimer - dt;
  if (spawnTimer <= 0) {
    const x = STAR_R + Math.random() * (W - 2 * STAR_R);
    remaining.push({
      id: nextId++,
      x,
      y: -STAR_R,
      r: STAR_R,
      speed: fallSpeed,
    });
    spawnTimer = Math.max(0.35, 0.9 - t * 0.012);
  }

  const alive = lives > 0;
  const score = caughtCount * 10;

  return {
    ...s,
    basketX,
    t,
    fallSpeed,
    score,
    caught: caughtCount,
    lives,
    alive,
    stars: remaining,
    nextId,
    spawnTimer,
  };
}
