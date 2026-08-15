// 俄罗斯方块 · 纯函数核心（无 DOM 可测试）。
// 7 种方块 + 7-bag 随机器 + 旋转/墙踢/消行。状态用不可变更新，便于单测。

export const COLS = 10;
export const ROWS = 18;
export const CELL = 28;
export const W = COLS * CELL;
export const H = ROWS * CELL;

export type Cell = number; // 0 空，1..7 颜色

const BASE: number[][][] = [
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
  [[2, 2], [2, 2]], // O
  [[0, 3, 0], [3, 3, 3], [0, 0, 0]], // T
  [[0, 4, 4], [4, 4, 0], [0, 0, 0]], // S
  [[5, 5, 0], [0, 5, 5], [0, 0, 0]], // Z
  [[6, 0, 0], [6, 6, 6], [0, 0, 0]], // J
  [[0, 0, 7], [7, 7, 7], [0, 0, 0]], // L
];

function rotateCW(m: number[][]): number[][] {
  const n = m.length;
  const r = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) r[j][n - 1 - i] = m[i][j];
  return r;
}

export const ROTATIONS: number[][][][] = BASE.map((base) => {
  const arr: number[][][] = [base];
  for (let k = 1; k < 4; k++) arr.push(rotateCW(arr[k - 1]));
  return arr;
});

export interface Piece {
  type: number;
  rot: number;
  x: number;
  y: number;
}

export interface GameState {
  board: Cell[][];
  cur: Piece;
  next: number;
  bag: number[];
  score: number;
  lines: number;
  alive: boolean;
  rng: () => number;
  dropTimer: number;
  prevRotate: boolean;
  prevHard: boolean;
  hDir: number;
  hTimer: number;
}

export interface Input {
  left: boolean;
  right: boolean;
  rotate: boolean;
  soft: boolean;
  hard: boolean;
}

const DAS = 0.16;
const ARR = 0.05;
const NORMAL_INTERVAL = 0.8;
const SOFT_INTERVAL = 0.05;
const LINE_SCORES = [0, 100, 300, 500, 800];

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function cellsOf(cur: Piece): { x: number; y: number }[] {
  const m = ROTATIONS[cur.type][cur.rot];
  const n = m.length;
  const out: { x: number; y: number }[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (m[r][c]) out.push({ x: cur.x + c, y: cur.y + r });
  return out;
}

export function collide(board: Cell[][], cur: Piece): boolean {
  for (const { x, y } of cellsOf(cur)) {
    if (x < 0 || x >= COLS || y >= ROWS) return true;
    if (y >= 0 && board[y][x] !== 0) return true;
  }
  return false;
}

function tryMove(board: Cell[][], cur: Piece, dx: number, dy: number): Piece {
  const n = { ...cur, x: cur.x + dx, y: cur.y + dy };
  return collide(board, n) ? cur : n;
}

function tryRotate(board: Cell[][], cur: Piece): Piece {
  const rot = (cur.rot + 1) % 4;
  const cand: Piece = { ...cur, rot };
  if (!collide(board, cand)) return cand;
  for (const k of [-1, 1, -2, 2]) {
    const kc = { ...cand, x: cand.x + k };
    if (!collide(board, kc)) return kc;
  }
  return cur;
}

export function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const kept = board.filter((row) => row.some((c) => c === 0));
  const cleared = ROWS - kept.length;
  const newRows = Array.from({ length: cleared }, () => Array(COLS).fill(0));
  return { board: [...newRows, ...kept], cleared };
}

function nextType(bag: number[], rng: () => number): { bag: number[]; type: number } {
  let b = bag;
  if (b.length === 0) {
    b = [0, 1, 2, 3, 4, 5, 6];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
  }
  const type = b.pop() as number;
  return { bag: b, type };
}

function writePiece(board: Cell[][], cur: Piece) {
  const m = ROTATIONS[cur.type][cur.rot];
  for (const { x, y } of cellsOf(cur)) {
    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
      board[y][x] = m[y - cur.y][x - cur.x];
    }
  }
}

