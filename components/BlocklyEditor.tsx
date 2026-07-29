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
        for (const block of topBlocks) {
          const type = block.type;
          if (type === "maker_when_start") {
            whenStart = javascriptGenerator.blockToCode(block).toString();
          } else if (type === "maker_when_stage_clicked") {
            whenStageClicked = javascriptGenerator.blockToCode(block).toString();
          }
        }
        runtime.setScripts({ whenStart, whenStageClicked });
        await runtime.handleRunStart();
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
