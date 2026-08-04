import { describe, it, expect, vi } from "vitest";
import { runDemoFull } from "./exec-helpers";
import type { CourseProject } from "@/courses";

// 分类 9（数学启蒙）共 10 个「看示范」项目。
// 此前这些项目只过了 courses/steps 的判定，未做过端到端运行时验证，
// 存在「判定过、实际跑偏/报错」的隐患（见 AGENTS.md §4）。
// 本文件用真实 Runtime 把 defaultXml 真跑一遍，断言：
//   1) 真实 Blockly 生成的 JS 不含错误、含正确算术/变量/图形标记；
//   2) 用真实 Runtime 实际跑完，无运行时报错（"程序出错"）；
//   3) 三步进度全部完成（孩子点运行/看示范后弹「完成」）。
//
// 测试里只把 requestAnimationFrame 塌缩成「立即触发」（move/turn 动画瞬间结束），
// 与 draw-exec.test.ts 的 withInstantRaf 一致；say 的 setTimeout 等待保持真实，
// 以免桩掉全局 setTimeout 误伤 Node undici 的内部连接超时定时器（会产生无关报错）。
function withInstantRafOnly(run: () => Promise<void>) {
  const origRaf = globalThis.requestAnimationFrame;
  vi.stubGlobal(
    "requestAnimationFrame",
    (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now() + 1e7), 0) as unknown as number
  );
  return run().finally(() => vi.stubGlobal("requestAnimationFrame", origRaf));
}

// 每个 slug 期望在生成的 JS 中至少包含的核心标记（codegen 正确性）。
const EXPECT_MARK: Record<string, string> = {
  count10: "__runtime.changeVar(",
  count_apples: "__runtime.changeVar(",
  compare_size: "__runtime.setVar(",
  add_sub: "__runtime.add(",
  shape_names: "__runtime.penDown()",
  symmetry: "__runtime.goto(",
  multiplication: "__runtime.changeVar(",
  clock: "__runtime.penDown()",
  geometry_puzzle: "__runtime.goto(",
  calculator: "__runtime.add(",
};

const MATH_SLUGS = Object.keys(EXPECT_MARK);

describe("分类9·数学启蒙·端到端真实运行（看示范必须真能跑完且三步全亮）", () => {
  for (const slug of MATH_SLUGS) {
    it(`${slug}：看示范能真实跑完、无报错、codegen 含正确标记、三步全亮`, async () => {
      await withInstantRafOnly(async () => {
        const { code, logs, steps } = await runDemoFull(slug);
        // 1) codegen 不含错误且含该项目的核心标记
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

  it("compare_size：比较判定确实基于真实数值（8 > 3 成立）", async () => {
    await withInstantRafOnly(async () => {
      const { logs } = await runDemoFull("compare_size");
      // 示范里 a=8, b=3，比较 a>b 成立 → 应说出「8 比 3 大！」
      expect(logs.some((l) => l.includes("8 比 3 大"))).toBe(true);
    });
  });

  it("add_sub：算术结果被正确算出（3+5=8、8-2=6）", async () => {
    await withInstantRafOnly(async () => {
      const { logs } = await runDemoFull("add_sub");
      // say 会输出计算结果；8 与 6 都应在日志里出现（按出现顺序先 8 后 6）
      const said = logs.filter((l) => l.startsWith("[二零]")).map((l) => l.replace("[二零] ", ""));
      expect(said).toContain("8");
      expect(said).toContain("6");
    });
  });
});