function spawnNext(s: GameState): { cur: Piece; next: number; bag: number[]; alive: boolean } {
  const nt = nextType(s.bag, s.rng);
  const size = ROTATIONS[nt.type][0].length;
  const cur: Piece = { type: nt.type, rot: 0, x: Math.floor((COLS - size) / 2), y: 0 };
  return { cur, next: nt.type, bag: nt.bag, alive: !collide(s.board, cur) };
}

export function createState(seed?: number): GameState {
  const rng = seed == null ? Math.random : mulberry32(seed);
  const first = nextType([], rng);
  const second = nextType(first.bag, rng);
  const size = ROTATIONS[first.type][0].length;
  const cur: Piece = { type: first.type, rot: 0, x: Math.floor((COLS - size) / 2), y: 0 };
  return {
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    cur,
    next: second.type,
    bag: second.bag,
    score: 0,
    lines: 0,
    alive: true,
    rng,
    dropTimer: 0,
    prevRotate: false,
    prevHard: false,
    hDir: 0,
    hTimer: 0,
  };
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  let board: Cell[][] = s.board.map((r) => r.slice());
  let cur: Piece = s.cur;
  let bag = s.bag.slice();
  let next = s.next;
  let score = s.score;
  let lines = s.lines;
  let alive: boolean = s.alive;
  let dropTimer = s.dropTimer;
  const dropInterval = input.soft ? SOFT_INTERVAL : NORMAL_INTERVAL;
  let prevRotate = input.rotate;
  let prevHard = input.hard;
  let hDir = s.hDir;
  let hTimer = s.hTimer;

  // 水平移动（DAS/ARR）
  const wantDir = input.right && !input.left ? 1 : input.left && !input.right ? -1 : 0;
  if (wantDir !== hDir) {
    hDir = wantDir;
    hTimer = DAS;
    if (hDir !== 0) cur = tryMove(board, cur, hDir, 0);
  } else if (hDir !== 0) {
    hTimer -= dt;
    while (hTimer <= 0) {
      cur = tryMove(board, cur, hDir, 0);
      hTimer += ARR;
    }
  }

  // 旋转（边沿触发）
  if (input.rotate && !s.prevRotate) cur = tryRotate(board, cur);

  // 硬降（边沿触发）：直接落底并锁定
  if (input.hard && !s.prevHard) {
    while (!collide(board, { ...cur, y: cur.y + 1 })) cur = { ...cur, y: cur.y + 1 };
    score += 2;
    writePiece(board, cur);
    const cl = clearLines(board);
    board = cl.board;
    if (cl.cleared > 0) {
      lines += cl.cleared;
      score += LINE_SCORES[cl.cleared] ?? 800;
    }
    const sp = spawnNext({ ...s, board, bag, next, score, lines });
    cur = sp.cur;
    next = sp.next;
    bag = sp.bag;
    alive = sp.alive;
    dropTimer = 0;
    return { ...s, board, cur, next, bag, score, lines, alive, dropTimer, prevRotate, prevHard, hDir, hTimer };
  }

  // 重力下落
  dropTimer += dt;
  if (dropTimer >= dropInterval) {
    dropTimer -= dropInterval;
    if (!collide(board, { ...cur, y: cur.y + 1 })) {
      if (input.soft) score += 1;
      cur = { ...cur, y: cur.y + 1 };
    } else {
      writePiece(board, cur);
      const cl = clearLines(board);
      board = cl.board;
      if (cl.cleared > 0) {
        lines += cl.cleared;
        score += LINE_SCORES[cl.cleared] ?? 800;
      }
      const sp = spawnNext({ ...s, board, bag, next, score, lines });
      cur = sp.cur;
      next = sp.next;
      bag = sp.bag;
      alive = sp.alive;
    }
  }

  return { ...s, board, cur, next, bag, score, lines, alive, dropTimer, prevRotate, prevHard, hDir, hTimer };
}
