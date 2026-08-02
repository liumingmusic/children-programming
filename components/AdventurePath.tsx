"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Lock, Play, Check } from "lucide-react";
import { getAllProgress } from "@/lib/db";
import {
  getStagePath,
  getUnlockedSet,
  getActiveChapterIndex,
  getNodeStatus,
  getChapterProgress,
  getCurrentSlug,
  type StagePath,
  type NodeStatus,
} from "@/lib/path";

const CHAPTER_EMOJI: Record<string, string> = {
  seq: "🧭",
  loop: "🔁",
  draw: "🎨",
  event: "👆",
  cond: "🤔",
  game: "🎮",
  story: "📖",
  music: "🎵",
  math: "🔢",
  science: "🔬",
  pbl: "🚀",
};

function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative h-10 w-10 shrink-0">
      <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#E5E2D8" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="#0F6E56"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-[#04342C]">
        {done}/{total}
      </span>
    </div>
  );
}

function NodeDot({ status }: { status: NodeStatus }) {
  const base =
    "flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-medium transition-colors";
  if (status === "completed")
    return (
      <div className={`${base} border-[#0F6E56] bg-[#0F6E56] text-white`}>
        <Check className="h-6 w-6" />
      </div>
    );
  if (status === "current")
    return (
      <div className={`${base} border-[#3a78a8] bg-[#E6F1FB] text-[#0C447C] shadow-[0_0_0_4px_rgba(58,120,168,0.18)]`}>
        <Play className="h-6 w-6 fill-current" />
      </div>
    );
  return (
    <div className={`${base} border-black/10 bg-[#EDEAE0] text-[#9B988E]`}>
      <Lock className="h-5 w-5" />
    </div>
  );
}

function ChapterSection({
  chapter,
  index,
  expanded,
  onToggle,
  completedSet,
  linearOrder,
  unlockedSet,
  innerRef,
}: {
  chapter: StagePath["chapters"][number];
  index: number;
  expanded: boolean;
  onToggle: () => void;
  completedSet: Set<string>;
  linearOrder: string[];
  unlockedSet: Set<string>;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  const prog = getChapterProgress(chapter, completedSet);
  const allDone = prog.done === prog.total && prog.total > 0;
  return (
    <div
      ref={innerRef}
      className="scroll-mt-24 rounded-2xl border border-black/5 bg-white shadow-sm"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1F5EE] text-2xl">
          {CHAPTER_EMOJI[chapter.id] ?? "📘"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-[#04342C]">{chapter.name}</span>
            <span className="rounded-full bg-[#F1EFE8] px-2 py-0.5 text-xs font-medium text-[#5F5E5A]">
              {chapter.shortTag}
            </span>
            {allDone && (
              <span className="rounded-full bg-[#FAEEDA] px-2 py-0.5 text-xs font-medium text-[#412402]">
                已通关
              </span>
            )}
          </div>
          <p className="truncate text-sm text-[#5F5E5A]">{chapter.description}</p>
        </div>
        <ProgressRing done={prog.done} total={prog.total} />
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-[#9B988E]" />
        ) : (
          <ChevronRight className="h-5 w-5 text-[#9B988E]" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-black/5 px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {chapter.projects.map((p) => {
              const status = getNodeStatus(p.slug, completedSet, unlockedSet);
              const unlocked = unlockedSet.has(p.slug);
              const cardClass =
                "flex items-center gap-3 rounded-xl border border-black/5 bg-white px-3 py-2.5 text-left transition-colors sm:px-3.5";
              const inner = (
                <>
                  <NodeDot status={status} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium leading-snug break-words ${
                        status === "locked" ? "text-[#9B988E]" : "text-[#04342C]"
                      }`}
                    >
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#9B988E]">
                      {status === "completed"
                        ? "已通关"
                        : status === "current"
                          ? "进行中"
                          : unlocked
                            ? "可挑战"
                            : "未解锁"}
                    </p>
                  </div>
                </>
              );
              return (
                <div key={p.slug}>
                  {unlocked ? (
                    <Link
                      href={`/learn/${p.slug}`}
                      className={`${cardClass} hover:border-[#0F6E56]/25 hover:bg-[#F1EFE8]`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div
                      title="先完成前面的关卡就能解锁"
                      className={`${cardClass} cursor-not-allowed opacity-90`}
                    >
                      {inner}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdventurePath({ stageId }: { stageId: string }) {
  const path = useMemo(() => getStagePath(stageId), [stageId]);
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [expandedOverrides, setExpandedOverrides] = useState<Record<number, boolean>>({});
  const [ready, setReady] = useState(false);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let alive = true;
    getAllProgress().then((list) => {
      if (!alive) return;
      const set = new Set(list.filter((p) => p.completed).map((p) => p.slug));
      setCompletedSet(set);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [stageId]);

  const unlockedSet = useMemo(
    () => getUnlockedSet(path.linearOrder, completedSet),
    [path.linearOrder, completedSet],
  );
  const activeIndex = useMemo(
    () => getActiveChapterIndex(path, completedSet),
    [path, completedSet],
  );

  const isExpanded = (i: number) =>
    expandedOverrides[i] ?? i === activeIndex;

  const toggle = (i: number) =>
    setExpandedOverrides((prev) => ({ ...prev, [i]: !(prev[i] ?? i === activeIndex) }));

  const currentSlug = getCurrentSlug(stageId, completedSet);
  const currentTitle = currentSlug
    ? path.chapters.flatMap((c) => c.projects).find((p) => p.slug === currentSlug)?.title ?? ""
    : "";

  // 默认滚动到当前章节
  useEffect(() => {
    if (!ready) return;
    const el = chapterRefs.current[activeIndex];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [ready, activeIndex]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-[#5F5E5A]">
        正在加载闯关地图…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 继续闯关提示条 */}
      <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-[#0F6E56] to-[#3a78a8] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm/relaxed opacity-90">继续你的探险吧！</p>
          <p className="text-lg font-medium">
            {currentTitle ? `当前关卡：${currentTitle}` : "🎉 这一阶段的关卡全部通关啦！"}
          </p>
        </div>
        {currentSlug && (
          <Link
            href={`/learn/${currentSlug}`}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-[#0F6E56] hover:bg-[#E1F5EE] sm:self-auto"
          >
            <Play className="h-4 w-4 fill-current" />
            继续闯关
          </Link>
        )}
      </div>

      {path.chapters.map((chapter, i) => (
        <ChapterSection
          key={chapter.id}
          chapter={chapter}
          index={i}
          expanded={isExpanded(i)}
          onToggle={() => toggle(i)}
          completedSet={completedSet}
          linearOrder={path.linearOrder}
          unlockedSet={unlockedSet}
          innerRef={(el) => {
            chapterRefs.current[i] = el;
          }}
        />
      ))}

      {currentSlug && (
        <p className="pt-2 text-center text-xs text-[#9B988E]">
          已解锁 {unlockedSet.size} / {path.linearOrder.length} 个关卡 · 按顺序闯关，前面的关卡完成才会解锁后面的哦
        </p>
      )}
    </div>
  );
}
