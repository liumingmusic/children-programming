"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Save, Trash2, FolderHeart, Sparkles, X, Wand2 } from "lucide-react";
import BlocklyEditor, { BlocklyEditorHandle } from "@/components/BlocklyEditor";
import ToolboxAccordion from "@/components/ToolboxAccordion";
import StagePlayer from "@/components/StagePlayer";
import ErLingAvatar from "@/components/ErLingAvatar";
import StudioReplayOverlay from "@/components/StudioReplayOverlay";
import { Runtime, type StageState, type Species } from "@/lib/runtime";
import {
  saveProject,
  loadProject,
  getAllFreeProjects,
  deleteProject,
  FREE_DRAFT_SLUG,
  type Project,
} from "@/lib/db";

const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 360;
const BRIEF_SEEN_KEY = "maker-studio-brief-seen";

/** 伙伴角色元数据：让自由创作默认就带「三七」，多角色 / 显隐 / 场景积木开箱即用。 */
const CAST_META: Record<string, { id: string; species: Species; name: string }> = {
  sanqi: { id: "sanqi", species: "sanqi", name: "三七" },
};

/** 6-8 阶段工具箱：不含「变量」「函数」（它们是 9-12 的代码概念）。 */
const STAGE6_CATEGORIES = ["事件", "运动", "外观", "画笔", "控制", "侦测", "运算", "声音", "角色"];

/** 阶段 → 首页/导航展示标签。 */
const STAGE_LABELS: Record<string, string> = {
  "stage-6-8": "6-8 岁 · 纯积木",
  "stage-9-12": "9-12 岁 · 代码初探",
};

const INITIAL_STATE: StageState = {
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
  actor: { id: "erling", species: "erling", name: "二零", x: 0, y: 0, angle: 270, message: null, messageUntil: 0, size: 1, expression: "normal", visible: true, acted: false },
  actors: [{ id: "erling", species: "erling", name: "二零", x: 0, y: 0, angle: 270, message: null, messageUntil: 0, size: 1, expression: "normal", visible: true, acted: false }],
  penPaths: [],
  currentPath: null,
  penColor: 0,
  penSize: 3,
  penDown: false,
  stars: [],
  running: false,
  log: [],
  vars: {},
  movedDistance: 0,
  keyHandlers: 0,
  clickHandlers: 0,
  sounded: false,
};

/** 灵感小贴士：开放式创作的触发点（不做步骤判定，仅给方向）。 */
const IDEAS = ["画一幅画", "让二零和三七对话", "做个小动画", "弹一首曲子", "设计一个小游戏", "讲一个晚安故事"];

function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  } catch {
    return String(date);
  }
}

