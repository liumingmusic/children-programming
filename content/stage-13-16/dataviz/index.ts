import type { CourseProject } from "@/courses";
import { datavizBar } from "./dataviz_bar";
import { datavizLine } from "./dataviz_line";
import { datavizPie } from "./dataviz_pie";
import { datavizWeather } from "./dataviz_weather";
import { datavizScores } from "./dataviz_scores";
import { datavizWordcloud } from "./dataviz_wordcloud";
import { datavizDashboard } from "./dataviz_dashboard";

/**
 * N·数据可视化（dataviz）：把数组里的数据画成图表，核心是「数值 → 视觉属性」的映射。
 * 顺序即概念阶梯（也是 /learn 页的解锁顺序），每一项换一种视觉通道：
 *   柱状图（高度）→ 折线图（趋势/连线）→ 饼图（角度）→ 天气图（颜色编码）
 *   → 直方图（先分组计数）→ 词云（字号）→ 仪表盘（滑动窗口 + 逐帧重画）
 * Phase 2c 一次铺满，本分类 7/7。前 6 项是静态图（画一次即可），
 * 只有仪表盘需要 clearCanvas + wait 的动画循环。
 */
export const stage13DatavizProjects: CourseProject[] = [
  datavizBar,
  datavizLine,
  datavizPie,
  datavizWeather,
  datavizScores,
  datavizWordcloud,
  datavizDashboard,
];
