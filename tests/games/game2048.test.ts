import { describe, it, expect } from "vitest";
import {
  boardsEqual,
  canMove,
  createEmpty,
  hasWon,
  move,
  spawnTile,
  type Board,
} from "@/games/entries/game2048/logic";

describe("2048 纯逻辑", () => {
  it("向左合并单行：2,2,0,0 -> 4,0,0,0，得分 4", () => {
    const { board, gained, moved } = move(
      [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "left"
    );
    expect(board[0]).toEqual([4, 0, 0, 0]);
    expect(gained).toBe(4);
    expect(moved).toBe(true);
  });

  it("向右合并：2,2,0,0 -> 0,0,0,4", () => {
    const { board } = move(
      [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "right"
    );
    expect(board[0]).toEqual([0, 0, 0, 4]);
  });

  it("向上合并列：第一列 2,2,0,0 -> 4,0,0,0", () => {
    const input: Board = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board } = move(input, "up");
    expect(board.map((r) => r[0])).toEqual([4, 0, 0, 0]);
  });

  it("向下合并列：第一列 2,2,0,0 -> 0,0,0,4", () => {
    const input: Board = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board } = move(input, "down");
    expect(board.map((r) => r[0])).toEqual([0, 0, 0, 4]);
  });

  it("无法移动时 moved=false（已锁死且无空格）", () => {
    const locked: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    const { moved } = move(locked, "left");
    expect(moved).toBe(false);
    expect(canMove(locked)).toBe(false);
  });

  it("同一行内不连续合并：2,2,2,2 -> 4,4,0,0（只合并一次）", () => {
    const { board } = move(
      [
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "left"
    );
    expect(board[0]).toEqual([4, 4, 0, 0]);
  });

  it("spawnTile 在空格生成一个方块", () => {
    const empty = createEmpty();
    const after = spawnTile(empty);
    const count = after.flat().filter((v) => v !== 0).length;
    expect(count).toBe(1);
    expect([2, 4]).toContain(after.flat().find((v) => v !== 0)!);
  });

  it("hasWon 在出现 2048 时为 true", () => {
    const b: Board = [
      [2048, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(hasWon(b)).toBe(true);
  });

  it("boardsEqual 正确比较", () => {
    const a: Board = [
      [2, 0],
      [0, 0],
    ];
    const b: Board = [
      [2, 0],
      [0, 0],
    ];
    expect(boardsEqual(a, b)).toBe(true);
  });
});
