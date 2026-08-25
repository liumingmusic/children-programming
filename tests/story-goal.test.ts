// 交互绘本（story）类项目完成判定的真实结果校验。
// 修复「随便搭积木也能通过校验」的 P0 缺陷在交互绘本类的收尾：
//   - story：必须真的配置了「舞台点击」处理器（注册数 > 0，时序安全，与键盘类同思路）。
// 空程序 / 没配点击事件 都应判定不通过。
import { describe, it, expect } from "vitest";
import { withInstantRaf, runDemoFull } from "./exec-helpers";
import { isGoalAchieved } from "@/lib/steps";
import { getProject } from "@/courses";
import { Runtime, type StageState } from "@/lib/runtime";

const STORY_SLUGS = [
  "story_branch",
  "story_clickable",
  "story_adventure",
  "story_growth",
  "story_science",
  "story_card",
];

describe("STORY 交互绘本类项目：必须配置舞台点击处理器", () => {
  it.each(STORY_SLUGS)("%s：看示范（默认 XML）应判定通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const { finalState } = await runDemoFull(slug);
      // 健壮性断言：示范程序确实注册了点击事件处理器
      expect(finalState.clickHandlers ?? 0).toBeGreaterThan(0);
      expect(isGoalAchieved(project, finalState, [])).toBe(true);
    });
  }, 60000);

  it.each(STORY_SLUGS)("%s：空程序（无点击处理器）应判定不通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const rt = new Runtime(480, 360, () => {}, [], { companions: [] });
      rt.setScripts({ whenStart: "", whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(st.clickHandlers ?? 0).toBe(0);
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });

  it("synthetic：无点击处理器即不通过（以 story_branch 为例）", () => {
    const project = getProject("story_branch")!;
    const st = {
      actor: { x: 0, y: 0 },
      stars: [],
      penPaths: [],
      movedDistance: 0,
      log: [],
      clickHandlers: 0,
    } as unknown as StageState;
    expect(isGoalAchieved(project, st, [])).toBe(false);
  });
});
