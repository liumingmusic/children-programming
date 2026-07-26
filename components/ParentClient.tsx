"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, CheckCircle, Clock, BookOpen, Sparkles } from "lucide-react";
import type { Project, Progress } from "@/lib/db";
import { getAllProjects, getAllProgress } from "@/lib/db";
import { getProject, projects as allCourses } from "@/courses";

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

export default function ParentClient() {
  const [stats, setStats] = useState<ChildStats | null>(null);
  const [items, setItems] = useState<{ course: typeof allCourses[0]; progress: Progress | null; saved: Project | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [savedProjects, progressList] = await Promise.all([getAllProjects(), getAllProgress()]);
      const progressMap = new Map(progressList.map((p) => [p.slug, p]));
      const savedMap = new Map(savedProjects.map((p) => [p.slug, p]));

      const merged = allCourses.map((course) => ({
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
      const recentProject = recentSaved || recentCompleted ? getProject(recentSaved?.slug || recentCompleted?.slug || "") : null;

      setStats({
        completed,
        inProgress,
        total: allCourses.length,
        lastActive,
        recentProject: recentProject?.title || null,
      });
      setItems(merged);
      setLoading(false);
    }
    load();
  }, []);

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
                这里记录着小创作者在造物星球的足迹，没有分数，只有作品。
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-black/5 bg-white p-12 text-center text-[#5F5E5A]">
              正在整理成长手稿...
            </div>
          ) : stats ? (
            <>
              <div className="mb-8 grid gap-4 md:grid-cols-4">
                <StatCard icon={<CheckCircle className="h-5 w-5 text-[#0F6E56]" />} label="已完成项目" value={String(stats.completed)} />
                <StatCard icon={<BookOpen className="h-5 w-5 text-[#378ADD]" />} label="进行中项目" value={String(stats.inProgress)} />
                <StatCard icon={<Sparkles className="h-5 w-5 text-[#EF9F27]" />} label="全部项目" value={String(stats.total)} />
                <StatCard
                  icon={<Clock className="h-5 w-5 text-[#7F77DD]" />}
                  label="最近活跃"
                  value={stats.lastActive ? formatDate(stats.lastActive) : "暂无"}
                />
              </div>

              {stats.recentProject && (
                <div className="mb-8 rounded-2xl border border-[#5DCAA5]/30 bg-[#E1F5EE] p-5">
                  <p className="text-sm text-[#0F6E56]">
                    二零告诉我：孩子最近创作了 <span className="font-medium text-[#04342C]">{stats.recentProject}</span>，记得夸夸TA！
                  </p>
                </div>
              )}

              <h2 className="mb-4 text-lg font-medium text-[#04342C]">项目进展</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.course.slug}
                    className="flex flex-col rounded-2xl border border-black/5 bg-white p-5"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#0F6E56]">
                        {item.course.ageGroup}
                      </span>
                      {item.progress?.completed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FAEEDA] px-2.5 py-1 text-xs font-medium text-[#412402]">
                          <CheckCircle className="h-3 w-3" />
                          已完成
                        </span>
                      ) : item.saved ? (
                        <span className="rounded-full bg-[#E6F1FB] px-2.5 py-1 text-xs font-medium text-[#0C447C]">进行中</span>
                      ) : (
                        <span className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-xs font-medium text-[#5F5E5A]">未开始</span>
                      )}
                    </div>
                    <h3 className="mb-1 text-base font-medium text-[#04342C]">{item.course.title}</h3>
                    <p className="mb-4 text-sm text-[#5F5E5A]">{item.course.description}</p>
                    <Link
                      href={`/learn/${item.course.slug}`}
                      className="mt-auto rounded-xl border border-[#0F6E56]/20 px-4 py-2 text-center text-sm font-medium text-[#0F6E56] hover:bg-[#E1F5EE]"
                    >
                      {item.progress?.completed ? "再看一次" : item.saved ? "继续创作" : "开始挑战"}
                    </Link>
                  </div>
                ))}
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

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fafbfc]">{icon}</div>
      <div className="text-2xl font-medium text-[#04342C]">{value}</div>
      <div className="mt-1 text-sm text-[#5F5E5A]">{label}</div>
    </div>
  );
}

function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return String(date);
  }
}
