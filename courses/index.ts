import { stages, CATEGORIES, projects } from "@/content";

export interface CourseStep {
  id: number;
  title: string;
}

export interface CourseProject {
  slug: string;
  title: string;
  ageGroup: string;
  description: string;
  /** 分类 id，对应 CATEGORIES 中某阶段的分类（如 "seq" / "loop" / "draw"）。用于 /missions/[stage] 页按分类分组展示。 */
  category: string;
  missionBrief: string;
  erLingHint: string;
  steps: CourseStep[];
  defaultXml?: string;
  /** 舞台场景装饰（纯展示）：目标点 emoji、障碍、迷宫墙等。不参与运行逻辑与步骤判定。 */
  scene?: ProjectScene;
  /** 舞台上需要收集的「星星/物品」坐标。传给 Runtime 作为可收集目标（碰触即收集），用于条件与游戏类收集项目。 */
  stars?: { x: number; y: number }[];
  /** 特殊项目类型：memory=独立翻牌小游戏（不走 Blockly 积木，由专门组件实现）。 */
  component?: "memory";
  /** 时间轴模式（分类10·科学）：走 Runtime 的独立时间轴子系统（时钟驱动状态场），
   * 而非默认的「事件→动作队列」。积木生成 __runtime.timeline 轨道，由时钟统一推进。 */
  timeline?: boolean;
  /** 角色阵容：除默认「二零」外，还上场的伙伴角色 id 列表（如 ["sanqi"]）。Runtime 据此实例化额外角色。 */
  cast?: string[];
}

/** 舞台上的装饰标记（纯展示用，例如小旗子、宝藏箱、石头、箭头）。 */
export interface SceneMark {
  x: number;
  y: number;
  emoji: string;
  label?: string;
  /** 交互种类：decor=纯装饰；obstacle=障碍（运行时参与碰撞判定）；badguy=坏人（运行时参与碰撞判定）。 */
  kind?: "decor" | "obstacle" | "badguy";
}
/** 舞台上的线段障碍（纯展示，例如迷宫的墙）。 */
export interface SceneWall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
/** 会缓慢飘动的乌云（躲避类游戏用），由运行时按 vx/vy 持续移动并反弹于边界。 */
export interface SceneCloud {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}
/** 会持续下落的苹果（接苹果 / 反应力游戏用），由运行时按 vy 下落并在底部循环重生。 */
export interface SceneApple {
  x: number;
  y: number;
  vy: number;
  r: number;
}
/** 项目的舞台场景配置（纯展示，不参与运行逻辑判定）。 */
export interface ProjectScene {
  marks?: SceneMark[];
  walls?: SceneWall[];
  /** 会动的乌云列表（躲避类项目用）。 */
  clouds?: SceneCloud[];
  /** 会下落的苹果列表（接苹果 / 反应力游戏用）。 */
  apples?: SceneApple[];
}

/** 项目分类：每个学龄段下，把项目进一步按「概念 / 题材」分组，便于在 /missions/[stage] 页分层展示。 */
export interface ProjectCategory {
  /** 分类唯一 id（同阶段内唯一） */
  id: string;
  /** 分类完整名称，如 "基础序列与方向" */
  name: string;
  /** 短标签，显示在分类名旁的胶囊里，如 "序列" */
  shortTag: string;
  /** 一句话介绍，显示在分类标题下方 */
  description: string;
}

/** 根据分类 id 返回展示用的短标签（跨学段查找）。找不到时回退为原始 id。供家长入口/作品花园按分类分组与筛选使用。 */
export function getCategoryLabel(categoryCode: string): string {
  for (const stageId of Object.keys(CATEGORIES)) {
    const cat = CATEGORIES[stageId].find((c) => c.id === categoryCode);
    if (cat) return cat.shortTag;
  }
  return categoryCode;
}

