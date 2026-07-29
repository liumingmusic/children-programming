import Link from "next/link";
import { ArrowRight, Lock, Gamepad2, Code2, Trophy } from "lucide-react";
import { CATEGORIES, type Stage } from "@/courses";

export const stageAccent: Record<
  string,
  { badge: string; card: string; icon: React.ReactNode }
> = {
  "stage-6-8": {
    badge: "bg-[#E1F5EE] text-[#04342C]",
    card: "border-[#0F6E56]/20 hover:border-[#0F6E56]/40 hover:bg-[#E1F5EE]/40",
    icon: <Gamepad2 className="h-6 w-6 text-[#7F77DD]" />,
  },
  "stage-9-12": {
    badge: "bg-[#E6F1FB] text-[#0C447C]",
    card: "border-[#378ADD]/20 hover:border-[#378ADD]/40 hover:bg-[#E6F1FB]/40",
    icon: <Code2 className="h-6 w-6 text-[#378ADD]" />,
  },
  "stage-13-16": {
    badge: "bg-[#EEEDFE] text-[#3B2E8C]",
    card: "border-[#7F77DD]/20 hover:border-[#7F77DD]/40 hover:bg-[#EEEDFE]/40",
    icon: <Trophy className="h-6 w-6 text-[#7F77DD]" />,
  },
};

export default function StageCard({ stage }: { stage: Stage }) {
  const accent = stageAccent[stage.id] ?? stageAccent["stage-6-8"];
  const soon = stage.status === "soon";

  return (
    <Link
      href={`/missions/${stage.id}`}
      className={`group flex flex-col rounded-2xl border bg-white p-6 transition-all ${accent.card}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          {accent.icon}
        </div>
        {soon ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F1EFE8] px-3 py-1 text-xs font-medium text-[#5F5E5A]">
            <Lock className="h-3 w-3" />
            即将开放
          </span>
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1EFE8] text-sm font-medium text-[#5F5E5A]">
            {stage.projectSlugs.length}
          </span>
        )}
      </div>
      <span className={`mb-1 inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${accent.badge}`}>
        {stage.ageRange}
      </span>
      <h3 className="mt-1 text-xl font-medium text-[#04342C]">{stage.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5F5E5A]">{stage.tagline}</p>
      <p className="mt-3 text-xs text-[#8A8880]">
        {stage.projectSlugs.length} 个项目 · {CATEGORIES[stage.id]?.length ?? 0} 个分类
      </p>
      <span className="mt-5 inline-flex items-center text-sm font-medium text-[#0F6E56]">
        {soon ? "敬请期待" : "进入这个阶段"}
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
