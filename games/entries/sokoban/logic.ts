// 推箱子 · 纯函数核心（无 DOM 可测试）。
// 经典推箱：把所有箱子推到目标点即胜利。地图用标准记号：
//   # 墙  . 目标  $ 箱子  * 箱在目标上  @ 玩家  + 玩家在目标上  空格 地板

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
  return {
    cols: p.cols,
    rows: p.rows,
    walls: p.walls,
    targets: p.targets,
    boxes: p.boxes,
    player: p.player,
    moves: 0,
    won: isWon(p.targets, p.boxes),
  };
}

export function isWon(targets: boolean[][], boxes: boolean[][]): boolean {
  for (let y = 0; y < targets.length; y++)
    for (let x = 0; x < targets[y].length; x++)
      if (targets[y][x] && !boxes[y][x]) return false;
  return true;
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
  return { ...s, boxes, player, moves, won };
}
