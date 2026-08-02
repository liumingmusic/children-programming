"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BlockChip from "@/components/BlockChip";
import SiteHeader from "@/components/SiteHeader";
import {
  BLOCK_CATALOG,
  CATEGORY_ORDER,
  CATEGORY_COLORS,
  STAGES,
  USED_IN,
  getProjectTitle,
  type BlockCategory,
  type BlockDoc,
} from "@/lib/block-catalog";

const SPECIAL_ICON: Record<string, string> = {
  special_cloud: "☁️",
  special_obstacle: "🪨",
  special_badguy: "👾",
  special_memory: "🃏",
};

function BlockCard({ doc }: { doc: BlockDoc }) {
  const used = USED_IN[doc.id] || [];
  const isSpecial = doc.shape === "special";
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-2">
        {isSpecial && (
          <span className="text-2xl leading-none">{SPECIAL_ICON[doc.id] ?? "🔧"}</span>
        )}
        <BlockChip doc={doc} />
      </div>
      <h3 className="text-base font-semibold text-[#04342C]">{doc.label}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-[#5F5E5A]">
        <p>
          <span className="font-medium text-[#0F6E56]">用途：</span>
          {doc.purpose}
        </p>
        <p>
          <span className="font-medium text-[#0F6E56]">用法：</span>
          {doc.usage}
        </p>
        {doc.example && (
          <p className="rounded-lg bg-[#F4FAF7] px-3 py-2 text-[#3a6]">
            <span className="font-medium">示例：</span>
            {doc.example}
          </p>
        )}
      </div>
      {used.length > 0 && (
        <div className="mt-auto border-t border-black/5 pt-3">
          <p className="mb-1.5 text-xs font-medium text-[#9b9a96]">
            在以下项目里会用到（点进去才能实际拖拽使用）：
          </p>
          <div className="flex flex-wrap gap-1.5">
            {used.map((slug) => (
              <Link
                key={slug}
                href={`/learn/${slug}`}
                className="rounded-full bg-[#EAF6F1] px-2.5 py-1 text-xs font-medium text-[#0F6E56] hover:bg-[#0F6E56] hover:text-white"
              >
                {getProjectTitle(slug) ?? slug}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToolboxPage() {
  const [stageId, setStageId] = useState(STAGES[0].id);
  const [catFilter, setCatFilter] = useState<BlockCategory | "全部">("全部");

  const stage = STAGES.find((s) => s.id === stageId)!;
  const blocks = useMemo(
    () => BLOCK_CATALOG.filter((b) => b.stages.includes(stageId)),
    [stageId]
  );
  const presentCats = useMemo(
    () => CATEGORY_ORDER.filter((c) => blocks.some((b) => b.category === c)),
    [blocks]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-2">
          <h1 className="text-3xl font-medium text-[#04342C]">组件库（工具箱）</h1>
          <p className="mt-2 max-w-2xl text-[#5F5E5A]">
            这里列出各学龄段能用到的小组件（积木与特殊能力）。本页<strong>只能查阅</strong>——
            看看每个组件是干什么的、怎么用；真正拖拽拼接、运行，要到对应的项目里去。
          </p>
        </div>

        {/* 阶段切换 */}
        <div className="mt-6 flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setStageId(s.id);
                setCatFilter("全部");
              }}
              disabled={!s.ready}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                stageId === s.id
                  ? "bg-[#0F6E56] text-white"
                  : s.ready
                  ? "bg-[#EAF6F1] text-[#0F6E56] hover:bg-[#dcefe6]"
                  : "cursor-not-allowed bg-black/5 text-[#9b9a96]"
              }`}
            >
              {s.label}
              {!s.ready && " · 敬请期待"}
            </button>
          ))}
        </div>

        {!stage.ready ? (
          <div className="mt-16 text-center text-[#9b9a96]">
            <div className="text-5xl">🚧</div>
            <p className="mt-4 text-lg">{stage.label} 阶段还没有开放项目，组件库将随项目上线逐步补充。</p>
          </div>
        ) : (
          <>
            {/* 分类筛选 */}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setCatFilter("全部")}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  catFilter === "全部"
                    ? "bg-[#04342C] text-white"
                    : "bg-black/5 text-[#5F5E5A] hover:bg-black/10"
                }`}
              >
                全部（{blocks.length}）
              </button>
              {presentCats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    catFilter === c
                      ? "text-white"
                      : "bg-black/5 text-[#5F5E5A] hover:bg-black/10"
                  }`}
                  style={catFilter === c ? { background: CATEGORY_COLORS[c] } : undefined}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* 卡片区 */}
            {catFilter === "全部" ? (
              <div className="mt-8 space-y-10">
                {presentCats.map((c) => {
                  const list = blocks.filter((b) => b.category === c);
                  return (
                    <section key={c}>
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#04342C]">
                        <span
                          className="inline-block h-3 w-3 rounded-sm"
                          style={{ background: CATEGORY_COLORS[c] }}
                        />
                        {c}
                        <span className="text-sm font-normal text-[#9b9a96]">（{list.length}）</span>
                      </h2>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {list.map((b) => (
                          <BlockCard key={b.id} doc={b} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {blocks
                  .filter((b) => b.category === catFilter)
                  .map((b) => (
                    <BlockCard key={b.id} doc={b} />
                  ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
