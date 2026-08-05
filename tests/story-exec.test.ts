import { describe, it, expect } from "vitest";
import { runDemoFull, withInstantRaf } from "./exec-helpers";

// 分类 7（故事与动画）共 10 个「看示范」项目。
// 用真实 Runtime 把 defaultXml 真跑一遍，断言：
//   1) 真实 Blockly 生成的 JS 不含错误、含正确的故事类标记（说话/表情/场景/控制角色/显隐）；
//   2) 用真实 Runtime 实际跑完，无运行时报错（"程序出错"）；
//   3) 三步进度全部完成（孩子点运行/看示范后弹「完成」）；
//   4) 带 cast 的项目（two_talk / a_day / magic_show）确实实例化了伙伴角色 三七。
//
// 测试里只把 requestAnimationFrame 塌缩成「立即触发」（move/turn 动画瞬间结束），
// 与 math-exec / draw-exec 一致；say 的 setTimeout 等待保持真实，
// 以免桩掉全局 setTimeout 误伤 Node undici 的内部连接超时定时器。
const EXPECT_MARK: Record<string, string> = {
  self_intro: "__runtime.say(",
  expression: "__runtime.setExpression(",
  freeze: "__runtime.move(",
  animal_sports: "__runtime.move(",
  word_chain: "__runtime.say(",
  birthday_party: "__runtime.setScene(",
  good_night: "__runtime.setScene(",
  two_talk: "__runtime.controlActor(",
  a_day: "__runtime.setScene(",
  magic_show: "__runtime.hideActor(",
};

const STORY_SLUGS = Object.keys(EXPECT_MARK);

// 带伙伴角色（三七）的项目：验证 once 实例化
const CAST_SLUGS = ["two_talk", "a_day", "magic_show"];

describe("分类7·故事与动画·端到端真实运行（看示范必须真能跑完且三步全亮）", () => {
  for (const slug of STORY_SLUGS) {
    it(`${slug}：看示范能真实跑完、无报错、codegen 含正确标记、三步全亮`, async () => {
      await withInstantRaf(async () => {
        const { code, logs, finalState, steps } = await runDemoFull(slug);
        // 1) codegen 不含错误且含该项目的核心标记
        expect(code).toBeTruthy();
        expect(code).toContain(EXPECT_MARK[slug]);

        // 2) 真实执行收尾，且无运行时报错
        expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
        expect(logs.some((l) => l.includes("程序出错"))).toBe(false);

        // 3) 三步进度全部完成
        expect(steps.every((s) => s.done)).toBe(true);

        // 4) 带 cast 的项目确实实例化了 三七
        if (CAST_SLUGS.includes(slug)) {
          expect(finalState.actors.some((a) => a.species === "sanqi")).toBe(true);
        }
      });
    });
  }

  it("two_talk：两个伙伴都开口说话（二零 + 三七 各至少一句）", async () => {
    await withInstantRaf(async () => {
      const { logs } = await runDemoFull("two_talk");
      expect(logs.some((l) => l.startsWith("[二零]"))).toBe(true);
      expect(logs.some((l) => l.startsWith("[三七]"))).toBe(true);
    });
  });

  it("magic_show：三七先被隐藏再被显示（藏起来 → 出现）", async () => {
    await withInstantRaf(async () => {
      const { logs } = await runDemoFull("magic_show");
      const hideIdx = logs.findIndex((l) => l.includes("三七 藏起来了"));
      const showIdx = logs.findIndex((l) => l.includes("三七 出现了"));
      // 隐藏的日志应早于出现的日志出现
      expect(hideIdx).toBeGreaterThanOrEqual(0);
      expect(showIdx).toBeGreaterThan(hideIdx);
    });
  });
});
