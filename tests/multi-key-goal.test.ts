// 多角色（multi）与键盘（key）类项目完成判定的真实结果校验。
// 修复「随便搭积木也能通过校验」的 P0 缺陷在多角色 / 键盘类的收尾：
//   - multi：伙伴角色（非二零）必须真正执行过动作（运行时 acted 标记）。
//   - key：必须真的配置了按键处理器（注册数 > 0，时序安全）。
// 空程序 / 只让二零动 / 没配按键 都应判定不通过。
import { describe, it, expect } from "vitest";
import { withInstantRaf, runDemoFull } from "./exec-helpers";
import { isGoalAchieved } from "@/lib/steps";
import { getProject } from "@/courses";
import { Runtime, type StageState } from "@/lib/runtime";
import type { Species } from "@/lib/runtime";

const MULTI_SLUGS = [
  "cat_mouse",
  "guardian_dodge",
  "two_player",
  "message_relay",
  "two_actor_chat",
  "relay_race",
  "chorus",
  "animal_queue",
];

const KEY_SLUGS = ["key_move", "key_maze", "key_piano"];

const D_GAME_SLUGS = [
  "catch_apple",
  "dodge_fall",
  "breakout_intro",
  "space_shooter",
  "reaction_game",
];

describe("MULTI 多角色类项目：必须真正 engage 伙伴角色", () => {
  it.each(MULTI_SLUGS)("%s：看示范（默认 XML）应判定通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const { finalState } = await runDemoFull(slug);
      // 健壮性断言：示范程序确实 engage 了伙伴角色
      expect(finalState.companionEngaged).toBe(true);
      expect(isGoalAchieved(project, finalState, [])).toBe(true);
    });
  }, 60000);

  it.each(MULTI_SLUGS)("%s：空程序（未 engage 伙伴）应判定不通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const rt = new Runtime(480, 360, () => {}, [], {
        companions: [{ id: "sanqi", species: "sanqi" as Species, name: "三七" }],
      });
      rt.setScripts({ whenStart: "", whenStageClicked: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      // 伙伴存在但程序从未引用它
      expect(st.companionEngaged).toBe(false);
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });

  it("synthetic：未 engage 伙伴即不通过（以 two_actor_chat 为例）", () => {
    const project = getProject("two_actor_chat")!;
    const st = {
      actor: { x: 0, y: 0 },
      stars: [],
      penPaths: [],
      movedDistance: 0,
      log: [],
      companionEngaged: false,
    } as unknown as StageState;
    expect(isGoalAchieved(project, st, [])).toBe(false);
  });
});

describe("KEY 键盘类项目：必须配置按键处理器", () => {
  it.each([...KEY_SLUGS, ...D_GAME_SLUGS])(
    "%s：看示范（默认 XML）应判定通过",
    async (slug) => {
      await withInstantRaf(async () => {
        const project = getProject(slug)!;
        const { finalState } = await runDemoFull(slug);
        expect(finalState.keyHandlers ?? 0).toBeGreaterThan(0);
        expect(isGoalAchieved(project, finalState, [])).toBe(true);
      });
    },
    60000
  );

  it.each([...KEY_SLUGS, ...D_GAME_SLUGS])(
    "%s：空程序（无按键处理器）应判定不通过",
    async (slug) => {
      await withInstantRaf(async () => {
        const project = getProject(slug)!;
        const rt = new Runtime(480, 360, () => {}, [], { companions: [] });
        rt.setScripts({ whenStart: "", whenStageClicked: "" });
        await rt.handleRunStart();
        const st = rt.getState();
        expect(st.keyHandlers ?? 0).toBe(0);
        expect(isGoalAchieved(project, st, [])).toBe(false);
      });
    }
  );

  it("synthetic：无按键处理器即不通过（以 key_move 为例）", () => {
    const project = getProject("key_move")!;
    const st = {
      actor: { x: 0, y: 0 },
      stars: [],
      penPaths: [],
      movedDistance: 0,
      log: [],
      keyHandlers: 0,
    } as unknown as StageState;
    expect(isGoalAchieved(project, st, [])).toBe(false);
  });
});
