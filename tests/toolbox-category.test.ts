import { describe, it, expect } from "vitest";
import { TOOLBOX } from "@/lib/blockly-blocks";
import {
  BLOCK_CATALOG,
  CATEGORY_ORDER,
} from "@/lib/block-catalog";
import {
  CATEGORIZED_TOOLBOX,
  TOOLBOX_ITEM_BY_TYPE,
  DEFAULT_EXPANDED_CATEGORIES,
  type ToolboxItem,
} from "@/lib/toolbox-category";

const toolboxTypes = (TOOLBOX as unknown as { contents: { type: string }[] }).contents.map(
  (c) => c.type
);
const catalogIds = new Set(BLOCK_CATALOG.map((d) => d.id));
const specialIds = new Set(
  BLOCK_CATALOG.filter((d) => d.shape === "special").map((d) => d.id)
);

describe("分类化工具箱（手风琴）", () => {
  it("TOOLBOX 里每一个真实积木都在 BLOCK_CATALOG 中登记过分类（防漏登记回归）", () => {
    const missing = toolboxTypes.filter(
      (t) => !catalogIds.has(t) || specialIds.has(t)
    );
    expect(
      missing,
      `以下 TOOLBOX 积木未在 catalog 登记分类（或属于 special 组件）：${missing.join(", ")}`
    ).toEqual([]);
  });

  it("CATEGORIZED_TOOLBOX 覆盖 TOOLBOX 的全部积木，不重不漏", () => {
    const grouped = CATEGORIZED_TOOLBOX.flatMap((g) => g.items.map((i) => i.doc.id));
    // 去重后应与 toolboxTypes 完全一致
    expect(new Set(grouped).size).toBe(new Set(toolboxTypes).size);
    for (const t of toolboxTypes) {
      expect(TOOLBOX_ITEM_BY_TYPE[t], `TOOLBOX 类型 ${t} 未出现在分类工具箱中`).toBeDefined();
    }
  });

  it("每个分类组内的积木 doc.category 与该组分类一致", () => {
    for (const group of CATEGORIZED_TOOLBOX) {
      for (const item of group.items as ToolboxItem[]) {
        expect(item.doc.category).toBe(group.category);
        // 该 doc 必须能在全量 catalog 中找到（避免引用悬空）
        expect(catalogIds.has(item.doc.id)).toBe(true);
      }
    }
  });

  it("分类顺序遵循 CATEGORY_ORDER，且无空分类", () => {
    const cats = CATEGORIZED_TOOLBOX.map((g) => g.category);
    // 取 cats 在 CATEGORY_ORDER 中的下标，应为递增（保持官方顺序）
    const idxs = cats.map((c) => CATEGORY_ORDER.indexOf(c));
    for (let i = 1; i < idxs.length; i++) {
      expect(idxs[i]).toBeGreaterThan(idxs[i - 1]);
    }
    for (const g of CATEGORIZED_TOOLBOX) {
      expect(g.items.length).toBeGreaterThan(0);
    }
  });

  it("默认展开的分类存在且非空", () => {
    for (const cat of DEFAULT_EXPANDED_CATEGORIES) {
      const group = CATEGORIZED_TOOLBOX.find((g) => g.category === cat);
      expect(group, `默认展开的分类 ${cat} 不存在`).toBeDefined();
      expect(group!.items.length).toBeGreaterThan(0);
    }
  });
});
