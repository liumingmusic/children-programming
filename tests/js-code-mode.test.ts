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

/**
 * 13-16 · Phase 2：画布渲染基建 + M 物理分类试点（phys_fall / phys_bounce）。
 *
 * 这两个项目不再用画笔轨迹，而是「变量累积 + 循环 + 每帧 clearCanvas 重画」的模拟循环，
 * 靠新增的 __runtime.drawCircle / drawRect / drawLine / drawText / clearCanvas 画到舞台画布上。
 * 统一验证：① 数据字段齐备；② 示范代码跑通且完成门禁全绿；③ 空代码不能过；
 * ④ 画布图元真的进了 state.shapes（基建生效，而非只跑了个空循环）。
 */
const PHYS_PHASE2_SLUGS = ["phys_fall", "phys_bounce"];

describe("13-16 画布基建 · Phase 2 物理试点（phys 分类）", () => {
  for (const slug of PHYS_PHASE2_SLUGS) {
    const project = getProject(slug) as CourseProject | undefined;
    expect(project, `缺少项目 ${slug}`).toBeTruthy();
    if (!project) continue;

    it(`${slug}：数据字段齐备（phys 分类 + codeMode + defaultCode）`, () => {
      expect(project.category).toBe("phys");
      expect(project.codeMode).toBe(true);
      expect(typeof project.defaultCode).toBe("string");
      expect(project.defaultCode!.length).toBeGreaterThan(0);
    });

    it(`${slug}：示范代码跑通，完成门禁全绿`, async () => {
      const code = project.defaultCode!;
      const state = await runCode(code);
      expect(state.log).toContain("[系统] 程序执行完毕");

      const steps = computeSteps(project, code, state.log);
      const undone = steps.filter((s) => !s.done).map((s) => s.title);
      expect(undone, `${slug} 未完成的步骤：${undone.join("、")}`).toEqual([]);
      expect(isGoalAchieved(project, state, state.log, code)).toBe(true);
    }, 15000);

    it(`${slug}：空代码不能通过完成门禁`, async () => {
      const state = await runCode("");
      expect(isGoalAchieved(project, state, state.log, "")).toBe(false);
    });

    it(`${slug}：画布图元真的进了 state.shapes（基建生效）`, async () => {
      const code = project.defaultCode!;
      const state = await runCode(code);
      // clearCanvas + 每帧重画：跑完时最后一帧的图元应留在画布上
      expect(state.shapes.length).toBeGreaterThan(0);
      // 最后一帧必须擦过屏重画，因此 shapes 不该无限堆积（clearCanvas 生效）
      expect(state.shapes.length).toBeLessThan(20);
    }, 15000);
  }

  // 定向拦截：证明门禁校验的是「模拟循环」本身，而不是跑完就算过
  it("phys_fall：只画一个静止的球、不做逐帧模拟不能通过", async () => {
    const code = '__runtime.drawCircle(0, 0, 12, "#38bdf8");\n';
    const state = await runCode(code);
    expect(isGoalAchieved(getProject("phys_fall")!, state, state.log, code)).toBe(false);
  });

  it("phys_fall：循环里只重画、不更新速度/位置不能通过", async () => {
    const code =
      'let y = 150;\nlet v = 0;\nfor (let f = 0; f < 36; f++) {\n' +
      '  __runtime.clearCanvas();\n  __runtime.drawCircle(0, y, 12, "#38bdf8");\n' +
      "  __runtime.wait(0.05);\n}\n";
    const state = await runCode(code);
    expect(isGoalAchieved(getProject("phys_fall")!, state, state.log, code)).toBe(false);
  });

  it("phys_bounce：有下落但没有碰撞反弹不能通过（缺 if + 速度反向）", async () => {
    const code =
      "let y = 80;\nlet v = 0;\nconst g = 800;\nconst dt = 0.05;\n" +
      "for (let f = 0; f < 50; f++) {\n  v = v - g * dt;\n  y = y + v * dt;\n" +
      '  __runtime.clearCanvas();\n  __runtime.drawCircle(0, y, 12, "#F59E0B");\n' +
      "  __runtime.wait(dt);\n}\n";
    const state = await runCode(code);
    expect(isGoalAchieved(getProject("phys_bounce")!, state, state.log, code)).toBe(false);
  });
});

/** 画布绘制原语（Phase 2 基建）直接对 Runtime 的行为契约。 */
describe("画布绘制原语 · drawRect / drawCircle / drawLine / drawText / clearCanvas", () => {
  it("五个原语按调用顺序写入 state.shapes，clearCanvas 整体清空", async () => {
    const code =
      '__runtime.drawRect(-100, -50, 200, 100, "#334155");\n' +
      '__runtime.drawCircle(0, 0, 12, "#F59E0B");\n' +
      '__runtime.drawLine(-50, 0, 50, 0, "#38bdf8", 4);\n' +
      '__runtime.drawText(-80, 60, "hello", "#FFFFFF", 16);\n';
    const state = await runCode(code);
    expect(state.shapes.map((s) => s.kind)).toEqual(["rect", "circle", "line", "text"]);
    expect(state.shapes[0]).toMatchObject({ x: -100, y: -50, w: 200, h: 100, color: "#334155" });
    expect(state.shapes[1]).toMatchObject({ x: 0, y: 0, r: 12, color: "#F59E0B" });
    // 线段在 shapes 里统一用 x/y 表示起点、x2/y2 表示终点（与 rect/circle 共用 x/y 字段）
    expect(state.shapes[2]).toMatchObject({ x: -50, y: 0, x2: 50, y2: 0, width: 4, color: "#38bdf8" });
    expect(state.shapes[3]).toMatchObject({ text: "hello", size: 16 });

    const cleared = await runCode(code + "__runtime.clearCanvas();\n");
    expect(cleared.shapes).toEqual([]);
  });

  it("绘制原语刻意不打日志（动画每帧画图不会刷爆日志面板）", async () => {
    const code = '__runtime.drawCircle(0, 0, 12, "#F59E0B");\n';
    const state = await runCode(code);
    const drawLogs = state.log.filter((l) => /draw|画圆|矩形|文字/.test(l));
    expect(drawLogs).toEqual([]);
  });
});
