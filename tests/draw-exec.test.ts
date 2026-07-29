import { describe, it, expect } from "vitest";
import { runDemo, withInstantRaf, totalPoints, normAngle } from "./exec-helpers";

// 分类 2（循环）与分类 3（画笔艺术）共 15 个「看示范」项目。
// 这些此前只过了 codegen 测试（能生成 JS），未做过端到端运行时验证，
// 存在「判定过、实际跑偏/画不出」的隐患（见 AGENTS.md §4）。
// 本文件用真实 Runtime 把 defaultXml 真跑一遍，断言确实画出图形、且几何正确。
const DRAW_SLUGS = [
  "pentagon", "spin", "stairs", "wave", "spiral", "fence", "windmill", "pickfruit",
  "snowflake", "mandala", "concentric", "connectdot", "house", "letter", "checkerboard",
];

// 这 11 个项目的轨迹是「闭合/对称回中心」的，执行完演员应回到原点附近、方向复原为 90°。
// （fence 终点≈(100,300)、checkerboard 终点≈(200,0)、wave 为开口飘移波浪线，均不回原点，单独处理）
const RETURNS_TO_ORIGIN = new Set([
  "pentagon", "spin", "stairs", "windmill", "pickfruit",
  "snowflake", "mandala", "concentric", "connectdot", "house", "letter",
]);

describe("分类2/3·端到端真实运行（看示范必须真能画出图形）", () => {
  for (const slug of DRAW_SLUGS) {
    it(`${slug}：看示范能真实跑完、无报错、画出笔画、三步全亮`, async () => {
      await withInstantRaf(async () => {
        const { logs, finalState, steps } = await runDemo(slug);
        // 1) 真实执行收尾，且无运行时报错（生成 JS 里若有 throw 会被 runScript 捕获并记录）
        expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
        expect(logs.some((l) => l.includes("程序出错"))).toBe(false);
        // 2) 三步进度全部完成（孩子点运行/看示范后弹「完成」）
        expect(steps.every((s) => s.done)).toBe(true);
        // 3) 确实画出了笔画（排除「判定过但画不出线」的 pen bug / 空路径）
        expect(finalState.penPaths.length).toBeGreaterThanOrEqual(1);
        const drew = finalState.penPaths.some((p) => p.points.length >= 2);
        expect(drew).toBe(true);
        expect(totalPoints(finalState)).toBeGreaterThanOrEqual(5);
      });
    });
  }

  describe("闭合/对称图形：执行完应回到原点附近、方向复原 90°", () => {
    for (const slug of RETURNS_TO_ORIGIN) {
      it(`${slug}：回到原点附近且方向 ≡ 90°`, async () => {
        await withInstantRaf(async () => {
          const { finalState } = await runDemo(slug);
          expect(finalState.actor.x).toBeCloseTo(0, 1);
          expect(finalState.actor.y).toBeCloseTo(0, 1);
          expect(normAngle(finalState.actor.angle)).toBeCloseTo(90, 1);
        });
      });
    }

    it("fence：方向复原 90°（不要求回原点）", async () => {
      await withInstantRaf(async () => {
        const { finalState } = await runDemo("fence");
        expect(normAngle(finalState.actor.angle)).toBeCloseTo(90, 1);
      });
    });

    it("checkerboard：方向复原 90°（不要求回原点）", async () => {
      await withInstantRaf(async () => {
        const { finalState } = await runDemo("checkerboard");
        expect(normAngle(finalState.actor.angle)).toBeCloseTo(90, 1);
      });
    });
  });
});
