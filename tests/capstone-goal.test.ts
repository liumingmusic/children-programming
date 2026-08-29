import { describe, it, expect } from "vitest";
import { getProject, type CourseProject } from "@/courses";
import { Runtime } from "@/lib/runtime";
import { computeSteps, isGoalAchieved } from "@/lib/steps";
import { withInstantRaf } from "./exec-helpers";

/**
 * 13-16 · R·毕业项目（Phase 3c 五项）。
 * 验证：① 数据字段齐备（codeMode + defaultCode + category=capstone）；
 * ② 默认示范代码运行后通过完成门禁（computeSteps 全绿 + isGoalAchieved 为真）并真的画出了东西；
 * ③ 空代码 / 缺核心标记不能通过（杜绝随便写几行就过关）；
 * ④ 定向拦截：证明门禁真的在查「对应毕业项目概念」。
 */
async function runCode(code: string) {
  const rt = new Runtime(480, 360, () => {}, undefined, {});
  await withInstantRaf(() => rt.runUserCode(code));
  return rt;
}

const CAPSTONE_SLUGS = [
  "capstone_game",
  "capstone_data",
  "capstone_tool",
  "capstone_oss",
  "capstone_portfolio",
];

describe("13-16 毕业项目 · Phase 3c 五项", () => {
  for (const slug of CAPSTONE_SLUGS) {
    const project = getProject(slug) as CourseProject | undefined;
    expect(project, `缺少项目 ${slug}`).toBeTruthy();
    if (!project) continue;

    it(`${slug}：数据字段齐备（codeMode + defaultCode + category=capstone）`, () => {
      expect(project.codeMode).toBe(true);
      expect(typeof project.defaultCode).toBe("string");
      expect(project.defaultCode!.length).toBeGreaterThan(0);
      expect(project.category).toBe("capstone");
    });

    it(`${slug}：默认示范代码运行后通过完成门禁，且真的画出了作品`, async () => {
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

  // 定向拦截：证明门禁真的在查「对应概念」，而非跑完就算过
  it("capstone_game：只有数组和静态绘制、没有逐帧循环不能通过", async () => {
    const code =
      "const coins = [{ x: 0, y: 0 }];\n" +
      "__runtime.drawText(-200, 158, \"接金币\", \"#1F2937\", 18);\n" +
      "__runtime.drawCircle(0, 0, 9, \"#FBBF24\");\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("capstone_game")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("capstone_data：只有数据没有循环绘制不能通过", async () => {
    const code =
      "const temps = [22, 26, 24];\n" +
      "__runtime.drawText(-200, 160, \"数据\", \"#1F2937\", 18);\n" +
      "__runtime.drawRect(0, -150, 30, 100, \"#22C55E\");\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("capstone_data")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("capstone_tool：只有循环绘制、没有工具函数不能通过", async () => {
    const code =
      "for (let i = 0; i < 5; i++) { __runtime.drawCircle(i * 30, 0, 6, \"#F59E0B\"); }\n" +
      "__runtime.drawText(-200, 160, \"工具\", \"#1F2937\", 18);\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("capstone_tool")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("capstone_oss：只有循环绘制、没有通用函数库不能通过", async () => {
    const code =
      "for (let i = 0; i <= 10; i++) { __runtime.drawCircle(i * 30 - 180, 100, 8, \"#22C55E\"); }\n" +
      "__runtime.drawText(-200, 160, \"库\", \"#1F2937\", 18);\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("capstone_oss")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("capstone_portfolio：只有静态卡片、没有循环批量生成不能通过", async () => {
    const code =
      "__runtime.drawText(-200, 160, \"我的作品集\", \"#1F2937\", 20);\n" +
      "__runtime.drawRect(-190, -30, 55, 80, \"#FBBF24\");\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("capstone_portfolio")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  // 真实行为校验：示范代码确实画出了对应内容
  it("capstone_data：柱状图真的按数据映射出文字标签", async () => {
    const rt = await runCode(getProject("capstone_data")!.defaultCode!);
    const texts = rt.getState().shapes.filter((s) => s.kind === "text").map((s) => (s as { text: string }).text);
    expect(texts.join(" ")).toContain("本周气温");
    expect(texts.join(" ")).toContain("30"); // 最高温被画出来
    rt.stopLoop();
  });

  it("capstone_portfolio：展板真的列出了作品主题", async () => {
    const rt = await runCode(getProject("capstone_portfolio")!.defaultCode!);
    const texts = rt.getState().shapes.filter((s) => s.kind === "text").map((s) => (s as { text: string }).text);
    expect(texts.join(" ")).toContain("作品集");
    expect(texts.join(" ")).toContain("AI");
    rt.stopLoop();
  });
});