export interface Stage {
  /** 唯一 id，用于锚点与路由 */
  id: string;
  /** 年龄段文案，例如 "6-8 岁" */
  ageRange: string;
  /** 阶段名称，例如 "图形化积木启蒙" */
  name: string;
  /** 一句话介绍 */
  tagline: string;
  /** open=已开放，soon=即将开放 */
  status: "open" | "soon";
  /** 该阶段下的项目 slug 列表（按顺序） */
  projectSlugs: string[];
}

// ⚠️ 坐标体系（2026-07-31 修正）：
//  渲染世界 Y 轴朝上（StagePlayer.toScreen 用 ch/2 - wy），而 runtime 的 move
//  原本用 dy = steps·sin(angle)，导致「脸朝上(angle=270)时身体往下走」= 倒着走。
//  已把 move 的 Y 分量改为 dy = -steps·sin(angle)，使「脸朝方向 == 移动方向」。
//  初始 angle 保持 270（朝上）。修好朝向后，移动类 demo 的整条路径相对原始坐标系做了
//  一次「左右镜像」（X 翻转）：故场景标记需同步 X 镜像，demo 才能仍落在旗子/星星上。
//  ⚠️ 例外：下列项目用「移到 x,y」（绝对坐标）积木，坐标写死在 demo 里、无法被场景镜像
//  自动同步，一旦镜像就会「题目说右下角、演示却去左上角」对不上。这些项目不含移动类路径、
//  镜像对它们无益，故跳过镜像——让 demo 坐标与原始场景标记、以及描述里的「右下角/左上角」一致。
const MIRROR_SKIP = new Set(["light_lanterns", "treasure_map", "escort"]);
for (const p of projects) {
  if (MIRROR_SKIP.has(p.slug)) continue;
  if (p.stars) for (const s of p.stars) { s.x = -s.x; }
  const marks = p.scene?.marks;
  if (marks) for (const m of marks) { m.x = -m.x; }
  const clouds = p.scene?.clouds;
  if (clouds) for (const c of clouds) { c.x = -c.x; }
}
export { stages, CATEGORIES, projects };

export function getProject(slug: string): CourseProject | undefined {
  return projects.find((p) => p.slug === slug);
}

/** 取某个学龄段下的全部项目（按 projectSlugs 顺序，过滤掉不存在的）。 */
export function getStageProjects(stageId: string): CourseProject[] {
  const stage = stages.find((s) => s.id === stageId);
  if (!stage) return [];
  return stage.projectSlugs
    .map((slug) => getProject(slug))
    .filter((p): p is CourseProject => Boolean(p));
}

/** 取某个学龄段下「按分类分组」的项目列表。只返回非空分类，分类顺序遵循 CATEGORIES 注册表，分类内项目遵循 projectSlugs 顺序。 */
export function getStageCategories(
  stageId: string
): Array<ProjectCategory & { projects: CourseProject[] }> {
  const stage = stages.find((s) => s.id === stageId);
  if (!stage) return [];
  const catDefs = CATEGORIES[stageId] ?? [];
  const projects = getStageProjects(stageId);
  return catDefs
    .map((cat) => ({ ...cat, projects: projects.filter((p) => p.category === cat.id) }))
    .filter((c) => c.projects.length > 0);
}

/** 取某个项目在同一学龄段里的下一个项目（用于完成弹窗的「挑战下一个」）。没有则返回 undefined。 */
export function getNextProject(slug: string): CourseProject | undefined {
  for (const stage of stages) {
    const ps = getStageProjects(stage.id);
    const idx = ps.findIndex((p) => p.slug === slug);
    if (idx >= 0 && idx < ps.length - 1) return ps[idx + 1];
  }
  return undefined;
}

/** 取某个项目所属的年段（用于项目页「返回」定位到对应的项目集合）。找不到返回 undefined。 */
export function getStageOfProject(slug: string): Stage | undefined {
  return stages.find((s) => s.projectSlugs.includes(slug));
}
