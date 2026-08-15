import { describe, it, expect } from "vitest";
import { getProject, getStageProjects } from "@/courses";
import { genScripts } from "./exec-helpers";
import { Runtime } from "@/lib/runtime";
import { computeSteps } from "@/lib/steps";
import { BLOCK_CATALOG } from "@/lib/block-catalog";
import { TOOLBOX } from "@/lib/blockly-blocks";

/**
 * 9-12 分类 D（键盘与操控游戏）首批量产项目：
 *  - 键盘积木字母键扩展（A S D F G H J K 弹琴）
 * 校验：编译器收集 / 运行时字母键分发 / 步骤判定真实 JS 标记。
 */

describe("分类 D · 编译器收集键盘事件", () => {
  it("key_move 的 4 个方向键被收集，且含 move / turn", () => {
    const p = getProject("key_move")!;
    const { whenKeyPressed } = genScripts(p.defaultXml!);
    expect(whenKeyPressed.map((k) => k.key).sort()).toEqual(["down", "left", "right", "up"]);
    expect(whenKeyPressed.some((k) => k.code.includes("__runtime.move"))).toBe(true);
    expect(whenKeyPressed.some((k) => k.code.includes("__runtime.turn"))).toBe(true);
  });

  it("key_maze 收集 up/left/right 且每块都有可执行代码", () => {
    const p = getProject("key_maze")!;
    const { whenKeyPressed } = genScripts(p.defaultXml!);
    expect(whenKeyPressed.map((k) => k.key).sort()).toEqual(["left", "right", "up"]);
    expect(whenKeyPressed.every((k) => k.code.length > 0)).toBe(true);
  });

  it("key_piano 收集 8 个字母键，每个含 playNote（字母键弹琴生效）", () => {
    const p = getProject("key_piano")!;
    const { whenKeyPressed } = genScripts(p.defaultXml!);
    expect(whenKeyPressed.length).toBe(8);
    expect(whenKeyPressed.map((k) => k.key).sort()).toEqual([
      "a", "d", "f", "g", "h", "j", "k", "s",
    ]);
    expect(whenKeyPressed.every((k) => k.code.includes("__runtime.playNote"))).toBe(true);
  });
});

describe("分类 D · 运行时字母键分发", () => {
  it("handleKeyPressed 接受字母键 a 并触发对应脚本", async () => {
    const logs: string[] = [];
    const rt = new Runtime(480, 360, (s) => logs.push(...s.log));
    rt.setScripts({
      whenStart: "",
      whenStageClicked: "",
      whenKeyPressed: [{ key: "a", code: '__runtime.say("哆")' }],
      whenReceived: [],
    });
    await rt.handleKeyPressed("a");
    expect(logs.some((l) => l.includes("按下按键"))).toBe(true);
    expect(logs.some((l) => l.includes("哆"))).toBe(true);
  });

  it("非匹配键不触发任何脚本", async () => {
    const logs: string[] = [];
    const rt = new Runtime(480, 360, (s) => logs.push(...s.log));
    rt.setScripts({
      whenStart: "",
      whenStageClicked: "",
      whenKeyPressed: [{ key: "a", code: '__runtime.say("哆")' }],
      whenReceived: [],
    });
    await rt.handleKeyPressed("z");
    expect(logs.some((l) => l.includes("按下按键"))).toBe(false);
  });
});

describe("分类 D · 步骤判定 (computeSteps)", () => {
  it("key_move：按键触发 + 移动 + 跑完 三步全绿", () => {
    const p = getProject("key_move")!;
    const code = "__runtime.move(40); __runtime.turn(-90);";
    const logs = ["[系统] 按下按键，执行事件", "[系统] 程序执行完毕"];
    expect(computeSteps(p, code, logs).map((s) => s.done)).toEqual([true, true, true]);
  });

  it("key_piano：按键触发 + 弹奏音符 + 跑完 三步全绿", () => {
    const p = getProject("key_piano")!;
    const code = '__runtime.playNote("do");';
    const logs = ["[系统] 按下按键，执行事件", "[系统] 程序执行完毕"];
    expect(computeSteps(p, code, logs).map((s) => s.done)).toEqual([true, true, true]);
  });

  it("key_maze：缺 turn 时第 2 步不算完成", () => {
    const p = getProject("key_maze")!;
    const code = "__runtime.move(40);"; // 只有 move 没有 turn
    const logs = ["[系统] 按下按键，执行事件", "[系统] 程序执行完毕"];
    const steps = computeSteps(p, code, logs);
    expect(steps[0].done).toBe(true);
    expect(steps[1].done).toBe(false);
    expect(steps[2].done).toBe(true);
  });
});

