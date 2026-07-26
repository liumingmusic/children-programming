"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";

export interface BlocklyEditorHandle {
  getXml: () => string;
  loadXml: (xml: string) => void;
  run: (runtime: unknown) => Promise<void>;
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
      run: async (runtime: unknown) => {
        const workspace = workspaceRef.current;
        if (!workspace) return;
        const code = javascriptGenerator.workspaceToCode(workspace);
        if (!code.trim()) {
          // eslint-disable-next-line no-console
          console.log("No code to run");
          return;
        }
        // Wrap user code to expose runtime as a global variable during execution.
        // We also keep the real global clean by wrapping in a function.
        const wrapped = `(function(__runtime) {\n${code}\n})(__runtimeArg);`;
        (window as unknown as Record<string, unknown>).__runtimeArg = runtime;
        // eslint-disable-next-line no-eval
        eval(wrapped);
        delete (window as unknown as Record<string, unknown>).__runtimeArg;
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
