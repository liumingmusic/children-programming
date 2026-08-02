import type { CourseProject, Stage, ProjectCategory } from "@/courses";
import { stage6Projects } from "./stage-6-8";
import { stage6Categories } from "./stage-6-8/categories";
import { stage9Categories } from "./stage-9-12/categories";
import { stage13Categories } from "./stage-13-16/categories";
import { stage9Projects } from "./stage-9-12";
import { stage13Projects } from "./stage-13-16";
import { stages } from "./stages";

/** 分类注册表：按学龄段 id 索引。这是「阶段 → 分类」的单一数据源。 */
export const CATEGORIES: Record<string, ProjectCategory[]> = {
  "stage-6-8": stage6Categories,
  "stage-9-12": stage9Categories,
  "stage-13-16": stage13Categories,
};

/** 全部项目（当前仅 stage-6-8 有项目）。 */
export const projects: CourseProject[] = [
  ...stage6Projects,
  ...stage9Projects,
  ...stage13Projects,
];

export { stages };
