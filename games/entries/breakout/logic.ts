// 星球打砖块 · 纯函数核心（可无 DOM 测试）。
// 竖屏逻辑分辨率；挡板在底部横向移动，小球反弹击碎顶部砖块。

export const W = 360;
export const H = 540;
export const PADDLE_W = 76;
export const PADDLE_H = 12;
export const PADDLE_Y = H - 30;
export const PADDLE_SPEED = 380;
export const BALL_R = 7;
export const BALL_SPEED = 250;
export const MAX_LIVES = 3;

export const BRICK_COLS = 7;
export const BRICK_ROWS = 4;
export const BRICK_GAP = 6;
export const BRICK_TOP = 64;
export const BRICK_H = 18;
export const BRICK_SIDE = 10; // 左右留白

export interface Brick {
  id: number;
  x: number; // 左上
  y: number;
  w: number;
  h: number;
  alive: boolean;
  color: string;
}

export interface GameState {
  paddleX: number;
  ballX: number;
  ballY: number;
  vx: number;
  vy: number;
  score: number;
  lives: number;
  alive: boolean;
  bricks: Brick[];
  won: boolean;
}

export interface Input {
  dir: number;
  targetX: number | null;
}

const BRICK_COLORS = ["#7F77DD", "#378ADD", "#0F6E56", "#EF9F27"];

export function buildBricks(): Brick[] {
  const bricks: Brick[] = [];
  const usableW = W - BRICK_SIDE * 2;
  const bw = (usableW - BRICK_GAP * (BRICK_COLS - 1)) / BRICK_COLS;
  let id = 1;
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        id: id++,
        x: BRICK_SIDE + c * (bw + BRICK_GAP),
        y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
        w: bw,
        h: BRICK_H,
        alive: true,
        color: BRICK_COLORS[r % BRICK_COLORS.length],
      });
    }
  }
  return bricks;
}

export function createState(): GameState {
  return {
    paddleX: W / 2,
    ballX: W / 2,
    ballY: PADDLE_Y - BALL_R - 2,
    vx: BALL_SPEED * 0.6,
    vy: -BALL_SPEED,
    score: 0,
    lives: MAX_LIVES,
    alive: true,
    bricks: buildBricks(),
    won: false,
  };
}

function resetBall(s: GameState): GameState {
  return {
    ...s,
    ballX: W / 2,
    ballY: PADDLE_Y - BALL_R - 2,
    vx: BALL_SPEED * (Math.random() < 0.5 ? -0.6 : 0.6),
    vy: -BALL_SPEED,
  };
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive || s.won) return s;

  // 挡板
  let paddleX = s.paddleX;
  if (input.targetX != null) {
    const d = input.targetX - paddleX;
    const mv = PADDLE_SPEED * dt;
    paddleX += Math.max(-mv, Math.min(mv, d));
  } else {
    paddleX += input.dir * PADDLE_SPEED * dt;
  }
  paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, paddleX));

  // 小球
  let ballX = s.ballX + s.vx * dt;
  let ballY = s.ballY + s.vy * dt;
  let vx = s.vx;
  let vy = s.vy;
  let score = s.score;
  let lives = s.lives;

  // 左右墙
  if (ballX - BALL_R < 0) {
    ballX = BALL_R;
    vx = Math.abs(vx);
  } else if (ballX + BALL_R > W) {
    ballX = W - BALL_R;
    vx = -Math.abs(vx);
  }
  // 顶墙
  if (ballY - BALL_R < 0) {
    ballY = BALL_R;
    vy = Math.abs(vy);
  }

  // 挡板反弹
  if (
    vy > 0 &&
    ballY + BALL_R >= PADDLE_Y - PADDLE_H / 2 &&
    ballY + BALL_R <= PADDLE_Y + PADDLE_H / 2 + 6 &&
    ballX >= paddleX - PADDLE_W / 2 &&
    ballX <= paddleX + PADDLE_W / 2
  ) {
    ballY = PADDLE_Y - PADDLE_H / 2 - BALL_R;
    vy = -Math.abs(vy);
    // 按击中位置改变角度
    const off = (ballX - paddleX) / (PADDLE_W / 2);
    vx = BALL_SPEED * Math.max(-0.85, Math.min(0.85, off));
    vy = -Math.sqrt(Math.max(0, BALL_SPEED * BALL_SPEED - vx * vx)) * (vy < 0 ? 1 : -1);
  }

  // 砖块碰撞
  const bricks = s.bricks.map((b) => ({ ...b }));
  for (const b of bricks) {
    if (!b.alive) continue;
    if (
      ballX + BALL_R >= b.x &&
      ballX - BALL_R <= b.x + b.w &&
      ballY + BALL_R >= b.y &&
      ballY - BALL_R <= b.y + b.h
    ) {
      b.alive = false;
      score += 10;
      // 判断从哪个方向撞入，反转对应速度分量
      const fromSide =
        Math.min(ballX + BALL_R - b.x, b.x + b.w - (ballX - BALL_R)) <
        Math.min(ballY + BALL_R - b.y, b.y + b.h - (ballY - BALL_R));
      if (fromSide) vx = -vx;
      else vy = -vy;
      break;
    }
  }

  // 掉落底部
  let alive: boolean = s.alive;
  let next: GameState = {
    ...s,
    paddleX,
    ballX,
    ballY,
    vx,
    vy,
    score,
    lives,
    bricks,
  };
  if (ballY - BALL_R > H) {
    lives -= 1;
    if (lives <= 0) {
      alive = false;
      next = { ...next, lives, alive };
    } else {
      next = { ...resetBall(next), lives };
    }
  }

  const won = next.bricks.every((b) => !b.alive);
  return { ...next, won };
}
