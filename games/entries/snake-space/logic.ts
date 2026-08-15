// 太空贪吃蛇 · 纯函数核心（可无 DOM 测试）。
// 网格步进：每 STEP_INTERVAL 秒移动一格，吃星星增长，撞墙或撞自己结束。

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
  score: number;
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
    alive: true,
  };
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
  if (stepTimer < STEP_INTERVAL) {
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
  if (willEat) {
    snake = [{ x: nx, y: ny }, ...s.snake];
    score += 1;
    food = randomFood(snake);
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
  };
}
