import type { CourseProject } from "@/courses";

/**
 * N·数据可视化 · 成绩分布（直方图）：把一堆原始分数先分组计数，再画出来。
 * 教学点：可视化常常不是「直接画原始数据」，而是先做一步**数据整理**。
 */
export const datavizScores: CourseProject = {
  slug: "dataviz_scores",
  title: "成绩分布：先分组，再画图",
  ageGroup: "13-16 岁",
  description: "20 个分数直接画是没意义的——先按分数段数出人数，得到的直方图才看得出分布形状。",
  category: "dataviz",
  missionBrief:
    "前几关都是「拿到数据就直接画」。这一关不一样：**原始数据得先整理**。\n\n给你 20 个同学的分数，直接画 20 根柱子看不出什么。真正该问的是「各个分数段有多少人」——\n这就需要一个叫**分组计数**（也叫「分桶」）的操作：\n\n· 准备一个全是 0 的数组当计数器：`const counts = [0, 0, 0, 0, 0];`\n· 遍历每个分数，判断它落进哪个桶，把那个桶 +1：`counts[k] = counts[k] + 1;`\n· 判断用 if / else if 从上往下比（先判 >=90，再 >=80……顺序不能反）\n\n数完之后画出来的图有个专门的名字：**直方图**。\n它和柱状图长得像，但含义不同——柱子是「每样东西有多少」，直方图是「落在这一段里的有多少」。\n\n画的时候还有个细节：高度最好按**最高的那桶**自动缩放，这样不管数据是多少，图都刚好填满画面。\n算出 maxCount 后让 `scale = 目标高度 / maxCount` 就行。",
  erLingHint:
    "提示：先 const counts = [0,0,0,0,0]; 再循环每个分数，用 if/else if 判断落在哪一段，counts[k] = counts[k] + 1; 然后循环求 maxCount，scale = 120 / maxCount；最后循环画柱子 + 人数 + 分段名称。",
  steps: [
    { id: 1, title: "用数组做分组计数（分桶）" },
    { id: 2, title: "按最高桶自动缩放，画出直方图" },
    { id: 3, title: "运行，看到成绩分布" },
  ],
  codeMode: true,
  defaultCode:
    "// 成绩分布：先把分数分组计数，再画直方图\n" +
    "const scores = [72, 85, 91, 66, 78, 95, 88, 59, 83, 74,\n" +
    "                90, 68, 79, 86, 93, 71, 62, 88, 76, 84];\n" +
    "const bucketNames = [\"<60\", \"60-69\", \"70-79\", \"80-89\", \"90+\"];\n" +
    "const colors = [\"#E24B4A\", \"#F59E0B\", \"#38bdf8\", \"#22C55E\", \"#A78BFA\"];\n" +
    "\n" +
    "const counts = [0, 0, 0, 0, 0];                 // 五个桶的计数器\n" +
    "for (let i = 0; i < scores.length; i++) {\n" +
    "  const s = scores[i];\n" +
    "  let k = 0;\n" +
    "  if (s >= 90) k = 4;                           // 从高往低比，顺序不能反\n" +
    "  else if (s >= 80) k = 3;\n" +
    "  else if (s >= 70) k = 2;\n" +
    "  else if (s >= 60) k = 1;\n" +
    "  else k = 0;\n" +
    "  counts[k] = counts[k] + 1;                    // 落进哪个桶，哪个桶 +1\n" +
    "}\n" +
    "\n" +
    "let maxCount = counts[0];                       // 找出最高的那桶，用来自动缩放\n" +
    "for (let i = 0; i < counts.length; i++) {\n" +
    "  if (counts[i] > maxCount) maxCount = counts[i];\n" +
    "}\n" +
    "\n" +
    "const scale = 120 / maxCount;                   // 让最高的柱子正好占 120\n" +
    "const barW = 60, gap = 20, baseY = -120;\n" +
    "__runtime.drawLine(-230, baseY, 230, baseY, \"#475569\", 3);\n" +
    "__runtime.drawText(-225, 155, \"全班成绩分布（20 人）\", \"#E2E8F0\", 18);\n" +
    "\n" +
    "for (let i = 0; i < counts.length; i++) {\n" +
    "  const h = counts[i] * scale;\n" +
    "  const x = -190 + i * (barW + gap);\n" +
    "  __runtime.drawRect(x, baseY, barW, h, colors[i]);\n" +
    "  __runtime.drawText(x + barW / 2 - 5, baseY + h + 8, String(counts[i]), \"#E2E8F0\", 15);\n" +
    "  __runtime.drawText(x + barW / 2 - 20, baseY - 24, bucketNames[i], \"#94A3B8\", 14);\n" +
    "}\n",
};
