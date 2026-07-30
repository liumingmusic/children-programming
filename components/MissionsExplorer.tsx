"use client";

import { useState } from "react";
import { stages } from "@/courses";
import AdventurePath from "@/components/AdventurePath";

export default function MissionsExplorer() {
  const openStage = stages.find((s) => s.status === "open") ?? stages[0];
  const [selected, setSelected] = useState(openStage.id);

  return (
    <div>
      {/* 阶段切换 tab：仅 open 阶段可选，其余显示「即将开放」并禁用 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {stages.map((s) => {
          const isOpen = s.status === "open";
          const active = s.id === selected;
          return (
            <button
              key={s.id}
              disabled={!isOpen}
              onClick={() => isOpen && setSelected(s.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#0F6E56] text-white"
                  : isOpen
                    ? "border border-black/10 bg-white text-[#085041] hover:bg-[#E1F5EE]"
                    : "cursor-not-allowed bg-[#F1EFE8] text-[#9B988E]"
              }`}
            >
              {s.ageRange} · {s.name}
              {!isOpen && <span className="ml-1 text-xs">（即将开放）</span>}
            </button>
          );
        })}
      </div>

      <AdventurePath stageId={selected} />
    </div>
  );
}
