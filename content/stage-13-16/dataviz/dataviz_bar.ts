import type { CourseProject } from "@/courses";

/**
 * N·数据可视化 · 柱状图：把一组数字变成一眼能比较高矮的柱子。
 * 核心是「数值 → 像素」的映射：一个数值单位对应多少高度的缩放系数。
 */
export const datavizBar: CourseProject = {
  slug: "dataviz_bar",
  title: "柱状图：让数字变成高矮",
  ageGroup: "13-16 岁",
  description: "把数组里的一串数字画成高低不同的柱子——数据可视化最基础的一步：数值到高度的映射。",
  category: "dataviz",
  missionBrief:
    "一屏幕的数字，人眼很难比较；画成柱子，高低一眼就看得出来。这就是数据可视化的起点。\n\n第一步永远是同一件事：**把数值换算成像素**。\n· const h = data[i] * scale;   // 数值 × 缩放系数 = 柱子高度\n\nscale（缩放系数）怎么定？看你最高的那根柱子想占多高。\n这个舞台高 360（y 从 -180 到 180），如果你的最大值是 35、想让最高的柱子占 105，那 scale = 105 / 35 = 3。\n\n然后就是循环：数组里每有一个数字，就在对应的横向位置画一根柱子。\n· 柱子的横向位置：`x = 起点 + i * (柱宽 + 间距)`\n· 柱子高度：`data[i] * scale`\n· 柱子颜色：可以从颜色数组里按 i 取，一根一个颜色更醒目\n\n顺手再加两样让图更专业：基线（`drawLine` 画一条横线）和数值标签（`drawText` 在柱顶写上数字）。\n\n试试换一组 data（比如全班同学的身高），看看图怎么变。",
  erLingHint:
    "提示：先用 const data = [...]; 存数据，再定 scale = 3、barW = 40、gap = 14、baseY = -120；然后 for 循环里算 h = data[i] * scale 和 x = -210 + i * (barW + gap)，drawRect(x, baseY, barW, h, 颜色) 画柱子，drawText 在柱顶写数值。",
  steps: [
    { id: 1, title: "用数组存下一组数据" },
    { id: 2, title: "循环把每个数值画成一根柱子" },
    { id: 3, title: "运行，看到柱状图" },
  ],
  codeMode: true,
  defaultCode:
    "// 柱状图：把一组数字画成高低不同的柱子\n" +
    "const data = [12, 30, 18, 25, 8, 35, 20];       // 一周里每天的阅读时间（分钟）\n" +
    "const labels = [\"一\", \"二\", \"三\", \"四\", \"五\", \"六\", \"日\"];\n" +
    "const colors = [\"#F59E0B\", \"#38bdf8\", \"#22C55E\", \"#E24B4A\", \"#A78BFA\", \"#F472B6\", \"#2DD4BF\"];\n" +
    "\n" +
    "const scale = 3;        // 缩放系数：1 分钟 = 3 个舞台单位高\n" +
    "const barW = 40;        // 柱子宽度\n" +
    "const gap = 14;         // 柱子之间的间距\n" +
    "const baseY = -120;     // 基线：柱子从这里往上长\n" +
    "\n" +
    "__runtime.drawLine(-230, baseY, 230, baseY, \"#475569\", 3);          // 基线\n" +
    "__runtime.drawText(-225, 155, \"一周阅读时间（分钟）\", \"#E2E8F0\", 18);\n" +
    "\n" +
    "for (let i = 0; i < data.length; i++) {\n" +
    "  const h = data[i] * scale;                    // 数值 → 高度\n" +
    "  const x = -210 + i * (barW + gap);            // 第 i 根柱子的横坐标\n" +
    "  __runtime.drawRect(x, baseY, barW, h, colors[i]);\n" +
    "  __runtime.drawText(x + barW / 2 - 8, baseY + h + 8, String(data[i]), \"#E2E8F0\", 14);\n" +
    "  __runtime.drawText(x + barW / 2 - 6, baseY - 24, labels[i], \"#94A3B8\", 14);\n" +
    "}\n",
};
