import { describe, it, expect } from "vitest";
import {
  getStagePath,
  getUnlockedSet,
  getNodeStatus,
  getActiveChapterIndex,
  isUnlocked,
  getPreviousSlug,
  getCurrentSlug,
} from "@/lib/path";

const STAGE = "stage-6-8";

describe("闯关路径（lib/path）", () => {
  it("getStagePath：章节按注册表顺序、分类连续，且所有项目都进线性顺序", () => {
    const path = getStagePath(STAGE);
    // 全部注册分类（含尚未开发的空分类 story/science/pbl；music 与 math 本次已填充）：
    // seq/loop/draw/event/cond/game/story/music/math/science/pbl
    expect(path.chapters.map((c) => c.id)).toEqual([
      "seq",
      "loop",
      "draw",
      "event",
      "cond",
      "game",
      "story",
      "music",
      "math",
      "science",
      "pbl",
    ]);
    // 线性顺序与分类顺序一致（seq 块在前）；空分类不贡献解锁节点
    expect(path.linearOrder.slice(0, 3)).toEqual(["hello", "flag", "stone"]);
    expect(path.linearOrder).toContain("square"); // loop 在 seq 之后
    expect(path.linearOrder.indexOf("square")).toBeGreaterThan(path.linearOrder.indexOf("frame"));
    // 总数 = 105（原 61 + 音乐/数学/故事/科学 各 10 项 + 分类11·综合 4 项）
    expect(path.linearOrder.length).toBe(105);
  });

  it("getUnlockedSet：空进度时只有第一关解锁", () => {
    const path = getStagePath(STAGE);
    const unlocked = getUnlockedSet(path.linearOrder, new Set());
    expect(unlocked.has("hello")).toBe(true);
    expect(unlocked.has("flag")).toBe(false);
    expect(unlocked.has("traffic_police")).toBe(false);
  });

  it("getUnlockedSet：完成上一关即解锁下一关（严格顺序）", () => {
    const path = getStagePath(STAGE);
    const unlocked = getUnlockedSet(path.linearOrder, new Set(["hello"]));
    expect(unlocked.has("hello")).toBe(true); // 自身已完成
    expect(unlocked.has("flag")).toBe(true); // 上一关已完成
    expect(unlocked.has("stone")).toBe(false); // 上上一关未完成
  });

  it("getUnlockedSet：全部完成则全部解锁", () => {
    const path = getStagePath(STAGE);
    const all = new Set(path.linearOrder);
    const unlocked = getUnlockedSet(path.linearOrder, all);
    expect(unlocked.size).toBe(105);
  });

  it("getUnlockedSet：已完成的关卡永远解锁（兼容乱序完成造成的空洞）", () => {
    const path = getStagePath(STAGE);
    const unlocked = getUnlockedSet(path.linearOrder, new Set(["collect3"]));
    expect(unlocked.has("collect3")).toBe(true); // 自身已完成
  });

  it("getNodeStatus：完成/当前/锁定 三种状态", () => {
    const path = getStagePath(STAGE);
    const completed = new Set(["hello"]);
    const unlocked = getUnlockedSet(path.linearOrder, completed);
    expect(getNodeStatus("hello", completed, unlocked)).toBe("completed");
    expect(getNodeStatus("flag", completed, unlocked)).toBe("current");
    expect(getNodeStatus("stone", completed, unlocked)).toBe("locked");
  });

  it("getActiveChapterIndex：空进度激活第一章", () => {
    const path = getStagePath(STAGE);
    expect(getActiveChapterIndex(path, new Set())).toBe(0);
  });

  it("getActiveChapterIndex：完成整章后激活下一章", () => {
    const path = getStagePath(STAGE);
    const seqAll = new Set(path.chapters[0].projects.map((p) => p.slug));
    expect(getActiveChapterIndex(path, seqAll)).toBe(1); // 进入 loop 章
  });

  it("getActiveChapterIndex：全通关时返回最后一章", () => {
    const path = getStagePath(STAGE);
    const all = new Set(path.linearOrder);
    expect(getActiveChapterIndex(path, all)).toBe(path.chapters.length - 1);
  });

  it("isUnlocked：封装判断正确", () => {
    expect(isUnlocked(STAGE, "flag", new Set(["hello"]))).toBe(true);
    expect(isUnlocked(STAGE, "square", new Set(["hello"]))).toBe(false);
    expect(isUnlocked(STAGE, "traffic_police", new Set())).toBe(false);
  });

  it("getPreviousSlug / getCurrentSlug", () => {
    expect(getPreviousSlug(STAGE, "flag")).toBe("hello");
    expect(getPreviousSlug(STAGE, "hello")).toBeNull();
    expect(getCurrentSlug(STAGE, new Set())).toBe("hello");
    const all = new Set(getStagePath(STAGE).linearOrder);
    expect(getCurrentSlug(STAGE, all)).toBeNull(); // 全通关无当前关
  });
});
