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
 * 13-16 · Phase 2：画布渲染基建 + M 物理分类 7 项（Phase 2a 试点 2 + Phase 2b 补齐 5）。
 *
 * 这些项目不再用画笔轨迹，而是「变量累积 + 循环 + 每帧 clearCanvas 重画」的模拟循环，
 * 靠新增的 __runtime.drawCircle / drawRect / drawLine / drawText / clearCanvas 画到舞台画布上。
 * 统一验证：① 数据字段齐备；② 示范代码跑通且完成门禁全绿；③ 空代码不能过；
 * ④ 画布图元真的进了 state.shapes（基建生效，而非只跑了个空循环）。
 */
const PHYS_PHASE2_SLUGS = [
  "phys_fall", "phys_bounce", "phys_parabola", "phys_gravity",
  "phys_spring", "phys_orbit", "phys_particle",
];

describe("13-16 画布基建 · Phase 2 物理分类满编（phys 7/7）", () => {
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
      // 每帧都擦过屏重画，所以 shapes 不该无限堆积（clearCanvas 生效）。
      // 上限放宽到 60：phys_parabola / phys_orbit 会在最后一帧重画整条轨迹（约 40 个图元）。
      expect(state.shapes.length).toBeLessThan(60);
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

  it("phys_parabola：只有竖直加速、水平不动不能通过（那还是自由落体）", async () => {
    const code =
      "const g = 300;\nconst dt = 0.05;\nlet y = 100;\nlet vy = 120;\n" +
      "const trailY = [];\n" +
      "for (let f = 0; f < 34; f++) {\n  vy = vy - g * dt;\n  y = y + vy * dt;\n" +
      "  trailY.push(y);\n  __runtime.clearCanvas();\n" +
      '  for (let i = 0; i < trailY.length; i++) __runtime.drawCircle(0, trailY[i], 3, "#64748B");\n' +
      '  __runtime.drawCircle(0, y, 10, "#F59E0B");\n  __runtime.wait(dt);\n}\n';
    const state = await runCode(code);
    // 水平方向没有「x = x + ...」的自更新 → 第 1 步不应通过
    expect(isGoalAchieved(getProject("phys_parabola")!, state, state.log, code)).toBe(false);
  });

  it("phys_gravity：三颗球各写一个变量、不用平行数组不能通过", async () => {
    const code =
      "const dt = 0.05;\nconst ground = -150;\n" +
      "let y1 = 140, y2 = 140, y3 = 140;\nlet v1 = 0, v2 = 0, v3 = 0;\n" +
      "for (let f = 0; f < 30; f++) {\n" +
      "  v1 = v1 - 300 * dt;\n  y1 = y1 + v1 * dt;\n  if (y1 < ground) { y1 = ground; v1 = 0; }\n" +
      "  v2 = v2 - 50 * dt;\n  y2 = y2 + v2 * dt;\n  if (y2 < ground) { y2 = ground; v2 = 0; }\n" +
      "  v3 = v3 - 750 * dt;\n  y3 = y3 + v3 * dt;\n  if (y3 < ground) { y3 = ground; v3 = 0; }\n" +
      "  __runtime.clearCanvas();\n" +
      '  __runtime.drawRect(-240, ground - 40, 480, 40, "#334155");\n' +
      '  __runtime.drawCircle(-140, y1, 12, "#F59E0B");\n' +
      '  __runtime.drawCircle(0, y2, 12, "#E2E8F0");\n' +
      '  __runtime.drawCircle(140, y3, 12, "#38bdf8");\n' +
      "  __runtime.wait(dt);\n}\n";
    const state = await runCode(code);
    // 没有数组字面量、也没有下标赋值 → 第 1 步不应通过（教学目标是「平行数组」）
    expect(isGoalAchieved(getProject("phys_gravity")!, state, state.log, code)).toBe(false);
  });

  it("phys_spring：加速度恒定、不与位移成正比不能通过（那是重力不是弹簧）", async () => {
    const code =
      "const dt = 0.05;\nlet x = 120;\nlet v = 0;\n" +
      "for (let f = 0; f < 56; f++) {\n  v = v - 300 * dt;\n  x = x + v * dt;\n" +
      "  __runtime.clearCanvas();\n" +
      '  __runtime.drawRect(-240, -45, 30, 90, "#475569");\n' +
      '  __runtime.drawCircle(-180 + 130 + x, 0, 12, "#F59E0B");\n' +
      "  __runtime.wait(dt);\n}\n";
    const state = await runCode(code);
    // 速度增量里没引用位移 x → 第 2 步不应通过
    expect(isGoalAchieved(getProject("phys_spring")!, state, state.log, code)).toBe(false);
  });

  it("phys_orbit：不用 cos / sin 换算坐标不能通过", async () => {
    const code =
      "const dt = 0.05;\nlet angle = 0;\n" +
      "for (let f = 0; f < 32; f++) {\n  angle = angle + 4 * dt;\n" +
      "  __runtime.clearCanvas();\n" +
      '  __runtime.drawCircle(0, 0, 12, "#F59E0B");\n' +
      '  __runtime.drawText(-225, 160, "角度：" + angle, "#E2E8F0", 15);\n' +
      "  __runtime.wait(dt);\n}\n";
    const state = await runCode(code);
    // 角度在增加，但没有 Math.cos / Math.sin → 第 1 步不应通过
    expect(isGoalAchieved(getProject("phys_orbit")!, state, state.log, code)).toBe(false);
  });

  it("phys_particle：粒子撞地只停下、不反向不能通过（缺反弹）", async () => {
    const code =
      "const N = 12;\nconst g = 400;\nconst dt = 0.05;\nconst ground = -150;\nconst r = 7;\n" +
      "const px = [];\nconst py = [];\nconst vx = [];\nconst vy = [];\n" +
      "for (let i = 0; i < N; i++) { px.push(-190 + i * 34); py.push(110); vx.push(0); vy.push(0); }\n" +
      "for (let f = 0; f < 50; f++) {\n" +
      "  for (let i = 0; i < N; i++) {\n" +
      "    vy[i] = vy[i] - g * dt;\n    px[i] = px[i] + vx[i] * dt;\n    py[i] = py[i] + vy[i] * dt;\n" +
      "    if (py[i] < ground + r) { py[i] = ground + r; vy[i] = 0; }\n" +
      "  }\n" +
      "  __runtime.clearCanvas();\n" +
      '  __runtime.drawRect(-240, ground - 40, 480, 40, "#334155");\n' +
      '  for (let i = 0; i < N; i++) __runtime.drawCircle(px[i], py[i], r, "#F59E0B");\n' +
      "  __runtime.wait(dt);\n}\n";
    const state = await runCode(code);
    // 有数组、有 if，但速度没有反向 → 第 2 步不应通过
    expect(isGoalAchieved(getProject("phys_particle")!, state, state.log, code)).toBe(false);
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

/**
 * 13-16 · Phase 2c：N 数据可视化分类 7 项（一次铺满）。
 *
 * 与物理模拟不同，这些图大多是**静态**的：画一次就完事，不需要 clearCanvas + wait 的动画循环
 * （只有最后的实时仪表盘需要）。所以判定抓的是「数据 → 视觉属性」的那一步映射，而不是「有没有在动」。
 * 统一验证：① 数据字段齐备；② 示范代码跑通且完成门禁全绿；③ 空代码不能过；
 * ④ 图元真的进了 state.shapes（图表真的被画出来，而不是只跑了段算术）。
 */
const DATAVIZ_PHASE2C_SLUGS = [
  "dataviz_bar", "dataviz_line", "dataviz_pie", "dataviz_weather",
  "dataviz_scores", "dataviz_wordcloud", "dataviz_dashboard",
];

describe("13-16 数据可视化 · Phase 2c 铺满（dataviz 7/7）", () => {
  for (const slug of DATAVIZ_PHASE2C_SLUGS) {
    const project = getProject(slug) as CourseProject | undefined;
    expect(project, `缺少项目 ${slug}`).toBeTruthy();
    if (!project) continue;

    it(`${slug}：数据字段齐备（dataviz 分类 + codeMode + defaultCode）`, () => {
      expect(project.category).toBe("dataviz");
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

    it(`${slug}：图表图元真的进了 state.shapes`, async () => {
      const code = project.defaultCode!;
      const state = await runCode(code);
      expect(state.shapes.length).toBeGreaterThan(0);
      // 静态图一次画完：饼图用 180 条半径线填充扇形，故上限放到 300
      expect(state.shapes.length).toBeLessThan(300);
    }, 15000);
  }

  // 定向拦截：证明门禁校验的是「数据 → 视觉属性」的那一步映射，而不是画了就算过
  it("dataviz_bar：柱子高度写死、不随数据缩放不能通过", async () => {
    const code =
      "const data = [12, 30, 18];\n" +
      "for (let i = 0; i < data.length; i++) {\n" +
      '  __runtime.drawRect(-210 + i * 54, -120, 40, 100, "#F59E0B");\n' +
      "}\n";
    const state = await runCode(code);
    // 高度是写死的 100，没有 data[i] * scale → 第 2 步不应通过
    expect(isGoalAchieved(getProject("dataviz_bar")!, state, state.log, code)).toBe(false);
  });

  it("dataviz_line：只画数据点、不记住上一个点连线不能通过", async () => {
    const code =
      "const data = [8, 15, 12, 22];\n" +
      "for (let i = 0; i < data.length; i++) {\n" +
      '  __runtime.drawCircle(-200 + i * 52, -120 + data[i] * 3.2, 5, "#F59E0B");\n' +
      "}\n";
    const state = await runCode(code);
    // 没有 lastX / lastY 之类「记住上一个点」的变量 → 第 2 步不应通过
    expect(isGoalAchieved(getProject("dataviz_line")!, state, state.log, code)).toBe(false);
  });

  it("dataviz_pie：不用 cos / sin 换算角度不能通过", async () => {
    const code =
      "const data = [30, 45, 25];\n" +
      "let angle = 90;\n" +
      "for (let i = 0; i < data.length; i++) {\n" +
      '  __runtime.drawCircle(-70, 0, 110, "#F59E0B");\n' +
      "  angle = angle + data[i] / 100 * 360;\n" +
      "}\n";
    const state = await runCode(code);
    // 角度在累加，但没有三角函数把角度换成坐标 → 第 2 步不应通过
    expect(isGoalAchieved(getProject("dataviz_pie")!, state, state.log, code)).toBe(false);
  });

  it("dataviz_weather：不算总和、只画柱子不能通过", async () => {
    const code =
      "const temps = [22, 24, 19];\n" +
      "for (let i = 0; i < temps.length; i++) {\n" +
      '  __runtime.drawRect(-180 + i * 52, -110, 36, temps[i] * 4.5, "#38bdf8");\n' +
      '  __runtime.drawText(-180 + i * 52, 10, String(temps[i]), "#E2E8F0", 13);\n' +
      "}\n";
    const state = await runCode(code);
    // 没有「sum = sum + ...」的求平均过程 → 第 1 步不应通过
    expect(isGoalAchieved(getProject("dataviz_weather")!, state, state.log, code)).toBe(false);
  });

  it("dataviz_scores：不做分组计数、直接把每个分数画成柱子不能通过", async () => {
    const code =
      "const scores = [72, 85, 91, 66, 78];\n" +
      "for (let i = 0; i < scores.length; i++) {\n" +
      '  __runtime.drawRect(-190 + i * 80, -120, 60, scores[i] * 1.5, "#38bdf8");\n' +
      "}\n";
    const state = await runCode(code);
    // 没有 counts[k] = counts[k] + 1 的分组计数 → 第 1 步不应通过
    expect(isGoalAchieved(getProject("dataviz_scores")!, state, state.log, code)).toBe(false);
  });

  it("dataviz_wordcloud：字号写死、不随权重变化不能通过", async () => {
    const code =
      'const words = ["代码", "循环", "函数"];\n' +
      "const weights = [32, 27, 24];\n" +
      "for (let i = 0; i < words.length; i++) {\n" +
      '  __runtime.drawText(-100 + i * 80, 0, words[i], "#F59E0B", 20);\n' +
      "}\n";
    const state = await runCode(code);
    // drawText 的字号没取自数组（写死 20）→ 第 2 步不应通过
    expect(isGoalAchieved(getProject("dataviz_wordcloud")!, state, state.log, code)).toBe(false);
  });

  it("dataviz_dashboard：只 push 不 shift、也不逐帧重画不能通过", async () => {
    const code =
      "const data = [];\n" +
      "let t = 0;\n" +
      "for (let f = 0; f < 40; f++) {\n" +
      "  t = t + 0.05;\n" +
      "  data.push(50 + 30 * Math.sin(t * 2));\n" +
      "}\n" +
      "for (let i = 0; i < data.length; i++) {\n" +
      '  __runtime.drawCircle(-200 + i * 20, 0, 4, "#38bdf8");\n' +
      "}\n";
    const state = await runCode(code);
    // 没有 shift（不做滑动窗口）、也没有 clearCanvas + wait（不逐帧重画）→ 第 2 步不应通过
    expect(isGoalAchieved(getProject("dataviz_dashboard")!, state, state.log, code)).toBe(false);
  });
});

/**
 * 13-16 · Phase 2d：O 创意编程分类 6 项（一次铺满）。
 *
 * 这里不追求「算得对」，而是让学生体会「几条规则就能生成复杂图案」。
 * 判定抓的是各自的**生成机制**（对称复制 / 随机 / 参数方程 / 递归 / 多频叠加 / 阻尼），
 * 而不是「画了多少个图元」。前 5 项是静态作品，只有粒子烟花需要逐帧重画。
 */
const CREATIVE_PHASE2D_SLUGS = [
  "creative_mandala", "creative_random", "creative_generative",
  "creative_tree", "creative_terrain", "creative_firework",
];

describe("13-16 创意编程 · Phase 2d 铺满（creative 6/6）", () => {
  for (const slug of CREATIVE_PHASE2D_SLUGS) {
    const project = getProject(slug) as CourseProject | undefined;
    expect(project, `缺少项目 ${slug}`).toBeTruthy();
    if (!project) continue;

    it(`${slug}：数据字段齐备（creative 分类 + codeMode + defaultCode）`, () => {
      expect(project.category).toBe("creative");
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

    it(`${slug}：作品图元真的进了 state.shapes`, async () => {
      const code = project.defaultCode!;
      const state = await runCode(code);
      expect(state.shapes.length).toBeGreaterThan(0);
      // 生成艺术有 377 个点、分形树有 127 条线段，故上限放到 500
      expect(state.shapes.length).toBeLessThan(500);
    }, 15000);
  }

  // 定向拦截：证明门禁校验的是「生成机制」，而不是画了东西就算过
  it("creative_mandala：不用数组描述各层参数不能通过", async () => {
    const code =
      "for (let i = 0; i < 8; i++) {\n" +
      "  const a = i / 8 * Math.PI * 2;\n" +
      '  __runtime.drawCircle(60 * Math.cos(a), 60 * Math.sin(a), 7, "#F59E0B");\n' +
      "}\n";
    const state = await runCode(code);
    // 只是手画了一圈，没有用数组描述各层 → 第 1 步不应通过
    expect(isGoalAchieved(getProject("creative_mandala")!, state, state.log, code)).toBe(false);
  });

  it("creative_random：不用随机数、纯手画图案不能通过", async () => {
    const code =
      "for (let ring = 0; ring < 5; ring++) {\n" +
      "  for (let i = 0; i < 12; i++) {\n" +
      "    const a = i / 12 * Math.PI * 2;\n" +
      "    const R = 40 + ring * 26;\n" +
      '    __runtime.drawCircle(R * Math.cos(a), R * Math.sin(a), 4, "#F59E0B");\n' +
      "  }\n" +
      "}\n";
    const state = await runCode(code);
    // 一次 Math.random 都没有 → 第 1 步不应通过
    expect(isGoalAchieved(getProject("creative_random")!, state, state.log, code)).toBe(false);
  });

  it("creative_generative：普通单参数三角函数、不是参数方程不能通过", async () => {
    const code =
      "for (let t = 0; t < 377; t++) {\n" +
      "  const a = t * 0.05;\n" +
      '  __runtime.drawCircle(100 * Math.cos(a), 100 * Math.sin(a), 2.5, "#F59E0B");\n' +
      "}\n";
    const state = await runCode(code);
    // 只有一个普通圆，没有嵌套的参数方程（Math.cos(k * a) 型）→ 第 1 步不应通过
    expect(isGoalAchieved(getProject("creative_generative")!, state, state.log, code)).toBe(false);
  });

  it("creative_tree：定义了函数但不调用自己（无递归）不能通过", async () => {
    const code =
      "function branch(x, y, angle, len) {\n" +
      "  const rad = angle * Math.PI / 180;\n" +
      '  __runtime.drawLine(x, y, x + len * Math.cos(rad), y + len * Math.sin(rad), "#22C55E", 3);\n' +
      "}\n" +
      "branch(0, -170, 90, 72);\n" +
      "branch(0, -170, 60, 60);\n" +
      "branch(0, -170, 120, 60);\n";
    const state = await runCode(code);
    // 有函数、也画了线，但函数内部没有调用自己 → 第 2 步不应通过
    expect(isGoalAchieved(getProject("creative_tree")!, state, state.log, code)).toBe(false);
  });

  it("creative_terrain：只用一个频率的波、不是噪声叠加不能通过", async () => {
    const code =
      "for (let x = -240; x <= 240; x = x + 8) {\n" +
      "  const h = 46 * Math.sin(x * 0.018);\n" +
      '  __runtime.drawLine(x, -50 + h, x, -180, "#22C55E", 8);\n' +
      "}\n";
    const state = await runCode(code);
    // 只有一个频率，没有多频叠加 → 第 1 步不应通过
    expect(isGoalAchieved(getProject("creative_terrain")!, state, state.log, code)).toBe(false);
  });

  it("creative_firework：有重力但没有阻尼（不衰减）不能通过", async () => {
    const code =
      "const N = 24;\nconst g = 55;\nconst dt = 0.05;\n" +
      "const px = [], py = [], vx = [], vy = [];\n" +
      "for (let i = 0; i < N; i++) {\n" +
      "  const a = i / N * Math.PI * 2;\n" +
      "  px.push(0); py.push(20);\n" +
      "  vx.push(60 * Math.cos(a)); vy.push(60 * Math.sin(a));\n" +
      "}\n" +
      "for (let f = 0; f < 20; f++) {\n" +
      "  for (let i = 0; i < N; i++) {\n" +
      "    vy[i] = vy[i] - g * dt;\n" +
      "    px[i] = px[i] + vx[i] * dt;\n    py[i] = py[i] + vy[i] * dt;\n" +
      "  }\n" +
      "  __runtime.clearCanvas();\n" +
      '  for (let i = 0; i < N; i++) __runtime.drawCircle(px[i], py[i], 4, "#F59E0B");\n' +
      "  __runtime.wait(dt);\n" +
      "}\n";
    const state = await runCode(code);
    // 粒子只会越掉越快、一瞬间飞出画面——没有 v = v * 0.97 的阻尼 → 第 2 步不应通过
    expect(isGoalAchieved(getProject("creative_firework")!, state, state.log, code)).toBe(false);
  });
});
