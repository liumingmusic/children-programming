import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import ErLingAvatar from "@/components/ErLingAvatar";
import SiteHeader from "@/components/SiteHeader";
import PlaygroundGrid from "@/games/components/PlaygroundGrid";
import { GAMES } from "@/games/registry";

export const metadata: Metadata = {
  title: "星球游乐场 - 造物星球",
  description: "学累了？来游乐场放松一下：2048、打节拍等纯休闲小游戏，劳逸结合。",
};

export default function PlaygroundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEDFE]">
              <Gamepad2 className="h-7 w-7 text-[#7F77DD]" />
            </div>
            <h1 className="text-3xl font-medium text-[#04342C] sm:text-4xl">星球游乐场</h1>
            <p className="mx-auto mt-3 max-w-xl text-[#5F5E5A]">
              编程学累了，就来这儿放松一下！这里的游戏和编程无关，纯粹好玩——挑一个，开玩吧～
            </p>
          </div>

          <PlaygroundGrid games={GAMES} />
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
