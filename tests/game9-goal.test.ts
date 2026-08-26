// 分类 H · 综合小游戏（9-12 阶段，8 项）完成判定的真实结果校验。
// 复用 D / G / multi 三套已验证模型：键盘型校验 keyHandlers>0；逻辑/数据/多角色型校验真实结果。
// 空程序 / 只搭一半 都应判定不通过（杜绝「随便搭积木也能通过」）。
import { describe, it, expect } from "vitest";
import { withInstantRaf, runDemoFull, genCode } from "./exec-helpers";
import { isGoalAchieved } from "@/lib/steps";
import { getProject } from "@/courses";
import { Runtime, type StageState, type Species } from "@/lib/runtime";

const GAME9_KEYBOARD = ["game_snake", "game_shooter", "game_dodge", "game_race"];
const GAME9_ALL = [
  "game_snake", "game_shooter", "game_dodge", "game_race",
  "game_guess", "game_memory", "game_2048lite", "game_puzzle",
];

const COMPANIONS = [{ id: "sanqi", species: "sanqi" as Species, name: "三七" }];

describe("H·综合小游戏：看示范（默认 XML）应判定通过", () => {
  it.each(GAME9_ALL)("%s：看示范通过且三步引导全亮", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const { finalState, steps } = await runDemoFull(slug);
      if (GAME9_KEYBOARD.includes(slug)) {
        expect(finalState.keyHandlers ?? 0).toBeGreaterThan(0);
      }
      if (slug === "game_puzzle") {
        expect(finalState.companionEngaged).toBe(true);
      }
      if (slug === "game_memory" || slug === "game_2048lite") {
        const hasList = Object.values(finalState.vars ?? {}).some(
          (v) => Array.isArray(v) && v.length > 0
        );
        expect(hasList).toBe(true);
      }
      expect(isGoalAchieved(project, finalState, [])).toBe(true);
      // 三步引导（computeSteps）在示范下应全部完成
      expect(steps.length).toBe(3);
      expect(steps.every((s) => s.done)).toBe(true);
    });
  }, 60000);
});

describe("H·综合小游戏：空程序应判定不通过", () => {
  it.each(GAME9_ALL)("%s：空程序（无按键/未 engage/未展示）不通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const rt = new Runtime(480, 360, () => {}, [], { companions: COMPANIONS });
      rt.setScripts({ whenStart: "", whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });
});

describe("H·综合小游戏：半程序（只搭一半）应判定不通过", () => {
  it("game_memory：只建列表不展示「配对成功」不通过", async () => {
    await withInstantRaf(async () => {
      const project = getProject("game_memory")!;
      const xml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="maker_when_start" x="40" y="40"><statement name="STACK"><block type="maker_list_create"><field name="NAME">牌面</field><next><block type="maker_list_add"><field name="NAME">牌面</field><value name="VALUE"><shadow type="text"><field name="TEXT">苹果</field></shadow></value></block></next></block></statement></block></xml>`;
      const code = genCode(xml);
      const rt = new Runtime(480, 360, () => {}, [], { companions: COMPANIONS });
      rt.setScripts({ whenStart: code, whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });

  it("game_guess：只循环不说出「猜中啦」不通过", async () => {
    await withInstantRaf(async () => {
      const project = getProject("game_guess")!;
      const xml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="maker_when_start" x="40" y="40"><statement name="STACK"><block type="maker_set_var"><field name="NAME">神秘数</field><value name="VALUE"><shadow type="math_number"><field name="NUM">8</field></shadow></value><next><block type="maker_set_var"><field name="NAME">当前</field><value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value><statement name="DO"><block type="maker_change_var"><field name="NAME">当前</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></statement></block></next></block></next></block></statement></block></xml>`;
      const code = genCode(xml);
      const rt = new Runtime(480, 360, () => {}, [], { companions: COMPANIONS });
      rt.setScripts({ whenStart: code, whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });

  it("game_puzzle：只控制伙伴但不说「归位完成」不通过", async () => {
    await withInstantRaf(async () => {
      const project = getProject("game_puzzle")!;
      const xml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="maker_when_start" x="40" y="40"><statement name="STACK"><block type="maker_control_actor"><field name="ACTOR">sanqi</field><next><block type="maker_goto"><value name="X"><shadow type="math_number"><field name="NUM">-120</field></shadow></value><value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value></block></next></block></statement></block></xml>`;
      const code = genCode(xml);
      const rt = new Runtime(480, 360, () => {}, [], { companions: COMPANIONS });
      rt.setScripts({ whenStart: code, whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(st.companionEngaged).toBe(true);
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });
});