export default function StudioClient() {
  const editorRef = useRef<BlocklyEditorHandle>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const autoSaveTimerRef = useRef<number | null>(null);

  const [stageState, setStageState] = useState<StageState>(INITIAL_STATE);
  const [logs, setLogs] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "loading">("idle");
  const [autoSaved, setAutoSaved] = useState(false);
  const [showSavePanel, setShowSavePanel] = useState(false);
  const [title, setTitle] = useState("");
  const [works, setWorks] = useState<Project[]>([]);
  const [replay, setReplay] = useState<{ xml: string; title: string } | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [resetToast, setResetToast] = useState<string | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const [stage, setStage] = useState<string>("");

  // 读 ?stage= 查询参数（客户端读取，避免静态导出下 useSearchParams 的 Suspense 约束）。
  // 造物工坊据学龄裁剪工具箱：6-8 纯积木；9-12 完整积木 + 显示生成的代码。
  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = new URLSearchParams(window.location.search).get("stage");
    if (s === "stage-6-8" || s === "stage-9-12") setStage(s);
  }, []);

  const toolboxCategories = stage === "stage-6-8" ? STAGE6_CATEGORIES : undefined;
  const showCode = stage === "stage-9-12";

  // 运行时：默认实例化「三七」，自由创作直接可用多角色 / 显隐 / 场景积木。
  useEffect(() => {
    const runtime = new Runtime(
      STAGE_WIDTH,
      STAGE_HEIGHT,
      (state) => {
        setStageState(state);
        setLogs(state.log);
      },
      [],
      {
        companions: Object.values(CAST_META).map((c) => ({ id: c.id, species: c.species, name: c.name })),
      },
    );
    runtimeRef.current = runtime;
    setShowBrief(typeof window === "undefined" || localStorage.getItem(BRIEF_SEEN_KEY) !== "true");
    return () => {
      runtime.reset();
    };
  }, []);

  // 键盘事件：把方向键转发给运行时（「按下按键」类自由创作可用）。
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const map: Record<string, string> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      const key = map[e.key];
      if (!key) return;
      e.preventDefault();
      runtimeRef.current?.handleKeyPressed(key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const refreshWorks = useCallback(() => {
    getAllFreeProjects()
      .then(setWorks)
      .catch(() => setWorks([]));
  }, []);
  useEffect(() => {
    refreshWorks();
  }, [refreshWorks]);

  const flashToast = useCallback((msg: string) => {
    setResetToast(msg);
    setTimeout(() => setResetToast(null), 2200);
  }, []);

  const closeBrief = useCallback(() => {
    setShowBrief(false);
    if (typeof window !== "undefined") localStorage.setItem(BRIEF_SEEN_KEY, "true");
  }, []);

  const handleRun = useCallback(async () => {
    const runtime = runtimeRef.current;
    const editor = editorRef.current;
    if (!runtime || !editor) return;
    const code = editor.getCode();
    setGeneratedCode(code);
    if (!code.trim()) {
      setHint("先拖一个「当开始运行」绿色事件，把积木放进去，再点运行吧！");
      setTimeout(() => setHint(null), 4000);
      return;
    }
    runtime.reset();
    setSaveStatus("idle");
    await editor.run(runtime);
    setHint(null);
  }, []);

  const handleReset = useCallback(() => {
    runtimeRef.current?.reset();
    setSaveStatus("idle");
    flashToast("舞台已重置，可以重新运行");
  }, [flashToast]);

  const handleClearBlocks = useCallback(() => {
    if (typeof window === "undefined") return;
    const ok = window.confirm("确定要清空当前所有积木吗？此操作无法撤销（已保存的作品不会受影响）。");
    if (!ok) return;
    editorRef.current?.resetWorkspace();
    setSaveStatus("idle");
    setAutoSaved(false);
    flashToast("积木已清空，从头开始吧");
  }, [flashToast]);

  // 防抖自动保存草稿：停手 800ms 写入本地，刷新/离开后再回来不丢工作。
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = window.setTimeout(() => {
      const editor = editorRef.current;
      if (!editor) return;
      const xml = editor.getXml();
      saveProject(FREE_DRAFT_SLUG, "草稿", "自由创作", xml)
        .then(() => {
          setAutoSaved(true);
          editor.markSaved();
        })
        .catch(() => {});
    }, 800);
  }, []);

  const handleEditorChange = useCallback(
    (code: string) => {
      setGeneratedCode(code);
      scheduleAutoSave();
    },
    [scheduleAutoSave],
  );

  const bootstrapXml = useCallback(() => loadProject(FREE_DRAFT_SLUG), []);
  const flushXml = useCallback((xml: string) => {
    saveProject(FREE_DRAFT_SLUG, "草稿", "自由创作", xml).catch(() => {});
  }, []);

  const handleSaveNamed = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;
    const t = title.trim() || "未命名作品";
    setSaveStatus("loading");
    try {
      const xml = editor.getXml();
      const id = `free:${Date.now().toString(36)}`;
      await saveProject(id, t, "自由创作", xml);
      setSaveStatus("saved");
      setAutoSaved(true);
      editor.markSaved();
      setTitle("");
      setShowSavePanel(false);
      refreshWorks();
      flashToast(`已保存为作品：${t}`);
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (e) {
      setSaveStatus("idle");
      flashToast("保存失败：浏览器本地存储不可用，请检查设置或换浏览器");
      console.error("保存失败", e);
    }
  }, [title, refreshWorks, flashToast]);

  const handleContinue = useCallback(
    (xml: string, name: string) => {
      editorRef.current?.loadXml(xml);
      flashToast(`已载入：${name}`);
    },
    [flashToast],
  );

  const handleDelete = useCallback(
    (slug: string, name: string) => {
      if (typeof window === "undefined") return;
      if (!window.confirm(`确定要删除作品「${name}」吗？此操作无法撤销。`)) return;
      deleteProject(slug)
        .then(() => {
          refreshWorks();
          flashToast(`已删除：${name}`);
        })
        .catch(() => {});
    },
    [refreshWorks, flashToast],
  );

  return (
    <div className="flex h-screen flex-col bg-[#fafbfc]">
      {/* 顶部栏 */}
      <header className="flex h-14 items-center justify-between border-b border-black/5 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-[#5F5E5A] hover:text-[#0F6E56]">
            <ArrowLeft className="h-4 w-4" />
            返回星球
          </Link>
          <h1 className="text-base font-medium text-[#04342C]">造物工坊</h1>
          {stage && STAGE_LABELS[stage] && (
            <span className="hidden rounded-full bg-[#EEEDFE] px-2.5 py-1 text-xs font-medium text-[#534AB7] sm:inline">
              {STAGE_LABELS[stage]}
            </span>
          )}
          <span className="hidden rounded-full bg-[#E1F5EE] px-2.5 py-1 text-xs font-medium text-[#0F6E56] sm:inline">
            自由创作 · 本地保存
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSavePanel((s) => !s)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#5DCAA5]/30 bg-[#E1F5EE] px-4 text-sm font-medium text-[#04342C] hover:bg-[#9FE1CB]"
          >
            <Save className="h-4 w-4" />
            保存为作品
          </button>
          {autoSaved && <span className="hidden text-xs text-[#5DCAA5] sm:inline">·已自动保存</span>}
          <ErLingAvatar className="h-8 w-8" />
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex flex-1 gap-3 overflow-hidden p-3">
        {/* 左侧：我的作品 + 灵感 */}
        <aside className="flex w-72 flex-col gap-3">
          <div className="flex-1 rounded-xl border border-black/10 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-[#04342C]">我的作品</h2>
              <span className="rounded-full bg-[#F1EFE8] px-2 py-0.5 text-xs text-[#5F5E5A]">{works.length}</span>
            </div>

            {showSavePanel && (
              <div className="mb-3 rounded-lg border border-[#5DCAA5]/30 bg-[#F4FBF8] p-3">
                <p className="mb-2 text-xs text-[#04342C]">给作品起个名字：</p>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：我的星空画"
                  className="mb-2 w-full rounded-md border border-black/10 px-2 py-1.5 text-sm text-[#04342C] outline-none focus:border-[#0F6E56]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNamed}
                    disabled={saveStatus === "loading"}
                    className="flex-1 rounded-md bg-[#0F6E56] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#085041] disabled:opacity-50"
                  >
                    {saveStatus === "loading" ? "保存中" : "保存"}
                  </button>
                  <button
                    onClick={() => {
                      setShowSavePanel(false);
                      setTitle("");
                    }}
                    className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium text-[#5F5E5A] hover:bg-[#F1EFE8]"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            <div className="max-h-[calc(100%-2.5rem)] space-y-2 overflow-y-auto pr-1">
              {works.length === 0 ? (
                <div className="rounded-lg border border-dashed border-black/10 bg-[#F8F8F6] p-4 text-center text-xs text-[#9b988e]">
                  还没有保存的作品。做好后点右上角「保存为作品」吧！
                </div>
              ) : (
                works.map((w) => (
                  <div key={w.slug} className="rounded-lg border border-black/5 bg-[#F8F8F6] p-3">
                    <div className="mb-1 truncate text-sm font-medium text-[#04342C]" title={w.title}>
                      {w.title}
                    </div>
                    <p className="mb-2 text-xs text-[#9b988e]">{w.updatedAt ? formatDate(w.updatedAt) : "刚刚"}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContinue(w.blocklyXml, w.title)}
                        className="flex-1 rounded-md bg-[#0F6E56] px-2 py-1.5 text-xs font-medium text-white hover:bg-[#085041]"
                      >
                        继续
                      </button>
                      <button
                        onClick={() => setReplay({ xml: w.blocklyXml, title: w.title })}
                        className="rounded-md border border-[#EF9F27]/30 bg-[#FAEEDA] px-2 py-1.5 text-xs font-medium text-[#412402] hover:bg-[#FAC775]"
                        title="原样运行一遍（不改动你的画布）"
                      >
                        回放
                      </button>
                      <button
                        onClick={() => handleDelete(w.slug, w.title)}
                        className="rounded-md border border-black/10 px-2 py-1.5 text-xs font-medium text-[#5F5E5A] hover:bg-[#F1EFE8]"
                        title="删除作品"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#F0997B]/30 bg-[#FAECE7] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-[#4A1B0C]" />
              <span className="text-sm font-medium text-[#4A1B0C]">灵感小贴士</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {IDEAS.map((idea) => (
                <span key={idea} className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-[#712B13]">
                  {idea}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#712B13]">
              没有标准答案——想做什么就做什么。用「切换场景」「控制角色 三七」还能让画面更丰富。
            </p>
          </div>
        </aside>

        {/* 积木工具箱（手风琴）—— 常驻左侧侧栏，按学龄裁剪分类；
            积木支持点击添加或拖拽到工作区。 */}
        <ToolboxAccordion
          categories={toolboxCategories}
          onPick={(item) => editorRef.current?.addBlock(item.doc.id, item.entry)}
        />

        {/* 中间积木编辑区 */}
        <section className="flex min-w-0 flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
          <h2 className="mb-2 text-sm font-medium text-[#04342C]">积木工作区</h2>
          <div className="min-h-0 flex-1">
            <BlocklyEditor
              ref={editorRef}
              onChange={handleEditorChange}
              onAutoSave={scheduleAutoSave}
              bootstrapXml={bootstrapXml}
              onFlush={flushXml}
            />
          </div>
        </section>

        {/* 右侧预览区 */}
        <aside className="flex w-[30rem] flex-col gap-3">
          <div className="flex flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
            <h2 className="mb-2 text-sm font-medium text-[#04342C]">舞台预览</h2>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-[#E6F1FB]">
              <StagePlayer state={stageState} scene={undefined} />
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
          {saveStatus === "saved" && (
            <span className="text-xs text-[#5DCAA5]">·已保存为作品</span>
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

      {/* 生成的代码预览：9-12 阶段默认可见（代码初探），其余隐藏 */}
      {generatedCode && (
        <div
          className={`${showCode ? "" : "hidden "}border-t border-black/5 bg-white px-4 py-2 text-xs text-[#5F5E5A]`}
        >
          <p className="mb-1 font-medium text-[#04342C]">生成的 JavaScript（代码初探）</p>
          <pre className="font-mono">{generatedCode}</pre>
        </div>
      )}

      {/* 首次进入简介 */}
      {showBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl">
            <button
              onClick={closeBrief}
              className="absolute right-4 top-4 rounded-full p-1 text-[#5F5E5A] hover:bg-[#F1EFE8]"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE]">
                <Sparkles className="h-6 w-6 text-[#0F6E56]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#04342C]">欢迎来到造物工坊</h3>
                <p className="text-sm text-[#5F5E5A]">这里是你的自由创作空间</p>
              </div>
            </div>
            <p className="mb-4 leading-relaxed text-[#444441]">
              没有题目、没有对错——拖积木让二零和三七动起来、画画、做音乐、讲故事都可以。
              做完点「保存为作品」，它会留在「我的作品」里，随时回来继续或回放给家人看。
            </p>
            <div className="mb-6 rounded-xl bg-[#FAECE7] p-4">
              <div className="mb-2 flex items-center gap-2">
                <ErLingAvatar className="h-7 w-7" />
                <span className="text-sm font-medium text-[#4A1B0C]">二零说</span>
              </div>
              <p className="text-sm leading-relaxed text-[#712B13]">
                尽情玩吧！你的作品都安全保存在这台设备上，不会上传到任何地方。
              </p>
            </div>
            <button
              onClick={closeBrief}
              className="w-full rounded-xl bg-[#0F6E56] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#085041]"
            >
              开始创作
            </button>
          </div>
        </div>
      )}

      {/* 空运行提示 */}
      {hint && (
        <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-[#F0997B]/30 bg-[#FAECE7] px-4 py-2.5 shadow-lg">
          <p className="text-sm font-medium text-[#712B13]">{hint}</p>
        </div>
      )}

      {/* 轻提示 */}
      {resetToast && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#04342C] px-4 py-2 text-sm font-medium text-white shadow-lg">
          {resetToast}
        </div>
      )}

      {/* 回放浮层（非破坏性，不改编辑画布） */}
      {replay && <StudioReplayOverlay xml={replay.xml} title={replay.title} onClose={() => setReplay(null)} />}
    </div>
  );
}
