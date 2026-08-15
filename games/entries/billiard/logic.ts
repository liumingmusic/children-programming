// 星球台球 · 纯函数核心（可无 DOM 测试）。
// 两球弹性碰撞（等质量），演示动量 / 能量守恒。

export const W = 360;
export const H = 540;
export const BALL_R = 16;
export const WALL_E = 0.98; // 桌边弹性
export const FRICTION = 0.25; // 每秒速度衰减（桌布摩擦）
export const MAX_SPEED = 900;

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface GameState {
  balls: [Ball, Ball]; // [白球, 星球]
  t: number;
  collisions: number;
}

export function createState(): GameState {
  return {
    balls: [
      { x: W * 0.3, y: H * 0.7, vx: 0, vy: 0 },
      { x: W * 0.7, y: H * 0.4, vx: 0, vy: 0 },
    ],
    t: 0,
    collisions: 0,
  };
}

/** 等质量弹性碰撞：沿法线交换速度分量；仅在相互接近且重叠时处理。 */
export function resolveCollision(a: Ball, b: Ball): boolean {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0 || dist >= BALL_R * 2) return false;
  const nx = dx / dist;
  const ny = dy / dist;
  const rvx = a.vx - b.vx;
  const rvy = a.vy - b.vy;
  const vrel = rvx * nx + rvy * ny;
  if (vrel <= 0) return false; // 正在分离，不处理
  // 等质量弹性：交换法线分量
  a.vx -= vrel * nx;
  a.vy -= vrel * ny;
  b.vx += vrel * nx;
  b.vy += vrel * ny;
  // 分离重叠，避免粘连
  const overlap = BALL_R * 2 - dist;
  const px = nx * overlap * 0.5;
  const py = ny * overlap * 0.5;
  a.x -= px;
  a.y -= py;
  b.x += px;
  b.y += py;
  return true;
}

export function step(s: GameState, dt: number): GameState {
  const t = s.t + dt;
  const balls: [Ball, Ball] = [{ ...s.balls[0] }, { ...s.balls[1] }];
  let collisions = s.collisions;

  for (const ball of balls) {
    const f = Math.max(0, 1 - FRICTION * dt);
    ball.vx *= f;
    ball.vy *= f;
    const sp = Math.hypot(ball.vx, ball.vy);
    if (sp > MAX_SPEED) {
      ball.vx = (ball.vx / sp) * MAX_SPEED;
      ball.vy = (ball.vy / sp) * MAX_SPEED;
    }
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x - BALL_R < 0) {
      ball.x = BALL_R;
      ball.vx = Math.abs(ball.vx) * WALL_E;
    } else if (ball.x + BALL_R > W) {
      ball.x = W - BALL_R;
      ball.vx = -Math.abs(ball.vx) * WALL_E;
    }
    if (ball.y - BALL_R < 0) {
      ball.y = BALL_R;
      ball.vy = Math.abs(ball.vy) * WALL_E;
    } else if (ball.y + BALL_R > H) {
      ball.y = H - BALL_R;
      ball.vy = -Math.abs(ball.vy) * WALL_E;
    }
  }

  if (resolveCollision(balls[0], balls[1])) collisions += 1;

  return { balls, t, collisions };
}

/** 发射白球：从白球当前位置朝目标点给一个速度。 */
export function shoot(s: GameState, targetX: number, targetY: number, power = 640): GameState {
  const a = s.balls[0];
  const dx = targetX - a.x;
  const dy = targetY - a.y;
  const d = Math.hypot(dx, dy) || 1;
  return {
    ...s,
    balls: [{ ...a, vx: (dx / d) * power, vy: (dy / d) * power }, { ...s.balls[1] }],
  };
}
