import { describe, it, expect, beforeEach, vi } from "vitest";
import { trackEvent, dumpEvents, initAnalytics, trackFirstCompletion } from "@/lib/analytics";

describe("analytics 埋点闭环", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  it("trackEvent 写入本地事件队列并能回读", () => {
    trackEvent("project_view", { slug: "capstone_game", stage: "stage-13-16" });
    const evs = dumpEvents();
    expect(evs.length).toBe(1);
    expect(evs[0].name).toBe("project_view");
    expect(evs[0].props.slug).toBe("capstone_game");
    expect(evs[0].props.stage).toBe("stage-13-16");
    expect(typeof evs[0].t).toBe("number");
  });

  it("未配置 GA 时降级为 localStorage + console，不抛错", () => {
    const spy = vi.spyOn(console, "debug");
    trackEvent("run_click", { slug: "capstone_data" });
    expect(spy).toHaveBeenCalledWith("[analytics]", "run_click", { slug: "capstone_data" });
  });

  it("全局运行时错误被捕获为 page_error", () => {
    initAnalytics();
    window.dispatchEvent(
      new ErrorEvent("error", { message: "boom-xyz", lineno: 12, filename: "app.js" })
    );
    const evs = dumpEvents();
    const hit = evs.find(
      (e) => e.name === "page_error" && String(e.props.message).includes("boom-xyz")
    );
    expect(hit).toBeTruthy();
  });

  it("队列最多保留最近 300 条", () => {
    for (let i = 0; i < 350; i++) trackEvent("ping", { i });
    expect(dumpEvents().length).toBe(300);
  });

  it("trackFirstCompletion 仅在首次完成才上报 first_project_completed", () => {
    const first = trackFirstCompletion("hello", "stage-6-8");
    expect(first).toBe(true);
    const evs = dumpEvents();
    const hit = evs.find(
      (e) => e.name === "first_project_completed" && e.props.slug === "hello"
    );
    expect(hit).toBeTruthy();

    // 同一个浏览器（同一用户）后续完成其它项目不再记为「首个」
    const second = trackFirstCompletion("rainbow", "stage-6-8");
    expect(second).toBe(false);
    const all = dumpEvents().filter((e) => e.name === "first_project_completed");
    expect(all.length).toBe(1);
  });
});
