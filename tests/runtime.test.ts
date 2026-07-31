import { describe, it, expect, vi } from "vitest";
import { Runtime, type StageState } from "@/lib/runtime";

// 让动画即时完成：runtime 用 requestAnimationFrame 按真实时长播放，
// jsdom 下帧率不稳定会让多段动画测试偶发超时。这里把 rAF 直接跳到结束。
function withInstantRaf(run: () => Promise<void>) {
  const original = globalThis.requestAnimationFrame;
  vi.stubGlobal(
    "requestAnimationFrame",
    (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now() + 1e7), 0) as unknown as number
  );
  return run().finally(() => {
    vi.stubGlobal("requestAnimationFrame", original);
  });
}

function makeRuntime() {
  const logs: string[] = [];
  const rt = new Runtime(480, 360, (s) => {
    logs.push(...s.log);
  });
  return { rt, logs, getState: () => rt.getState() };
}

describe("Runtime 行为（完成判定依赖的日志/状态）", () => {
  it("move 改变坐标，并发出「二零开始移动」日志", async () => {
    const { rt, logs, getState } = makeRuntime();
    rt.setScripts({ whenStart: "__runtime.move(100);", whenStageClicked: "" });
    await rt.handleRunStart();
    const s = getState();
    // 初始角度 270°（朝上）：move 的 Y 取负（dy=-steps·sin），故向上移动 → 世界 Y 增大到 +100
    // （toScreen 把世界 Y 向上映射为屏幕上方），头朝上与移动方向一致。
    expect(s.actor.y).toBeCloseTo(100, 5);
    expect(logs.some((l) => l.includes("二零开始移动"))).toBe(true);
    expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
  });

  it("say 发出「[二零] 文本」日志", async () => {
    const { rt, logs } = makeRuntime();
    rt.setScripts({ whenStart: '__runtime.say("你好！", 0.05);', whenStageClicked: "" });
    await rt.handleRunStart();
    expect(logs.some((l) => l.startsWith("[二零] 你好！"))).toBe(true);
  });

  it("collectNearbyStars：靠近星星时收集成功", () => {
    const { rt, getState } = makeRuntime();
    const s = getState();
    // 走到第一颗星星（实际坐标随 DEFAULT_STARS 定义，避免写死）
    const star0 = s.stars[0];
    s.actor.x = star0.x;
    s.actor.y = star0.y;
    rt.collectNearbyStars();
    expect(getState().stars[0].collected).toBe(true);
  });

  it("touchingStar 在碰到星星时为 true", () => {
    const { rt, getState } = makeRuntime();
    const s = getState();
    const star0 = s.stars[0];
    s.actor.x = star0.x;
    s.actor.y = star0.y;
    expect(rt.touchingStar()).toBe(true);
    // 远离时应为 false
    s.actor.x = 400;
    s.actor.y = 400;
    expect(rt.touchingStar()).toBe(false);
  });

  it("运行含 move+turn+pen 的生成代码不抛错并收尾", async () => {
    const { rt, logs } = makeRuntime();
    const code = [
      "__runtime.penDown();",
      "__runtime.move(10);",
      "__runtime.turn(10);",
      "__runtime.changePenColor(10);",
    ].join("\n");
    rt.setScripts({ whenStart: code, whenStageClicked: "" });
    await rt.handleRunStart();
    expect(logs.some((l) => l.includes("画笔落下"))).toBe(true);
    expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
  });

  it("修复回归：penDown→move→penUp 必须真正记录笔画（笔不能在 eval 阶段被立刻抬起）", () =>
    withInstantRaf(async () => {
      const { rt, getState } = makeRuntime();
      // 五角星示范：落笔 + 重复5次(移动+右转144) + 抬笔
      const code = [
        "__runtime.penDown();",
        "for (var i = 0; i < 5; i++) { __runtime.move(100); __runtime.turn(144); }",
        "__runtime.penUp();",
      ].join("\n");
      rt.setScripts({ whenStart: code, whenStageClicked: "" });
      await rt.handleRunStart();
      const s = getState();
      // 必须至少一条笔画，且点数 >= 6（起点 + 5 次移动）
      const totalPoints = s.penPaths.reduce((n, p) => n + p.points.length, 0);
      expect(s.penPaths.length).toBeGreaterThanOrEqual(1);
      expect(totalPoints).toBeGreaterThanOrEqual(6);
    }));

  it("彩虹式循环：落笔→(移动+变色)×N→抬笔，每段都有独立彩色笔画", () =>
    withInstantRaf(async () => {
      const { rt, getState } = makeRuntime();
      const code = [
        "__runtime.penDown();",
        "__runtime.setPenColor(0);",
        "for (var i = 0; i < 4; i++) { __runtime.move(80); __runtime.changePenColor(30); }",
        "__runtime.penUp();",
      ].join("\n");
      rt.setScripts({ whenStart: code, whenStageClicked: "" });
      await rt.handleRunStart();
      const s = getState();
      // 4 次变色 → 应有 5 段笔画（起始段 + 4 段），且每段都可绘制
      expect(s.penPaths.length).toBeGreaterThanOrEqual(4);
      expect(s.penPaths.every((p) => p.points.length >= 2)).toBe(true);
    }));
});
