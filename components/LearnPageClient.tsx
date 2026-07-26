"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Save, CheckCircle, X, BookOpen, Info } from "lucide-react";
import BlocklyEditor, { BlocklyEditorHandle } from "@/components/BlocklyEditor";
import StagePlayer from "@/components/StagePlayer";
import { Runtime, StageState } from "@/lib/runtime";
import type { CourseProject } from "@/courses";
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
const BRIEF_SEEN_KEY = (slug: string) => `maker-planet-brief-seen-${slug}`;

interface LearnPageClientProps {
  project: CourseProject;
}

interface StepToast {
  id: number;
  title: string;
}

export default function LearnPageClient({ project }: LearnPageClientProps) {
  const editorRef = useRef<BlocklyEditorHandle>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const [stageState, setStageState] = useState<StageState>({
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    actor: { x: 0, y: 0, angle: 90, message: null, messageUntil: 0 },
    penPaths: [],
    currentPath: null,
    penColor: 0,
    penDown: false,
    stars: [
      { id: 1, x: -120, y: 80, collected: false },
      { id: 2, x: 140, y: -60, collected: false },
      { id: 3, x: 80, y: 110, collected: false },
    ],
    running: false,
    log: [],
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "loading">("idle");
  const [progress, setProgress] = useState({ completed: false, stars: 0 });
  const progressRef = useRef({ completed: false, stars: 0 });

  const [showBrief, setShowBrief] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toasts, setToasts] = useState<StepToast[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const prevStepsDone = useRef<boolean[]>(project.steps.map(() => false));

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

    // Show mission brief on first visit
    const seen = typeof window !== "undefined" && localStorage.getItem(BRIEF_SEEN_KEY(project.slug)) === "true";
    setShowBrief(!seen);

    return () => {
      runtime.reset();
    };
  }, [project.slug, project.defaultXml]);

  const closeBrief = useCallback(() => {
    setShowBrief(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(BRIEF_SEEN_KEY(project.slug), "true");
    }
  }, [project.slug]);

  const handleRun = useCallback(async () => {
    const runtime = runtimeRef.current;
    const editor = editorRef.current;
    if (!runtime || !editor) return;

    if (!generatedCode.trim()) {
      setHint("二零还没收到指令呢～把积木拖到「当开始运行」下面，再点运行吧！");
      setTimeout(() => setHint(null), 4000);
      return;
    }

    runtime.reset();
    setSaveStatus("idle");
    setShowCelebration(false);
    await editor.run(runtime);
  }, [generatedCode]);

  const handleReset = useCallback(() => {
    runtimeRef.current?.reset();
    setSaveStatus("idle");
    setShowCelebration(false);
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

  const stepStatus = project.steps.map((step) => {
    const id = step.id;
    let done = false;
    const code = generatedCode;

    if (project.slug === "hello") {
      if (id === 1) done = logs.some((log) => log.includes("二零开始移动"));
      else if (id === 2) done = logs.some((log) => log.startsWith("[二零]"));
      else if (id === 3) done = logs.includes("[系统] 程序执行完毕");
    } else if (project.slug === "rainbow") {
      if (id === 1) done = code.includes("penDown") && (code.includes("setPenColor") || code.includes("changePenColor"));
      else if (id === 2) done = code.includes("controls_repeat_ext") && code.includes("maker_move") && code.includes("maker_turn");
      else if (id === 3) done = logs.includes("[系统] 程序执行完毕");
    } else if (project.slug === "stars") {
      if (id === 1) done = code.includes("maker_goto_star");
      else if (id === 2) done = logs.some((log) => log.startsWith("[二零]") && log.includes("收集"));
      else if (id === 3) done = logs.some((log) => log.includes("所有星星都收集完了"));
    }

    return { ...step, done };
  });

  // Trigger toasts when steps newly complete
  useEffect(() => {
    const newToasts: StepToast[] = [];
    stepStatus.forEach((step, index) => {
      if (step.done && !prevStepsDone.current[index]) {
        newToasts.push({ id: step.id, title: step.title });
      }
      prevStepsDone.current[index] = step.done;
    });
    if (newToasts.length) {
      setToasts((prev) => [...prev, ...newToasts]);
      newToasts.forEach((toast) => {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, 3000);
      });
    }
  }, [stepStatus]);

  // Trigger celebration when all steps complete
  useEffect(() => {
    if (stepStatus.every((s) => s.done) && !showCelebration && progress.completed) {
      setShowCelebration(true);
    }
  }, [stepStatus, progress.completed, showCelebration]);

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
          <button
            onClick={() => setShowBrief(true)}
            className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#E6F1FB] px-2.5 py-1 text-xs font-medium text-[#0C447C] hover:bg-[#CDE4F9]"
          >
            <Info className="h-3 w-3" />
            任务简报
          </button>
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
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    step.done
                      ? "border-[#5DCAA5] bg-[#E1F5EE] text-[#04342C]"
                      : "border-black/5 bg-[#F1EFE8] text-[#5F5E5A]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs transition-colors ${
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

      {/* 生成的代码预览（调试用） */}
      {generatedCode && (
        <div className="hidden border-t border-black/5 bg-white px-4 py-2 text-xs text-[#5F5E5A]">
          <pre className="font-mono">{generatedCode}</pre>
        </div>
      )}

      {/* Mission Brief Modal */}
      {showBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl">
            <button
              onClick={closeBrief}
              className="absolute right-4 top-4 rounded-full p-1 text-[#5F5E5A] hover:bg-[#F1EFE8]"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE]">
                <BookOpen className="h-6 w-6 text-[#0F6E56]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#04342C]">任务简报</h3>
                <p className="text-sm text-[#5F5E5A]">{project.title}</p>
              </div>
            </div>
            <p className="mb-6 leading-relaxed text-[#444441]">{project.missionBrief}</p>
            <div className="mb-6 rounded-xl bg-[#FAECE7] p-4">
              <div className="mb-2 flex items-center gap-2">
                <ErLingAvatar className="h-7 w-7" />
                <span className="text-sm font-medium text-[#4A1B0C]">二零的小提示</span>
              </div>
              <p className="text-sm leading-relaxed text-[#712B13]">{project.erLingHint}</p>
            </div>
            <button
              onClick={closeBrief}
              className="w-full rounded-xl bg-[#0F6E56] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#085041]"
            >
              开始挑战
            </button>
          </div>
        </div>
      )}

      {/* Step completion toasts */}
      <div className="pointer-events-none fixed right-4 top-20 z-40 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[#5DCAA5]/30 bg-[#E1F5EE] px-4 py-2.5 shadow-lg transition-all"
          >
            <CheckCircle className="h-4 w-4 text-[#0F6E56]" />
            <span className="text-sm font-medium text-[#04342C]">步骤完成：{toast.title}</span>
          </div>
        ))}
      </div>

      {/* Empty run hint */}
      {hint && (
        <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-[#F0997B]/30 bg-[#FAECE7] px-4 py-2.5 shadow-lg">
          <p className="text-sm font-medium text-[#712B13]">{hint}</p>
        </div>
      )}

      {/* Completion celebration */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowCelebration(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-[#5F5E5A] hover:bg-[#F1EFE8]"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FAEEDA]">
              <ErLingAvatar className="h-14 w-14" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-[#04342C]">任务完成！</h3>
            <p className="mb-6 text-sm text-[#5F5E5A]">
              太棒了！你帮二零完成了第一个任务，获得了一颗「创意种子」！
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCelebration(false)}
                className="flex-1 rounded-xl border border-[#0F6E56]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#0F6E56] hover:bg-[#E1F5EE]"
              >
                继续探索
              </button>
              <Link
                href={`/certificate/${project.slug}`}
                className="flex-1 rounded-xl bg-[#0F6E56] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#085041]"
              >
                查看证书
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
