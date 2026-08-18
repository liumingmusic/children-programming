"use client";

import { useState, useCallback } from "react";
import {
  CATEGORIZED_TOOLBOX,
  DEFAULT_EXPANDED_CATEGORIES,
  type ToolboxItem,
} from "@/lib/toolbox-category";
import BlockChip from "./BlockChip";

interface ToolboxAccordionProps {
  /** 点击某个积木时回调，携带该积木的文档与默认 TOOLBOX 条目（含 fields/shadow）。 */
  onPick: (item: ToolboxItem) => void;
  /** 可选：只展示这些分类（造物工坊按学龄裁剪工具箱用）。不传则展示全部。 */
  categories?: string[];
}

/**
 * 手风琴式积木工具箱（替代 Blockly 自带的扁平 flyout）。
 * - 每个分类是一个可折叠面板，标题带分类色标 + 名称 + 数量。
 * - 默认展开「事件」「运动」两个分类，其余折叠，学生可自行展开查找。
 * - 两种「把积木放到工作区」的方式：
 *   1) 点击：触发 onPick → 上层调用 editor.addBlock
 *   2) 拖拽：HTML5 dragstart 把积木 type 写进 dataTransfer('application/x-blockly-type')，
 *      工作区容器 onDrop 读出并 addBlock 到拖入点附近
 *   两种方式都可用，按孩子习惯自选。
 */
export default function ToolboxAccordion({ onPick, categories }: ToolboxAccordionProps) {
  const groups = categories
    ? CATEGORIZED_TOOLBOX.filter((g) => categories.includes(g.category))
    : CATEGORIZED_TOOLBOX;

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const g of groups) {
      init[g.category] = DEFAULT_EXPANDED_CATEGORIES.includes(g.category);
    }
    return init;
  });

  const toggle = useCallback((cat: string) => {
    setOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  return (
    <aside className="flex w-64 flex-col overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="border-b border-black/5 px-3 py-2">
        <h2 className="text-sm font-medium text-[#04342C]">积木工具箱</h2>
        <p className="text-[11px] text-[#9b988e]">点击或拖拽积木到工作区</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {groups.map((group) => {
          const isOpen = open[group.category];
          return (
            <div key={group.category} className="border-b border-black/5 last:border-b-0">
              <button
                type="button"
                onClick={() => toggle(group.category)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-[#F8F8F6]"
              >
                <span className="w-3 text-[10px] text-[#9b988e]">{isOpen ? "▾" : "▸"}</span>
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ background: group.color }}
                />
                <span className="flex-1 text-sm font-medium text-[#04342C]">
                  {group.category}
                </span>
                <span className="rounded-full bg-[#F1EFE8] px-2 py-0.5 text-[11px] text-[#5F5E5A]">
                  {group.items.length}
                </span>
              </button>

              {isOpen && (
                <div className="space-y-2 overflow-x-auto px-3 pb-3 pt-1">
                  {group.items.map((item) => (
                    <button
                      key={item.doc.id}
                      type="button"
                      // 拖拽：把积木 type 写进 dataTransfer；浏览器在拖动时会显示一个半透明积木
                      // 副本跟随光标，松手时由 BlocklyEditor 的 onDrop 捕获并 addBlock。
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("application/x-blockly-type", item.doc.id);
                        e.dataTransfer.effectAllowed = "copy";
                      }}
                      // 点击仍然可用：双模式（点 / 拖）
                      onClick={() => onPick(item)}
                      title={`${item.doc.label}\n${item.doc.purpose}\n（点击添加，或拖到工作区）`}
                      className="block w-full cursor-grab rounded-lg border border-black/5 bg-white p-1.5 text-left transition-colors hover:border-[#5DCAA5] hover:bg-[#F4FBF8] active:cursor-grabbing"
                    >
                      <BlockChip doc={item.doc} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
