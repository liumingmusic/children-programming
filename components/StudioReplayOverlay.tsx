"use client";

import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { Runtime, type StageState, type Species } from "@/lib/runtime";
import StagePlayer from "@/components/StagePlayer";
import { X, Play } from "lucide-react";

/** 伙伴角色元数据：与 StudioClient / LearnPageClient 保持一致。 */
const CAST_META: Record<string, { id: string; species: Species; name: string }> = {
  sanqi: { id: "sanqi", species: "sanqi", name: "三七" },
};

/**
 * 「回放」浮层：用一份已保存的 xml 独立运行，完全不触碰学生当前编辑画布。
 * 关键：与 DemoOverlay 同理——另起一个只读 Blockly 工作区 + 独立 Runtime，
 * 关闭浮层后编辑区原样保留（草稿不会被回放的作品覆盖）。
 */
export default function StudioReplayOverlay({
  xml,
  title,
  onClose,
}: {
  xml: string;
  title: string;
  onClose: () => void;
}) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const wsRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const [state, setState] = useState<StageState | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!blocklyDiv.current) return;
    registerCustomBlocks();
    const ws = Blockly.inject(blocklyDiv.current, {
      readOnly: true,
      toolbox: TOOLBOX,
      grid: { spacing: 20, length: 3, colour: "#eee", snap: true },
      zoom: { controls: false, wheel: false, startScale: 0.72 },
      trashcan: false,
      theme: Blockly.Themes.Classic,
    });
    wsRef.current = ws;

    const layout = () => {
      try {
        ws.resize();
        ws.scrollCenter();
      } catch {
        /* noop */
      }
    };
    requestAnimationFrame(layout);

    if (xml) {
      try {
        const dom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, ws);
        requestAnimationFrame(() => ws.scrollCenter());
      } catch (e) {
        console.error("Failed to load replay XML", e);
      }
    }

    const companions = Object.values(CAST_META).map((c) => ({
      id: c.id,
      species: c.species,
      name: c.name,
    }));
    const rt = new Runtime(480, 360, (s) => setState(s), [], { companions });
    runtimeRef.current = rt;

    return () => {
      ws.dispose();
      rt.reset();
      wsRef.current = null;
      runtimeRef.current = null;
    };
  }, [xml]);

  const handleRun = async () => {
    const ws = wsRef.current;
    const rt = runtimeRef.current;
    if (!ws || !rt || running) return;
    // 每次运行前重置：避免从上一次终点接着跑、大小/位置逐次累积。
    rt.reset();
    setRunning(true);
    javascriptGenerator.init(ws);
    let whenStart = "";
    let whenStageClicked = "";
    const whenKeyPressed: { key: string; code: string }[] = [];
    for (const b of ws.getTopBlocks(true)) {
      const code = javascriptGenerator.blockToCode(b).toString();
      if (b.type === "maker_when_start") whenStart += code + "\n";
      else if (b.type === "maker_when_stage_clicked") whenStageClicked += code + "\n";
      else if (b.type === "maker_when_key_pressed")
        whenKeyPressed.push({ key: b.getFieldValue("KEY") || "up", code: code + "\n" });
    }
    whenStart = javascriptGenerator.finish(whenStart);
    whenStageClicked = javascriptGenerator.finish(whenStageClicked);
    whenKeyPressed.forEach((k) => (k.code = javascriptGenerator.finish(k.code)));
    rt.setScripts({ whenStart, whenStageClicked, whenKeyPressed });
    await rt.handleRunStart();
    if (whenStageClicked) await rt.handleStageClick(0, 0);
    else if (whenKeyPressed.length) await rt.handleKeyPressed(whenKeyPressed[0].key);
    setRunning(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-[#5F5E5A] hover:bg-[#F1EFE8]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-black/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E1F5EE] text-sm">
              🎬
            </span>
            <h3 className="text-lg font-medium text-[#04342C]">回放：{title}</h3>
          </div>
          <p className="mt-1.5 text-sm text-[#5F5E5A]">
            这是你保存的作品回放，原样运行一遍。你的画布在背后保留，关闭浮层就回到编辑区。
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 p-6 md:flex-row">
          <div className="flex min-h-0 flex-1 flex-col">
            <p className="mb-2 shrink-0 text-xs font-medium text-[#444441]">作品积木</p>
            <div className="h-[440px] w-full shrink-0 overflow-hidden rounded-xl border border-black/10 bg-[#F1EFE8]">
              <div ref={blocklyDiv} className="h-full w-full" />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <p className="mb-2 text-xs font-medium text-[#444441]">运行效果</p>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#E6F1FB] p-2">
              {state && <StagePlayer state={state} scene={undefined} />}
            </div>
            <button
              onClick={handleRun}
              disabled={running}
              className="mt-3 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#0F6E56] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#085041] disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {running ? "运行中..." : "运行回放"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
