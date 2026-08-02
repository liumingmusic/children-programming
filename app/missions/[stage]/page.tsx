import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import ErLingAvatar from "@/components/ErLingAvatar";
import SiteHeader from "@/components/SiteHeader";
import MissionsExplorer from "@/components/MissionsExplorer";
import { stages, type Stage } from "@/courses";
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

export default async function StagePage({ params }: StagePageProps) {
  const { stage } = await params;
  const current: Stage | undefined = stages.find((s) => s.id === stage);
  if (!current) notFound();

  const accent = stageAccent[current.id] ?? stageAccent["stage-6-8"];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

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

          {/* 闯关解锁界面：与 /missions 一致的关卡地图（严格顺序解锁） */}
          {current.status === "open" ? (
            <MissionsExplorer defaultStage={current.id} />
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
