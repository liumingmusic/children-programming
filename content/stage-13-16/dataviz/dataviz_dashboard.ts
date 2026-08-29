import type { CourseProject } from "@/courses";

/**
 * N·数据可视化 · 实时仪表盘：数组当「滑动窗口」，每帧 push 新数据、shift 掉老数据，
 * 边算统计边逐帧重画——这是监控类可视化的标准形态。
 */
export const datavizDashboard: CourseProject = {
  slug: "dataviz_dashboard",
  title: "实时仪表盘：会动的图表",
  ageGroup: "13-16 岁",
  description: "把数组当成滑动窗口：新数据从右边进、老数据从左边走，图表每帧重画一次就成了实时仪表盘。",
  category: "dataviz",
  missionBrief:
    "前面画的都是**静态**图——数据不变，画一次就完事。真实世界的数据是不断涌进来的：\n气温、心率、网速、股票……这一关做一个会自己动的仪表盘。\n\n核心是一个叫**滑动窗口**的技巧。用一个数组只保留最近 N 个数据：\n· `data.push(新值);` —— 新数据从右边进来\n· `if (data.length > N) data.shift();` —— 超长了就把最老的那个从左边扔掉\n\n`push` 往数组末尾加、`shift` 从数组开头删，两个配合起来就是一个固定长度的窗口。\n\n然后每一帧做三件事：\n1. 产生一个新数据（这里用 `Math.sin` 假装是传感器读数；真接上硬件就是真实数据）\n2. 重新算一遍统计值（最高 / 最低 / 平均）\n3. `clearCanvas()` 擦掉，把窗口里的数据重画一遍\n\n注意统计值必须在循环里**每帧重算**——因为数据每一帧都在变，算一次就固定住的话，数字就不动了。\n\n试试改 `WINDOW`（窗口留多长）或信号公式，看看图表的手感怎么变。",
  erLingHint:
    "提示：主循环里先 t = t + dt; value = 50 + 30 * Math.sin(t * 2); 然后 data.push(value); if (data.length > WINDOW) data.shift(); 接着循环求 hi / lo / sum 算出平均；最后 clearCanvas → 画上下边界 → 循环画点和连线 → drawText 写当前值/平均/最高最低 → wait(dt)。",
  steps: [
    { id: 1, title: "用数组当滑动窗口：push 新数据、shift 老数据" },
    { id: 2, title: "每帧重算统计值，并擦掉重画" },
    { id: 3, title: "运行，看仪表盘动起来" },
  ],
  codeMode: true,
  defaultCode:
    "// 实时仪表盘：数组当滑动窗口，每帧 push + shift + 重画\n" +
    "const WINDOW = 20;          // 窗口里只留最近 20 个数据点\n" +
    "const dt = 0.05;\n" +
    "const data = [];\n" +
    "let t = 0;\n" +
    "\n" +
    "for (let frame = 0; frame < 40; frame++) {\n" +
    "  t = t + dt;\n" +
    "  const value = 50 + 30 * Math.sin(t * 2);   // 假装是传感器读数（范围 20 ~ 80）\n" +
    "  data.push(value);                          // 新数据从右边进\n" +
    "  if (data.length > WINDOW) data.shift();    // 老数据从左边走\n" +
    "\n" +
    "  let hi = data[0], lo = data[0], sum = 0;   // 每帧都要重算，因为数据在变\n" +
    "  for (let i = 0; i < data.length; i++) {\n" +
    "    if (data[i] > hi) hi = data[i];\n" +
    "    if (data[i] < lo) lo = data[i];\n" +
    "    sum = sum + data[i];\n" +
    "  }\n" +
    "  const avg = sum / data.length;\n" +
    "\n" +
    "  __runtime.clearCanvas();\n" +
    "  __runtime.drawLine(-200, -90, 200, -90, \"#475569\", 2);      // 上下边界\n" +
    "  __runtime.drawLine(-200, 90, 200, 90, \"#475569\", 2);\n" +
    "\n" +
    "  let lastX = 0, lastY = 0;\n" +
    "  for (let i = 0; i < data.length; i++) {\n" +
    "    const x = -200 + i * (400 / (WINDOW - 1));\n" +
    "    const y = -80 + (data[i] - 20) / 60 * 160;                 // 20 ~ 80 映射到 -80 ~ 80\n" +
    "    __runtime.drawCircle(x, y, 4, \"#38bdf8\");\n" +
    "    if (i > 0) __runtime.drawLine(lastX, lastY, x, y, \"#38bdf8\", 2);\n" +
    "    lastX = x;\n" +
    "    lastY = y;\n" +
    "  }\n" +
    "\n" +
    "  __runtime.drawText(-225, 155, \"实时数据仪表盘\", \"#E2E8F0\", 18);\n" +
    "  __runtime.drawText(-225, 122, \"当前：\" + Math.round(value), \"#F59E0B\", 20);\n" +
    "  __runtime.drawText(-70, 122, \"平均：\" + Math.round(avg), \"#E2E8F0\", 15);\n" +
    "  __runtime.drawText(60, 122, \"最高 \" + Math.round(hi) + \"  最低 \" + Math.round(lo), \"#94A3B8\", 14);\n" +
    "  __runtime.wait(dt);\n" +
    "}\n",
};