describe("分类 D · 进阶 5 项（接苹果/躲避/打砖块/射击/反应力）", () => {
  const NEW = ["catch_apple", "dodge_fall", "breakout_intro", "space_shooter", "reaction_game"];

  it("5 个 slug 都已注册进 stage-9-12 且 defaultXml 含对应碰撞积木", () => {
    const slugs = getStageProjects("stage-9-12").map((p) => p.slug);
    for (const s of NEW) {
      expect(slugs).toContain(s);
      const p = getProject(s)!;
      expect(p.defaultXml).toBeTruthy();
    }
    const xml = (s: string) => getProject(s)!.defaultXml!;
    expect(xml("catch_apple")).toContain("maker_touching_apple");
    expect(xml("catch_apple")).toContain("maker_change_var");
    expect(xml("dodge_fall")).toContain("maker_touching_cloud");
    expect(xml("breakout_intro")).toContain("maker_touching_star");
    expect(xml("breakout_intro")).toContain("maker_change_var");
    expect(xml("space_shooter")).toContain("maker_touching_cloud");
    expect(xml("space_shooter")).toContain("maker_change_var");
    expect(xml("reaction_game")).toContain("maker_touching_apple");
    expect(xml("reaction_game")).toContain("maker_change_var");
  });

  it("maker_touching_apple 代码生成输出 __runtime.touchingApple()", () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start">
        <statement name="STACK">
          <block type="controls_if">
            <value name="IF0"><block type="maker_touching_apple"></block></value>
          </block>
        </statement>
      </block>
    </xml>`;
    const { whenStart } = genScripts(xml);
    expect(whenStart).toContain("__runtime.touchingApple()");
  });

  it("catalog 与 toolbox 对称：maker_touching_apple 两边都在、分类侦探、形状 boolean", () => {
    const toolboxTypes = (TOOLBOX as unknown as { contents: { type: string }[] }).contents.map((c) => c.type);
    expect(toolboxTypes).toContain("maker_touching_apple");
    const doc = BLOCK_CATALOG.find((b) => b.id === "maker_touching_apple");
    expect(doc).toBeTruthy();
    expect(doc!.category).toBe("侦测");
    expect(doc!.shape).toBe("boolean");
  });
});

describe("分类 D · 运行时 apples 下落物场景", () => {
  it("苹果与角色重叠时 touchingApple 为真", () => {
    const rt = new Runtime(480, 360, () => {}, undefined, {
      apples: [{ x: 0, y: 0, vy: 2, r: 18 }],
    });
    expect(rt.touchingApple()).toBe(true);
  });

  it("苹果远离角色时 touchingApple 为假", () => {
    const rt = new Runtime(480, 360, () => {}, undefined, {
      apples: [{ x: 200, y: 0, vy: 2, r: 18 }],
    });
    expect(rt.touchingApple()).toBe(false);
  });

  it("构造时传入的 apples 出现在初始 state（供 StagePlayer 渲染）", () => {
    const rt = new Runtime(480, 360, () => {}, undefined, {
      apples: [{ x: 10, y: 20, vy: 1.5, r: 18 }],
    });
    const st = rt.getState();
    expect(st.apples && st.apples.length).toBe(1);
    expect(st.apples![0]).toMatchObject({ x: 10, y: 20, r: 18 });
  });
});

describe("分类 D · 进阶 5 项步骤判定 (computeSteps)", () => {
  const cases: Record<string, { code: string; collide: string }> = {
    catch_apple: { code: "__runtime.move(40); __runtime.touchingApple(); __runtime.changeVar('score',1);", collide: "touchingApple" },
    dodge_fall: { code: "__runtime.turn(-90); __runtime.touchingCloud();", collide: "touchingCloud" },
    breakout_intro: { code: "__runtime.move(40); __runtime.touchingStar(); __runtime.changeVar('score',1);", collide: "touchingStar" },
    space_shooter: { code: "__runtime.turn(90); __runtime.touchingCloud(); __runtime.changeVar('score',1);", collide: "touchingCloud" },
    reaction_game: { code: "__runtime.move(40); __runtime.touchingApple(); __runtime.changeVar('score',1);", collide: "touchingApple" },
  };
  for (const [slug, c] of Object.entries(cases)) {
    it(`${slug}：按键触发 + 碰撞结算 (+分数) + 跑完 三步全绿`, () => {
      const p = getProject(slug)!;
      const code = c.code;
      const logs = ["[系统] 按下按键，执行事件", "[系统] 程序执行完毕"];
      expect(computeSteps(p, code, logs).map((s) => s.done)).toEqual([true, true, true]);
    });
  }
});
