import { describe, it, expect } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { projects } from "@/courses";

/**
 * 全量冒烟：遍历 courses 中全部 105 个项目，确认每个非 memory 项目的 defaultXml
 * 都能被 Blockly 代码生成器成功转成非空 JS。
 *
 * 价值：积木类型若被改名 / 从 blockly-blocks 删除，但某项目的 demo 仍引用它，
 * 运行时「看示范」会静默崩溃。此测试把这类回归挡在 CI 之外（每次提交即校验）。
 * 这也是对「6-8 岁全部项目是否正确」的自动化保证。
 */
describe("全部项目 defaultXml 代码生成冒烟（防积木改名/缺定义导致看示范崩溃）", () => {
  it("所有非 memory 项目都能从 defaultXml 生成有效 JS（不抛错、非空）", () => {
    registerCustomBlocks();
    const div = document.createElement("div");
    document.body.appendChild(div);
    const workspace = Blockly.inject(div, {
      toolbox: TOOLBOX,
      grid: { spacing: 20, length: 3, colour: "#eee", snap: true },
      zoom: { controls: true, wheel: true, startScale: 0.85 },
      trashcan: true,
      theme: Blockly.Themes.Classic,
    });

    const failures: string[] = [];
    for (const p of projects) {
      if (p.component === "memory") continue; // 翻牌独立组件，不走 Blockly
      if (!p.defaultXml) {
        failures.push(`${p.slug}: 缺 defaultXml`);
        continue;
      }
      try {
        workspace.clear();
        const dom = Blockly.utils.xml.textToDom(p.defaultXml);
        Blockly.Xml.domToWorkspace(dom, workspace);
        const code = javascriptGenerator.workspaceToCode(workspace).toString();
        if (!code || !code.trim()) failures.push(`${p.slug}: 生成空代码`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        failures.push(`${p.slug}: ${msg.slice(0, 80)}`);
      }
    }
    workspace.dispose();
    expect(failures, `以下项目的 defaultXml 代码生成失败：\n${failures.join("\n")}`).toEqual([]);
  });
});
