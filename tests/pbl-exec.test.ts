import { describe, it, expect } from "vitest";
import { withInstantRaf, runDemo, runDemoFull, runTimelineDemo, genCode } from "./exec-helpers";
import { getProject } from "@/courses";

describe("分类11·综合创意 端到端执行（看示范真能跑 + 3 步全 done）", () => {
  it("singing_picture：落笔 + 循环画 + 至少 3 个音符，3 步全 done 且无出错", async () => {
    const slug = "singing_picture";
    const project = getProject(slug)!;
    const code = genCode(project.defaultXml!);
    expect(code).toContain("__runtime.penDown()");
    expect(code).toMatch(/for\s*\(|while\s*\(/); // 循环
    expect(code).toContain("__runtime.move");
    expect(code).toContain("__runtime.turn");
    expect((code.match(/__runtime\.playNote\(/g) || []).length).toBeGreaterThanOrEqual(3);

    const { logs, steps } = await withInstantRaf(() => runDemo(slug));
    expect(logs.some((l) => l.includes("出错"))).toBe(false);
    expect(steps.every((s) => s.done)).toBe(true);
  });

  it("two_actor_show：双角色 + 表情 + 场景，3 步全 done", async () => {
    const slug = "two_actor_show";
    const project = getProject(slug)!;
    const code = genCode(project.defaultXml!);
    expect(code).toContain("__runtime.controlActor(");
    expect(code).toContain("__runtime.setExpression(");
    expect(code).toContain("__runtime.setScene(");

    const { logs, steps } = await withInstantRaf(() => runDemo(slug));
    expect(logs.some((l) => l.includes("出错"))).toBe(false);
    expect(logs.some((l) => l.includes("开始执行程序"))).toBe(true);
    expect(steps.every((s) => s.done)).toBe(true);
  });

  it("my_solar_system：时间轴公转 + 大小 tween + 当时间到达解说，3 步全 done", async () => {
    const slug = "my_solar_system";
    const project = getProject(slug)!;
    const code = genCode(project.defaultXml!);
    expect(code).toContain("__runtime.timeline.reset(10)");
    expect(code).toContain('type: "orbit"');
    expect(code).toContain('type: "tween"');
    expect(code).toContain('type: "whenAt"');

    const { logs, steps } = await withInstantRaf(() => runTimelineDemo(slug));
    expect(logs.some((l) => l.includes("出错"))).toBe(false);
    expect(steps.every((s) => s.done)).toBe(true);
  });

  it("interactive_book：点击 + 条件（碰到星星）+ 收集所有星星，3 步全 done", async () => {
    const slug = "interactive_book";
    const project = getProject(slug)!;
    const code = genCode(project.defaultXml!);
    expect(code).toContain("__runtime.touchingStar()");
    expect(code).toContain("__runtime.gotoStar");

    const { logs, steps } = await withInstantRaf(() => runDemoFull(slug));
    expect(logs.some((l) => l.includes("出错"))).toBe(false);
    expect(logs.some((l) => l.includes("所有星星都收集完了"))).toBe(true);
    expect(steps.every((s) => s.done)).toBe(true);
  });
});
