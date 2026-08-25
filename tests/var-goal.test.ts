// 变量类（var）项目完成判定的真实结果校验。
// 修复「随便搭积木也能通过校验」的 P0 缺陷在变量类的收尾：
// 每个 var 项目用 project.goal 声明期望结果，isGoalAchieved 对运行时终态做断言。
import { describe, it, expect } from "vitest";
import { withInstantRaf, runDemo } from "./exec-helpers";
import { isGoalAchieved } from "@/lib/steps";
import { getProject } from "@/courses";
import { Runtime, type StageState } from "@/lib/runtime";

const VAR_SLUGS = [
  "var_counter",
  "var_score",
  "var_lives",
  "var_speed",
  "var_parity",
  "var_gradient",
  "var_timer",
  "var_best",
];

describe("VAR 变量类项目：真实结果校验", () => {
  it.each(VAR_SLUGS)("%s：看示范（默认 XML）应判定通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const { finalState, logs } = await runDemo(slug);
      expect(isGoalAchieved(project, finalState, logs)).toBe(true);
    });
  });

  it.each(VAR_SLUGS)("%s：空程序（随便搭）应判定不通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const rt = new Runtime(480, 360, () => {}, [], { companions: [] });
      rt.setScripts({ whenStart: "", whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });

  it("synthetic：变量终值不达标即不通过（以 var_counter 为例）", () => {
    const project = getProject("var_counter")!;
    const st: StageState = {
      actor: { x: 0, y: 0 },
      stars: [],
      vars: { 步数: 3 }, // 没数到 10
      penPaths: [],
      movedDistance: 0,
      log: [],
    } as unknown as StageState;
    expect(isGoalAchieved(project, st, [])).toBe(false);
  });
});
