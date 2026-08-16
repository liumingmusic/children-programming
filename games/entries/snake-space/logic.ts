// 太空贪吃蛇 · 纯函数核心（可无 DOM 测试）。
// 网格步进：每 STEP_INTERVAL 秒移动一格，吃星星增长，撞墙或撞自己结束。
// 增强：5 关按长度递进（每关需吃更多星星且步进更快）+ 连击倍率（每关内连续吃星星累积）。

import { comboMult as comboMultFn, levelTarget as levelTargetFn } from "@/games/lib/enhance";

export const MAX_LEVEL = 5;
export const comboMult = comboMultFn;
/** 第 level 关需累计吃到的星星数（长度递进）。 */
export function levelTargetFor(level: number): number {
  return levelTargetFn(5, 4, level);
}

export const COLS = 20;
export const ROWS = 20;
export const CELL = 18;
export const W = COLS * CELL;
export const H = ROWS * CELL;
export const STEP_INTERVAL = 0.12;

export interface Cell {
  x: number;
  y: number;
}

export interface GameState {
  snake: Cell[]; // 头在前
  dir: Cell;
  nextDir: Cell;
  food: Cell;
  t: number;
  stepTimer: number;
  score: number; // 吃到的星星数（长度 = score + 3）
  points: number; // 连击计分
  level: number;
  levelTarget: number;
  combo: number;
  comboBest: number;
  cleared: boolean;
  alive: boolean;
}

export interface Input {
  dx: number;
  dy: number;
}

function randomFood(snake: Cell[]): Cell {
  const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
  const free: Cell[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return { x: 0, y: 0 };
  return free[Math.floor(Math.random() * free.length)];
}

export function createState(): GameState {
  const snake: Cell[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  return {
    snake,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: randomFood(snake),
    t: 0,
    stepTimer: 0,
    score: 0,
    points: 0,
    level: 1,
    levelTarget: levelTargetFor(1),
    combo: 0,
    comboBest: 0,
    cleared: false,
    alive: true,
  };
}

/** 第 level 关的步进间隔（越高关越快）。 */
function intervalFor(level: number): number {
  return Math.max(0.06, STEP_INTERVAL - (level - 1) * 0.012);
}

/** 推进一帧：累计时间，到达步进间隔时移动一格。 */
export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  const t = s.t + dt;
  let nextDir = s.nextDir;
  // 仅在不反向时接受新方向
  if ((input.dx !== 0 || input.dy !== 0) && !(input.dx === -s.dir.x && input.dy === -s.dir.y)) {
    nextDir = { x: input.dx, y: input.dy };
  }

  const stepTimer = s.stepTimer + dt;
  if (stepTimer < intervalFor(s.level)) {
    return { ...s, t, nextDir, stepTimer };
  }

  const dir = nextDir;
  const head = s.snake[0];
  const nx = head.x + dir.x;
  const ny = head.y + dir.y;

  // 撞墙
  if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
    return { ...s, t, dir, nextDir: dir, alive: false, stepTimer: 0 };
  }
  // 撞自己（尾巴这步会让出来，所以排除末节）
  const willEat = nx === s.food.x && ny === s.food.y;
  const body = willEat ? s.snake : s.snake.slice(0, -1);
  if (body.some((c) => c.x === nx && c.y === ny)) {
    return { ...s, t, dir, nextDir: dir, alive: false, stepTimer: 0 };
  }

  let snake: Cell[];
  let food = s.food;
  let score = s.score;
  let points = s.points;
  let combo = s.combo;
  let comboBest = s.comboBest;
  let level = s.level;
  let levelTarget = s.levelTarget;
  let cleared = s.cleared;

  if (willEat) {
    snake = [{ x: nx, y: ny }, ...s.snake];
    score += 1;
    combo += 1;
    comboBest = Math.max(comboBest, combo);
    points += Math.round(comboMult(combo));
    food = randomFood(snake);
    // 关卡递进：达到当前关目标且未通关 → 进下一关（连击重置）
    if (score >= levelTarget) {
      if (level < MAX_LEVEL) {
        level += 1;
        levelTarget = levelTargetFor(level);
        combo = 0;
      } else {
        cleared = true;
      }
    }
  } else {
    snake = [{ x: nx, y: ny }, ...s.snake.slice(0, -1)];
  }

  return {
    ...s,
    snake,
    dir,
    nextDir: dir,
    food,
    t,
    stepTimer: 0,
    score,
    points,
    combo,
    comboBest,
    level,
    levelTarget,
    cleared,
  };
}
