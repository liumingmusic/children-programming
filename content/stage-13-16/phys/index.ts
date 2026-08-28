import type { CourseProject } from "@/courses";
import { physFall } from "./phys_fall";
import { physBounce } from "./phys_bounce";

/**
 * M·物理与模拟（phys）：用变量 + 循环 + 画布图元做「每帧擦掉重画」的模拟动画。
 * Phase 2 试点 2 项（自由落体 / 弹跳球），其余项目按节奏补齐。
 */
export const stage13PhysProjects: CourseProject[] = [physFall, physBounce];
