import { describe, it, expect } from "vitest";
import {
  W as GW,
  H as GH,
  BALL_R as GR,
  PADDLE_W,
  MAX_LIVES,
  createState as gbCreate,
  step as gbStep,
  type Input as GbInput,
} from "@/games/entries/gravity-bounce/logic";
import {
  W as BW,
  H as BH,
  BALL_R as BR,
  createState as biCreate,
  step as biStep,
  shoot,
  resolveCollision,
} from "@/games/entries/billiard/logic";

const DT = 1 / 60;

describe("gravity-bounce 物理与边界", () => {
  it("小球始终在画面内、数值有限", () => {
    let s = gbCreate();
    const input: GbInput = { dir: 0, targetX: GW / 2 };
    for (let i = 0; i < 800; i++) s = gbStep(s, DT, input);
    expect(Number.isFinite(s.x)).toBe(true);
    expect(Number.isFinite(s.y)).toBe(true);
    expect(s.x).toBeGreaterThanOrEqual(GR - 1);
    expect(s.x).toBeLessThanOrEqual(GW - GR + 1);
    expect(s.lives).toBeGreaterThanOrEqual(0);
    expect(s.lives).toBeLessThanOrEqual(MAX_LIVES);
  });

  it("挡板跟随小球时能接到球，弹跳次数增加且得分=弹跳×10", () => {
    let s = gbCreate();
    // 模拟玩家：让挡板始终跟在小球的水平位置下方
    for (let i = 0; i < 1200; i++) {
      const input: GbInput = { dir: 0, targetX: s.x };
      s = gbStep(s, DT, input);
    }
    expect(s.bounces).toBeGreaterThan(0);
    expect(s.score).toBe(s.bounces * 10);
  });

  it("完全漏接会扣除生命直至结束", () => {
    let s = {
      ...gbCreate(),
      x: GW - 20,
      y: GH - 30,
      vx: 0,
      vy: 300,
      paddleX: PADDLE_W / 2,
      lives: 1,
    };
    const input: GbInput = { dir: 0, targetX: PADDLE_W / 2 };
    let died = false;
    for (let i = 0; i < 200; i++) {
      s = gbStep(s, DT, input);
      if (!s.alive) {
        died = true;
        break;
      }
    }
    expect(died).toBe(true);
    expect(s.alive).toBe(false);
  });
});

describe("billiard 弹性碰撞与边界", () => {
  it("正碰后动量守恒、星球获得速度、白球减速", () => {
    const s0 = biCreate();
    s0.balls[0].x = 100;
    s0.balls[0].y = 200;
    s0.balls[0].vx = 320;
    s0.balls[0].vy = 0;
    s0.balls[1].x = 200;
    s0.balls[1].y = 200;
    s0.balls[1].vx = 0;
    s0.balls[1].vy = 0;

    let s = s0;
    let prev = s;
    let hit = false;
    for (let i = 0; i < 40; i++) {
      prev = s;
      s = biStep(s, DT);
      if (s.collisions > 0) {
        hit = true;
        break;
      }
    }
    expect(hit).toBe(true);
    expect(s.balls[1].vx).toBeGreaterThan(50);
    expect(s.balls[0].vx).toBeLessThan(320);
    // 碰撞瞬间动量守恒：比较碰撞前一刻（prev）与碰撞后（s）的总动量，
    // 仅相差该一步的摩擦（约 0.4%），碰撞本身严格守恒。
    const pPrev = prev.balls[0].vx + prev.balls[1].vx;
    const pAfter = s.balls[0].vx + s.balls[1].vx;
    expect(Math.abs(pAfter - pPrev)).toBeLessThan(0.01 * Math.abs(pPrev) + 1);
  });

  it("两球始终在桌面内", () => {
    let s = shoot(biCreate(), 300, 100);
    for (let i = 0; i < 400; i++) s = biStep(s, DT);
    for (const b of s.balls) {
      expect(b.x).toBeGreaterThanOrEqual(BR - 1);
      expect(b.x).toBeLessThanOrEqual(BW - BR + 1);
      expect(b.y).toBeGreaterThanOrEqual(BR - 1);
      expect(b.y).toBeLessThanOrEqual(BH - BR + 1);
    }
  });

  it("resolveCollision 在相距过远时不触发", () => {
    const a = { x: 100, y: 100, vx: -100, vy: 0 };
    const b = { x: 200, y: 100, vx: 0, vy: 0 };
    expect(resolveCollision(a, b)).toBe(false);
  });
});
