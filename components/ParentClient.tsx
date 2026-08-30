"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Heart, CheckCircle, Clock, BookOpen, Sparkles, Calendar, Flag,
  PartyPopper, PencilLine, Search, ChevronDown, Download, Upload, ShieldCheck,
} from "lucide-react";
import type { Project, Progress } from "@/lib/db";
import {
  getAllProjects, getAllProgress, getTimeStats,
  exportBackup, parseBackup, importBackup,
  type TimeStats,
} from "@/lib/db";
import { projects as allCourses, stages, getStageProjects, CATEGORIES, type CourseProject } from "@/courses";

function ErLingAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm ${className}`}>
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

interface ChildStats {
  completed: number;
  inProgress: number;
  total: number;
  lastActive: Date | null;
  recentProject: string | null;
}

type Item = { course: CourseProject; progress: Progress | null; saved: Project | null };

export default function ParentClient() {
  const [stats, setStats] = useState<ChildStats | null>(null);
  const [timeStats, setTimeStats] = useState<TimeStats | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // 默认展开「孩子已经开始」的分类；搜索时强制全部展开
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // 备份导出 / 导入的结果提示
  const [backupMsg, setBackupMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 抽成 useCallback：导入备份后可再次调用，页面上的进度立刻刷新，不必手动刷新浏览器
  const load = useCallback(async () => {
      const [savedProjects, progressList, times] = await Promise.all([
        getAllProjects(),
        getAllProgress(),
        getTimeStats(),
      ]);
      const progressMap = new Map(progressList.map((p) => [p.slug, p]));
      const savedMap = new Map(savedProjects.map((p) => [p.slug, p]));

      const merged: Item[] = allCourses.map((course) => ({
        course,
        progress: progressMap.get(course.slug) || null,
        saved: savedMap.get(course.slug) || null,
      }));

      const completed = merged.filter((m) => m.progress?.completed).length;
      const inProgress = merged.filter((m) => !m.progress?.completed && m.saved).length;
      const allDates = [
        ...progressList.map((p) => p.completedAt).filter(Boolean),
        ...savedProjects.map((p) => p.updatedAt),
      ] as Date[];
      const lastActive = allDates.length ? new Date(Math.max(...allDates.map((d) => new Date(d).getTime()))) : null;

      const recentSaved = savedProjects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
      const recentCompleted = progressList
        .filter((p) => p.completed && p.completedAt)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];
      const recentProject = recentSaved || recentCompleted ? allCourses.find((c) => c.slug === (recentSaved?.slug || recentCompleted?.slug)) : null;

      setStats({
        completed,
        inProgress,
        total: allCourses.length,
        lastActive,
        recentProject: recentProject?.title || null,
      });
      setTimeStats(times);
      setItems(merged);

      // 默认展开包含「已开始项目」的分类
      const defaultOpen = new Set<string>();
      for (const stage of stages) {
        const stageItems = getStageProjects(stage.id)
          .map((p) => merged.find((m) => m.course.slug === p.slug))
          .filter((i): i is Item => Boolean(i));
        const cats = Array.from(new Set(stageItems.map((i) => i.course.category)));
        for (const cat of cats) {
          const started = stageItems.some(
            (i) => i.course.category === cat && (i.progress?.completed || i.saved),
          );
          if (started) defaultOpen.add(`${stage.id}:${cat}`);
        }
      }
      setExpanded(defaultOpen);
      setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bySlug = new Map(items.map((i) => [i.course.slug, i]));
  const kw = search.trim().toLowerCase();

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  };

  // ---- 作品备份：导出成 JSON 文件 / 从文件恢复（纯前端，不经过任何服务器）----
  const handleExport = useCallback(async () => {
    try {
      const backup = await exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const d = new Date();
      const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      a.download = `造物星球-作品备份-${stamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupMsg(`已导出 ${backup.counts.projects} 份作品、${backup.counts.progress} 条进度记录。请把这个文件收好～`);
    } catch {
      setBackupMsg("导出失败：当前浏览器不允许下载文件，换一个浏览器再试试。");
    }
  }, []);

  const handleImportFile = useCallback(
    async (file: File) => {
      setBackupMsg("正在读取备份文件…");
      try {
        const text = await file.text();
        const backup = parseBackup(text);
        if (!backup) {
          setBackupMsg("这个文件不是造物星球的备份文件，请重新选择。");
          return;
        }
        const n = await importBackup(backup);
        await load();
        setBackupMsg(
          `恢复完成：导入了 ${backup.counts.projects} 份作品、${backup.counts.progress} 条进度（共 ${n} 条记录）。`
        );
      } catch {
        setBackupMsg("导入失败：文件读不出来，换一个备份文件再试试。");
      }
    },
    [load]
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#fafbfc]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <ErLingAvatar className="h-9 w-9" />
            <span className="text-lg font-medium text-[#04342C]">造物星球</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-[#5F5E5A] hover:text-[#0F6E56]">
            <ArrowLeft className="h-4 w-4" />
            返回星球
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAEEDA]">
              <Heart className="h-7 w-7 text-[#D85A30]" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-[#04342C]">孩子的成长手稿</h1>
              <p className="mt-1 text-[#5F5E5A]">
                这里记录着小创作者在造物星球的足迹，没有分数，只有作品和时间。
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-black/5 bg-white p-12 text-center text-[#5F5E5A]">
              正在整理成长手稿...
            </div>
          ) : stats ? (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<CheckCircle className="h-5 w-5 text-[#0F6E56]" />} label="已完成项目" value={String(stats.completed)} hint={`共 ${stats.total} 个任务`} />
                <StatCard icon={<BookOpen className="h-5 w-5 text-[#378ADD]" />} label="进行中项目" value={String(stats.inProgress)} hint="保存过但还没完成" />
                <StatCard
                  icon={<Clock className="h-5 w-5 text-[#7F77DD]" />}
                  label="总学习时长"
                  value={formatDuration(timeStats?.totalSeconds || 0)}
                />
                <StatCard
                  icon={<Sparkles className="h-5 w-5 text-[#EF9F27]" />}
                  label="今日学习时长"
                  value={formatDuration(timeStats?.todaySeconds || 0)}
                />
              </div>

              {stats.recentProject && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl border border-[#5DCAA5]/30 bg-[#E1F5EE] p-5">
                  <PartyPopper className="h-6 w-6 shrink-0 text-[#0F6E56]" />
                  <p className="text-sm text-[#0F6E56]">
                    二零告诉我：孩子最近创作了 <span className="font-medium text-[#04342C]">{stats.recentProject}</span>，记得夸夸 TA！
                  </p>
                </div>
              )}

              {timeStats && timeStats.last7Days.some((d) => d.seconds > 0) && (
                <div className="mb-10 rounded-2xl border border-black/5 bg-white p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#0F6E56]" />
                    <h2 className="text-lg font-medium text-[#04342C]">最近 7 天学习时长</h2>
                  </div>
                  <div className="flex items-end gap-3 sm:gap-4">
                    {timeStats.last7Days.map((day) => {
                      const max = Math.max(...timeStats.last7Days.map((d) => d.seconds), 60);
                      const height = day.seconds > 0 ? Math.max(8, (day.seconds / max) * 120) : 4;
                      return (
                        <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                          <div
                            className="w-full rounded-t-lg bg-[#0F6E56]/80 transition-all hover:bg-[#0F6E56]"
                            style={{ height: `${height}px` }}
                            title={`${day.date}: ${formatDuration(day.seconds)}`}
                          />
                          <div className="text-xs text-[#5F5E5A]">{day.date.slice(5)}</div>
                          <div className="text-xs font-medium text-[#04342C]">{formatShortDuration(day.seconds)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 作品备份与隐私：作品只存在本地，清缓存 / 换设备会丢，所以要把「自己导出」这条路给到家长 */}
              <div className="mb-10 rounded-2xl border border-[#5DCAA5]/30 bg-[#E1F5EE] p-6">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#0F6E56]" />
                  <h2 className="text-lg font-medium text-[#04342C]">作品备份与隐私</h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-[#0F6E56]">
                  孩子的作品、进度和学习时长都只保存在
                  <strong className="font-medium text-[#04342C]">这台设备的浏览器里</strong>
                  ，造物星球<strong className="font-medium text-[#04342C]">不会上传任何信息</strong>
                  ，也不需要注册账号。但清理浏览器数据、换设备或换浏览器时这些记录会丢失——
                  建议偶尔导出一份备份收好，换设备时再导入回来。
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {/* 这两个按钮刻意**不写** aria-label：可见文字已经清楚，
                      文字本身就是可访问名称。若另写一个措辞不同的 aria-label，
                      会违反 WCAG 2.5.3（名称须包含可见文字），导致语音控制用户说
                      「点击导出备份文件」反而失效。 */}
                  <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F6E56] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A5544]"
                  >
                    <Download className="h-4 w-4" />
                    导出备份文件
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#0F6E56]/30 bg-white px-4 py-2 text-sm font-medium text-[#0F6E56] hover:bg-[#E1F5EE]"
                  >
                    <Upload className="h-4 w-4" />
                    从备份文件恢复
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    aria-label="选择备份文件"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      // 先清空 value，否则连续选同一个文件不会再触发 change
                      e.target.value = "";
                      if (f) void handleImportFile(f);
                    }}
                  />
                </div>
                {backupMsg && (
                  <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-sm text-[#0F6E56]">{backupMsg}</p>
                )}
              </div>

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-medium text-[#04342C]">各阶段进展</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b988e]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索某个项目"
                    // placeholder 在不少读屏软件上不会被当作无障碍名称，补一个等价的 aria-label
                    aria-label="搜索某个项目"
                    className="w-52 rounded-lg border border-black/10 bg-white py-2 pl-9 pr-3 text-sm text-[#04342C] outline-none focus:border-[#0F6E56]"
                  />
                </div>
              </div>

              <div className="space-y-10">
                {stages.map((stage) => {
                  const stageItems = getStageProjects(stage.id)
                    .map((p) => bySlug.get(p.slug))
                    .filter((i): i is Item => Boolean(i));
                  const done = stageItems.filter((i) => i.progress?.completed).length;
                  const pct = stageItems.length ? Math.round((done / stageItems.length) * 100) : 0;

                  // 该阶段下实际有项目的分类（按 CATEGORIES 顺序）
                  const stageCats = (CATEGORIES[stage.id] || []).filter((cat) =>
                    stageItems.some((i) => i.course.category === cat.id),
                  );

                  return (
                    <section key={stage.id}>
                      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-[#5F5E5A]">{stage.ageRange}</span>
                            <h3 className="text-xl font-medium text-[#04342C]">{stage.name}</h3>
                          </div>
                          <p className="mt-1 text-sm text-[#5F5E5A]">{stage.tagline}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#0F6E56]">{done}/{stageItems.length} 完成</span>
                          <div className="h-2 w-32 overflow-hidden rounded-full bg-[#E5E2D8]">
                            <div className="h-full rounded-full bg-[#0F6E56] transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>

                      {stageItems.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-[#5F5E5A]">
                          这个阶段还在准备中，先带 TA 来 {stages[0]?.ageRange} 的任务探险吧～
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {stageCats.map((cat) => {
                            let catItems = stageItems.filter((i) => i.course.category === cat.id);
                            if (kw) catItems = catItems.filter((i) => i.course.title.toLowerCase().includes(kw));
                            if (catItems.length === 0) return null; // 无匹配则隐藏该分类
                            const catDone = catItems.filter((i) => i.progress?.completed).length;
                            const catPct = Math.round((catDone / catItems.length) * 100);
                            const key = `${stage.id}:${cat.id}`;
                            const open = kw ? true : expanded.has(key);

                            return (
                              <div key={cat.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
                                <button
                                  onClick={() => toggle(key)}
                                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-[#fafbfc]"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="rounded-full bg-[#E1F5EE] px-2.5 py-1 text-xs font-medium text-[#0F6E56]">
                                      {cat.shortTag}
                                    </span>
                                    <div>
                                      <div className="text-base font-medium text-[#04342C]">{cat.name}</div>
                                      <div className="text-xs text-[#9b988e]">{catDone}/{catItems.length} 完成</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-[#E5E2D8] sm:block">
                                      <div className="h-full rounded-full bg-[#0F6E56]" style={{ width: `${catPct}%` }} />
                                    </div>
                                    <ChevronDown
                                      className={`h-4 w-4 text-[#9b988e] transition-transform ${open ? "rotate-180" : ""}`}
                                    />
                                  </div>
                                </button>

                                {open && (
                                  <div className="grid gap-4 border-t border-black/5 p-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {catItems.map((item) => {
                                      const status = item.progress?.completed
                                        ? "done"
                                        : item.saved
                                        ? "doing"
                                        : "todo";
                                      const borderByStatus = {
                                        done: "border-l-[#0F6E56]",
                                        doing: "border-l-[#378ADD]",
                                        todo: "border-l-[#C9C5BC]",
                                      }[status];
                                      return (
                                        <div
                                          key={item.course.slug}
                                          className={`flex flex-col rounded-2xl border border-black/5 border-l-4 bg-white p-5 ${borderByStatus}`}
                                        >
                                          <div className="mb-3 flex items-start justify-between gap-2">
                                            <span className="rounded-full bg-[#F1EFE8] px-3 py-1 text-xs font-medium text-[#5F5E5A]">
                                              {item.course.ageGroup}
                                            </span>
                                            {status === "done" ? (
                                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FAEEDA] px-2.5 py-1 text-xs font-medium text-[#412402]">
                                                <CheckCircle className="h-3 w-3" /> 已完成
                                              </span>
                                            ) : status === "doing" ? (
                                              <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F1FB] px-2.5 py-1 text-xs font-medium text-[#0C447C]">
                                                <PencilLine className="h-3 w-3" /> 进行中
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-1 rounded-full bg-[#F1EFE8] px-2.5 py-1 text-xs font-medium text-[#5F5E5A]">
                                                <Flag className="h-3 w-3" /> 未开始
                                              </span>
                                            )}
                                          </div>
                                          <h3 className="mb-1 text-base font-medium text-[#04342C]">{item.course.title}</h3>
                                          <p className="mb-4 flex-1 text-sm text-[#5F5E5A]">{item.course.description}</p>
                                          {timeStats && timeStats.byProject[item.course.slug] > 0 && (
                                            <div className="mb-3 flex items-center gap-1.5 text-xs text-[#5F5E5A]">
                                              <Clock className="h-3.5 w-3.5" />
                                              已学习 {formatDuration(timeStats.byProject[item.course.slug])}
                                            </div>
                                          )}
                                          <Link
                                            href={`/learn/${item.course.slug}`}
                                            className="mt-auto rounded-xl border border-[#0F6E56]/20 px-4 py-2 text-center text-sm font-medium text-[#0F6E56] hover:bg-[#E1F5EE]"
                                          >
                                            {status === "done" ? "再看一次" : status === "doing" ? "继续创作" : "开始挑战"}
                                          </Link>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </main>

      <footer className="border-t border-black/5 bg-[#F1EFE8] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <ErLingAvatar className="h-7 w-7" />
            <span className="font-medium text-[#04342C]">造物星球</span>
          </div>
          <p className="text-sm text-[#5F5E5A]">永久免费 · 无广告 · 保护儿童隐私</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fafbfc]">{icon}</div>
      <div className="text-2xl font-medium text-[#04342C]">{value}</div>
      <div className="mt-1 text-sm text-[#5F5E5A]">{label}</div>
      {hint && <div className="mt-0.5 text-xs text-[#9b988e]">{hint}</div>}
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} 秒`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} 分钟`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h} 小时 ${rm} 分钟`;
}

function formatShortDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  return `${Math.floor(seconds / 60)}分`;
}
