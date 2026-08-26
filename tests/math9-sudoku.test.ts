// 分类 F · 数独填空（9-12 阶段，math_sudoku）完成判定的真实结果校验。
// math_sudoku 复用分类 G·列表的判定模型（归在 LIST9_SLUGS）：
//   computeSteps 三步 = 建列表 / 填充 / 展示；isGoalAchieved 要求「非空列表 + 说 数独完成」。
// 空程序 / 只搭一半（不展示 / 不说出完成词）都应判定不通过（杜绝「随便搭积木也能通过」）。
import { describe, it, expect } from "vitest";
import { withInstantRaf, runDemoFull, genCode } from "./exec-helpers";
import { isGoalAchieved } from "@/lib/steps";
import { getProject } from "@/courses";
import { Runtime } from "@/lib/runtime";

describe("F·数独 math_sudoku：看示范（默认 XML）应判定通过", () => {
  it("math_sudoku：看示范通过且三步引导全亮", async () => {
    await withInstantRaf(async () => {
      const project = getProject("math_sudoku")!;
      const { finalState, steps } = await runDemoFull("math_sudoku");
      const hasList = Object.values(finalState.vars ?? {}).some(
        (v) => Array.isArray(v) && v.length > 0
      );
      expect(hasList).toBe(true);
      expect(isGoalAchieved(project, finalState, [])).toBe(true);
      // 三步引导（computeSteps）在示范下应全部完成
      expect(steps.length).toBe(3);
      expect(steps.every((s) => s.done)).toBe(true);
    });
  }, 60000);
});

describe("F·数独 math_sudoku：空程序应判定不通过", () => {
  it("math_sudoku：空程序（无列表 / 未展示）不通过", async () => {
    await withInstantRaf(async () => {
      const project = getProject("math_sudoku")!;
      const rt = new Runtime(480, 360, () => {}, []);
      rt.setScripts({ whenStart: "", whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });
});

describe("F·数独 math_sudoku：半程序（只搭一半）应判定不通过", () => {
  it("只建列表并填充、但不展示 / 不说「数独完成」：不通过", async () => {
    await withInstantRaf(async () => {
      const project = getProject("math_sudoku")!;
      const xml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="maker_when_start" x="40" y="40"><statement name="STACK"><block type="maker_list_create"><field name="NAME">数独</field><next><block type="maker_list_add"><field name="NAME">数独</field><value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="maker_list_add"><field name="NAME">数独</field><value name="VALUE"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="maker_list_add"><field name="NAME">数独</field><value name="VALUE"><shadow type="math_number"><field name="NUM">3</field></shadow></value><next><block type="maker_list_add"><field name="NAME">数独</field><value name="VALUE"><shadow type="math_number"><field name="NUM">4</field></shadow></value></block></next></block></next></block></next></block></statement></block></xml>`;
      const code = genCode(xml);
      const rt = new Runtime(480, 360, () => {}, []);
      rt.setScripts({ whenStart: code, whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });

  it("建列表 + 填充 + 说列表内容、但没说「数独完成」：不通过", async () => {
    await withInstantRaf(async () => {
      const project = getProject("math_sudoku")!;
      const xml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="maker_when_start" x="40" y="40"><statement name="STACK"><block type="maker_list_create"><field name="NAME">数独</field><next><block type="maker_list_add"><field name="NAME">数独</field><value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="maker_list_add"><field name="NAME">数独</field><value name="VALUE"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="maker_list_add"><field name="NAME">数独</field><value name="VALUE"><shadow type="math_number"><field name="NUM">3</field></shadow></value><next><block type="maker_list_add"><field name="NAME">数独</field><value name="VALUE"><shadow type="math_number"><field name="NUM">4</field></shadow></value><next><block type="maker_say"><value name="TEXT"><block type="maker_list_var"><field name="NAME">数独</field></block></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></next></block></next></block></next></block></statement></block></xml>`;
      const code = genCode(xml);
      const rt = new Runtime(480, 360, () => {}, []);
      rt.setScripts({ whenStart: code, whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });
});
