import type { CourseProject } from "@/courses";

/**
 * N·数据可视化 · 饼图：把「份额」变成「角度」，再用三角函数把角度变回坐标。
 * 当前画布原语没有扇形，故用「每 2 度一条半径线」密集填充来画出扇形（线宽 6 保证无缝）。
 */
export const datavizPie: CourseProject = {
  slug: "dataviz_pie",
  title: "饼图：把份额画成角度",
  ageGroup: "13-16 岁",
  description: "想知道「各占多少」，就把每份换算成一个角度，再用 cos / sin 把角度变回坐标。",
  category: "dataviz",
  missionBrief:
    "柱状图适合比大小，饼图适合看**占比**：整体被分成几块，每块占多少。\n\n画饼图分三步：\n1. 算出总和 —— 把所有份额加起来\n2. 把每份换算成角度 —— `data[i] / total * 360`（一整圈是 360 度）\n3. 用 `Math.cos` / `Math.sin` 把角度变回坐标（和圆周运动那关一样）\n\n有个小机关：画布上只有「画线」，没有「画扇形」这条指令。\n所以我们的办法是——**在扇形的角度范围内，从圆心往外画很多条线**，线挨着线，看起来就是一块实心扇形。\n每 2 度画一条、线宽设成 6，相邻两条线就会重叠，不会有缝。\n\n画完再补一个**图例**（右边的小色块 + 文字），告诉读者每种颜色代表什么——没有图例的饼图等于没画。\n\n注意：这里用的是角度制（0–360），而 `Math.cos` / `Math.sin` 要的是弧度制，\n所以要先 `角度 * Math.PI / 180` 换算一下。",
  erLingHint:
    "提示：先循环算出 total；再从 angle = 90 开始（正上方），每块算 sweep = data[i] / total * 360，内层循环 for (let a = angle; a < angle + sweep; a = a + 2) 从圆心画半径线，画完 angle = angle + sweep; 最后画右侧图例。",
  steps: [
    { id: 1, title: "用数组存下各份额，算出总和" },
    { id: 2, title: "把每份换算成角度，用 cos / sin 画出来" },
    { id: 3, title: "运行，看到饼图与图例" },
  ],
  codeMode: true,
  defaultCode:
    "// 饼图：份额 → 角度 → 坐标\n" +
    "const data = [30, 45, 25];                      // 三项各占多少\n" +
    "const labels = [\"阅读\", \"运动\", \"游戏\"];\n" +
    "const colors = [\"#F59E0B\", \"#38bdf8\", \"#22C55E\"];\n" +
    "const cx = -70;         // 圆心\n" +
    "const cy = 0;\n" +
    "const R = 110;          // 半径\n" +
    "\n" +
    "let total = 0;                                  // 第一步：算出总和\n" +
    "for (let i = 0; i < data.length; i++) {\n" +
    "  total = total + data[i];\n" +
    "}\n" +
    "\n" +
    "let angle = 90;                                 // 从正上方开始画（角度制）\n" +
    "for (let i = 0; i < data.length; i++) {\n" +
    "  const sweep = data[i] / total * 360;          // 这一块占多少度\n" +
    "  for (let a = angle; a < angle + sweep; a = a + 2) {   // 每 2 度一条半径线\n" +
    "    const rad = a * Math.PI / 180;              // 角度制 → 弧度制\n" +
    "    __runtime.drawLine(cx, cy, cx + R * Math.cos(rad), cy + R * Math.sin(rad), colors[i], 6);\n" +
    "  }\n" +
    "  angle = angle + sweep;                        // 挪到下一块的起点\n" +
    "}\n" +
    "\n" +
    "for (let i = 0; i < data.length; i++) {         // 右侧图例\n" +
    "  const ly = 60 - i * 34;\n" +
    "  __runtime.drawRect(80, ly, 18, 18, colors[i]);\n" +
    "  __runtime.drawText(112, ly + 3, labels[i] + \" \" + data[i], \"#E2E8F0\", 15);\n" +
    "}\n" +
    "__runtime.drawText(-225, 155, \"周末时间怎么花的\", \"#E2E8F0\", 18);\n",
};
