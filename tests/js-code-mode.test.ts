import { describe, it, expect } from "vitest";
import { getProject } from "@/courses";
import { Runtime } from "@/lib/runtime";
import { computeSteps, isGoalAchieved } from "@/lib/steps";

/**
 * 13-16 代码模式试点（js 分类 · js_square）。
 * 验证：① 代码模式数据字段齐备；② 默认示范代码运行后能通过完成门禁（落笔 + 循环 + 跑完）；
 * ③ 空代码 / 缺循环不能通过（杜绝随便写几行就过关）。
 */
describe("13-16 代码模式试点 · js_square", () => {
  const project = getProject("js_square");
  expect(project).toBeTruthy();
  if (!project) return;

  it("数据字段：codeMode 开启且带 defaultCode", () => {
    expect(project.codeMode).toBe(true);
    expect(typeof project.defaultCode).toBe("string");
    expect(project.defaultCode!.length).toBeGreaterThan(0);
  });

  it("默认示范代码运行后能达成完成条件（落笔 + 循环 + 跑完）", async () => {
    const rt = new Runtime(480, 360, () => {}, undefined, {});
    await rt.runUserCode(project.defaultCode!);
    const state = rt.getState();
    expect(state.log).toContain("[系统] 程序执行完毕");

    const steps = computeSteps(project, project.defaultCode!, state.log);
    expect(steps.every((s) => s.done)).toBe(true);

    expect(isGoalAchieved(project, state, state.log, project.defaultCode!)).toBe(true);

    // 真实画出正方形：至少 4 段笔迹
    const segs = (state.penPaths ?? []).reduce(
      (n, p) => n + Math.max(0, p.points.length - 1),
      0
    );
    expect(segs).toBeGreaterThanOrEqual(4);
  });

  it("空代码不能通过完成门禁", async () => {
    const rt = new Runtime(480, 360, () => {}, undefined, {});
    await rt.runUserCode("");
    const state = rt.getState();
    expect(isGoalAchieved(project, state, state.log, "")).toBe(false);
  });

  it("只落笔不循环不能通过（缺循环绘制）", async () => {
    const code = "__runtime.penDown();\n__runtime.move(100);\n";
    const rt = new Runtime(480, 360, () => {}, undefined, {});
    await rt.runUserCode(code);
    const state = rt.getState();
    expect(isGoalAchieved(project, state, state.log, code)).toBe(false);
  });
});
