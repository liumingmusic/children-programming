// 推箱子 · 纯函数核心（无 DOM 可测试）。
// 经典推箱：把所有箱子推到目标点即胜利。地图用标准记号：
//   # 墙  . 目标  $ 箱子  * 箱在目标上  @ 玩家  + 玩家在目标上  空格 地板
// 增强：多关卡递进 + 连击（把箱子推上目标累积连击加分）。

import { comboMult } from "@/games/lib/enhance";

export const CELL = 48;

export interface Level {
  rows: string[];
}

export interface GameState {
  cols: number;
  rows: number;
  walls: boolean[][];
  targets: boolean[][];
  boxes: boolean[][];
  player: { x: number; y: number };
  moves: number;
  won: boolean;
  placed: number; // 已在目标上的箱子数
  combo: number; // 连续把箱子放上目标的连击
  comboBest: number;
  score: number; // 连击放置奖励累计
}

export interface Input {
  move: 0 | 1 | 2 | 3 | null; // 上、右、下、左
}

export const DEFAULT_LEVEL: Level = {
  rows: [
    "########",
    "#      #",
    "#@$  . #",
    "#      #",
    "# $  . #",
    "#      #",
    "#      #",
    "########",
  ],
};

// 增强：5 个递进关卡（箱子数与布局逐步变难）。每关把全部箱子推上目标即过关。
export const LEVELS: Level[] = [
  DEFAULT_LEVEL,
  {
    rows: [
      "########",
      "#      #",
      "#  #   #",
      "#@ $ . #",
      "#  #   #",
      "#      #",
      "#      #",
      "########",
    ],
  },
  {
    rows: [
      "########",
      "#      #",
      "#@$ .  #",
      "#      #",
      "#  $ . #",
      "#      #",
      "#      #",
      "########",
    ],
  },
  {
    rows: [
      "########",
      "#    . #",
      "#   $  #",
      "#  @   #",
      "#      #",
      "#      #",
      "#      #",
      "########",
    ],
  },
  {
    rows: [
      "########",
      "#      #",
      "#@$ .  #",
      "#  $ . #",
      "#  $ . #",
      "#      #",
      "#      #",
      "########",
    ],
  },
];

export const LEVEL_COUNT = LEVELS.length;

export function parseLevel(level: Level) {
  const rows = level.rows.length;
  const cols = Math.max(...level.rows.map((r) => r.length));
  const walls: boolean[][] = [];
  const targets: boolean[][] = [];
  const boxes: boolean[][] = [];
  let player = { x: 0, y: 0 };
  for (let y = 0; y < rows; y++) {
    walls[y] = [];
    targets[y] = [];
    boxes[y] = [];
    const line = level.rows[y];
    for (let x = 0; x < cols; x++) {
      const ch = line[x] ?? " ";
      walls[y][x] = ch === "#";
      targets[y][x] = ch === "." || ch === "*" || ch === "+";
      boxes[y][x] = ch === "$" || ch === "*";
      if (ch === "@" || ch === "+") player = { x, y };
    }
  }
  return { cols, rows, walls, targets, boxes, player };
}

export function createState(level?: Level): GameState {
  const lv = level ?? DEFAULT_LEVEL;
  const p = parseLevel(lv);
  const placed = countPlaced(p.targets, p.boxes);
  return {
    cols: p.cols,
    rows: p.rows,
    walls: p.walls,
    targets: p.targets,
    boxes: p.boxes,
    player: p.player,
    moves: 0,
    won: isWon(p.targets, p.boxes),
    placed,
    combo: 0,
    comboBest: 0,
    score: 0,
  };
}

export function isWon(targets: boolean[][], boxes: boolean[][]): boolean {
  for (let y = 0; y < targets.length; y++)
    for (let x = 0; x < targets[y].length; x++)
      if (targets[y][x] && !boxes[y][x]) return false;
  return true;
}

function countPlaced(targets: boolean[][], boxes: boolean[][]): number {
  let n = 0;
  for (let y = 0; y < targets.length; y++)
    for (let x = 0; x < targets[y].length; x++)
      if (targets[y][x] && boxes[y][x]) n++;
  return n;
}

const DIRS = [
  [0, -1], // 上
  [1, 0], // 右
  [0, 1], // 下
  [-1, 0], // 左
];

export function step(s: GameState, _dt: number, input: Input): GameState {
  if (s.won || input.move == null) return s;
  const [dx, dy] = DIRS[input.move];
  const nx = s.player.x + dx;
  const ny = s.player.y + dy;
  if (s.walls[ny]?.[nx]) return s; // 撞墙

  let boxes = s.boxes;
  let player = s.player;
  if (boxes[ny]?.[nx]) {
    const bx = nx + dx;
    const by = ny + dy;
    if (s.walls[by]?.[bx] || boxes[by]?.[bx]) return s; // 箱子被挡
    boxes = boxes.map((r) => r.slice());
    boxes[ny][nx] = false;
    boxes[by][bx] = true;
    player = { x: nx, y: ny };
  } else {
    player = { x: nx, y: ny };
  }

  const moves = s.moves + 1;
  const won = isWon(s.targets, boxes);
  const newPlaced = countPlaced(s.targets, boxes);

  let combo = s.combo;
  let comboBest = s.comboBest;
  let score = s.score;
  if (newPlaced > s.placed) {
    for (let i = 0; i < newPlaced - s.placed; i++) {
      combo += 1;
      comboBest = Math.max(comboBest, combo);
      score += Math.round(30 * comboMult(combo));
    }
  } else if (newPlaced < s.placed) {
    combo = 0; // 有箱子被推离目标，连击中断
  }

  return { ...s, boxes, player, moves, won, placed: newPlaced, combo, comboBest, score };
}
