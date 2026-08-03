"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { GameDefMeta } from "@/games/types";

/**
 * 游戏详情页外壳：轻量返回头 + 标题 + 年龄标签，主体留给具体游戏组件。
 * 不放全局 SiteHeader（游戏页需要全屏聚焦），自带返回「星球游乐场」的入口。
 */
export default function GameShell({
  meta,
  children,
}: {
  meta: GameDefMeta;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link
            href="/playground"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#5F5E5A] hover:text-[#0F6E56]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回游乐场
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.emoji}</span>
            <span className="font-medium text-[#04342C]">{meta.title}</span>
          </div>
          <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#0F6E56]">
            {meta.ageGroup}
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
