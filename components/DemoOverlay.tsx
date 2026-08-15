"use client";

import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { Runtime, type StageState, type Hazard, type Cloud, type Species } from "@/lib/runtime";
import StagePlayer from "@/components/StagePlayer";

/** 伙伴角色元数据：cast id → 物种与名字。新增伙伴角色在此登记。 */
const CAST_META: Record<string, { id: string; species: Species; name: string }> = {
  sanqi: { id: "sanqi", species: "sanqi", name: "三七" },
};
import { X, Play } from "lucide-react";
import type { CourseProject } from "@/courses";

/**
 * 「看示范」浮层：只读展示参考答案积木 + 独立舞台「运行示范」。
 * 关键：完全不触碰学生主画布——关闭浮层即回到学生自己的作品，原样保留。
 * 与旧实现（把主工作区替换成示范再还原）相比，避免了「我的积木去哪了」的困惑。
 */
export default function DemoOverlay({
  project,
  onClose,
}: {
  project: CourseProject;
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

    // Blockly 注入后必须校正一次尺寸：浮层挂载瞬间父容器可能尚未完成布局，
    // 若不 resize，workSpace 会停在 0×0，积木被渲染到不可见区域 → 表现为「参考答案页面空白」。
    const layout = () => {
      try {
        ws.resize();
        ws.scrollCenter();
      } catch {
        /* noop */
      }
    };
    requestAnimationFrame(layout);

    if (project.defaultXml) {
      try {
        const dom = Blockly.utils.xml.textToDom(project.defaultXml);
        Blockly.Xml.domToWorkspace(dom, ws);
        // 加载完积木后再次居中，确保参考答案完整可见
        requestAnimationFrame(() => ws.scrollCenter());
      } catch (e) {
        console.error("Failed to load demo XML", e);
      }
    }

    const initialStars = project.stars
      ? project.stars.map((s, i) => ({ id: i + 1, x: s.x, y: s.y, collected: false }))
      : undefined;
    const hazards = (project.scene?.marks ?? [])
      .filter((m) => m.kind === "obstacle" || m.kind === "badguy")
      .map((m) => ({ x: m.x, y: m.y, r: 32, kind: m.kind as "obstacle" | "badguy" })) as Hazard[];
    const clouds = (project.scene?.clouds ?? []) as Cloud[];
    const companions = (project.cast ?? [])
      .map((id) => CAST_META[id])
      .filter((c): c is { id: string; species: Species; name: string } => Boolean(c));
    const rt = new Runtime(
      480,
      360,
      (s) => setState(s),
      initialStars,
      { hazards, clouds, companions }
    );
    runtimeRef.current = rt;

    return () => {
      ws.dispose();
      rt.reset();
      wsRef.current = null;
      runtimeRef.current = null;
    };
  }, [project]);

  const handleRun = async () => {
    const ws = wsRef.current;
    const rt = runtimeRef.current;
    if (!ws || !rt || running) return;
    // 关键：每次运行前先把运行时重置到初始状态（角色位置/朝向/大小、星星、笔迹全部复位），
    // 否则会从上一次运行的终点接着跑、大小/位置逐次累积，表现为「越跑越远、无限放大」。
    rt.reset();
    setRunning(true);
    javascriptGenerator.init(ws);
    let whenStart = "";
    let whenStageClicked = "";
    const whenKeyPressed: { key: string; code: string }[] = [];
    const whenReceived: { message: string; code: string }[] = [];
    for (const b of ws.getTopBlocks(true)) {
      const code = javascriptGenerator.blockToCode(b).toString();
      if (b.type === "maker_when_start") whenStart += code + "\n";
      else if (b.type === "maker_when_stage_clicked") whenStageClicked += code + "\n";
      else if (b.type === "maker_when_key_pressed")
        whenKeyPressed.push({ key: b.getFieldValue("KEY") || "up", code: code + "\n" });
      else if (b.type === "maker_when_receive")
        whenReceived.push({ message: b.getFieldValue("MSG") || "出发", code: code + "\n" });
    }
    // finish() 负责补上变量/函数声明等前导代码，必须传入已生成的 code 并采用返回值
    whenStart = javascriptGenerator.finish(whenStart);
    whenStageClicked = javascriptGenerator.finish(whenStageClicked);
    whenKeyPressed.forEach((k) => (k.code = javascriptGenerator.finish(k.code)));
    rt.setScripts({ whenStart, whenStageClicked, whenKeyPressed, whenReceived });
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
              📺
            </span>
            <h3 className="text-lg font-medium text-[#04342C]">示范模式（参考答案 · 只读）</h3>
          </div>
          <p className="mt-1.5 text-sm text-[#5F5E5A]">
            这是官方参考答案，可以照着搭一遍。你的作品在背后原样保留，关闭浮层就回到你的画布。
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 p-6 md:flex-row">
          {/* 参考答案积木（只读） */}
          <div className="flex min-h-0 flex-1 flex-col">
            <p className="mb-2 shrink-0 text-xs font-medium text-[#444441]">参考答案积木</p>
            <div className="h-[440px] w-full shrink-0 overflow-hidden rounded-xl border border-black/10 bg-[#F1EFE8]">
              <div ref={blocklyDiv} className="h-full w-full" />
            </div>
          </div>

          {/* 演示舞台 */}
          <div className="flex min-h-0 flex-1 flex-col">
            <p className="mb-2 text-xs font-medium text-[#444441]">运行效果</p>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#E6F1FB] p-2">
              {state && <StagePlayer state={state} scene={project.scene} />}
            </div>
            <button
              onClick={handleRun}
              disabled={running}
              className="mt-3 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#0F6E56] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#085041] disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {running ? "运行中..." : "运行示范"}
            </button>
          </div>
        </div>

        {!project.defaultXml && (
          <p className="px-6 pb-4 text-sm text-[#8A8880]">该关卡暂无可参考的示范。</p>
        )}
      </div>
    </div>
  );
}
