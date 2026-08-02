"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Save, CheckCircle, BookOpen, Info, X } from "lucide-react";
import BlocklyEditor, { BlocklyEditorHandle } from "@/components/BlocklyEditor";
import StagePlayer from "@/components/StagePlayer";
import DemoOverlay from "@/components/DemoOverlay";
import ErLingAvatar from "@/components/ErLingAvatar";
import { Runtime, StageState, type Hazard, type Cloud } from "@/lib/runtime";
import type { CourseProject } from "@/courses";
import MemoryGame from "@/components/MemoryGame";
import { getNextProject, getStageOfProject, getProject } from "@/courses";
import { loadProject, saveProject, markProgress, getProgress, getAllProgress, recordSessionTime } from "@/lib/db";
import { computeSteps, coach, isGoalAchieved } from "@/lib/steps";
import { isUnlocked, getPreviousSlug } from "@/lib/path";

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
    actor: { x: 0, y: 0, angle: 270, message: null, messageUntil: 0, size: 1 },
    penPaths: [],
    currentPath: null,
    penColor: 0,
    penSize: 3,
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
  const [toasts, setToasts] = useState<StepToast[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const prevStepsDone = useRef<boolean[]>(project.steps.map(() => false));
  const sessionStartRef = useRef<number>(0);

  // 「看示范」浮层开关（只读参考，不触碰学生主画布）
  const [showExample, setShowExample] = useState(false);

  // 自动保存：真实改动后防抖写入本地，避免「点保存没生效 / 刷新空白」
  const autoSaveTimerRef = useRef<number | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);

  // 完成后的温和通知（替代原来的强制弹窗）：本次会话内首次达成时显示一次
  const [doneBanner, setDoneBanner] = useState(false);
  const prevCompletedRef = useRef<boolean | null>(null);

  // 「重置舞台 / 清空积木」的轻提示
  const [resetToast, setResetToast] = useState<string | null>(null);

  // 闯关锁门：未解锁的关卡不进编辑器（防止跨项目练习）
  const [lockReady, setLockReady] = useState(false);
  const [locked, setLocked] = useState(false);

  // 键盘事件：把方向键转发给运行时，用于「按键前进」等键盘操控项目
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const map: Record<string, string> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const key = map[e.key];
      if (!key) return;
      e.preventDefault();
      runtimeRef.current?.handleKeyPressed(key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const flushTime = () => {
      if (!sessionStartRef.current) return;
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      if (elapsed >= 10) {
        recordSessionTime(project.slug, elapsed).catch(console.error);
      }
      sessionStartRef.current = Date.now();
    };

    sessionStartRef.current = Date.now();
    const interval = setInterval(flushTime, 60000);

    return () => {
      clearInterval(interval);
      const elapsed = Math.floor((Date.now() - (sessionStartRef.current || Date.now())) / 1000);
      if (elapsed >= 10) {
        recordSessionTime(project.slug, elapsed).catch(console.error);
      }
    };
  }, [project.slug]);

  useEffect(() => {
    const runtime = new Runtime(STAGE_WIDTH, STAGE_HEIGHT, (state) => {
      setStageState(state);
      setLogs(state.log);
      if (state.log.includes("[系统] 程序执行完毕") && !progressRef.current.completed) {
        // 关键修复：不能「程序一跑完就判完成」——必须真正达成目标（走到旗子/集齐星星）才算数，
        // 否则孩子瞎搭积木也能拿到「任务完成」，纯属误人子弟。
        if (isGoalAchieved(project, state, state.log)) {
          progressRef.current = { completed: true, stars: 3 };
          setProgress(progressRef.current);
          markProgress(project.slug, true, 3).catch(console.error);
        }
      }
    }, project.stars
      ? project.stars.map((s, i) => ({ id: i + 1, x: s.x, y: s.y, collected: false }))
      : project.slug === "stars"
        ? undefined
        : [],
    {
      hazards: project.scene?.marks
        ?.filter((m) => m.kind === "obstacle" || m.kind === "badguy")
        .map((m) => ({
          x: m.x,
          y: m.y,
          r: 32,
          kind: m.kind as "obstacle" | "badguy",
        })) as Hazard[],
      clouds: (project.scene?.clouds ?? []) as Cloud[],
    });
    runtimeRef.current = runtime;

    loadProject(project.slug).then((xml) => {
      if (editorRef.current) {
        // 默认进入给「空画布」，让学生自己拖积木；不直接把参考答案（defaultXml）预载进去。
        // 想参考时再点「看示范」按钮加载示范，关闭后回到学生自己的画布。
        editorRef.current.loadXml(xml || "");
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

  // 锁门判定：读取本地进度，按严格顺序判断本关是否解锁
  useEffect(() => {
    const stage = getStageOfProject(project.slug);
    if (!stage) {
      setLockReady(true);
      setLocked(false);
      return;
    }
    getAllProgress().then((list) => {
      const completed = new Set(list.filter((p) => p.completed).map((p) => p.slug));
      setLocked(!isUnlocked(stage.id, project.slug, completed));
      setLockReady(true);
    });
  }, [project.slug]);

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

    const code = editor.getCode();
    setGeneratedCode(code);

    if (!code.trim()) {
      setHint("二零还没收到指令呢～先拖一个「当开始运行」绿色事件，把积木放进去，再点运行吧！");
      setTimeout(() => setHint(null), 4000);
      return;
    }

    runtime.reset();
    setSaveStatus("idle");
    await editor.run(runtime);

    // 运行后给出针对性辅导：聚焦第一个未完成的步骤
    const finalLogs = runtimeRef.current?.getState().log ?? [];
    const st = computeSteps(project, code, finalLogs);
    if (!st.every((s) => s.done)) {
      const firstUndone = st.find((s) => !s.done);
      if (firstUndone) {
        setHint(coach(project.slug, firstUndone.id));
        return;
      }
    }
    // 步骤都做对了，但还没真正达成目标（没走到旗子/没集齐星星）：给明确反馈，绝不谎报完成
    const finalState = runtimeRef.current?.getState();
    if (finalState && !isGoalAchieved(project, finalState, finalLogs)) {
      setHint("积木都放对啦！不过二零好像还没真正到目标呢～再调整一下路线，让它走到小旗子 / 宝藏那里吧！");
      return;
    }
    setHint(null);
  }, [project]);

  // 「看示范」：打开只读参考浮层（不触碰学生主画布，见 DemoOverlay）。
  const toggleExample = useCallback(() => {
    setShowBrief(false);
    setShowExample((s) => !s);
  }, []);

  // 防抖自动保存：学生一停手就把当前积木写入本地，避免「点保存没生效 / 刷新空白」
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = window.setTimeout(() => {
      const editor = editorRef.current;
      if (!editor) return;
      const xml = editor.getXml();
      saveProject(project.slug, project.title, project.ageGroup, xml)
        .then(() => setAutoSaved(true))
        .catch(() => {});
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug, project.title, project.ageGroup]);

  // 编辑器真实改动：更新代码预览 + 触发防抖自动保存
  const handleEditorChange = useCallback(
    (code: string) => {
      setGeneratedCode(code);
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const handleStageClick = useCallback(async (x: number, y: number) => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    await runtime.handleStageClick(x, y);
  }, []);

  // 「重置舞台」：清掉刚才运行的结果（角色回原点、清除笔迹与日志、停止动画），
  // 方便学生重新运行看效果。不破坏积木，并给出轻提示，避免「点了没反应」。
  const flashResetToast = useCallback((msg: string) => {
    setResetToast(msg);
    setTimeout(() => setResetToast(null), 2200);
  }, []);

  const handleReset = useCallback(() => {
    runtimeRef.current?.reset();
    setSaveStatus("idle");
    flashResetToast("舞台已重置，可以重新运行");
  }, [flashResetToast]);

  // 「清空积木」：彻底清掉学生工作区（破坏性，需二次确认），满足「重来」诉求
  const handleClearBlocks = useCallback(() => {
    if (typeof window === "undefined") return;
    const ok = window.confirm("确定要清空当前所有积木吗？此操作无法撤销。");
    if (!ok) return;
    editorRef.current?.resetWorkspace();
    setSaveStatus("idle");
    setAutoSaved(false);
    flashResetToast("积木已清空，从头开始吧");
  }, [flashResetToast]);

  // 记忆翻牌等独立组件类项目：由组件自己判定完成，胜利时回调这里
  const handleMemoryWin = useCallback(() => {
    if (!progressRef.current.completed) {
      progressRef.current = { completed: true, stars: 3 };
      setProgress(progressRef.current);
      markProgress(project.slug, true, 3).catch(console.error);
    }
  }, [project.slug]);

  const handleSave = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;
    setSaveStatus("loading");
    try {
      const xml = editor.getXml();
      await saveProject(project.slug, project.title, project.ageGroup, xml);
      setSaveStatus("saved");
      setAutoSaved(true);
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (e) {
      setSaveStatus("idle");
      flashResetToast("保存失败：浏览器本地存储不可用，请检查设置或换浏览器");
      console.error("保存失败", e);
    }
  }, [project, flashResetToast]);

  const stepStatus = computeSteps(project, generatedCode, logs);

  // 项目页「返回」应回到它所属的项目集合（学龄段页），而非首页
  const stage = getStageOfProject(project.slug);
  const backHref = stage ? `/missions/${stage.id}` : "/missions";
  const nextProject = getNextProject(project.slug);

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

  // 完成温和通知：本次会话内「首次」达成（false→true 的那一刻）才显示一次浮条，
  // 不强制弹窗——学生只是想看看运行效果时不会被打断。
  useEffect(() => {
    if (prevCompletedRef.current === null) {
      prevCompletedRef.current = progress.completed; // 初始化（含「旧已完成」项目），不弹
      return;
    }
    if (progress.completed && !prevCompletedRef.current) {
      setDoneBanner(true);
    }
    prevCompletedRef.current = progress.completed;
  }, [progress.completed]);

  const completedSteps = stepStatus.filter((s) => s.done).length;

  if (!lockReady) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fafbfc]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0F6E56]/20 border-t-[#0F6E56]" />
        <p className="mt-3 text-sm text-[#5F5E5A]">正在加载关卡…</p>
      </div>
    );
  }

  if (locked) {
    const stage = getStageOfProject(project.slug);
    const prevSlug = stage ? getPreviousSlug(stage.id, project.slug) : null;
    const prevTitle = prevSlug ? getProject(prevSlug)?.title : null;
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fafbfc] px-4">
        <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6F1FB]">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="mb-2 text-xl font-medium text-[#04342C]">这一关还没解锁</h1>
          <p className="mb-6 leading-relaxed text-[#5F5E5A]">
            {prevTitle
              ? `先完成上一关《${prevTitle}》，就能解锁这一关啦！`
              : "按顺序闯关，才能解锁后面的关卡哦。"}
          </p>
          <div className="flex flex-col gap-3">
            {prevSlug && (
              <Link
                href={`/learn/${prevSlug}`}
                className="rounded-xl bg-[#0F6E56] px-4 py-3 text-sm font-medium text-white hover:bg-[#085041]"
              >
                去完成《{prevTitle}》
              </Link>
            )}
            <Link
              href="/missions"
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-[#5F5E5A] hover:bg-[#F1EFE8]"
            >
              返回任务地图
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#fafbfc]">
      {/* 顶部栏 */}
      <header className="flex h-14 items-center justify-between border-b border-black/5 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={backHref} className="flex items-center gap-1 text-sm font-medium text-[#5F5E5A] hover:text-[#0F6E56]">
            <ArrowLeft className="h-4 w-4" />
            返回任务列表
          </Link>
          <h1 className="text-base font-medium text-[#04342C]">{project.title}</h1>
            <button
              onClick={() => setShowBrief(true)}
              className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#E6F1FB] px-2.5 py-1 text-xs font-medium text-[#0C447C] hover:bg-[#CDE4F9]"
            >
              <Info className="h-3 w-3" />
              任务简报
            </button>
              <button
              onClick={toggleExample}
              className={`ml-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                showExample
                  ? "bg-[#0F6E56] text-white hover:bg-[#085041]"
                  : "bg-[#FAEEDA] text-[#412402] hover:bg-[#FAC775]"
              }`}
            >
              <BookOpen className="h-3 w-3" />
              {showExample ? "关闭示范" : "看示范"}
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

        {/* 中间积木编辑区 / 记忆翻牌等特殊组件区 */}
        {project.component === "memory" ? (
          <section className="flex min-w-0 flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
            <h2 className="mb-2 text-sm font-medium text-[#04342C]">记忆翻牌</h2>
            <div className="min-h-0 flex-1">
              <MemoryGame onWin={handleMemoryWin} />
            </div>
          </section>
        ) : (
          <>
            <section className="flex min-w-0 flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
              <h2 className="mb-2 text-sm font-medium text-[#04342C]">积木工作区</h2>
              <div className="min-h-0 flex-1">
                <BlocklyEditor
                  ref={editorRef}
                  onChange={handleEditorChange}
                  onAutoSave={scheduleAutoSave}
                />
              </div>
            </section>

            {/* 右侧预览区 */}
            <aside className="flex w-[30rem] flex-col gap-3">
              <div className="flex flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
                <h2 className="mb-2 text-sm font-medium text-[#04342C]">舞台预览</h2>
                <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-[#E6F1FB]">
                  <StagePlayer state={stageState} scene={project.scene} onStageClick={handleStageClick} />
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
          </>
        )}
      </div>

      {/* 底部操作栏（记忆翻牌等独立组件类项目不显示积木操作按钮） */}
      {project.component !== "memory" && (
      <footer className="flex h-14 items-center justify-between border-t border-black/5 bg-white px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={stageState.running}
            title="清空刚才运行的结果（角色回原点、清除笔迹与日志），不影响你的积木"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#EF9F27]/30 bg-[#FAEEDA] px-4 text-sm font-medium text-[#412402] hover:bg-[#FAC775] disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            重置舞台
          </button>
          <button
            onClick={handleClearBlocks}
            disabled={stageState.running}
            title="清空工作区里所有积木，从头开始（需确认）"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-4 text-sm font-medium text-[#5F5E5A] hover:bg-[#F1EFE8] disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            清空积木
          </button>
          <button
            onClick={handleSave}
            disabled={stageState.running || saveStatus === "loading" || showExample}
            title={showExample ? "查看示范时不可保存，关闭示范后再保存你的作品" : "修改会自动保存，也可手动点此确认保存"}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#5DCAA5]/30 bg-[#E1F5EE] px-4 text-sm font-medium text-[#04342C] hover:bg-[#9FE1CB] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveStatus === "saved" ? "已保存" : saveStatus === "loading" ? "保存中" : "保存"}
          </button>
          {autoSaved && (
            <span className="hidden text-xs text-[#5DCAA5] sm:inline">·已自动保存</span>
          )}
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
      )}

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

      {/* 完成温和通知（非阻塞浮条，替代强制弹窗）—— 不挡住学生看运行效果 */}
      {doneBanner && (
        <div className="fixed left-1/2 top-20 z-40 w-[min(92vw,32rem)] -translate-x-1/2 rounded-2xl border border-[#5DCAA5]/40 bg-[#E1F5EE] px-5 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#04342C]">《{project.title}》已完成！</p>
              <p className="text-xs text-[#5F5E5A]">可以挑战下一关啦～</p>
            </div>
            <button
              onClick={() => setDoneBanner(false)}
              aria-label="关闭"
              className="rounded-full p-1 text-[#5F5E5A] hover:bg-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            {nextProject && (
              <Link
                href={`/learn/${nextProject.slug}`}
                className="flex-1 rounded-xl bg-[#0F6E56] px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#085041]"
              >
                挑战下一个：{nextProject.title}
              </Link>
            )}
            <Link
              href={backHref}
              onClick={() => setDoneBanner(false)}
              className="rounded-xl border border-[#0F6E56]/20 bg-white px-3 py-2 text-center text-sm font-medium text-[#0F6E56] hover:bg-[#F1EFE8]"
            >
              返回任务列表
            </Link>
          </div>
        </div>
      )}

      {/* 重置 / 清空 的轻提示 */}
      {resetToast && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#04342C] px-4 py-2 text-sm font-medium text-white shadow-lg">
          {resetToast}
        </div>
      )}

      {/* 看示范只读浮层（不触碰学生主画布） */}
      {showExample && <DemoOverlay project={project} onClose={() => setShowExample(false)} />}
    </div>
  );
}
