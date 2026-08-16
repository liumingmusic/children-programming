import { describe, it, expect } from "vitest";
import {
  levelTargetFor,
  comboMult,
  createState as scCreate,
  step as scStep,
  type Input as ScInput,
} from "@/games/entries/star-catch/logic";
import {
  createState as boCreate,
  step as boStep,
  type Input as BoInput,
} from "@/games/entries/breakout/logic";
import {
  createState as biCreate,
  step as biStep,
  cornerPockets,
  comboMult as biComboMult,
  POT_PER_LEVEL,
  LEVEL_COUNT,
} from "@/games/entries/billiard/logic";
import {
  maxTile,
  comboMult2048,
  TILE_LEVELS,
} from "@/games/entries/game2048/logic";

const NO_INPUT_S = { dir: 0, targetX: null } as ScInput;
const NO_INPUT_B = { dir: 0, targetX: null } as BoInput;

describe("star-catch 关卡与连击", () => {
  it("levelTargetFor 递增", () => {
    expect(levelTargetFor(1)).toBe(10);
    expect(levelTargetFor(2)).toBe(16);
    expect(levelTargetFor(5)).toBe(34);
  });
  it("comboMult 随连击增长且封顶 3 倍", () => {
    expect(comboMult(0)).toBe(1);
    expect(comboMult(4)).toBe(1);
    expect(comboMult(5)).toBe(1.5);
    expect(comboMult(100)).toBe(3);
  });
  it("接够目标数后升关", () => {
    let s = scCreate();
    s = { ...s, caught: 9, combo: 9 };
    // 把星星放到篮子口（BASKET_Y=492, 口在 477~507），确保下一帧接住
    s = { ...s, stars: [{ id: 1, x: s.basketX, y: 490, r: 13, speed: 0 }] };
    const ns = scStep(s, 0.016, NO_INPUT_S);
    expect(ns.caught).toBe(10);
    expect(ns.level).toBe(2);
    expect(ns.cleared).toBe(false);
  });
});

describe("breakout 升关重建砖块", () => {
  it("清空砖块后升到下一关并重建更多砖", () => {
    const s0 = boCreate(1);
    const cleared = { ...s0, bricks: s0.bricks.map((b) => ({ ...b, alive: false })) };
    // 球必须在场内才不触发掉球
    const ns = boStep(cleared, 0.016, NO_INPUT_B);
    expect(ns.level).toBe(2);
    expect(ns.bricks.filter((b) => b.alive).length).toBe(5 * 7);
    expect(ns.won).toBe(false);
  });
  it("最后一关清空后通关", () => {
    const s0 = boCreate(5);
    const cleared = { ...s0, bricks: s0.bricks.map((b) => ({ ...b, alive: false })) };
    const ns = boStep(cleared, 0.016, NO_INPUT_B);
    expect(ns.cleared).toBe(true);
    expect(ns.won).toBe(true);
  });
});

describe("billiard 进洞闯关", () => {
  it("星球落入袋口 → 进洞+连击+重生+计分", () => {
    const s0 = biCreate({ challenge: true });
    const pk = cornerPockets()[0];
    const withPlanetInPocket = {
      ...s0,
      balls: [{ ...s0.balls[0] }, { x: pk.x, y: pk.y, vx: 0, vy: 0 }] as [any, any],
    };
    const ns = biStep(withPlanetInPocket, 0.016);
    expect(ns.potted).toBe(1);
    expect(ns.pottedLevel).toBe(1);
    expect(ns.combo).toBe(1);
    expect(ns.score).toBe(110); // 100 × comboMult(1)=1.1
    expect(ns.balls.length).toBe(2);
    // 重生后不在袋口
    const inAny = cornerPockets().some(
      (p) => Math.hypot(p.x - ns.balls[1].x, p.y - ns.balls[1].y) < p.r
    );
    expect(inAny).toBe(false);
  });
  it("本关进够目标数后升关、补满击球", () => {
    let s = biCreate({ challenge: true });
    // 连进 POT_PER_LEVEL 个
    for (let i = 0; i < POT_PER_LEVEL; i++) {
      const pk = cornerPockets()[i % cornerPockets().length];
      s = {
        ...s,
        balls: [{ ...s.balls[0] }, { x: pk.x, y: pk.y, vx: 0, vy: 0 }] as [any, any],
      };
      s = biStep(s, 0.016);
    }
    expect(s.level).toBe(2);
    expect(s.pottedLevel).toBe(0);
    expect(s.shots).toBe(0); // 升关补满预算
    expect(s.cleared).toBe(false);
  });
  it("最后一关进够目标数后通关", () => {
    let s = biCreate({ challenge: true });
    s = { ...s, level: LEVEL_COUNT };
    for (let i = 0; i < POT_PER_LEVEL; i++) {
      const pk = cornerPockets()[i % cornerPockets().length];
      s = {
        ...s,
        balls: [{ ...s.balls[0] }, { x: pk.x, y: pk.y, vx: 0, vy: 0 }] as [any, any],
      };
      s = biStep(s, 0.016);
    }
    expect(s.cleared).toBe(true);
    expect(s.over).toBe(true);
  });
  it("沙盒模式(默认)不进洞、球不出界", () => {
    const s = biStep(biCreate(), 0.016);
    expect(s.potted).toBe(0);
    expect(s.balls[0].x).toBeGreaterThanOrEqual(16 - 1);
  });
  it("comboMult 封顶 1.8", () => {
    expect(biComboMult(0)).toBe(1);
    expect(biComboMult(20)).toBe(1.8);
  });
});

describe("2048 关卡目标与连击", () => {
  it("maxTile 取最大值", () => {
    expect(maxTile([[2, 4], [8, 16]])).toBe(16);
  });
  it("comboMult2048 封顶 1.8", () => {
    expect(comboMult2048(0)).toBe(1);
    expect(comboMult2048(8)).toBe(1.8);
  });
  it("TILE_LEVELS 共 6 关、末关 2048", () => {
    expect(TILE_LEVELS).toEqual([64, 128, 256, 512, 1024, 2048]);
  });
});
