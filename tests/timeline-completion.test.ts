// 回归测试：时间轴（科学）项目「播放到结尾」必须触发完成信号，
// 且完成闸门（LearnPageClient）对时间轴改用 computeSteps 把关——
//   1) 真搭出预期轨道的示范：播完 → 发「程序执行完毕」→ computeSteps 三步全亮 → 可判完成；
//   2) 空程序（只 reset 无 addTrack）：播完虽发「程序执行完毕」，但 computeSteps 不全亮 → 不误判完成。
//
// 历史缺陷：TimelineEngine 播完无结束回调、runTimelineCode 从不发「程序执行完毕」，
// 导致 18 个科学时间轴项目（6-8 科学 11 + 9-12 J 科学 7 + my_solar_system）生产永远无法标记完成。
import { describe, it, expect, vi } from "vitest";
import { Runtime } from "@/lib/runtime";
import { getProject } from "@/courses";
import { computeSteps } from "@/lib/steps";
import { runTimelineDemo } from "./exec-helpers";

// 用「同步假 rAF + 同步假 performance.now」把时间轴真播到结尾：
// 每帧时间跳 1000ms，loop 内 dt 被限幅为 0.05s，故约 200 帧（10s）内同步递归播完并触发 onComplete。
function withSyncedTimeline(run: () => Promise<void> | void) {
  let fakeNow = 0;
  const perfSpy = vi.spyOn(performance, "now").mockImplementation(() => fakeNow);
  const origRaf = globalThis.requestAnimationFrame;
  vi.stubGlobal(
    "requestAnimationFrame",
    (cb: FrameRequestCallback) => {
      fakeNow += 1000;
      cb(fakeNow);
      return 0;
    }
  );
  return (async () => {
    try {
      await run();
    } finally {
      perfSpy.mockRestore();
      vi.stubGlobal("requestAnimationFrame", origRaf);
    }
  })();
}

describe("时间轴科学项目·播放结尾触发完成（修复 18 项目永不完成）", () => {
  it("day_night 示范：播完发「程序执行完毕」且 computeSteps 三步全亮", async () => {
    await withSyncedTimeline(async () => {
      const { code, logs, steps } = await runTimelineDemo("day_night");
      expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
      expect(steps.every((s) => s.done)).toBe(true);
      // 闸门逻辑（LearnPageClient 对 timeline 分支）：
      const achieved = computeSteps(getProject("day_night")!, code, logs).every(
        (s) => s.done
      );
      expect(achieved).toBe(true);
    });
  });

  it("my_solar_system：播完发「程序执行完毕」且三步全亮", async () => {
    await withSyncedTimeline(async () => {
      const { logs, steps } = await runTimelineDemo("my_solar_system");
      expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
      expect(steps.every((s) => s.done)).toBe(true);
    });
  });

  it("9-12 J 科学 science_orbit：播完发「程序执行完毕」且三步全亮", async () => {
    await withSyncedTimeline(async () => {
      const { logs, steps } = await runTimelineDemo("science_orbit");
      expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
      expect(steps.every((s) => s.done)).toBe(true);
    });
  });

  it("空程序（只 reset 无 addTrack）：虽发「程序执行完毕」，但 computeSteps 不全亮→不误判完成", async () => {
    await withSyncedTimeline(() => {
      const project = getProject("day_night")!;
      const code = "__runtime.timeline.reset(10);";
      const logs: string[] = [];
      const rt = new Runtime(480, 360, (s) => {
        logs.push(...s.log);
      });
      rt.runTimelineCode(code);
      // 播完应发「程序执行完毕」（信号本身正常）
      expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
      // 但空程序未搭轨道，computeSteps 不全亮 → 闸门不会误判完成
      expect(computeSteps(project, code, logs).every((s) => s.done)).toBe(false);
    });
  });
});
