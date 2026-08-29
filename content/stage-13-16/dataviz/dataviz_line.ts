import type { CourseProject } from "@/courses";

/**
 * N·数据可视化 · 折线图：柱状图看高低，折线图看趋势。
 * 关键是「记住上一个点」——折线本质是把相邻的两个点连起来。
 */
export const datavizLine: CourseProject = {
  slug: "dataviz_line",
  title: "折线图：看点连成的趋势",
  ageGroup: "13-16 岁",
  description: "柱状图适合比高低，折线图适合看变化——秘诀是记住上一个点，把相邻的点连起来。",
  category: "dataviz",
  missionBrief:
    "想知道「是涨还是跌」，折线图比柱状图更直观。\n\n画柱子只需要知道「当前这个数」；画折线还得多记一件事：**上一个点在哪儿**。\n· 先算出当前点的坐标 (x, y)\n· 画一个点（小圆）\n· **如果上一个点存在**，就从上一个点画一条线到当前点\n· 把当前点存成「上一个点」，供下一轮使用\n\n代码里的写法是留两个变量 `lastX` / `lastY`（上一个点的坐标），\n第一次循环时它们是空的，所以要用 `if (i > 0)` 跳过第一条连线。\n\n这个「记住上一步」的思路在编程里非常常见：滚动平均、路径追踪、动画补间，全靠它。\n\n折线图还有个常见搭档——**参考线**（比如目标线、平均线），用一条淡色的横线标出来，一眼就能看出哪几天达标了。",
  erLingHint:
    "提示：循环里先算 x = x0 + i * dx、y = baseY + data[i] * scale；然后 drawCircle 画点；再用 if (i > 0) 判断，有的话就 drawLine(lastX, lastY, x, y, ...) 连线；最后记得 lastX = x; lastY = y; 把当前点存下来。",
  steps: [
    { id: 1, title: "用数组存下一串数据" },
    { id: 2, title: "记住上一个点，把相邻的点连成线" },
    { id: 3, title: "运行，看到折线趋势" },
  ],
  codeMode: true,
  defaultCode:
    "// 折线图：看点连成的趋势（关键是记住上一个点）\n" +
    "const data = [8, 15, 12, 22, 18, 28, 24, 32];   // 连续 8 次测验的成绩\n" +
    "const x0 = -200;        // 第一个点的横坐标\n" +
    "const dx = 52;          // 相邻两点的横向间隔\n" +
    "const baseY = -120;     // 底线（数值 0 的位置）\n" +
    "const scale = 3.2;      // 缩放系数：1 分 = 3.2 个舞台单位\n" +
    "const goal = 25;        // 目标线\n" +
    "\n" +
    "__runtime.drawLine(-230, baseY, 230, baseY, \"#475569\", 3);              // 底线\n" +
    "__runtime.drawLine(-230, baseY + goal * scale, 230, baseY + goal * scale, \"rgba(34,197,94,0.5)\", 2);  // 目标线\n" +
    "__runtime.drawText(-225, 155, \"我的成绩趋势\", \"#E2E8F0\", 18);\n" +
    "\n" +
    "let lastX = 0;          // 上一个点的横坐标\n" +
    "let lastY = 0;          // 上一个点的纵坐标\n" +
    "for (let i = 0; i < data.length; i++) {\n" +
    "  const x = x0 + i * dx;\n" +
    "  const y = baseY + data[i] * scale;\n" +
    "  __runtime.drawCircle(x, y, 5, \"#F59E0B\");                              // 数据点\n" +
    "  if (i > 0) {\n" +
    "    __runtime.drawLine(lastX, lastY, x, y, \"#38bdf8\", 3);                // 与上一个点连线\n" +
    "  }\n" +
    "  lastX = x;            // 把当前点存成「上一个点」，供下一轮用\n" +
    "  lastY = y;\n" +
    "}\n",
};
