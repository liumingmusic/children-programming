"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Play, CheckCircle, Clock, FolderHeart, Search } from "lucide-react";
import type { Project, Progress } from "@/lib/db";
import { getAllProjects, getAllProgress } from "@/lib/db";
import { getProject, getCategoryLabel } from "@/courses";

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

interface ProjectItem extends Project {
  completed: boolean;
  completedAt?: Date;
  category: string;
}

const PAGE_SIZE = 12;
type StatusFilter = "all" | "done" | "doing";

export default function GalleryClient() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function load() {
      const [projects, progress] = await Promise.all([getAllProjects(), getAllProgress()]);
      const progressMap = new Map(progress.map((p) => [p.slug, p]));
      const merged: ProjectItem[] = projects.map((p) => {
        const prog = progressMap.get(p.slug);
        return {
          ...p,
          completed: prog?.completed || false,
          completedAt: prog?.completedAt,
          category: getProject(p.slug)?.category ?? "",
        };
      });
      // 也纳入「有进度但还没保存积木」的项目
      const projectSlugs = new Set(projects.map((p) => p.slug));
      progress.forEach((p) => {
        if (!projectSlugs.has(p.slug)) {
          const course = getProject(p.slug);
          if (course) {
            merged.push({
              id: undefined,
              slug: course.slug,
              title: course.title,
              ageGroup: course.ageGroup,
              blocklyXml: "",
              updatedAt: p.completedAt || new Date(),
              completed: p.completed,
              completedAt: p.completedAt,
              category: course.category,
            });
          }
        }
      });
      setItems(merged.sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)));
      setLoading(false);
    }
    load();
  }, []);

  const ageOptions = useMemo(() => Array.from(new Set(items.map((i) => i.ageGroup))), [items]);
  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.category).filter(Boolean))).map((code) => ({
        code: code as string,
        label: getCategoryLabel(code as string),
      })),
    [items],
  );

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return items.filter((i) => {
      if (statusFilter === "done" && !i.completed) return false;
      if (statusFilter === "doing" && i.completed) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      if (ageFilter !== "all" && i.ageGroup !== ageFilter) return false;
      if (kw && !i.title.toLowerCase().includes(kw)) return false;
      return true;
    });
  }, [items, statusFilter, categoryFilter, ageFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paged = useMemo(
    () => filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE),
    [filtered, currentPage],
  );

  const resetPage = () => setPage(0);
  const completedCount = items.filter((i) => i.completed).length;

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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1F5EE]">
              <FolderHeart className="h-7 w-7 text-[#0F6E56]" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-[#04342C]">作品花园</h1>
              <p className="mt-1 text-[#5F5E5A]">
                这里保存着你和二零一起创作的作品。共 {items.length} 个，已完成 {completedCount} 个。
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-black/5 bg-white p-12 text-center text-[#5F5E5A]">
              正在打开作品花园...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-white p-12 text-center">
              <ErLingAvatar className="mx-auto mb-4 h-16 w-16" />
              <h2 className="mb-2 text-lg font-medium text-[#04342C]">作品花园还是空的</h2>
              <p className="mb-6 text-[#5F5E5A]">完成第一个项目后，你的作品就会出现在这里。</p>
              <Link href="/learn/hello" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#0F6E56] px-6 text-sm font-medium text-white hover:bg-[#085041]">
                <Play className="h-4 w-4" />
                开始第一个任务
              </Link>
            </div>
          ) : (
            <>
              {/* 筛选条 */}
              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-center rounded-full bg-[#F1EFE8] p-1">
                  {(["all", "done", "doing"] as StatusFilter[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        resetPage();
                      }}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        statusFilter === s ? "bg-white text-[#04342C] shadow-sm" : "text-[#5F5E5A] hover:text-[#04342C]"
                      }`}
                    >
                      {s === "all" ? "全部" : s === "done" ? "已完成" : "进行中"}
                    </button>
                  ))}
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    resetPage();
                  }}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#04342C] outline-none focus:border-[#0F6E56]"
                >
                  <option value="all">全部分类</option>
                  {categoryOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>

                {ageOptions.length > 1 && (
                  <select
                    value={ageFilter}
                    onChange={(e) => {
                      setAgeFilter(e.target.value);
                      resetPage();
                    }}
                    className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#04342C] outline-none focus:border-[#0F6E56]"
                  >
                    <option value="all">全部学段</option>
                    {ageOptions.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                )}

                <div className="relative ml-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b988e]" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                    placeholder="搜索作品名"
                    className="w-44 rounded-lg border border-black/10 bg-white py-2 pl-9 pr-3 text-sm text-[#04342C] outline-none focus:border-[#0F6E56]"
                  />
                </div>
              </div>

              <p className="mb-4 text-sm text-[#9b988e]">
                共 {filtered.length} 个作品
                {filtered.length !== items.length && `（从 ${items.length} 个中筛选）`}
              </p>

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-white p-12 text-center text-sm text-[#5F5E5A]">
                  没有符合条件的作品，换个筛选试试～
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paged.map((item) => (
                    <div
                      key={item.slug}
                      className="flex flex-col rounded-2xl border border-black/5 bg-white p-5 transition-shadow hover:shadow-md"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#0F6E56]">
                          {item.ageGroup}
                        </span>
                        {item.completed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FAEEDA] px-2.5 py-1 text-xs font-medium text-[#412402]">
                            <CheckCircle className="h-3 w-3" />
                            已完成
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-xs font-medium text-[#5F5E5A]">
                            进行中
                          </span>
                        )}
                      </div>
                      <h3 className="mb-1 text-lg font-medium text-[#04342C]">{item.title}</h3>
                      <p className="mb-4 text-sm text-[#5F5E5A]">
                        {item.completed
                          ? `完成于 ${item.completedAt ? formatDate(item.completedAt) : "刚刚"}`
                          : `最后编辑于 ${item.updatedAt ? formatDate(item.updatedAt) : "刚刚"}`}
                      </p>
                      <div className="mt-auto flex items-center gap-3">
                        <Link
                          href={`/learn/${item.slug}`}
                          className="flex-1 rounded-xl bg-[#0F6E56] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[#085041]"
                        >
                          {item.completed ? "再玩一次" : "继续创作"}
                        </Link>
                        {item.completed && (
                          <Link
                            href={`/certificate?slug=${item.slug}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#EF9F27]/30 bg-[#FAEEDA] text-[#412402] hover:bg-[#FAC775]"
                            title="查看创作证书"
                          >
                            <Sparkles className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#04342C] hover:bg-[#f1efe8] disabled:opacity-40"
                  >
                    上一页
                  </button>
                  <span className="text-sm text-[#5F5E5A]">
                    第 {currentPage + 1} / {totalPages} 页
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#04342C] hover:bg-[#f1efe8] disabled:opacity-40"
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
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
