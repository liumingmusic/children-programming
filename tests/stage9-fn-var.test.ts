import { describe, it, expect } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks } from "@/lib/blockly-blocks";
import { projects } from "@/courses";

const FN = ["fn_square", "fn_polygon", "fn_house", "fn_snowflake", "fn_tree", "fn_toolbox", "fn_spiral", "fn_castle"];
const VAR = ["var_counter", "var_score", "var_lives", "var_speed", "var_parity", "var_gradient", "var_timer", "var_best"];

/**
 * 9-12 阶段「函数」与「变量」两个分类共 16 个项目的代码生成冒烟。
 * 用无注入的 headless workspace（不触发 Blockly 的 fragment 媒体 CDN 拉取，
 * 避免离线沙箱失败），确认每个 defaultXml 都能生成含预期标记的有效 JS。
 */
describe("9-12 分类 A/B 代码生成与关键标记", () => {
  it("所有新项目都能从 defaultXml 生成有效 JS（含函数定义/调用、变量、计时、最高分）", () => {
    registerCustomBlocks();
    const ws = new Blockly.Workspace();
    const fails: string[] = [];
    for (const slug of [...FN, ...VAR]) {
      const p = projects.find((x) => x.slug === slug);
      if (!p) {
        fails.push(`${slug}: 项目未注册`);
        continue;
      }
      ws.clear();
      try {
        const dom = Blockly.utils.xml.textToDom(p.defaultXml!);
        Blockly.Xml.domToWorkspace(dom, ws);
        const code = javascriptGenerator.workspaceToCode(ws).toString();
        if (!code.trim()) {
          fails.push(`${slug}: 生成空代码`);
          continue;
        }
        if (FN.includes(slug) && !code.includes("function ")) fails.push(`${slug}: 缺函数定义`);
        if (FN.includes(slug) && !code.includes("();")) fails.push(`${slug}: 缺函数调用`);
        if (slug === "fn_tree" && !code.includes("画树")) fails.push(`${slug}: 递归未出现`);
        if (slug === "var_parity" && !code.includes("%")) fails.push(`${slug}: 缺取余`);
        if (slug === "var_timer" && !code.includes("Date.now()")) fails.push(`${slug}: 缺计时`);
        if (slug === "var_best" && !code.includes("__runtime.setBest")) fails.push(`${slug}: 缺最高分写入`);
      } catch (e) {
        fails.push(`${slug}: ${(e as Error).message.slice(0, 80)}`);
      }
    }
    ws.dispose();
    expect(fails, `以下项目代码生成异常：\n${fails.join("\n")}`).toEqual([]);
  });

  it("函数声明会 hoist：调用写在定义之前也能生成可执行的 JS", () => {
    registerCustomBlocks();
    const ws = new Blockly.Workspace();
    const p = projects.find((x) => x.slug === "fn_square")!;
    const dom = Blockly.utils.xml.textToDom(p.defaultXml!);
    Blockly.Xml.domToWorkspace(dom, ws);
    const code = javascriptGenerator.workspaceToCode(ws).toString();
    // 调用应出现在 function 定义之前（DOM 顺序：when_start 在前），但 hoist 保证可执行
    const callIdx = code.indexOf("画正方形();");
    const defIdx = code.indexOf("function 画正方形");
    expect(callIdx).toBeGreaterThanOrEqual(0);
    expect(defIdx).toBeGreaterThanOrEqual(0);
    expect(callIdx).toBeLessThan(defIdx);
    ws.dispose();
  });
});
