import { describe, it, expect, vi } from "vitest";
import { runTimelineDemo } from "./exec-helpers";
import type { StageState } from "@/lib/runtime";

// 分类 10（自然科学模拟）共 10 个「看示范」项目，全部走时间轴引擎（project.timeline=true）。
// 此前这些项目只过了 courses/steps 的判定，未做过端到端运行时验证，
// 存在「判定过、实际跑偏/报错」的隐患（见 AGENTS.md §4）。
// 本文件用真实 Blockly 把 defaultXml 转成 JS（含 __runtime.timeline.reset/addTrack），
// 再用真实 Runtime 的 TimelineEngine 把轨道真加好并 seek 到各时刻，断言：
//   1) 真实 codegen 不含错误、含正确时间轴标记（reset/addTrack/轨道类型）；
//   2) 注入执行无「时间轴程序出错」；
//   3) 时间轴真的驱动了世界状态（tween 改属性 / orbit 改坐标 / 粒子被发射 / 颜色被混合）；
//   4) 三步进度全部完成（孩子点运行/看示范后弹「完成」）。
//
// 测试里只把 requestAnimationFrame 塌缩（与 math-exec 的 withInstantRafOnly 一致），
// 但时间轴状态场由 seek 同步驱动，不依赖 rAF 循环；say 的 setTimeout 等待保持真实。
function withInstantRafOnly(run: () => Promise<void>) {
  const origRaf = globalThis.requestAnimationFrame;
  vi.stubGlobal(
    "requestAnimationFrame",
    (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now() + 1e7), 0) as unknown as number
  );
  return run().finally(() => vi.stubGlobal("requestAnimationFrame", origRaf));
}

// 每个 slug 期望在生成的 JS 中至少包含的核心标记（codegen 正确性）
const EXPECT_MARK: Record<string, string> = {
  day_night: 'type: "tween"', // 背景明暗 tween
  rain: 'kind: "rain"', // 下雨粒子轨道
  snow: 'kind: "snow"', // 下雪粒子轨道
  volcano: 'kind: "lava"', // 火山粒子轨道
  color_wheel: "__runtime.timelineMix(", // 颜色混合 reporter
  rainbow_bridge: 'type: "tween"', // 左右位置 tween
  seed_grow: 'type: "tween"', // 大小/位置 tween
  earth_sun: 'type: "orbit"', // 公转轨道
  food_chain: 'type: "tween"', // 三七移动 tween
  moon_phase: 'type: "tween"', // 显示程度 tween
};

const SCIENCE_SLUGS = Object.keys(EXPECT_MARK);

// 在快照里取某角色
function actorAt(state: StageState, id: string) {
  return state.actors.find((a) => a.id === id);
}

describe("分类10·自然科学模拟·端到端真实运行（看示范必须真能跑完且三步全亮）", () => {
  for (const slug of SCIENCE_SLUGS) {
    it(`${slug}：看示范能真实生成时间轴代码、无报错、三步全亮`, async () => {
      await withInstantRafOnly(async () => {
        const { code, logs, steps } = await runTimelineDemo(slug);
        // 1) codegen 不含错误且含该项目的核心时间轴标记
        expect(code).toBeTruthy();
        expect(code).toContain("__runtime.timeline.reset(10)");
        expect(code).toContain(EXPECT_MARK[slug]);

        // 2) 注入执行无「时间轴程序出错」
        expect(logs.some((l) => l.includes("时间轴程序出错"))).toBe(false);

        // 3) 三步进度全部完成（孩子点运行/看示范后弹「完成」）
        expect(steps.every((s) => s.done)).toBe(true);
      });
    });
  }

  it("day_night：背景明暗真的从 0 渐变到 220（tween 驱动状态场）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("day_night");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at8 = snapshots.find((s) => s.t === 8)!.state;
      const bg0 = (at0 as unknown as { bgHue?: number }).bgHue ?? 0;
      const bg8 = (at8 as unknown as { bgHue?: number }).bgHue ?? 0;
      expect(bg0).toBeCloseTo(0, 0);
      expect(bg8).toBeCloseTo(220, 0);
    });
  });

  it("rain：天空真的发射了雨点粒子（粒子轨道驱动状态场）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("rain");
      const mid = snapshots.find((s) => s.t === 2)!.state;
      const rainParticles = (mid.particles ?? []).filter((p) => p.kind === "rain");
      expect(rainParticles.length).toBeGreaterThan(0);
    });
  });

  it("earth_sun：零二真的绕中心公转（orbit 驱动坐标）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("earth_sun");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at4 = snapshots.find((s) => s.t === 4)!.state; // 半圈
      const at8 = snapshots.find((s) => s.t === 8)!.state; // 整圈回到起点
      const a0 = actorAt(at0, "erling")!;
      const a4 = actorAt(at4, "erling")!;
      const a8 = actorAt(at8, "erling")!;
      // 半圈时坐标应明显偏离起点（绕中心 160x110 椭圆）
      expect(Math.hypot(a4.x - a0.x, a4.y - a0.y)).toBeGreaterThan(50);
      // 整圈应回到起点附近
      expect(Math.hypot(a8.x - a0.x, a8.y - a0.y)).toBeLessThan(5);
    });
  });

  it("color_wheel：三种颜色混合确实算出正确名字（红+黄→橙、黄+蓝→绿、红+蓝→紫）", async () => {
    await withInstantRafOnly(async () => {
      const { logs } = await runTimelineDemo("color_wheel");
      expect(logs.some((l) => l.includes("橙"))).toBe(true);
      expect(logs.some((l) => l.includes("绿"))).toBe(true);
      expect(logs.some((l) => l.includes("紫"))).toBe(true);
    });
  });

  it("seed_grow：种子大小真的从 0.1 长到 1（actorSize tween 驱动）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("seed_grow");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at8 = snapshots.find((s) => s.t === 8)!.state;
      const s0 = actorAt(at0, "erling")!.size;
      const s8 = actorAt(at8, "erling")!.size;
      expect(s0).toBeCloseTo(0.1, 1);
      expect(s8).toBeCloseTo(1, 1);
    });
  });

  it("moon_phase：月亮显示程度从 0.15 渐变到 1（actorAlpha→visible 驱动）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("moon_phase");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at8 = snapshots.find((s) => s.t === 8)!.state;
      const v0 = actorAt(at0, "erling")!.visible;
      const v8 = actorAt(at8, "erling")!.visible;
      expect(v0).toBe(false); // alpha 0.15 < 0.5 → 隐藏（弯月）
      expect(v8).toBe(true); // alpha 1 ≥ 0.5 → 显示（满月）
    });
  });
});
