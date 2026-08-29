import type { CourseProject } from "@/courses";
import { physFall } from "./phys_fall";
import { physBounce } from "./phys_bounce";
import { physParabola } from "./phys_parabola";
import { physGravity } from "./phys_gravity";
import { physSpring } from "./phys_spring";
import { physOrbit } from "./phys_orbit";
import { physParticle } from "./phys_particle";

/**
 * M·物理与模拟（phys）：用变量 + 循环 + 画布图元做「每帧擦掉重画」的模拟动画。
 * 顺序即概念阶梯（也是 /learn 页的解锁顺序）：
 *   自由落体 → 弹跳球 → 抛物线 → 重力对比 → 弹簧振子 → 圆周运动 → 粒子系统
 * 前 2 项为 Phase 2a 试点，后 5 项为 Phase 2b 补齐，本分类已 7/7 满编。
 */
export const stage13PhysProjects: CourseProject[] = [
  physFall,
  physBounce,
  physParabola,
  physGravity,
  physSpring,
  physOrbit,
  physParticle,
];
