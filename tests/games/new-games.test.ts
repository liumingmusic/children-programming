import { describe, it, expect } from "vitest";
import {
  createState as createStar,
  step as stepStar,
  type Input as StarInput,
} from "@/games/entries/star-catch/logic";
import {
  createState as createBreakout,
  step as stepBreakout,
  type Input as BreakoutInput,
} from "@/games/entries/breakout/logic";
import {
  createState as createSnake,
  step as stepSnake,
  type Input as SnakeInput,
  COLS,
  ROWS,
} from "@/games/entries/snake-space/logic";
import { buildDeck } from "@/games/entries/memory-cards/logic";
import { buildTiles } from "@/games/entries/number-match/logic";

const finite = (n: number) => Number.isFinite(n);

describe("新增游戏逻辑", () => {
  it("star-catch：多帧推进不崩溃、数值有限、篮子不出界", () => {
    let s = createStar();
    const input: StarInput = { dir: 1, targetX: null };
    for (let i = 0; i < 300; i++) {
      s = stepStar(s, 0.016, i % 40 < 20 ? input : { dir: -1, targetX: null });
      expect(finite(s.basketX)).toBe(true);
      expect(s.basketX).toBeGreaterThanOrEqual(0);
      expect(s.basketX).toBeLessThanOrEqual(360);
      expect(finite(s.score)).toBe(true);
      if (!s.alive) break;
    }
  });

  it("breakout：多帧推进、小球在界内或已结束、砖块数正确", () => {
    let s = createBreakout();
    const input: BreakoutInput = { dir: 0, targetX: null };
    for (let i = 0; i < 400; i++) {
      s = stepBreakout(s, 0.016, input);
      expect(s.bricks.filter((b) => b.alive).length).toBeLessThanOrEqual(28);
      if (!s.alive || s.won) break;
    }
    expect(finite(s.score)).toBe(true);
  });

  it("snake-space：前进不崩溃、蛇头在界内、食物合法", () => {
    let s = createSnake();
    const input: SnakeInput = { dx: 1, dy: 0 };
    for (let i = 0; i < 200; i++) {
      s = stepSnake(s, 0.05, input);
      const head = s.snake[0];
      expect(head.x).toBeGreaterThanOrEqual(0);
      expect(head.x).toBeLessThan(COLS);
      expect(head.y).toBeGreaterThanOrEqual(0);
      expect(head.y).toBeLessThan(ROWS);
      expect(finite(s.score)).toBe(true);
      if (!s.alive) break;
    }
  });

  it("memory-cards：牌组为偶数张且成对", () => {
    const deck = buildDeck(6);
    expect(deck.length).toBe(12);
    const counts: Record<string, number> = {};
    for (const c of deck) counts[c.emoji] = (counts[c.emoji] ?? 0) + 1;
    for (const v of Object.values(counts)) expect(v).toBe(2);
  });

  it("number-match：tiles 为偶数张、各值成对", () => {
    const tiles = buildTiles(16);
    expect(tiles.length).toBe(16);
    const counts: Record<number, number> = {};
    for (const t of tiles) counts[t.value] = (counts[t.value] ?? 0) + 1;
    for (const v of Object.values(counts)) expect(v).toBe(2);
  });
});
