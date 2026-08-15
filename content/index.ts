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

/** 各阶段项目聚合（stage-6-8 已 105 项，stage-9-12 已 32 项，stage-13-16 待建）。 */
export const projects: CourseProject[] = [
  ...stage6Projects,
  ...stage9Projects,
  ...stage13Projects,
];

export { stages };
