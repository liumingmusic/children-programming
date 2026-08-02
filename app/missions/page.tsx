import { Sparkles } from "lucide-react";
import ErLingAvatar from "@/components/ErLingAvatar";
import MissionsExplorer from "@/components/MissionsExplorer";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "星球任务 - 造物星球",
  description: "按年龄选择探险阶段，再挑选一个能跑起来的小项目。",
};

export default function MissionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          {/* 页头 */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1F5EE]">
              <Sparkles className="h-7 w-7 text-[#0F6E56]" />
            </div>
            <h1 className="text-3xl font-medium text-[#04342C] sm:text-4xl">星球任务</h1>
            <p className="mx-auto mt-3 max-w-xl text-[#5F5E5A]">
              跟着闯关地图一步步来：完成当前关卡，才会解锁下一关。没解锁的关卡先练前面的吧！
            </p>
          </div>

          {/* 闯关路径 */}
          <MissionsExplorer />
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
