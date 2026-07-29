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
}

const BlocklyEditor = forwardRef<BlocklyEditorHandle, BlocklyEditorProps>(
  function BlocklyEditor({ onChange }, ref) {
    const blocklyDiv = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    useEffect(() => {
      if (!blocklyDiv.current || workspaceRef.current) return;

      registerCustomBlocks();

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
      };

      workspace.addChangeListener(handleChange);
      handleChange();

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
        workspace.clear();
        if (!xml) return;
        try {
          const dom = Blockly.utils.xml.textToDom(xml);
          Blockly.Xml.domToWorkspace(dom, workspace);
        } catch (e) {
          console.error("Failed to load Blockly XML", e);
        }
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
