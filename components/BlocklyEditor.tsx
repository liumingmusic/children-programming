"use client";

import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";

const toolbox = {
  kind: "flyoutToolbox" as const,
  contents: [
    {
      kind: "block" as const,
      type: "controls_repeat_ext",
    },
    {
      kind: "block" as const,
      type: "math_number",
      fields: { NUM: 10 },
    },
    {
      kind: "block" as const,
      type: "text",
      fields: { TEXT: "你好！我是二零" },
    },
    {
      kind: "block" as const,
      type: "text_print",
    },
  ],
};

interface BlocklyEditorProps {
  onChange?: (code: string) => void;
}

export default function BlocklyEditor({ onChange }: BlocklyEditorProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!blocklyDiv.current || workspaceRef.current) return;

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      grid: {
        spacing: 20,
        length: 3,
        colour: "#e5e7eb",
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
      },
      trashcan: true,
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

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-black/10 bg-white">
      <div ref={blocklyDiv} className="h-full w-full" />
    </div>
  );
}
