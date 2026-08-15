import { describe, it, expect } from "vitest";
import { getProject } from "@/courses";
import { genScripts } from "./exec-helpers";
import { Runtime } from "@/lib/runtime";
import { computeSteps } from "@/lib/steps";

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
