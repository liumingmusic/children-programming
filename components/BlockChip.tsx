"use client";

import { BlockDoc, BlockPart } from "@/lib/block-catalog";

function hsl(h: number, s: number, l: number) {
  return `hsl(${h} ${s}% ${l}%)`;
}

// 输入槽（数字/文本/下拉/布尔）的小卡片
function InputSlot({ part }: { part: Extract<BlockPart, { kind: "input" }> }) {
  if (part.inputType === "boolean") {
    return (
      <span
        className="inline-block h-5 w-6 align-middle"
        style={{
          background: "rgba(255,255,255,0.95)",
          clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
        }}
        title="可放入一个条件（六边形）积木"
      />
    );
  }
  const placeholder =
    part.inputType === "dropdown"
      ? (part.options?.[0] ?? "选项")
      : (part.placeholder ?? "");
  return (
    <span
      className="mx-1 inline-flex items-center rounded px-2 py-[2px] text-[12px] font-medium"
      style={{ background: "rgba(255,255,255,0.95)", color: "#222" }}
    >
      {placeholder}
      {part.inputType === "dropdown" && <span className="ml-1 opacity-60">▾</span>}
    </span>
  );
}

// 只读积木外观（不可拖拽）
export default function BlockChip({ doc }: { doc: BlockDoc }) {
  const bg = hsl(doc.color, 68, 48);
  const bgDark = hsl(doc.color, 68, 38);

  if (doc.shape === "special") {
    return (
      <div
        className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium"
        style={{ borderColor: bgDark, background: hsl(doc.color, 60, 95), color: bgDark }}
      >
        <span className="text-lg">🔧</span>
        <span>特殊组件</span>
      </div>
    );
  }

  const isPill = doc.shape === "reporter";
  const isHex = doc.shape === "boolean";

  const body = (
    <div
      className="flex flex-wrap items-center gap-x-1 gap-y-1 px-3 py-2 text-[13px] font-medium leading-none text-white"
      style={{
        background: bg,
        borderRadius: isPill ? 999 : isHex ? 6 : 10,
        clipPath: isHex
          ? "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)"
          : undefined,
      }}
    >
      {doc.parts.map((p, i) =>
        p.kind === "text" ? (
          <span key={i}>{p.value}</span>
        ) : (
          <InputSlot key={i} part={p} />
        )
      )}
    </div>
  );

  if (doc.shape === "hat") {
    return (
      <div className="inline-block">
        <div
          style={{
            width: "55%",
            height: 12,
            marginLeft: 4,
            background: bg,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            clipPath: "polygon(0 100%, 100% 100%, 88% 0, 12% 0)",
          }}
        />
        {body}
      </div>
    );
  }

  return body;
}
