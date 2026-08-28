import type { CourseProject } from "@/courses";
import { stage13JsProjects } from "./js";
import { stage13PhysProjects } from "./phys";

/**
 * 13-16 岁 · 进阶工坊 项目集合（按分类拆文件夹，与 9-12 阶段同一约定）。
 *
 * 每个分类一个子文件夹（<cat>/<slug>.ts + <cat>/index.ts 聚合），分类 id 见 categories.ts：
 *   js       文本代码过渡      K  8/8   从积木平滑过渡到 JavaScript 文本代码
 *   phys     物理与模拟        M  2/8   Phase 2 试点：自由落体 / 弹跳球（画布图元）
 *   algo     算法与数据结构    L  0/8   待 Phase 3
 *   dataviz  数据可视化        N  0/8   待 Phase 2 后续
 *   creative 创意编程          O  0/8   待 Phase 2 后续
 *   web      网页 / 小游戏     P  0/8   待 Phase 2 后续
 *   ai       人工智能启蒙      Q  0/8   待 Phase 3
 *   capstone 毕业项目          R  0/8   待 Phase 3
 *
 * 全部项目为 codeMode（直接写 JavaScript），完成判定走 lib/steps.ts 的
 * JS_CODE_SLUGS / PHYS_CODE_SLUGS 分支（真实 JS 标记 + 运行日志 + 画布图元统计）。
 */
export const stage13Projects: CourseProject[] = [
  ...stage13JsProjects,
  ...stage13PhysProjects,
];
