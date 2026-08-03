import { describe, expect, it } from "vitest";
import {
  W,
  H,
  SHIP_W,
  createState,
  rectCircleHit,
  step,
} from "@/games/entries/planet-race/logic";

describe("planet-race logic", () => {
  it("createState 默认处于存活、居中、零分", () => {
    const s = createState();
    expect(s.alive).toBe(true);
    expect(s.shipX).toBe(W / 2);
    expect(s.score).toBe(0);
    expect(s.obstacles).toHaveLength(0);
  });

  it("rectCircleHit 矩形内含圆时为 true，远离时为 false", () => {
    expect(rectCircleHit(0, 0, 10, 10, 5, 5, 3)).toBe(true);
    expect(rectCircleHit(0, 0, 10, 10, 100, 100, 3)).toBe(false);
  });

  it("step 推进后得分增加且障碍下移", () => {
    const s = createState();
    const withRock = {
      ...s,
      obstacles: [{ id: 1, x: 100, y: 0, r: 16, kind: "rock" as const }],
    };
    const ns = step(withRock, 0.1, { dir: 0, targetX: null });
    expect(ns.score).toBeGreaterThan(0);
    expect(ns.obstacles[0].y).toBeCloseTo(19, 0); // BASE_SPEED=190 * 0.1
  });

  it("step 把越界障碍剔除", () => {
    const s = createState();
    const off = {
      ...s,
      obstacles: [{ id: 1, x: 100, y: H + 30, r: 16, kind: "rock" as const }],
    };
    const ns = step(off, 0.016, { dir: 0, targetX: null });
    expect(ns.obstacles).toHaveLength(0);
  });

  it("飞船被陨石击中后不再存活", () => {
    const s = createState();
    const hit = {
      ...s,
      // 陨石正好压在飞船中心（SHIP_Y - SHIP_H/2 .. +SHIP_H/2）
      obstacles: [{ id: 1, x: W / 2, y: 540 - 80, r: 16, kind: "rock" as const }],
    };
    const ns = step(hit, 0.016, { dir: 0, targetX: null });
    expect(ns.alive).toBe(false);
  });

  it("飞船横向移动被边界夹紧", () => {
    const s = { ...createState(), shipX: 10 };
    const ns = step(s, 1, { dir: -1, targetX: null });
    expect(ns.shipX).toBeGreaterThanOrEqual(SHIP_W / 2);
  });
});
