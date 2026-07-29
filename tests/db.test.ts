import { describe, it, expect, beforeEach } from "vitest";
import {
  markProgress,
  getProgress,
  getAllProgress,
  saveProject,
  loadProject,
  recordSessionTime,
  getTimeStats,
} from "@/lib/db";

describe("本地进度存取（Dexie / fake-indexeddb）", () => {
  beforeEach(async () => {
    // 每个用例前清空，避免互相污染
    const { db } = await import("@/lib/db");
    if (db) {
      await db.projects.clear();
      await db.progress.clear();
      await db.timeLogs.clear();
    }
  });

  it("markProgress 后 getProgress 能读回已完成状态", async () => {
    await markProgress("hello", true, 3);
    const p = await getProgress("hello");
    expect(p).not.toBeNull();
    expect(p!.completed).toBe(true);
    expect(p!.stars).toBe(3);
    expect(p!.completedAt).toBeInstanceOf(Date);
  });

  it("getAllProgress 包含已完成的条目（证书页依赖它判断是否发证书）", async () => {
    await markProgress("hello", true, 3);
    await markProgress("rainbow", false, 0);

    const all = await getAllProgress();
    expect(all.length).toBe(2);
    const hello = all.find((p) => p.slug === "hello");
    expect(hello?.completed).toBe(true);
  });

  it("重复标记同一项目不会写入多条记录", async () => {
    await markProgress("hello", true, 3);
    await markProgress("hello", true, 3);
    const all = await getAllProgress();
    expect(all.filter((p) => p.slug === "hello").length).toBe(1);
  });

  it("未完成的进度 completed=false，证书页应判为未找到", async () => {
    await markProgress("hello", false, 0);
    const all = await getAllProgress();
    const hello = all.find((p) => p.slug === "hello");
    expect(hello?.completed).toBe(false);
  });

  it("saveProject / loadProject 往返保存积木 XML", async () => {
    await saveProject("hello", "标题", "6-8 岁", "<xml>block</xml>");
    const xml = await loadProject("hello");
    expect(xml).toBe("<xml>block</xml>");
  });

  it("recordSessionTime 累加时长，getTimeStats 能汇总", async () => {
    await recordSessionTime("hello", 30);
    await recordSessionTime("hello", 15);
    const stats = await getTimeStats();
    expect(stats.totalSeconds).toBe(45);
    expect(stats.byProject["hello"]).toBe(45);
  });
});
