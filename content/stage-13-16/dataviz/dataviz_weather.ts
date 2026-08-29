import type { CourseProject } from "@/courses";

/**
 * N·数据可视化 · 天气预报：真实数据集 + 平均值参考线 + 用颜色再编码一层信息。
 * 教学点：一张好图不只有柱子，还要有「基准线」和「让颜色也说话」。
 */
export const datavizWeather: CourseProject = {
  slug: "dataviz_weather",
  title: "天气预报图：给图表加基准与颜色",
  ageGroup: "13-16 岁",
  description: "柱状图之上再加一层：算出平均值画成参考线，再让颜色随温度变化——一张图能同时说三件事。",
  category: "dataviz",
  missionBrief:
    "柱子画出来只是第一步。真正好用的图，还会告诉你「跟平均比怎么样」「哪天特别热」。\n\n这一关加三样东西：\n\n**1. 平均值**——先把所有温度加起来除以天数。这需要一个小循环：\n· let sum = 0;\n· for (...) { sum = sum + temps[i]; }\n· const avg = sum / temps.length;\n然后把它画成一条横贯全图的淡色**参考线**。\n\n**2. 最高与最低**——同样用循环，但每轮要比较：\n· if (temps[i] > hi) hi = temps[i];\n这种「打擂台」式的循环叫**求极值**，是处理数据最常用的套路之一。\n\n**3. 让颜色也编码数据**——越热越红、越凉越蓝，读者不用看数字就能感觉到冷热。\n用 if / else if 给每个温度挑一个颜色就行。\n\n一个专业提醒：柱状图的底线要从 0 开始。要是从 20 开始画，5 度的温差看起来会像 20 度那样夸张——那是骗人的图。",
  erLingHint:
    "提示：先用一个循环求 sum、再用一个循环求 hi/lo；然后画基线、平均参考线、标题；最后主循环里按温度挑颜色（>=26 红、>=22 橙、否则蓝），画柱子 + 温度数值 + 星期标签。",
  steps: [
    { id: 1, title: "用数组存下一周温度，算出平均值" },
    { id: 2, title: "循环画柱子，并让颜色随温度变化" },
    { id: 3, title: "运行，看到带参考线的天气图" },
  ],
  codeMode: true,
  defaultCode:
    "// 天气预报图：柱子 + 平均参考线 + 颜色编码温度\n" +
    "const temps = [22, 24, 19, 17, 21, 26, 28];\n" +
    "const days = [\"一\", \"二\", \"三\", \"四\", \"五\", \"六\", \"日\"];\n" +
    "const scale = 4.5;      // 1 度 = 4.5 个舞台单位高\n" +
    "const barW = 36, gap = 16, baseY = -110;\n" +
    "\n" +
    "let sum = 0;                                    // 求总和 → 平均\n" +
    "for (let i = 0; i < temps.length; i++) {\n" +
    "  sum = sum + temps[i];\n" +
    "}\n" +
    "const avg = sum / temps.length;\n" +
    "\n" +
    "let hi = temps[0];                              // 求最高 / 最低（打擂台）\n" +
    "let lo = temps[0];\n" +
    "for (let i = 0; i < temps.length; i++) {\n" +
    "  if (temps[i] > hi) hi = temps[i];\n" +
    "  if (temps[i] < lo) lo = temps[i];\n" +
    "}\n" +
    "\n" +
    "__runtime.drawLine(-230, baseY, 230, baseY, \"#475569\", 3);            // 底线（从 0 度开始）\n" +
    "__runtime.drawLine(-230, baseY + avg * scale, 230, baseY + avg * scale, \"rgba(226,232,240,0.45)\", 2);  // 平均线\n" +
    "__runtime.drawText(120, baseY + avg * scale + 7, \"平均 \" + avg.toFixed(1) + \"°\", \"#94A3B8\", 13);\n" +
    "__runtime.drawText(-225, 155, \"一周天气预报（°C）\", \"#E2E8F0\", 18);\n" +
    "__runtime.drawText(60, 155, \"最高 \" + hi + \"°  最低 \" + lo + \"°\", \"#94A3B8\", 14);\n" +
    "\n" +
    "for (let i = 0; i < temps.length; i++) {\n" +
    "  const h = temps[i] * scale;\n" +
    "  const x = -180 + i * (barW + gap);\n" +
    "  let c = \"#38bdf8\";                            // 凉爽 → 蓝\n" +
    "  if (temps[i] >= 26) c = \"#E24B4A\";            // 热 → 红\n" +
    "  else if (temps[i] >= 22) c = \"#F59E0B\";       // 温暖 → 橙\n" +
    "  __runtime.drawRect(x, baseY, barW, h, c);\n" +
    "  __runtime.drawText(x + 5, baseY + h + 6, temps[i] + \"°\", \"#E2E8F0\", 13);\n" +
    "  __runtime.drawText(x + 11, baseY - 24, days[i], \"#94A3B8\", 14);\n" +
    "}\n",
};
