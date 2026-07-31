import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Footprints,
  Repeat,
  PenTool,
  Zap,
  GitBranch,
  Gamepad2,
  Clapperboard,
  Music,
  Calculator,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ErLingAvatar from "@/components/ErLingAvatar";
import { stages, getStageCategories, type Stage } from "@/courses";
import { stageAccent } from "@/components/StageCard";

export function generateStaticParams() {
  return stages.map((s) => ({ stage: s.id }));
}

interface StagePageProps {
  params: Promise<{ stage: string }>;
}

export async function generateMetadata({ params }: StagePageProps) {
  const { stage } = await params;
  const s = stages.find((x) => x.id === stage);
  return {
    title: s ? `${s.name} - 星球任务 - 造物星球` : "星球任务 - 造物星球",
  };
}

const CAT_ICON: Record<string, LucideIcon> = {
  seq: Footprints,
  loop: Repeat,
  draw: PenTool,
  event: Zap,
  cond: GitBranch,
  game: Gamepad2,
  story: Clapperboard,
  music: Music,
  math: Calculator,
  science: FlaskConical,
  pbl: Sparkles,
};

export default async function StagePage({ params }: StagePageProps) {
  const { stage } = await params;
  const current: Stage | undefined = stages.find((s) => s.id === stage);
  if (!current) notFound();

  const accent = stageAccent[current.id] ?? stageAccent["stage-6-8"];
  const sections = getStageCategories(current.id);
  const totalProjects = sections.reduce((n, s) => n + s.projects.length, 0);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <ErLingAvatar className="h-9 w-9" />
            <span className="text-lg font-medium text-[#04342C]">造物星球</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-[#085041]">
            <Link href="/missions" className="hover:text-[#0F6E56]">星球任务</Link>
            <Link href="/toolbox" className="hover:text-[#0F6E56]">组件库</Link>
            <Link href="/gallery" className="hover:text-[#0F6E56]">作品花园</Link>
            <Link href="/parent" className="hover:text-[#0F6E56]">家长入口</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          {/* 面包屑 */}
          <Link
            href="/missions"
            className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-[#5F5E5A] hover:text-[#0F6E56]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回所有阶段
          </Link>

          {/* 学段标题 */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${accent.badge}`}>
              {current.ageRange}
            </span>
            <h1 className="text-3xl font-medium text-[#04342C]">{current.name}</h1>
            {current.status === "soon" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F1EFE8] px-3 py-1 text-xs font-medium text-[#5F5E5A]">
                <Lock className="h-3 w-3" />
                即将开放
              </span>
            )}
          </div>
          <p className="mb-2 max-w-2xl text-[#5F5E5A]">{current.tagline}</p>
          {current.status === "open" && (
            <p className="mb-10 text-sm text-[#8A8880]">
              共 {totalProjects} 个项目 · {sections.length} 个分类
            </p>
          )}

          {/* 项目列表（按分类分组） */}
          {current.status === "open" ? (
            <div className="space-y-12">
              {sections.map((cat) => {
                const Icon = CAT_ICON[cat.id];
                return (
                  <section key={cat.id} id={`cat-${cat.id}`}>
                    {/* 分类标题 */}
                    <div className="mb-5 flex items-end justify-between gap-4 border-b border-black/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                            {Icon ? <Icon className="h-5 w-5 text-[#0F6E56]" /> : null}
                          </span>
                          <h2 className="text-xl font-medium text-[#04342C]">{cat.name}</h2>
                          <span className="rounded-full bg-[#F1EFE8] px-2.5 py-0.5 text-xs font-medium text-[#5F5E5A]">
                            {cat.shortTag}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-[#5F5E5A]">{cat.description}</p>
                      </div>
                      <span className="hidden shrink-0 text-sm text-[#8A8880] sm:block">
                        {cat.projects.length} 个项目
                      </span>
                    </div>

                    {/* 分类下的项目卡片 */}
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {cat.projects.map((p, i) => (
                        <Link
                          key={p.slug}
                          href={`/learn/${p.slug}`}
                          className={`group flex flex-col rounded-2xl border bg-white p-6 transition-all ${accent.card}`}
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                              {accent.icon}
                            </div>
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1EFE8] text-sm font-medium text-[#5F5E5A]">
                              {i + 1}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-[#04342C]">{p.title}</h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5F5E5A]">{p.description}</p>
                          <span className="mt-5 inline-flex items-center text-sm font-medium text-[#0F6E56]">
                            开始任务
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-black/10 bg-[#F1EFE8]/50 p-8 text-[#5F5E5A]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                {accent.icon}
              </div>
              <div>
                <p className="font-medium text-[#04342C]">这个阶段还在筹备中</p>
                <p className="mt-1 text-sm">我们正忙着给二零准备新的冒险，敬请期待～</p>
              </div>
            </div>
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
