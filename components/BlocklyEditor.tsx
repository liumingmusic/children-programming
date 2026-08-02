"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import type { Runtime } from "@/lib/runtime";

export interface BlocklyEditorHandle {
  getXml: () => string;
  loadXml: (xml: string) => void;
  getCode: () => string;
  run: (runtime: Runtime) => Promise<void>;
  resetWorkspace: () => void;
}

interface BlocklyEditorProps {
  onChange?: (code: string) => void;
  /** 真实用户改动（非程序化加载）时回调当前积木 XML，供上层做自动保存。 */
  onAutoSave?: (xml: string) => void;
}

const BlocklyEditor = forwardRef<BlocklyEditorHandle, BlocklyEditorProps>(
  function BlocklyEditor({ onChange, onAutoSave }, ref) {
    const blocklyDiv = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    // 注入初始化 / 程序化 loadXml 期间抑制自动保存，避免把「刚加载的存档」或「看示范」误存成学生作品
    const suppressRef = useRef(false);
    // 用 ref 持有最新 onAutoSave，保证 effect 依赖稳定（[onChange]），不会因为回调变化而重新注入 Blockly
    const onAutoSaveRef = useRef(onAutoSave);
    onAutoSaveRef.current = onAutoSave;

    useEffect(() => {
      if (!blocklyDiv.current || workspaceRef.current) return;

      registerCustomBlocks();
      suppressRef.current = true;

      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: TOOLBOX,
        grid: {
          spacing: 20,
          length: 3,
          colour: "#e5e7eb",
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.85,
        },
        trashcan: true,
        theme: Blockly.Themes.Classic,
      });

      workspaceRef.current = workspace;

      const handleChange = () => {
        const code = javascriptGenerator.workspaceToCode(workspace);
        onChange?.(code);
        if (!suppressRef.current) {
          const xml = Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(workspace));
          onAutoSaveRef.current?.(xml);
        }
      };

      workspace.addChangeListener(handleChange);
      handleChange();
      // 初始化完成后放开自动保存（下一个 tick 再放开，跳过本次 handleChange）
      setTimeout(() => {
        suppressRef.current = false;
      }, 0);

      return () => {
        workspace.removeChangeListener(handleChange);
        workspace.dispose();
        workspaceRef.current = null;
      };
    }, [onChange]);

    useImperativeHandle(ref, () => ({
      getXml: () => {
        const workspace = workspaceRef.current;
        if (!workspace) return "";
        const xml = Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(workspace));
        return xml;
      },
      getCode: () => {
        const workspace = workspaceRef.current;
        if (!workspace) return "";
        return javascriptGenerator.workspaceToCode(workspace).toString();
      },
      loadXml: (xml: string) => {
        const workspace = workspaceRef.current;
        if (!workspace) return;
        // 先解析校验：解析失败则保留原有积木、不破坏画布（避免「刷新后空白」的极端情况）
        if (!xml) {
          suppressRef.current = true;
          workspace.clear();
          setTimeout(() => {
            suppressRef.current = false;
          }, 0);
          return;
        }
        let dom: Element | null = null;
        try {
          dom = Blockly.utils.xml.textToDom(xml);
        } catch (e) {
          console.error("Failed to parse Blockly XML, keep current blocks", e);
          return;
        }
        suppressRef.current = true;
        workspace.clear();
        try {
          Blockly.Xml.domToWorkspace(dom, workspace);
        } catch (e) {
          console.error("Failed to load Blockly XML", e);
        }
        setTimeout(() => {
          suppressRef.current = false;
        }, 0);
      },
      resetWorkspace: () => {
        const workspace = workspaceRef.current;
        if (!workspace) return;
        workspace.clear();
      },
      run: async (runtime: Runtime) => {
        const workspace = workspaceRef.current;
        if (!workspace) return;
        const topBlocks = workspace.getTopBlocks(true);
        let whenStart = "";
        let whenStageClicked = "";
        const whenKeyPressed: { key: string; code: string }[] = [];
        for (const block of topBlocks) {
          const type = block.type;
          if (type === "maker_when_start") {
            whenStart = javascriptGenerator.blockToCode(block).toString();
          } else if (type === "maker_when_stage_clicked") {
            whenStageClicked = javascriptGenerator.blockToCode(block).toString();
          } else if (type === "maker_when_key_pressed") {
            const key = block.getFieldValue("KEY") || "up";
            const code = javascriptGenerator.blockToCode(block).toString();
            whenKeyPressed.push({ key, code });
          }
        }
        runtime.setScripts({ whenStart, whenStageClicked, whenKeyPressed });
        await runtime.handleRunStart();
        // 演示用自动触发：有「当舞台被点击」脚本时，自动模拟一次舞台点击（无论是否同时有
        // 「当开始运行」，便于「两个事件组合」类项目在「看示范」时也能把点击分支跑出来）；
        // 否则若有「按下按键」脚本、且没有点击事件，自动模拟一次按键，让键盘操控项目也有可见演示。
        if (whenStageClicked) {
          await runtime.handleStageClick(0, 0);
        } else if (whenKeyPressed.length) {
          await runtime.handleKeyPressed(whenKeyPressed[0].key);
        }
      },
    }));

    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-black/10 bg-white">
        <div ref={blocklyDiv} className="h-full w-full" />
      </div>
    );
  }
);

export default BlocklyEditor;
