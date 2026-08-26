// 音乐创作（music）与 数学进阶（math）类项目完成判定的真实结果校验。
// 收紧两类「随便搭积木也能通过校验」的隐患：
//   - music：必须真的播放过声音（sounded 在 performAction 发声时同步置位，空程序必然 false）。
//   - math：复用 VAR 的 goal 真实结果断言（saidIncludes / drew），空程序无输出必然 false。
import { describe, it, expect } from "vitest";
import { withInstantRaf, runDemoFull } from "./exec-helpers";
import { isGoalAchieved } from "@/lib/steps";
import { getProject } from "@/courses";
import { Runtime, type StageState } from "@/lib/runtime";

const MUSIC_SLUGS = [
  "music_doremi",
  "music_twinkle",
  "music_loop",
  "music_random",
  "music_pitch_pos",
  "music_chord",
  "music_birthday",
  "music_compose",
];

const MATH_SLUGS = [
  "math_mul_table",
  "math_factor_prime",
  "math_area",
  "math_fib",
  "math_prime_sieve",
  "math_polygon",
  "math_coords",
];

describe("MUSIC 音乐创作类项目：必须真的播放过声音", () => {
  it.each(MUSIC_SLUGS)("%s：看示范（默认 XML）应判定通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const { finalState } = await runDemoFull(slug);
      // 健壮性断言：示范程序确实播放过声音
      expect(finalState.sounded === true).toBe(true);
      expect(isGoalAchieved(project, finalState, [])).toBe(true);
    });
  }, 60000);

  it.each(MUSIC_SLUGS)("%s：空程序（不发声）应判定不通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const rt = new Runtime(480, 360, () => {}, [], { companions: [] });
      rt.setScripts({ whenStart: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(st.sounded === true).toBe(false);
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });

  it("synthetic：未发声即不通过（以 music_doremi 为例）", () => {
    const project = getProject("music_doremi")!;
    const st = {
      actor: { x: 0, y: 0 },
      stars: [],
      penPaths: [],
      movedDistance: 0,
      log: [],
      sounded: false,
    } as unknown as StageState;
    expect(isGoalAchieved(project, st, [])).toBe(false);
  });
});

describe("MATH 数学进阶类项目：必须产出真实结果（goal 断言）", () => {
  it.each(MATH_SLUGS)("%s：看示范（默认 XML）应判定通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const { finalState } = await runDemoFull(slug);
      // 健壮性断言：示范程序确实跑完并产出输出
      expect(finalState.log ?? []).toContain("[系统] 程序执行完毕");
      expect(isGoalAchieved(project, finalState, [])).toBe(true);
    });
  }, 60000);

  it.each(MATH_SLUGS)("%s：空程序（无输出）应判定不通过", async (slug) => {
    await withInstantRaf(async () => {
      const project = getProject(slug)!;
      const rt = new Runtime(480, 360, () => {}, [], { companions: [] });
      rt.setScripts({ whenStart: "" });
      await rt.handleRunStart();
      const st = rt.getState();
      expect(isGoalAchieved(project, st, [])).toBe(false);
    });
  });

  it("synthetic：无输出即不通过（以 math_fib 为例）", () => {
    const project = getProject("math_fib")!;
    const st = {
      actor: { x: 0, y: 0 },
      stars: [],
      penPaths: [],
      movedDistance: 0,
      vars: {},
      log: [],
    } as unknown as StageState;
    expect(isGoalAchieved(project, st, [])).toBe(false);
  });
});
