import { describe, it, expect } from "vitest";
import { getProject, type CourseProject } from "@/courses";
import { Runtime } from "@/lib/runtime";
import { computeSteps, isGoalAchieved } from "@/lib/steps";
import { withInstantRaf } from "./exec-helpers";

/**
 * 13-16 · Q·AI 启蒙（Phase 3b 六项）。
 * 验证：① 数据字段齐备（codeMode + defaultCode + category=ai）；
 * ② 默认示范代码运行后通过完成门禁（computeSteps 全绿 + isGoalAchieved 为真）并真的画出了东西；
 * ③ 空代码 / 缺核心标记不能通过（杜绝随便写几行就过关）；
 * ④ 定向拦截：证明门禁真的在查「对应 AI 概念」。
 */
async function runCode(code: string) {
  const rt = new Runtime(480, 360, () => {}, undefined, {});
  await withInstantRaf(() => rt.runUserCode(code));
  return rt;
}

const AI_SLUGS = [
  "ai_tree",
  "ai_knn",
  "ai_bayes",
  "ai_perceptron",
  "ai_recommend",
  "ai_network",
];

/** 取舞台上最后画的文字（drawText 产物），用于断言算法确实算出了预期结果。 */
function stageTexts(  rt: Runtime): string[] {
  return rt.getState().shapes.filter((s) => s.kind === "text").map((s) => (s as { text: string }).text);
}

describe("13-16 AI 启蒙 · Phase 3b 六项", () => {
  for (const slug of AI_SLUGS) {
    const project = getProject(slug) as CourseProject | undefined;
    expect(project, `缺少项目 ${slug}`).toBeTruthy();
    if (!project) continue;

    it(`${slug}：数据字段齐备（codeMode + defaultCode + category=ai）`, () => {
      expect(project.codeMode).toBe(true);
      expect(typeof project.defaultCode).toBe("string");
      expect(project.defaultCode!.length).toBeGreaterThan(0);
      expect(project.category).toBe("ai");
    });

    it(`${slug}：默认示范代码运行后通过完成门禁，且真的画出了可视化`, async () => {
      const rt = await runCode(project.defaultCode!);
      const state = rt.getState();
      expect(state.log).toContain("[系统] 程序执行完毕");

      const steps = computeSteps(project, project.defaultCode!, state.log);
      const undone = steps.filter((s) => !s.done).map((s) => s.title);
      expect(undone, `${slug} 未完成的步骤：${undone.join("、")}`).toEqual([]);
      expect(isGoalAchieved(project, state, state.log, project.defaultCode!)).toBe(true);
      expect(state.shapes.length, `${slug} 没有画出任何图元`).toBeGreaterThan(0);
      rt.stopLoop();
    });

    it(`${slug}：空代码不能通过完成门禁`, async () => {
      const rt = await runCode("");
      expect(isGoalAchieved(project, rt.getState(), rt.getState().log, "")).toBe(false);
      rt.stopLoop();
    });
  }

  // 定向拦截：证明门禁真的在查「对应 AI 概念」，而非跑完就算过
  it("ai_tree：只有数组和循环、没有决策规则（if）不能通过", async () => {
    const code =
      "const data = [[1, 1, 0], [1, -1, 1], [-1, 1, 0]];\n" +
      "for (let i = 0; i < data.length; i++) {\n" +
      "  __runtime.drawCircle(data[i][0], data[i][1], 8, \"#F59E0B\");\n" +
      "}\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("ai_tree")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("ai_knn：有数据点但不算距离（无 Math.hypot）不能通过", async () => {
    const code =
      "const red = [[1, 1], [2, 2]];\n" +
      "const blue = [[3, 3]];\n" +
      "const all = red.concat(blue);\n" +
      "for (let i = 0; i < all.length; i++) {\n" +
      "  __runtime.drawCircle(all[i][ 0], all[i][1], 8, \"#F59E0B\");\n" +
      "}\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("ai_knn")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("ai_bayes：只画条、不统计词命中（无 msg.includes）不能通过", async () => {
    const code =
      "const spamWords = [\"免费\"];\n" +
      "const normalWords = [\"你好\"];\n" +
      "__runtime.drawRect(-180, -150, 100, 50, \"#DC2626\");\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("ai_bayes")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("ai_perceptron：有数据但不更新权重（无 err 修正）不能通过", async () => {
    const code =
      "const pts = [[-150, -70, 0], [160, 90, 1]];\n" +
      "for (let i = 0; i < pts.length; i++) {\n" +
      "  __runtime.drawCircle(pts[i][0], pts[i][1], 12, \"#F59E0B\");\n" +
      "}\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("ai_perceptron")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("ai_recommend：有向量但不算相似度不能通过", async () => {
    const code =
      "const items = [\"科幻\", \"喜剧\"];\n" +
      "const me = [1, 2];\n" +
      "const users = [[3, 4]];\n" +
      "for (let i = 0; i < me.length; i++) {\n" +
      "  __runtime.drawCircle(i * 20, 0, 5, \"#F59E0B\");\n" +
      "}\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("ai_recommend")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("ai_network：有输入但不做前向传播（无 w1/w2）不能通过", async () => {
    const code =
      "const x = [0.5, 0.8];\n" +
      "const h = [0, 0];\n" +
      "for (let k = 0; k < 2; k++) { h[k] = x[k]; }\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("ai_network")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  // 真实行为校验：AI 项目确实算出了预期结果（以舞台文字为证）
  it("ai_tree：示范代码真的给出分类结果", async () => {
    const rt = await runCode(getProject("ai_tree")!.defaultCode!);
    expect(stageTexts(rt).some((t) => t.includes("分类结果"))).toBe(true);
    rt.stopLoop();
  });

  it("ai_bayes：示范代码真的判定「广告」（命中广告词更多）", async () => {
    const rt = await runCode(getProject("ai_bayes")!.defaultCode!);
    expect(stageTexts(rt).some((t) => t.includes("判定: 广告"))).toBe(true);
    rt.stopLoop();
  });

  it("ai_knn：示范代码真的给出「K=3 最近邻」结论", async () => {
    const rt = await runCode(getProject("ai_knn")!.defaultCode!);
    expect(stageTexts(rt).some((t) => t.includes("K=3 最近邻"))).toBe(true);
    rt.stopLoop();
  });
});
