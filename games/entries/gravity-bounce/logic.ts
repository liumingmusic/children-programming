// 重力弹球 · 纯函数核心（可无 DOM 测试）。
// 物理：小球受恒定重力下落，撞墙与挡板按弹性系数反弹。

export const W = 360;
export const H = 540;
export const BALL_R = 14;
export const GRAVITY = 1000; // px/s^2
export const RESTITUTION = 0.92; // 墙/挡板弹性系数
export const PADDLE_W = 96;
export const PADDLE_H = 16;
export const PADDLE_Y = H - 46;
export const PADDLE_SPEED = 420; // 挡板横向速度 px/s
export const MAX_LIVES = 3;

export interface GameState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  paddleX: number;
  t: number;
  score: number;
  bounces: number;
  lives: number;
  alive: boolean;
}

export interface Input {
  dir: number; // -1 | 0 | 1
  targetX: number | null;
}

export function createState(): GameState {
  return {
    x: W / 2,
    y: 60,
    vx: (Math.random() < 0.5 ? -1 : 1) * 160,
    vy: 120,
    paddleX: W / 2,
    t: 0,
    score: 0,
    bounces: 0,
    lives: MAX_LIVES,
    alive: true,
  };
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  const t = s.t + dt;

  // 挡板移动
  let paddleX = s.paddleX;
  if (input.targetX != null) {
    const d = input.targetX - paddleX;
    const mv = PADDLE_SPEED * dt;
    paddleX += Math.max(-mv, Math.min(mv, d));
  } else {
    paddleX += input.dir * PADDLE_SPEED * dt;
  }
  paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, paddleX));

  // 物理积分
  let { x, y, vx, vy } = s;
  vy += GRAVITY * dt;
  x += vx * dt;
  y += vy * dt;

  // 左右墙反弹
  if (x - BALL_R < 0) {
    x = BALL_R;
    vx = Math.abs(vx) * RESTITUTION;
  } else if (x + BALL_R > W) {
    x = W - BALL_R;
    vx = -Math.abs(vx) * RESTITUTION;
  }

  // 挡板反弹（仅下落且进入挡板口时）
  let bounces = s.bounces;
  const paddleTop = PADDLE_Y - PADDLE_H / 2;
  if (
    vy > 0 &&
    y + BALL_R >= paddleTop &&
    y - BALL_R <= PADDLE_Y + PADDLE_H / 2 &&
    x >= paddleX - PADDLE_W / 2 &&
    x <= paddleX + PADDLE_W / 2
  ) {
    y = paddleTop - BALL_R;
    const centered = 1 - Math.abs(x - paddleX) / (PADDLE_W / 2); // 0..1
    vy = -(Math.abs(vy) * RESTITUTION + 120 + centered * 160);
    vx += (x - paddleX) * 1.6; // 边缘给一点横向偏移
    bounces += 1;
  }

  // 漏接（掉出底部）
  let lives = s.lives;
  if (y - BALL_R > H) {
    lives -= 1;
    if (lives <= 0) {
      return { ...s, x, y, vx, vy, paddleX, t, bounces, lives, alive: false };
    }
    // 重置小球到顶部
    x = W / 2;
    y = 60;
    vx = (Math.random() < 0.5 ? -1 : 1) * 160;
    vy = 120;
  }

  const score = bounces * 10;
  return { ...s, x, y, vx, vy, paddleX, t, score, bounces, lives, alive: true };
}
