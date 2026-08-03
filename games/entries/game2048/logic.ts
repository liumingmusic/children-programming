// 2048 纯逻辑（无 DOM / React 依赖，便于单元测试）。
// 棋盘用 4x4 数字矩阵表示，0 表示空格。

export type Dir = "left" | "right" | "up" | "down";
export type Board = number[][];

export function createEmpty(): Board {
  return Array.from({ length: 4 }, () => Array<number>(4).fill(0));
}

export function cloneBoard(b: Board): Board {
  return b.map((r) => r.slice());
}

export function boardsEqual(a: Board, b: Board): boolean {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }
  return true;
}

function transpose(b: Board): Board {
  const n = b.length;
  const r = Array.from({ length: n }, () => Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) r[j][i] = b[i][j];
  }
  return r;
}

function reverseRows(b: Board): Board {
  return b.map((r) => r.slice().reverse());
}

/** 单行向左滑动并合并，返回新行与本轮得分。 */
function slideLeftRow(row: number[]): { row: number[]; gained: number } {
  const nums = row.filter((v) => v !== 0);
  const res: number[] = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      res.push(merged);
      gained += merged;
      i++; // 跳过已合并的下一个
    } else {
      res.push(nums[i]);
    }
  }
  while (res.length < row.length) res.push(0);
  return { row: res, gained };
}

function slideLeft(board: Board): { board: Board; gained: number } {
  let gained = 0;
  const next = board.map((row) => {
    const r = slideLeftRow(row);
    gained += r.gained;
    return r.row;
  });
  return { board: next, gained };
}

/**
 * 在指定方向移动并合并。
 * 思路：把目标方向旋转成「向左」，执行 slideLeft，再反向旋转回去。
 */
export function move(
  board: Board,
  dir: Dir
): { board: Board; gained: number; moved: boolean } {
  let work: Board;
  let inverse: (b: Board) => Board;

  if (dir === "left") {
    work = board;
    inverse = (b) => b;
  } else if (dir === "right") {
    work = reverseRows(board);
    inverse = reverseRows;
  } else if (dir === "up") {
    work = transpose(board);
    inverse = transpose;
  } else {
    // down：先转置、再每行反转（使「向下」变为「向左」）；合并后先反转移回、再转置回去
    work = reverseRows(transpose(board));
    inverse = (b) => transpose(reverseRows(b));
  }

  const { board: slid, gained } = slideLeft(work);
  const newBoard = inverse(slid);
  const moved = !boardsEqual(board, newBoard);
  return { board: newBoard, gained, moved };
}

/** 在随机空格生成一个新方块（90% 为 2，10% 为 4）。 */
export function spawnTile(board: Board): Board {
  const empties: [number, number][] = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) empties.push([i, j]);
    }
  }
  if (empties.length === 0) return board;
  const [i, j] = empties[Math.floor(Math.random() * empties.length)];
  const next = cloneBoard(board);
  next[i][j] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

/** 初始棋盘：空盘 + 两个随机方块。 */
export function createInitial(): Board {
  return spawnTile(spawnTile(createEmpty()));
}

/** 是否已经拼出 2048。 */
export function hasWon(board: Board): boolean {
  return board.some((row) => row.some((v) => v >= 2048));
}

/** 是否还有可行的移动（有空格或存在可合并的相邻对）。 */
export function canMove(board: Board): boolean {
  if (board.some((row) => row.some((v) => v === 0))) return true;
  const n = board.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (j + 1 < n && board[i][j] === board[i][j + 1]) return true;
      if (i + 1 < n && board[i][j] === board[i + 1][j]) return true;
    }
  }
  return false;
}
