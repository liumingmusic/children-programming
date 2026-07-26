"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Save, CheckCircle } from "lucide-react";
import BlocklyEditor, { BlocklyEditorHandle } from "@/components/BlocklyEditor";
import StagePlayer from "@/components/StagePlayer";
import { Runtime, StageState } from "@/lib/runtime";
import { getProject, CourseProject } from "@/courses";
import { loadProject, saveProject, markProgress, getProgress } from "@/lib/db";

function ErLingAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm ${className}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full p-2">
        <circle cx="50" cy="45" r="32" fill="#F5C4B3" />
        <circle cx="38" cy="40" r="4" fill="#1a1a2e" />
        <circle cx="62" cy="40" r="4" fill="#1a1a2e" />
        <path d="M38 58 Q50 68 62 58" fill="none" stroke="#D85A30" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 30 Q30 10 42 22" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" />
        <path d="M78 30 Q70 10 58 22" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 360;

interface LearnPageClientProps {
  project: CourseProject;
}

export default function LearnPageClient({ project }: LearnPageClientProps) {
  const editorRef = useRef<BlocklyEditorHandle>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const [stageState, setStageState] = useState<StageState>({
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    actor: { x: 0, y: 0, angle: 90, message: null, messageUntil: 0 },
    running: false,
    log: [],
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "loading">("idle");
  const [progress, setProgress] = useState({ completed: false, stars: 0 });
  const progressRef = useRef({ completed: false, stars: 0 });

  useEffect(() => {
    const runtime = new Runtime(STAGE_WIDTH, STAGE_HEIGHT, (state) => {
      setStageState(state);
      setLogs(state.log);
      if (state.log.includes("[系统] 程序执行完毕") && !progressRef.current.completed) {
        progressRef.current = { completed: true, stars: 3 };
        setProgress(progressRef.current);
        markProgress(project.slug, true, 3).catch(console.error);
      }
    });
    runtimeRef.current = runtime;

    // Load saved project or default
    loadProject(project.slug).then((xml) => {
      if (editorRef.current) {
        editorRef.current.loadXml(xml || project.defaultXml || "");
      }
    });

    getProgress(project.slug).then((p) => {
      if (p) {
        progressRef.current = { completed: p.completed, stars: p.stars };
        setProgress(progressRef.current);
      }
    });

    return () => {
      runtime.reset();
    };
  }, [project.slug, project.defaultXml]);

  const handleRun = useCallback(async () => {
    const runtime = runtimeRef.current;
    const editor = editorRef.current;
    if (!runtime || !editor) return;

    runtime.reset();
    setSaveStatus("idle");
    await editor.run(runtime);
  }, []);

  const handleReset = useCallback(() => {
    runtimeRef.current?.reset();
    setSaveStatus("idle");
  }, []);

  const handleSave = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;
    setSaveStatus("loading");
    const xml = editor.getXml();
    await saveProject(project.slug, project.title, project.ageGroup, xml);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [project]);

  const stepStatus = project.steps.map((step, index) => {
    const id = step.id;
    let done = false;
    if (id === 1) {
      done = logs.some((log) => log.includes("[系统]") && (log.includes("移动") || log.includes("执行")));
    } else if (id === 2) {
      done = logs.some((log) => log.startsWith("[二零]"));
    } else if (id === 3) {
      done = logs.includes("[系统] 程序执行完毕");
    }
    return { ...step, done };
  });
  const completedSteps = stepStatus.filter((s) => s.done).length;

  return (
    <div className="flex h-screen flex-col bg-[#fafbfc]">
      {/* 顶部栏 */}
      <header className="flex h-14 items-center justify-between border-b border-black/5 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-[#5F5E5A] hover:text-[#0F6E56]">
            <ArrowLeft className="h-4 w-4" />
            返回星球
          </Link>
          <h1 className="text-base font-medium text-[#04342C]">{project.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#04342C]">
            进度 {completedSteps}/{project.steps.length}
          </span>
          {progress.completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAEEDA] px-3 py-1 text-xs font-medium text-[#412402]">
              <CheckCircle className="h-3.5 w-3.5" />
              已完成
            </span>
          )}
          <ErLingAvatar className="h-8 w-8" />
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex flex-1 gap-3 overflow-hidden p-3">
        {/* 左侧任务面板 */}
        <aside className="flex w-72 flex-col gap-3">
          <div className="flex-1 rounded-xl border border-black/10 bg-white p-4">
            <h2 className="mb-4 text-sm font-medium text-[#04342C]">任务步骤</h2>
            <div className="space-y-3">
              {stepStatus.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                    step.done
                      ? "border-[#5DCAA5] bg-[#E1F5EE] text-[#04342C]"
                      : "border-black/5 bg-[#F1EFE8] text-[#5F5E5A]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                      step.done ? "bg-[#0F6E56] text-white" : "bg-white text-[#5F5E5A]"
                    }`}
                  >
                    {step.done ? "✓" : step.id}
                  </span>
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#F0997B]/30 bg-[#FAECE7] p-4">
            <div className="mb-2 flex items-center gap-2">
              <ErLingAvatar className="h-8 w-8" />
              <span className="text-sm font-medium text-[#4A1B0C]">二零说</span>
            </div>
            <p className="text-sm leading-relaxed text-[#712B13]">{project.erLingHint}</p>
          </div>
        </aside>

        {/* 中间积木编辑区 */}
        <section className="flex min-w-0 flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
          <h2 className="mb-2 text-sm font-medium text-[#04342C]">积木工作区</h2>
          <div className="min-h-0 flex-1">
            <BlocklyEditor ref={editorRef} onChange={setGeneratedCode} />
          </div>
        </section>

        {/* 右侧预览区 */}
        <aside className="flex w-96 flex-col gap-3">
          <div className="flex flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
            <h2 className="mb-2 text-sm font-medium text-[#04342C]">舞台预览</h2>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-[#E6F1FB]">
              <StagePlayer state={stageState} />
            </div>
          </div>

          <div className="h-48 rounded-xl border border-black/10 bg-[#F1EFE8] p-3">
            <h3 className="mb-2 text-xs font-medium text-[#444441]">运行日志</h3>
            <div className="scrollbar-hide h-36 space-y-1 overflow-y-auto text-xs text-[#5F5E5A]">
              {logs.length === 0 && <div className="text-[#999]">点击「运行」开始...</div>}
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* 底部操作栏 */}
      <footer className="flex h-14 items-center justify-between border-t border-black/5 bg-white px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={stageState.running}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#EF9F27]/30 bg-[#FAEEDA] px-4 text-sm font-medium text-[#412402] hover:bg-[#FAC775] disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </button>
          <button
            onClick={handleSave}
            disabled={stageState.running || saveStatus === "loading"}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#5DCAA5]/30 bg-[#E1F5EE] px-4 text-sm font-medium text-[#04342C] hover:bg-[#9FE1CB] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveStatus === "saved" ? "已保存" : saveStatus === "loading" ? "保存中" : "保存"}
          </button>
        </div>
        <button
          onClick={handleRun}
          disabled={stageState.running}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#0F6E56] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#085041] disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {stageState.running ? "运行中..." : "运行"}
        </button>
      </footer>

      {/* 生成的代码预览（调试用，开发阶段可隐藏） */}
      {generatedCode && (
        <div className="hidden border-t border-black/5 bg-white px-4 py-2 text-xs text-[#5F5E5A]">
          <pre className="font-mono">{generatedCode}</pre>
        </div>
      )}
    </div>
  );
}
