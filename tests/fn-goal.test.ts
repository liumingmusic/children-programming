import { describe, it, expect } from "vitest";
import { runDemo, withInstantRaf } from "./exec-helpers";
import { isGoalAchieved } from "@/lib/steps";
import { getProject } from "@/courses";

// 回归守卫：分类 A「函数」项目此前存在「随便搭积木也能通过校验」的缺陷
// （isGoalAchieved 对无 stars / 无目标标记的分类直接 return true）。
// 现在完成判定必须基于真实绘制轨迹：fn_square 要画出「等边+垂直+闭合」的正方形，
// fn_polygon 要画出「闭合多边形」，其余自定义积木至少要有真实笔画。
describe("分类A·函数：完成判定基于真实绘制（不再「随便搭也算过」）", () => {
  it("fn_square：看示范画出正方形 -> isGoalAchieved 通过", async () => {
    await withInstantRaf(async () => {
      const { logs, finalState } = await runDemo("fn_square");
      expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
      expect(finalState.penPaths.length).toBeGreaterThan(0);
      const project = getProject("fn_square")!;
      expect(isGoalAchieved(project, finalState)).toBe(true);
    });
  });

  it("fn_polygon：看示范画出闭合多边形 -> isGoalAchieved 通过", async () => {
    await withInstantRaf(async () => {
      const { logs, finalState } = await runDemo("fn_polygon");
      expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
      const project = getProject("fn_polygon")!;
      expect(isGoalAchieved(project, finalState)).toBe(true);
    });
  });

  // 以下守卫：随便搭的积木绝不能被判定为「完成」。

  it("fn_square：只画一条直线（未闭合）-> 不通过", () => {
    const project = getProject("fn_square")!;
    const state = {
      actor: { x: 100, y: 0 },
      stars: [],
      penPaths: [{ points: [{ x: 0, y: 0 }, { x: 100, y: 0 }] }],
    };
    expect(isGoalAchieved(project, state)).toBe(false);
  });

  it("fn_square：空轨迹（未绘制）-> 不通过", () => {
    const project = getProject("fn_square")!;
    const state = { actor: { x: 0, y: 0 }, stars: [], penPaths: [] };
    expect(isGoalAchieved(project, state)).toBe(false);
  });

  it("fn_square：五边形（5 边，非正方形）-> 不通过", () => {
    const project = getProject("fn_square")!;
    const pent = {
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 150, y: 80 },
        { x: 50, y: 130 },
        { x: -50, y: 80 },
        { x: 0, y: 0 },
      ],
    };
    const state = { actor: { x: 0, y: 0 }, stars: [], penPaths: [pent] };
    expect(isGoalAchieved(project, state)).toBe(false);
  });

  it("fn_square：菱形（4 边等边但不垂直）-> 不通过", () => {
    const project = getProject("fn_square")!;
    const diamond = {
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 150, y: 86 },
        { x: 50, y: 86 },
        { x: 0, y: 0 },
      ],
    };
    const state = { actor: { x: 0, y: 0 }, stars: [], penPaths: [diamond] };
    expect(isGoalAchieved(project, state)).toBe(false);
  });
});
