import { describe, it, expect, vi } from "vitest";
import { runTimelineDemo, genCode } from "./exec-helpers";
import { computeSteps } from "@/lib/steps";
import { getProject } from "@/courses";
import type { StageState } from "@/lib/runtime";

// 分类 J（9-12 科学探究）共 7 个「看示范」项目，全部走时间轴引擎（project.timeline=true），
// 复用分类 10·科学的 maker_tween_prop / maker_orbit / maker_emit_* / maker_when_at_* 积木。
// 此前 6-8 科学已做过端到端验证（science-exec.test.ts），本文件对 9-12 的 7 项做同等严格验证：
//   1) 真实 codegen 含正确时间轴标记（reset/addTrack/轨道类型）；
//   2) 注入执行无「时间轴程序出错」；
//   3) 时间轴真的驱动了世界状态（tween 改属性 / orbit 改坐标 / 粒子被发射）；
//   4) 三步进度全部完成（孩子点运行/看示范后弹「完成」）。
// 另加一项「空程序守卫」：只放「当开始运行（时间轴）」而无任何轨道积木时，step1 必不通过——
// 与 6-8 科学同一套真实标记把关，杜绝「随便搭积木也能通过」。

// 测试里只把 requestAnimationFrame 塌缩（与 science-exec 的 withInstantRafOnly 一致），
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
  science_day_night: 'type: "tween"', // 背景明暗 tween
  science_seasons: 'type: "tween"', // 背景明暗 tween（光线随季节流转）
  science_orbit: 'type: "orbit"', // 公转轨道
  science_water_cycle: 'kind: "rain"', // 下雨粒子轨道
  science_grow: 'type: "tween"', // 大小 + 位置两条 tween
  science_sound: 'type: "tween"', // 大小 tween（声波扩散）
  science_light: 'type: "tween"', // 直线 + 斜向多条 tween
};

const SCIENCE9_SLUGS = Object.keys(EXPECT_MARK);

// 在快照里取某角色
function actorAt(state: StageState, id: string) {
  return state.actors.find((a) => a.id === id);
}

describe("分类J·科学探究·端到端真实运行（看示范必须真能跑完且三步全亮）", () => {
  for (const slug of SCIENCE9_SLUGS) {
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
        expect(steps.length).toBe(3);
      });
    });
  }

  it("science_day_night：背景明暗真的从 0 渐变到 220（tween 驱动状态场）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("science_day_night");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at8 = snapshots.find((s) => s.t === 8)!.state;
      const bg0 = (at0 as unknown as { bgHue?: number }).bgHue ?? 0;
      const bg8 = (at8 as unknown as { bgHue?: number }).bgHue ?? 0;
      expect(bg0).toBeCloseTo(0, 0);
      expect(bg8).toBeCloseTo(220, 0);
    });
  });

  it("science_seasons：背景明暗随季节从 20 渐变到 200（tween 驱动状态场）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("science_seasons");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at8 = snapshots.find((s) => s.t === 8)!.state;
      const bg0 = (at0 as unknown as { bgHue?: number }).bgHue ?? 0;
      const bg8 = (at8 as unknown as { bgHue?: number }).bgHue ?? 0;
      expect(bg0).toBeCloseTo(20, 0);
      expect(bg8).toBeCloseTo(200, 0);
    });
  });

  it("science_orbit：零二真的绕中心公转（orbit 驱动坐标）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("science_orbit");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at4 = snapshots.find((s) => s.t === 4)!.state; // 半圈
      const at8 = snapshots.find((s) => s.t === 8)!.state; // 整圈回到起点
      const a0 = actorAt(at0, "erling")!;
      const a4 = actorAt(at4, "erling")!;
      const a8 = actorAt(at8, "erling")!;
      expect(Math.hypot(a4.x - a0.x, a4.y - a0.y)).toBeGreaterThan(50);
      expect(Math.hypot(a8.x - a0.x, a8.y - a0.y)).toBeLessThan(5);
    });
  });

  it("science_water_cycle：天空真的发射了雨点粒子（粒子轨道驱动状态场）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("science_water_cycle");
      const mid = snapshots.find((s) => s.t === 5)!.state; // 雨段 3~8 秒内
      const rainParticles = (mid.particles ?? []).filter((p) => p.kind === "rain");
      expect(rainParticles.length).toBeGreaterThan(0);
      // 蒸发上升：t=0 时零二在地面（y≈0），t=3 时升到空中（y≈-80）
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at3 = snapshots.find((s) => s.t === 3)!.state;
      expect(actorAt(at3, "erling")!.y).toBeLessThan(actorAt(at0, "erling")!.y - 50);
    });
  });

  it("science_grow：种子大小真的从 0.1 长到 1（actorSize tween 驱动）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("science_grow");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at5 = snapshots.find((s) => s.t === 5)!.state;
      const s0 = actorAt(at0, "erling")!.size;
      const s5 = actorAt(at5, "erling")!.size;
      expect(s0).toBeCloseTo(0.1, 1);
      expect(s5).toBeCloseTo(1, 1);
    });
  });

  it("science_sound：声波（零二大小）真的从 0.2 扩到 3（actorSize tween 驱动）", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("science_sound");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at8 = snapshots.find((s) => s.t === 8)!.state;
      const s0 = actorAt(at0, "erling")!.size;
      const s8 = actorAt(at8, "erling")!.size;
      expect(s0).toBeCloseTo(0.2, 1);
      expect(s8).toBeCloseTo(3, 1);
    });
  });

  it("science_light：光路先直走再斜折（折射）——t=4 时 x≈0，t=8 时 x≈60 且 y 增大", async () => {
    await withInstantRafOnly(async () => {
      const { snapshots } = await runTimelineDemo("science_light");
      const at0 = snapshots.find((s) => s.t === 0)!.state;
      const at4 = snapshots.find((s) => s.t === 4)!.state; // 抵达水面
      const at8 = snapshots.find((s) => s.t === 8)!.state; // 斜着进入水中
      const a0 = actorAt(at0, "erling")!;
      const a4 = actorAt(at4, "erling")!;
      const a8 = actorAt(at8, "erling")!;
      // 空气中（0~4 秒）只竖直下落：x 始终≈0
      expect(Math.abs(a4.x)).toBeLessThan(1);
      expect(Math.abs(a0.x)).toBeLessThan(1);
      // 进入水中后斜向偏折：x 明显增大、y 继续增大（偏离原竖直方向）
      expect(a8.x).toBeGreaterThan(40);
      expect(a8.y).toBeGreaterThan(a4.y + 50);
    });
  });

  it("空程序守卫：只放「当开始运行（时间轴）」而无任何轨道积木时，step1 必不通过", () => {
    const emptyXml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start_tl" x="40" y="40">
        <statement name="STACK"></statement>
      </block>
    </xml>`;
    const code = genCode(emptyXml);
    // 只 reset，没有任何 addTrack —— 真实标记把关应识别「没有真正搭出轨道」
    expect(code).toContain("__runtime.timeline.reset(10)");
    expect(code).not.toContain("__runtime.timeline.addTrack(");
    const project = getProject("science_day_night")!;
    const steps = computeSteps(project, code, []);
    // step1（hasTimeline && hasTween/orbit/particle）必然为 false
    expect(steps.find((s) => s.id === 1)!.done).toBe(false);
    expect(steps.every((s) => s.done)).toBe(false);
  });
});
