import type { CourseProject } from "@/courses";
import { capstoneGame } from "./capstone_game";
import { capstoneData } from "./capstone_data";
import { capstoneTool } from "./capstone_tool";
import { capstoneOss } from "./capstone_oss";
import { capstonePortfolio } from "./capstone_portfolio";

/** R·毕业项目（Phase 3c，5 项）。全部 codeMode，判定走 lib/steps.ts 的 CAPSTONE_CODE_SLUGS 分支。 */
export const stage13CapstoneProjects: CourseProject[] = [
  capstoneGame, // 我的完整小游戏：接金币（状态 + 循环 + 逐帧重画）
  capstoneData, // 我的数据作品：数据 → 图形映射
  capstoneTool, // 我的创意工具：可复用函数 + 循环生成
  capstoneOss,  // 开源贡献：通用工具函数库 + 演示
  capstonePortfolio, // 我的作品集：循环批量绘制展板
];
