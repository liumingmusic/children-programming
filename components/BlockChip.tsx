"use client";

import type { CSSProperties } from "react";
import { BlockDoc, BlockPart } from "@/lib/block-catalog";

// ============================================================================
// 颜色：与项目编辑器里的 Blockly（Classic 主题）完全一致。
// Blockly 的 setColour(hue) 最终走 ColourManager.hueToHex(hue)
// = hsv(hue, 0.45, 165.75)（饱和度 45%、明度 165.75/255≈65%）。
// 之前组件库用的是 hsl(hue,68%,48%)，色相虽同但饱和/明度不同，
// 导致「看起来不是一个东西」。这里直接复用同一套公式。
// ============================================================================
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  // 注意：传入的 v 已是 0–255 量纲（165.75），r/g/b/c/x/m 也都在 0–255，
  // 这里直接取整即可，不要再乘 255（否则会爆成乱码颜色）。
  return [Math.round(r + m), Math.round(g + m), Math.round(b + m)];
}
const hx = (n: number) => n.toString(16).padStart(2, "0");
const blocklyFill = (hue: number) => {
  const [r, g, b] = hsvToRgb(hue, 0.45, 165.75);
  return `#${hx(r)}${hx(g)}${hx(b)}`;
};
const blocklyBorder = (hue: number) => {
  const [r, g, b] = hsvToRgb(hue, 0.45, 165.75 * 0.72);
  return `#${hx(r)}${hx(g)}${hx(b)}`;
};
const blocklyTop = (hue: number) => {
  const [r, g, b] = hsvToRgb(hue, 0.45, Math.min(255, 165.75 * 1.12));
  return `#${hx(r)}${hx(g)}${hx(b)}`;
};

// 文本宽度估算：与服务端、客户端用同一算法，避免 hydration 不一致。
function charW(ch: string): number {
  const code = ch.codePointAt(0) || 0;
  if (code > 0x2e7f) return 12; // CJK / 全角
  if (ch === " ") return 3.5;
  return 6.6;
}
function measure(t: string): number {
  let w = 0;
  for (const ch of t) w += charW(ch);
  return w;
}
function partWidth(part: BlockPart): number {
  if (part.kind === "text") return measure(part.value);
  if (part.inputType === "boolean") return 22;
  if (part.inputType === "dropdown")
    return measure((part.options?.[0] ?? "选项") + " ▾") + 16;
  return Math.max(26, measure(part.placeholder ?? "") + 16);
}

// 输入槽（数字/文本/下拉/布尔）的小卡片
function InputSlot({ part }: { part: Extract<BlockPart, { kind: "input" }> }) {
  if (part.inputType === "boolean") {
    return (
      <span
        className="inline-block align-middle"
        style={{
          width: 22,
          height: 16,
          background: "rgba(255,255,255,0.96)",
          clipPath:
            "polygon(22% 0, 78% 0, 100% 50%, 78% 100%, 22% 100%, 0 50%)",
        }}
        title="可放入一个条件（六边形）积木"
      />
    );
  }
  const text =
    part.inputType === "dropdown"
      ? (part.options?.[0] ?? "选项") + " ▾"
      : (part.placeholder ?? "");
  return (
    <span
      className="inline-flex items-center px-2 py-[1px] text-[12px] font-medium"
      style={{
        background: "rgba(255,255,255,0.96)",
        color: "#222",
        borderRadius: 4,
        boxShadow: "0 1px 0 rgba(0,0,0,0.12)",
      }}
    >
      {text}
    </span>
  );
}

// 只读积木外观（不可拖拽），尽量还原 Blockly 编辑器里的样子：
// 同款配色、顶部高光、深色描边，并按形状还原轮廓（帽子/堆叠缺口/数值插头/布尔六边形）。
export default function BlockChip({ doc }: { doc: BlockDoc }) {
  if (doc.shape === "special") {
    const fill = blocklyFill(doc.color);
    const border = blocklyBorder(doc.color);
    const top = blocklyTop(doc.color);
    return (
      <div
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium"
        style={{
          border: `1.5px solid ${border}`,
          background: fill,
          color: "#fff",
          boxShadow: `inset 0 1px 0 ${top}`,
        }}
      >
        <span className="text-lg">🔧</span>
        <span>特殊组件</span>
      </div>
    );
  }

  const fill = blocklyFill(doc.color);
  const border = blocklyBorder(doc.color);
  const top = blocklyTop(doc.color);

  const widths = doc.parts.map(partWidth);
  const contentW =
    widths.reduce((a, b) => a + b, 0) + Math.max(0, doc.parts.length - 1) * 6;
  const blockW = Math.max(64, Math.round(contentW + 28));

  const isPill = doc.shape === "reporter";
  const isHex = doc.shape === "boolean";
  const isHat = doc.shape === "hat";
  const isStatement = doc.shape === "statement";

  const base: CSSProperties = {
    background: fill,
    border: `1.5px solid ${border}`,
    color: "#fff",
    boxShadow: `inset 0 1px 0 ${top}, 0 1px 1px rgba(0,0,0,0.12)`,
    fontSize: 12,
    lineHeight: "16px",
  };

  // 堆叠积木（statement）：顶部中间凹一个缺口、底部中间凸一个卡扣，
  // 这就是 Blockly 里「可以上下拼起来」的样子。
  const statementClip =
    "polygon(0 0, calc(50% - 9px) 0, calc(50% - 9px) 6px, calc(50% + 9px) 6px, calc(50% + 9px) 0, 100% 0, 100% 100%, calc(50% + 9px) 100%, calc(50% + 9px) calc(100% - 6px), calc(50% - 9px) calc(100% - 6px), calc(50% - 9px) 100%, 0 100%)";

  const bodyStyle: CSSProperties = {
    ...base,
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    padding: "9px 14px",
    borderRadius: isPill ? 10 : isHex ? 6 : 10,
    clipPath: isHex
      ? "polygon(12% 0, 88% 0, 100% 50%, 88% 100%, 12% 100%, 0 50%)"
      : isStatement
        ? statementClip
        : undefined,
    width: isHex ? undefined : blockW,
    justifyContent: isHex ? "center" : undefined,
    textAlign: "center",
  };

  const body = (
    <div style={bodyStyle}>
      {/* 数值/报告类积木左侧的「插头」小凸起，表示可以嵌进别的积木 */}
      {isPill && (
        <span
          className="absolute"
          style={{
            left: -7,
            top: "50%",
            transform: "translateY(-50%)",
            width: 9,
            height: 16,
            background: fill,
            border: `1.5px solid ${border}`,
            borderRight: "none",
            borderRadius: "9px 0 0 9px",
          }}
        />
      )}
      {doc.parts.map((p, i) =>
        p.kind === "text" ? (
          <span key={i} style={{ whiteSpace: "pre" }}>
            {p.value}
          </span>
        ) : (
          <InputSlot key={i} part={p} />
        )
      )}
    </div>
  );

  // 帽子积木（「当…」事件）：上面加一个圆顶，和编辑器里帽子块一致。
  if (isHat) {
    return (
      <div className="inline-block">
        <div
          style={{
            width: "62%",
            height: 15,
            margin: "0 auto -2px",
            background: fill,
            border: `1.5px solid ${border}`,
            borderBottom: "none",
            borderRadius: "11px 11px 0 0",
            boxShadow: `inset 0 1px 0 ${top}`,
          }}
        />
        {body}
      </div>
    );
  }

  return body;
}
