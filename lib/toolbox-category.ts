// 分类化工具箱：把扁平的 TOOLBOX（63 个积木全部罗列）按 BLOCK_CATALOG 的分类重新分组，
// 供「手风琴」自定义工具箱使用。每个分类下保留原始 TOOLBOX 条目（含默认 fields / shadow inputs），
// 这样点击添加时生成的积木与原来的 flyout 完全一致。
//
// 设计要点：
// - 顺序遵循 TOOLBOX.contents（保持原有合理相邻关系，如「敲鼓」紧随「弹音符」），
//   再按 BLOCK_CATALOG 的 category 归组。
// - 只收录「既是真实积木（非 special 组件）又在 TOOLBOX 中」的条目；
//   若某 TOOLBOX 类型在 catalog 漏登记（历史曾漏过 maker_play_drum 等），
//   这里会静默跳过——由 tests/toolbox-category.test.ts 抓漏。
// - 本文件不引入 Blockly 运行时，纯数据；避免与 blockly-blocks 形成循环依赖。

import { TOOLBOX } from "@/lib/blockly-blocks";
import {
  BLOCK_CATALOG,
  CATEGORY_ORDER,
  CATEGORY_COLORS,
  type BlockDoc,
} from "@/lib/block-catalog";

/** TOOLBOX 条目里携带的默认 fields / shadow inputs（点击添加时原样套用）。 */
export interface ToolboxEntry {
  type: string;
  fields?: Record<string, string | number>;
  inputs?: Record<
    string,
    { shadow?: { type: string; fields?: Record<string, string | number> } }
  >;
}

export interface ToolboxItem {
  doc: BlockDoc;
  entry: ToolboxEntry;
}

export interface ToolboxCategoryGroup {
  category: string;
  color: string;
  items: ToolboxItem[];
}

/** 默认展开的分类（用户需求：默认展开两个，方便快速上手）。 */
export const DEFAULT_EXPANDED_CATEGORIES: string[] = ["事件", "运动"];

const docById = new Map<string, BlockDoc>(BLOCK_CATALOG.map((d) => [d.id, d]));

function buildCategorizedToolbox(): ToolboxCategoryGroup[] {
  const buckets: Record<string, ToolboxItem[]> = {};
  for (const cat of CATEGORY_ORDER) buckets[cat] = [];

  const contents = (TOOLBOX as unknown as { contents: ToolboxEntry[] }).contents;
  for (const entry of contents) {
    const doc = docById.get(entry.type);
    if (!doc) continue; // 漏登记 → 跳过（测试会报警）
    if (doc.shape === "special") continue; // 特殊组件不是可添加积木
    buckets[doc.category]?.push({ doc, entry });
  }

  return CATEGORY_ORDER.map((cat) => ({
    category: cat,
    color: CATEGORY_COLORS[cat],
    items: buckets[cat] ?? [],
  })).filter((g) => g.items.length > 0);
}

export const CATEGORIZED_TOOLBOX: ToolboxCategoryGroup[] = buildCategorizedToolbox();

/** 扁平索引：type → ToolboxItem，便于按类型取默认条目。 */
export const TOOLBOX_ITEM_BY_TYPE: Record<string, ToolboxItem> = (() => {
  const map: Record<string, ToolboxItem> = {};
  for (const g of CATEGORIZED_TOOLBOX) {
    for (const item of g.items) map[item.doc.id] = item;
  }
  return map;
})();

/** 全部分类名（按 CATEGORIZED_TOOLBOX 顺序），供页面启用原生拖拽 flyout 时传全部分类。 */
export const ALL_TOOLBOX_CATEGORIES: string[] = CATEGORIZED_TOOLBOX.map((g) => g.category);

/**
 * 构建 Blockly 原生「分类 flyout」工具箱（可拖拽），用于替代外部手风琴 + 点击添加。
 * 把现有 CATEGORIZED_TOOLBOX 的分组与配色直接映射成 Blockly 嵌套分类，
 * 每个分类下是可拖出的积木（含默认 fields / shadow inputs，拖出效果与原来一致）。
 *
 * @param categories 可选：只保留这些分类（按学龄裁剪工具箱用）。不传则展示全部。
 * @returns Blockly toolbox 配置对象（kind: "categoryToolbox"）。
 */
export function buildFlyoutToolbox(categories?: string[]) {
  const groups = categories
    ? CATEGORIZED_TOOLBOX.filter((g) => categories.includes(g.category))
    : CATEGORIZED_TOOLBOX;

  return {
    kind: "categoryToolbox" as const,
    contents: groups.map((g) => ({
      kind: "category" as const,
      name: g.category,
      colour: g.color, // 分类色标，让 flyout 与原有手风琴配色一致
      contents: g.items.map((item) => {
        const entry = item.entry;
        const node: Record<string, unknown> = { kind: "block", type: entry.type };
        if (entry.fields && Object.keys(entry.fields).length) node.fields = entry.fields;
        if (entry.inputs && Object.keys(entry.inputs).length) node.inputs = entry.inputs;
        return node;
      }),
    })),
  };
}
