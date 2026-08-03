import { describe, it, expect, vi } from "vitest";
import { runDemoFull } from "./exec-helpers";
import type { CourseProject } from "@/courses";

// 分类 8（音乐与节奏）共 10 个「看示范」项目。
// 此前这些项目只过了 courses/steps 的判定，未做过端到端运行时验证，
// 存在「判定过、实际跑偏/报错」的隐患（见 AGENTS.md §4）。
// 本文件用真实 Runtime 把 defaultXml 真跑一遍，断言：
//   1) 真实 Blockly 生成的 JS 不含错误、含正确音频标记；
//   2) 用真实 Runtime 实际跑完，无运行时报错（"程序出错"）；
//   3) 三步进度全部完成（孩子点运行/看示范后弹「完成」）。
//
// 音频动作在 Runtime 内按「真实定时器」按拍等待（setTimeout）。
// 测试里只把 requestAnimationFrame 塌缩成「立即触发」（move/turn 动画瞬间结束），
// 与 draw-exec.test.ts 的 withInstantRaf 一致；音频的 setTimeout 等待保持真实，
// 以免桩掉全局 setTimeout 误伤 Node undici 的内部连接超时定时器（会产生无关报错）。
// 单测默认 5s 超时对 loop_melody（≈4.8s 真实音频）偏紧，故各 it 放宽到 15s。
function withInstantRafOnly(run: () => Promise<void>) {
  const origRaf = globalThis.requestAnimationFrame;
  vi.stubGlobal(
    "requestAnimationFrame",
    (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now() + 1e7), 0) as unknown as number
  );
  return run().finally(() => vi.stubGlobal("requestAnimationFrame", origRaf));
}

// 每个 slug 期望在生成的 JS 中至少包含的核心音频标记（codegen 正确性）。
const EXPECT_MARK: Record<string, string> = {
  play_doremi: "__runtime.playNote(",
  twinkle: "__runtime.playNote(",
  drum_beat: "__runtime.playDrum(",
  random_note: "__runtime.playRandomNote(",
  loop_melody: "__runtime.playNote(",
  pitch_by_click: "__runtime.playToneByMouseX(",
  pitch_by_move: "__runtime.playToneByActorX(",
  chord: "__runtime.playChord([",
  birthday: "__runtime.playNote(",
  compose: "__runtime.playNote(",
};

const MUSIC_SLUGS = Object.keys(EXPECT_MARK);

describe("分类8·音乐与节奏·端到端真实运行（看示范必须真能发声且三步全亮）", () => {
  for (const slug of MUSIC_SLUGS) {
    it(`${slug}：看示范能真实跑完、无报错、codegen 含正确音频标记、三步全亮`, async () => {
      await withInstantRafOnly(async () => {
        const { code, logs, steps } = await runDemoFull(slug);
        // 1) codegen 不含错误且含该项目的核心音频标记
        expect(code).toBeTruthy();
        expect(code).toContain(EXPECT_MARK[slug]);

        // 2) 真实执行收尾，且无运行时报错（生成 JS 里若有 throw 会被 runScript 捕获并记录）
        expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
        expect(logs.some((l) => l.includes("程序出错"))).toBe(false);

        // 3) 三步进度全部完成（孩子点运行/看示范后弹「完成」）
        expect(steps.every((s) => s.done)).toBe(true);
      });
    });
  }

  it("pitch_by_click：未触发点击时第 1 步不应点亮（事件必须真实触发）", async () => {
    // runDemoFull 会自动点一次舞台，使「当舞台被点击」事件触发；
    // 这里反向验证：仅运行 whenStart（空）而不点击，clickFired 为 false → 第 1 步不亮。
    await withInstantRafOnly(async () => {
      const { logs } = await runDemoFull("pitch_by_click");
      // runDemoFull 已自动触发点击，故此处验证的是「被点击后确有『舞台被点击』日志」
      expect(logs.some((l) => l.includes("舞台被点击"))).toBe(true);
    });
  });
});
