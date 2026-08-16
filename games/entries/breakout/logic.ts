// 星球打砖块 · 纯函数核心（可无 DOM 测试）。
// 竖屏逻辑分辨率；挡板在底部横向移动，小球反弹击碎顶部砖块。
// 增强：多层关卡（每关多一行砖 + 更快球速）+ 连击倍率。

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
export const BRICK_ROWS = 4; // 第 1 关行数
export const BRICK_MAX_ROWS = 6;
export const BRICK_GAP = 6;
export const BRICK_TOP = 64;
export const BRICK_H = 18;
export const BRICK_SIDE = 10; // 左右留白

export const MAX_LEVEL = 5;
const COMBO_STEP = 5;
const SPEED_PER_LEVEL = 32;

export function rowsForLevel(level: number): number {
  return Math.min(BRICK_ROWS + (level - 1), BRICK_MAX_ROWS);
}
export function speedForLevel(level: number): number {
  return BALL_SPEED + (level - 1) * SPEED_PER_LEVEL;
}
export function comboMult(combo: number): number {
  return Math.min(3, 1 + Math.floor(combo / COMBO_STEP) * 0.5);
}

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
  speed: number; // 当前球速（随关卡提升）
  score: number;
  lives: number;
  alive: boolean;
  won: boolean;
  cleared: boolean; // 已通关全部关卡
  level: number;
  combo: number;
  comboBest: number;
  bricks: Brick[];
}

export interface Input {
  dir: number;
  targetX: number | null;
}

const BRICK_COLORS = ["#7F77DD", "#378ADD", "#0F6E56", "#EF9F27", "#E0608A", "#3AA8A0"];

export function buildBricks(rows: number): Brick[] {
  const bricks: Brick[] = [];
  const usableW = W - BRICK_SIDE * 2;
  const bw = (usableW - BRICK_GAP * (BRICK_COLS - 1)) / BRICK_COLS;
  let id = 1;
  for (let r = 0; r < rows; r++) {
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

export function createState(level = 1): GameState {
  const speed = speedForLevel(level);
  return {
    paddleX: W / 2,
    ballX: W / 2,
    ballY: PADDLE_Y - BALL_R - 2,
    vx: speed * 0.6,
    vy: -speed,
    speed,
    score: 0,
    lives: MAX_LIVES,
    alive: true,
    won: false,
    cleared: false,
    level,
    combo: 0,
    comboBest: 0,
    bricks: buildBricks(rowsForLevel(level)),
  };
}

function resetBall(s: GameState): GameState {
  const speed = s.speed;
  return {
    ...s,
    ballX: W / 2,
    ballY: PADDLE_Y - BALL_R - 2,
    vx: speed * (Math.random() < 0.5 ? -0.6 : 0.6),
    vy: -speed,
  };
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive || s.cleared) return s;

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
  let combo = s.combo;
  let comboBest = s.comboBest;

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
    const off = (ballX - paddleX) / (PADDLE_W / 2);
    vx = s.speed * Math.max(-0.85, Math.min(0.85, off));
    vy = -Math.sqrt(Math.max(0, s.speed * s.speed - vx * vx)) * (vy < 0 ? 1 : -1);
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
      combo += 1;
      comboBest = Math.max(comboBest, combo);
      score += Math.round(10 * comboMult(combo));
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
    combo,
    comboBest,
    bricks,
  };
  if (ballY - BALL_R > H) {
    lives -= 1;
    combo = 0; // 掉球断连击
    if (lives <= 0) {
      alive = false;
      next = { ...next, lives, combo, alive };
    } else {
      next = { ...resetBall(next), lives, combo };
    }
  }

  // 通关 / 过关判定
  const remaining = next.bricks.filter((b) => b.alive).length;
  if (remaining === 0) {
    if (next.level < MAX_LEVEL) {
      const nl = next.level + 1;
      const bs = speedForLevel(nl);
      return {
        ...next,
        level: nl,
        bricks: buildBricks(rowsForLevel(nl)),
        ballX: W / 2,
        ballY: PADDLE_Y - BALL_R - 2,
        vx: bs * 0.6,
        vy: -bs,
        won: false,
      };
    }
    return { ...next, cleared: true, won: true };
  }

  return next;
}
