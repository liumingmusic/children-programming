import type { CourseProject } from "@/courses";
import { stage13JsProjects } from "./js";
import { stage13PhysProjects } from "./phys";
import { stage13DatavizProjects } from "./dataviz";

/**
 * 13-16 岁 · 进阶工坊 项目集合（按分类拆文件夹，与 9-12 阶段同一约定）。
 *
 * 每个分类一个子文件夹（<cat>/<slug>.ts + <cat>/index.ts 聚合），分类 id 见 categories.ts：
 *   js       文本代码过渡      K  8/8    从积木平滑过渡到 JavaScript 文本代码
 *   phys     物理与模拟        M  7/7    Phase 2a 试点 + Phase 2b 补齐（画布图元逐帧模拟）
 *   dataviz  数据可视化        N  7/7    Phase 2c 铺满（数值 → 高度/角度/字号/颜色）
 *   algo     算法与数据结构    L  0/8    待 Phase 3
 *   creative 创意编程          O  0/6    待 Phase 2d
 *   web      网页 / 小游戏     P  0/6    待 Phase 2e（需先建 DOM 渲染能力）
 *   ai       人工智能启蒙      Q  0/6    待 Phase 3
 *   capstone 毕业项目          R  0/5    待 Phase 3
 *
 * 全部项目为 codeMode（直接写 JavaScript），完成判定走 lib/steps.ts 的
 * JS_CODE_SLUGS / PHYS_CODE_SLUGS / DATAVIZ_CODE_SLUGS 分支
 * （真实 JS 标记 + 运行日志 + 画布图元统计）。
 */
export const stage13Projects: CourseProject[] = [
  ...stage13JsProjects,
  ...stage13PhysProjects,
  ...stage13DatavizProjects,
];
