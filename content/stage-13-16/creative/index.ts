import type { CourseProject } from "@/courses";
import { creativeMandala } from "./creative_mandala";
import { creativeRandom } from "./creative_random";
import { creativeGenerative } from "./creative_generative";
import { creativeTree } from "./creative_tree";
import { creativeTerrain } from "./creative_terrain";
import { creativeFirework } from "./creative_firework";

/**
 * O·创意编程（creative）：用代码当画笔，做「看得出规律、又每次不同」的作品。
 * 顺序即概念阶梯（也是 /learn 页的解锁顺序）：
 *   曼陀罗（对称）→ 随机艺术（随机 + 规则）→ 生成艺术（参数方程）
 *   → 分形树（递归）→ 噪声地形（多频波叠加）→ 粒子烟花（阻尼动画）
 * Phase 2d 一次铺满，本分类 6/6。前 5 项是静态图，只有粒子烟花需要逐帧重画。
 */
export const stage13CreativeProjects: CourseProject[] = [
  creativeMandala,
  creativeRandom,
  creativeGenerative,
  creativeTree,
  creativeTerrain,
  creativeFirework,
];
