import { describe, it, expect, beforeEach } from "vitest";
import {
  clearStore,
  saveProject,
  loadProject,
  getAllFreeProjects,
  deleteProject,
  FREE_PREFIX,
  FREE_DRAFT_SLUG,
} from "@/lib/db";

describe("造物工坊·自由创作本地存储", () => {
  beforeEach(async () => {
    await clearStore();
  });

  it("命名作品可保存并通过 getAllFreeProjects 列出", async () => {
    await saveProject("free:abc", "我的画", "自由创作", "<xml/>");
    const list = await getAllFreeProjects();
    expect(list.length).toBe(1);
    expect(list[0].title).toBe("我的画");
    expect(list[0].slug).toBe("free:abc");
  });

  it("草稿槽不计入作品列表", async () => {
    await saveProject("free:abc", "我的画", "自由创作", "<xml/>");
    await saveProject(FREE_DRAFT_SLUG, "草稿", "自由创作", "<xml/>");
    const list = await getAllFreeProjects();
    expect(list.length).toBe(1);
    expect(list[0].slug).toBe("free:abc");
  });

  it("loadProject 能取回命名作品 xml", async () => {
    await saveProject("free:abc", "我的画", "自由创作", "<xml>blocks</xml>");
    expect(await loadProject("free:abc")).toBe("<xml>blocks</xml>");
  });

  it("deleteProject 删除后列表为空且无法再取回", async () => {
    await saveProject("free:abc", "我的画", "自由创作", "<xml/>");
    await deleteProject("free:abc");
    expect(await getAllFreeProjects()).toHaveLength(0);
    expect(await loadProject("free:abc")).toBeNull();
  });

  it("FREE_PREFIX 常量用于区分自由创作作品", () => {
    expect(FREE_PREFIX).toBe("free:");
    expect(FREE_DRAFT_SLUG).toBe("free:draft");
  });
});
