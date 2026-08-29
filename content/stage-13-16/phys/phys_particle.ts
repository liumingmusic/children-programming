import type { CourseProject } from "@/courses";

/**
 * M·物理 · 粒子系统：用四组平行数组装 12 个粒子的位置与速度，
 * 每个粒子各自受重力、撞地衰减反弹、撞左右边界反向——一份代码驱动一整片粒子。
 */
export const physParticle: CourseProject = {
  slug: "phys_particle",
  title: "粒子系统：一份代码驱动一片粒子",
  ageGroup: "13-16 岁",
  description: "把每一个粒子的状态装进数组，用一个循环同时更新十几个粒子——这就是游戏里雪花、烟花的做法。",
  category: "phys",
  missionBrief:
    "游戏里的雪花、烟花、爆炸碎片，都不是一个一个画出来的，而是一个**粒子系统**：\n一份物理代码 + 一组数据，同时驱动成百上千个粒子。\n\n做法和「重力对比」那关一样，只是粒子多了：**平行数组**。\n· px[i] / py[i] —— 第 i 个粒子的位置\n· vx[i] / vy[i] —— 第 i 个粒子的速度\n四个数组下标一一对应，循环里挨个更新，12 个粒子和 1200 个粒子写起来完全一样。\n\n每个粒子都要处理碰撞：\n· 撞到地面 → 竖直速度反向并衰减（vy = -vy * 0.6）\n· 撞到左右边界 → 水平速度直接反向（vx = -vx）\n\n先用循环把数组「填好」（初始化），再进主循环——这两步是粒子系统的标准套路。\n\n试试改粒子数量 N、衰减系数 0.6，或者给不同粒子不同的初速度。",
  erLingHint:
    "提示：先建 px/py/vx/vy 四个空数组，用 for 循环 push 初始化；主循环里再套一个 for 遍历每个粒子：vy[i] = vy[i] - g * dt; px[i] = px[i] + vx[i] * dt; py[i] = py[i] + vy[i] * dt; 然后撞地、撞左右墙分别处理；最后 clearCanvas 画地面和所有粒子。",
  steps: [
    { id: 1, title: "用数组装下所有粒子的位置与速度" },
    { id: 2, title: "遍历每个粒子：各自受重力并碰撞反弹" },
    { id: 3, title: "每帧擦掉重画，看粒子雨" },
  ],
  codeMode: true,
  defaultCode:
    "// 粒子系统：四个平行数组 + 一个循环，同时驱动 12 个粒子\n" +
    "const N = 12;                 // 粒子数量\n" +
    "const g = 400;                // 重力加速度\n" +
    "const dt = 0.05;\n" +
    "const ground = -150;\n" +
    "const r = 7;                  // 粒子半径\n" +
    "const colors = [\"#F59E0B\", \"#38bdf8\", \"#E2E8F0\", \"#22C55E\"];\n" +
    "\n" +
    "const px = [];                // 每个粒子的横坐标\n" +
    "const py = [];                // 每个粒子的纵坐标\n" +
    "const vx = [];                // 每个粒子的水平速度\n" +
    "const vy = [];                // 每个粒子的竖直速度\n" +
    "for (let i = 0; i < N; i++) { // 初始化：给每个粒子一个不同的起点和速度\n" +
    "  px.push(-190 + i * 34);\n" +
    "  py.push(110 + (i % 3) * 28);\n" +
    "  vx.push((i % 2 === 0 ? 1 : -1) * (25 + i * 3));\n" +
    "  vy.push(0);\n" +
    "}\n" +
    "\n" +
    "for (let frame = 0; frame < 50; frame++) {\n" +
    "  for (let i = 0; i < N; i++) {          // 挨个更新每个粒子\n" +
    "    vy[i] = vy[i] - g * dt;              // 重力\n" +
    "    px[i] = px[i] + vx[i] * dt;\n" +
    "    py[i] = py[i] + vy[i] * dt;\n" +
    "    if (py[i] < ground + r) {            // 撞到地面：反弹并损失能量\n" +
    "      py[i] = ground + r;\n" +
    "      vy[i] = -vy[i] * 0.6;\n" +
    "    }\n" +
    "    if (px[i] < -230 + r) {              // 撞到左墙：水平速度反向\n" +
    "      px[i] = -230 + r;\n" +
    "      vx[i] = -vx[i];\n" +
    "    }\n" +
    "    if (px[i] > 230 - r) {               // 撞到右墙\n" +
    "      px[i] = 230 - r;\n" +
    "      vx[i] = -vx[i];\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  __runtime.clearCanvas();\n" +
    "  __runtime.drawRect(-240, ground - 40, 480, 40, \"#334155\");     // 地面\n" +
    "  for (let i = 0; i < N; i++) {\n" +
    "    __runtime.drawCircle(px[i], py[i], r, colors[i % colors.length]);\n" +
    "  }\n" +
    "  __runtime.wait(dt);\n" +
    "}\n",
};
