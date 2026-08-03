import { getStageOfProject, getProject, CATEGORIES, getStageProjects } from "@/courses";

export type NodeStatus = "completed" | "current" | "locked";

export interface PathProjectRef {
  slug: string;
  title: string;
}

export interface PathChapter {
  id: string;
  name: string;
  shortTag: string;
  description: string;
  projects: PathProjectRef[];
}

export interface StagePath {
  stageId: string;
  chapters: PathChapter[];
  /** 全局线性闯关顺序（按分类连续拼接）。解锁判定以此为唯一依据。 */
  linearOrder: string[];
}

/**
 * 取某个学龄段的「闯关路径」：章节（=分类）按注册表顺序，**包含尚未开发的空分类**，
 * 这样 /missions/[stage] 页能为 story/math/science/pbl 等「敬请期待」占位分类也渲染出分组卡片。
 * 章节内项目按 projectSlugs 顺序（CATEGORIES 顺序 + projectSlugs 顺序共同保证「分类连续」）。
 * 空分类的 projects 为空数组，不贡献任何线性解锁节点，故不影响闯关解锁逻辑。
 */
export function getStagePath(stageId: string): StagePath {
  const catDefs = CATEGORIES[stageId] ?? [];
  const stageProjects = getStageProjects(stageId);
  const chapters: PathChapter[] = catDefs.map((c) => ({
    id: c.id,
    name: c.name,
    shortTag: c.shortTag,
    description: c.description,
    projects: stageProjects
      .filter((p) => p.category === c.id)
      .map((p) => ({ slug: p.slug, title: p.title })),
  }));
  const linearOrder = chapters.flatMap((ch) => ch.projects.map((p) => p.slug));
  return { stageId, chapters, linearOrder };
}

/**
 * 严格顺序解锁：slug 在 i 处解锁 ⇔ 它已完成，或它是第一个，或它的「前一个」已完成。
 * 已完成的关卡永远解锁（兼容老用户乱序完成造成的空洞，不会把自己锁死）。
 * 因此同一时刻只有一个「进行中」节点（最前方的未通关解锁节点）。
 */
export function getUnlockedSet(linearOrder: string[], completedSet: Set<string>): Set<string> {
  const unlocked = new Set<string>();
  linearOrder.forEach((slug, i) => {
    if (completedSet.has(slug)) {
      unlocked.add(slug);
    } else if (i === 0) {
      unlocked.add(slug);
    } else if (completedSet.has(linearOrder[i - 1])) {
      unlocked.add(slug);
    }
  });
  return unlocked;
}

export function getNodeStatus(
  slug: string,
  completedSet: Set<string>,
  unlockedSet: Set<string>,
): NodeStatus {
  if (completedSet.has(slug)) return "completed";
  if (unlockedSet.has(slug)) return "current";
  return "locked";
}

/** 当前激活章节下标：含「已解锁但未完成」项目的第一个章节；全通关则取最后一章。 */
export function getActiveChapterIndex(path: StagePath, completedSet: Set<string>): number {
  const unlocked = getUnlockedSet(path.linearOrder, completedSet);
  for (let ci = 0; ci < path.chapters.length; ci++) {
    const hasFrontier = path.chapters[ci].projects.some(
      (p) => unlocked.has(p.slug) && !completedSet.has(p.slug),
    );
    if (hasFrontier) return ci;
  }
  return Math.max(0, path.chapters.length - 1);
}

/** 判断某 slug 是否解锁（供项目页「锁门」使用）。 */
export function isUnlocked(stageId: string, slug: string, completedSet: Set<string>): boolean {
  const path = getStagePath(stageId);
  return getUnlockedSet(path.linearOrder, completedSet).has(slug);
}

/** 取某 slug 的「上一个」关卡 slug（用于锁门提示「先完成上一关《X》」）。 */
export function getPreviousSlug(stageId: string, slug: string): string | null {
  const order = getStagePath(stageId).linearOrder;
  const i = order.indexOf(slug);
  return i > 0 ? order[i - 1] : null;
}

/** 取当前「进行中」关卡 slug（第一个未通关的解锁节点），全通关返回 null。 */
export function getCurrentSlug(stageId: string, completedSet: Set<string>): string | null {
  const path = getStagePath(stageId);
  const unlocked = getUnlockedSet(path.linearOrder, completedSet);
  for (const slug of path.linearOrder) {
    if (unlocked.has(slug) && !completedSet.has(slug)) return slug;
  }
  return null;
}

/** 计算某章节的进度（已完成数 / 总数）。 */
export function getChapterProgress(
  chapter: PathChapter,
  completedSet: Set<string>,
): { done: number; total: number } {
  const done = chapter.projects.filter((p) => completedSet.has(p.slug)).length;
  return { done, total: chapter.projects.length };
}

/** 便捷封装：给定 slug 与其所属阶段的已完成集合，判断该关卡是否被锁。 */
export function isSlugLocked(slug: string, completedSet: Set<string>): boolean {
  const stage = getStageOfProject(slug);
  if (!stage) return false;
  return !isUnlocked(stage.id, slug, completedSet);
}

/** 便捷封装：取锁门提示用的「上一关标题」。 */
export function getPreviousTitle(slug: string): string | null {
  const stage = getStageOfProject(slug);
  if (!stage) return null;
  const prev = getPreviousSlug(stage.id, slug);
  return prev ? getProject(prev)?.title ?? null : null;
}
