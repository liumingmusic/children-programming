import type { CourseProject } from "@/courses";
import { helloProject } from "./seq/hello";
import { flagProject } from "./seq/flag";
import { stoneProject } from "./seq/stone";
import { shapeLProject } from "./seq/shapeL";
import { homeProject } from "./seq/home";
import { mazeProject } from "./seq/maze";
import { arrowProject } from "./seq/arrow";
import { zigzagProject } from "./seq/zigzag";
import { treasureProject } from "./seq/treasure";
import { danceProject } from "./seq/dance";
import { frameProject } from "./seq/frame";

/** stage-6-8 · 序列分类（seq）的项目集合。
 * courses 模块会把它并入顶层 `projects` 数组，因此运行时的 MIRROR 坐标镜像、
 * getProject、闯关路径等逻辑对拆分后的文件照常生效。后续其它分类按同类方式迁移。 */
export const seqProjects: CourseProject[] = [
  helloProject,
  flagProject,
  stoneProject,
  shapeLProject,
  homeProject,
  mazeProject,
  arrowProject,
  zigzagProject,
  treasureProject,
  danceProject,
  frameProject,
];
