import { describe, it, expect } from "vitest";
import { runDemoFull, withInstantRaf } from "./exec-helpers";

// 分类 4（事件）9 项、分类 5（条件）5 项、分类 6（游戏）7 项，共 21 个「看示范」项目。
// 用真实 Blockly 把 defaultXml 转成 JS，再用真实 Runtime 真跑一遍，
// 断言：代码能解析、运行无报错、三步进度全部点亮；收集类项目确实收集到所有星星。
// （覆盖 AGENTS.md §4 的「看示范必须真能跑」「步骤判定用真实 JS 标记」红线）

const EVENT_SLUGS = [
  "click_jump", "click_color", "click_dialog", "two_events", "click_play_dialog",
  "auto_patrol", "key_forward", "edge_bounce", "size_toggle",
];
const COND_SLUGS = ["if_touch_star", "if_edge_turn", "if_red_stop", "click_left_right", "collect3"];
const GAME_SLUGS = [
  "maze_exit", "collect_apples", "light_lanterns", "collect_rainbow",
  "treasure_map", "escort", "traffic_police",
];
const ALL_SLUGS = [...EVENT_SLUGS, ...COND_SLUGS, ...GAME_SLUGS];
const COLLECT_SLUGS = ["collect3", "collect_apples", "collect_rainbow"];

describe("分类4/5/6 · 端到端真实运行（看示范必须真能跑完、三步全亮）", () => {
  for (const slug of ALL_SLUGS) {
    it(`${slug}：看示范能真实跑完、无报错、三步全亮`, async () => {
      await withInstantRaf(async () => {
        const { logs, steps } = await runDemoFull(slug);
        expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
        expect(logs.some((l) => l.includes("程序出错"))).toBe(false);
        expect(steps.length).toBe(3);
        expect(steps.every((s) => s.done)).toBe(true);
      });
    });
  }

  describe("收集类项目：确实收集到全部星星", () => {
    for (const slug of COLLECT_SLUGS) {
      it(`${slug}：所有星星都被收集`, async () => {
        await withInstantRaf(async () => {
          const { finalState, logs } = await runDemoFull(slug);
          // 项目若定义了 stars 字段，运行后应全部 collected
          if (finalState.stars.length > 0) {
            expect(finalState.stars.every((s) => s.collected)).toBe(true);
          }
          expect(logs.some((l) => l.includes("所有星星都收集完了"))).toBe(true);
        });
      });
    }
  });
});
