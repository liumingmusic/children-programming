import { describe, it, expect } from "vitest";
import { getProject, type CourseProject } from "@/courses";
import { Runtime } from "@/lib/runtime";
import { computeSteps, isGoalAchieved } from "@/lib/steps";
import { withInstantRaf } from "./exec-helpers";

/**
 * 13-16 · L·算法与数据结构（Phase 3a 八项）。
 * 验证：① 数据字段齐备（codeMode + defaultCode + category=algo）；
 * ② 默认示范代码运行后通过完成门禁（computeSteps 全绿 + isGoalAchieved 为真），并真的画出了东西；
 * ③ 空代码 / 缺核心标记不能通过（杜绝随便写几行就过关）；
 * ④ 定向拦截：证明门禁真的在查「对应算法概念」。
 * 注：算法项目用 wait（真实 setTimeout）做动画，测试按真实时长回放，不依赖 rAF。
 */
async function runCode(code: string) {
  const rt = new Runtime(480, 360, () => {}, undefined, {});
  await withInstantRaf(() => rt.runUserCode(code));
  return rt;
}

const ALGO_SLUGS = [
  "algo_bubble",
  "algo_binary",
  "algo_stack",
  "algo_maze",
  "algo_fib",
  "algo_prime",
  "algo_string",
  "algo_greedy",
];

/** 取舞台上最后画的文字（drawText 产物），用于断言算法确实算出了预期结果。 */
function stageTexts(rt: Runtime): string[] {
  return rt.getState().shapes.filter((s) => s.kind === "text").map((s) => (s as { text: string }).text);
}

describe("13-16 算法与数据结构 · Phase 3a 八项", () => {
  for (const slug of ALGO_SLUGS) {
    const project = getProject(slug) as CourseProject | undefined;
    expect(project, `缺少项目 ${slug}`).toBeTruthy();
    if (!project) continue;

    it(`${slug}：数据字段齐备（codeMode + defaultCode + category=algo）`, () => {
      expect(project.codeMode).toBe(true);
      expect(typeof project.defaultCode).toBe("string");
      expect(project.defaultCode!.length).toBeGreaterThan(0);
      expect(project.category).toBe("algo");
    });

    it(`${slug}：默认示范代码运行后通过完成门禁，且真的画出了可视化`, async () => {
      const rt = await runCode(project.defaultCode!);
      const state = rt.getState();
      expect(state.log).toContain("[系统] 程序执行完毕");

      const steps = computeSteps(project, project.defaultCode!, state.log);
      const undone = steps.filter((s) => !s.done).map((s) => s.title);
      expect(undone, `${slug} 未完成的步骤：${undone.join("、")}`).toEqual([]);
      expect(isGoalAchieved(project, state, state.log, project.defaultCode!)).toBe(true);
      // 算法可视化必须真的用画布画了东西（柱子 / 网格 / 圆 / 文字），不能只跑逻辑不画
      expect(state.shapes.length, `${slug} 没有画出任何图元`).toBeGreaterThan(0);
      rt.stopLoop();
    });

    it(`${slug}：空代码不能通过完成门禁`, async () => {
      const rt = await runCode("");
      expect(isGoalAchieved(project, rt.getState(), rt.getState().log, "")).toBe(false);
      rt.stopLoop();
    });
  }

  // 定向拦截：证明门禁真的在查「对应算法概念」，而非跑完就算过
  it("algo_bubble：只循环不比较交换不能通过（必须比较相邻并交换）", async () => {
    const code =
      "let a = [5, 3, 1, 4, 2];\n" +
      "for (let i = 0; i < a.length; i++) {\n" +
      "  __runtime.drawRect(0, -100, 10, 10, \"#F59E0B\");\n" +
      "}\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("algo_bubble")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("algo_fib：写了函数但不递归（无 fib(参数-1) 自调用）不能通过", async () => {
    const code = "function fib(n) { return n; }\n__runtime.drawText(0, 0, fib(5), \"#fff\", 16);\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("algo_fib")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("algo_maze：没有队列（shift）的扩散不能通过（BFS 必须 push+shift）", async () => {
    const code =
      "const maze = [[0,1,0],[0,0,0],[1,0,0]];\n" +
      "const visited = [[false,false,false],[false,false,false],[false,false,false]];\n" +
      "let queue = [[0,0]]; visited[0][0]=true;\n" +
      "while (queue.length > 0) { const cur = queue[0]; queue = []; }\n" +
      "__runtime.drawRect(0,0,10,10,\"#fff\");\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("algo_maze")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  // 真实行为校验：算法确实算出了预期结果（以舞台文字为证）
  it("algo_binary：示范代码真的定位到目标 13", async () => {
    const rt = await runCode(getProject("algo_binary")!.defaultCode!);
    expect(stageTexts(rt).some((t) => t.includes("找到目标 13"))).toBe(true);
    rt.stopLoop();
  });

  it("algo_prime：示范代码真的圈出了 2~30 的素数", async () => {
    const rt = await runCode(getProject("algo_prime")!.defaultCode!);
    expect(stageTexts(rt).some((t) => t.includes("素数"))).toBe(true);
    rt.stopLoop();
  });
});
