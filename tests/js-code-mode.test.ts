import { describe, it, expect } from "vitest";
import { getProject, type CourseProject } from "@/courses";
import { Runtime } from "@/lib/runtime";
import { computeSteps, isGoalAchieved } from "@/lib/steps";
import { withInstantRaf } from "./exec-helpers";

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

/**
 * 13-16 代码模式 · Phase 1 铺满的 7 个 js 项目。
 * 每个项目瞄准一个 JS 语言概念（输出 / 变量 / 函数 / 数组 / 计算工具 / 画布换色 / 积木→代码综合）。
 * 统一验证：① 数据字段齐备；② 默认示范代码运行后通过完成门禁；③ 空代码不能通过（杜绝随便写几行过关）。
 * 执行用 withInstantRaf 塌缩动画，避免真实播放时长拖慢测试。
 */
async function runCode(code: string) {
  const rt = new Runtime(480, 360, () => {}, undefined, {});
  await withInstantRaf(() => rt.runUserCode(code));
  return rt.getState();
}

const JS_PHASE1_SLUGS = [
  "js_hello", "js_variable", "js_function", "js_array", "js_tool", "js_canvas", "js_compare",
];

describe("13-16 代码模式 · Phase 1 七项（js 分类铺满）", () => {
  for (const slug of JS_PHASE1_SLUGS) {
    const project = getProject(slug) as CourseProject | undefined;
    expect(project, `缺少项目 ${slug}`).toBeTruthy();
    if (!project) continue;

    it(`${slug}：数据字段齐备（codeMode 开启 + 有 defaultCode）`, () => {
      expect(project.codeMode).toBe(true);
      expect(typeof project.defaultCode).toBe("string");
      expect(project.defaultCode!.length).toBeGreaterThan(0);
    });

    it(`${slug}：默认示范代码运行后通过完成门禁`, async () => {
      const code = project.defaultCode!;
      const state = await runCode(code);
      expect(state.log).toContain("[系统] 程序执行完毕");

      const steps = computeSteps(project, code, state.log);
      const undone = steps.filter((s) => !s.done).map((s) => s.title);
      expect(undone, `${slug} 未完成的步骤：${undone.join("、")}`).toEqual([]);
      expect(isGoalAchieved(project, state, state.log, code)).toBe(true);
    });

    it(`${slug}：空代码不能通过完成门禁`, async () => {
      const state = await runCode("");
      expect(isGoalAchieved(project, state, state.log, "")).toBe(false);
    });
  }

  // 定向拦截：证明门禁是真的在校验「对应概念」，而不是跑完就算过
  it("js_hello：只写注释没输出不能通过（必须真的 say）", async () => {
    const code = "// 我只写了注释，什么也没做\n";
    const state = await runCode(code);
    expect(isGoalAchieved(getProject("js_hello")!, state, state.log, code)).toBe(false);
  });

  it("js_function：只画图不定义函数不能通过（必须有 function）", async () => {
    const code = "__runtime.penDown();\nfor (let i = 0; i < 4; i++) {\n  __runtime.move(80);\n  __runtime.turn(90);\n}\n";
    const state = await runCode(code);
    expect(isGoalAchieved(getProject("js_function")!, state, state.log, code)).toBe(false);
  });

  it("js_canvas：循环里不换色不能通过（必须用到换色指令）", async () => {
    const code = "__runtime.penDown();\nfor (let i = 0; i < 4; i++) {\n  __runtime.move(80);\n  __runtime.turn(90);\n}\n";
    const state = await runCode(code);
    expect(isGoalAchieved(getProject("js_canvas")!, state, state.log, code)).toBe(false);
  });

  it("js_variable：数字写死、变量没用进画图指令不能通过（不能靠循环计数器蒙混）", async () => {
    const code = "__runtime.penDown();\nfor (let i = 0; i < 4; i++) {\n  __runtime.move(120);\n  __runtime.turn(90);\n}\n";
    const state = await runCode(code);
    // for 循环的 let i 也算「声明了变量」，但 move/turn 用的是写死的数字 → 第 2 步不应通过
    expect(isGoalAchieved(getProject("js_variable")!, state, state.log, code)).toBe(false);
  });
});
