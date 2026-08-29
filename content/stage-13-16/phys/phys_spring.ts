import type { CourseProject } from "@/courses";

/**
 * M·物理 · 弹簧振子：拉力与位移成正比且方向相反（a = -k * x），于是来回振荡。
 * 水平放置弹簧，让「位移 x」就是真正的横坐标，避免 x 被当成 y 用的困惑。
 * 数值上用「先更新速度、再更新位置」的半隐式欧拉，振幅不会越跑越大。
 */
export const physSpring: CourseProject = {
  slug: "phys_spring",
  title: "弹簧振子：越拉越往回拽",
  ageGroup: "13-16 岁",
  description: "加速度与位移成正比、方向相反——把小球拉开再松手，它就永远来回振荡下去。",
  category: "phys",
  missionBrief:
    "前面几关的重力是「一个恒定的力」；弹簧不一样，它的力**会变**：\n\n· 拉得越远，往回拽的力越大\n· 方向永远指向平衡位置\n\n写成公式就是 `a = -k * x`：x 是小球偏离平衡位置的距离，k 是弹簧的倔强程度。\n注意那个负号——它表示「你往右拉，我偏往左拽」。\n\n每帧两步：\n· v = v + (-k * x) * dt;   // 速度被位移拽着改\n· x = x + v * dt;          // 位置跟着速度走\n\n松手后小球被拽回平衡位置，但到那儿时速度已经很大，会冲过头——然后又被反方向拽回来。\n于是就形成了**振荡**：钟摆、秋千、吉他弦背后都是同一套数学。\n\n舞台布局：左边墙上固定着弹簧，虚线标出平衡位置，x 就是小球偏离那条虚线的距离。\n\n试试把 k 调大（硬弹簧，晃得快）或调小（软弹簧，晃得慢），感受节奏的变化。",
  erLingHint:
    "提示：每帧写 v = v + (-k * x) * dt; 再 x = x + v * dt; 然后算出小球横坐标 bx = x0 + rest + x；clearCanvas → drawRect 画左墙 → drawLine 画弹簧 → drawCircle 画球 → drawText 写当前位移 → wait(dt)。",
  steps: [
    { id: 1, title: "用变量记录位移与速度" },
    { id: 2, title: "让加速度与位移成正比、方向相反" },
    { id: 3, title: "每帧擦掉重画，看小球来回振荡" },
  ],
  codeMode: true,
  defaultCode:
    "// 弹簧振子：拉得越远，往回拽的力越大（a = -k * x）\n" +
    "const k = 20;          // 弹簧的倔强程度：越大晃得越快\n" +
    "const dt = 0.05;\n" +
    "const x0 = -180;       // 弹簧固定端（左墙上）\n" +
    "const rest = 130;      // 平衡长度：不松不紧时弹簧有多长（留出余量，球不会撞墙）\n" +
    "let x = 120;           // 位移：小球偏离平衡位置多远（正数 = 往右拉）\n" +
    "let v = 0;             // 速度\n" +
    "\n" +
    "for (let frame = 0; frame < 56; frame++) {\n" +
    "  v = v + (-k * x) * dt;      // 加速度指向平衡位置，所以有个负号\n" +
    "  x = x + v * dt;             // 位移跟着速度走\n" +
    "  const bx = x0 + rest + x;   // 小球的实际横坐标\n" +
    "\n" +
    "  __runtime.clearCanvas();\n" +
    "  __runtime.drawRect(-240, -45, 30, 90, \"#475569\");                       // 左墙\n" +
    "  __runtime.drawLine(x0, 0, bx - 12, 0, \"#94A3B8\", 3);                     // 弹簧（简化成一条线）\n" +
    "  __runtime.drawLine(x0 + rest, -70, x0 + rest, 70, \"rgba(148,163,184,0.35)\", 2); // 平衡位置\n" +
    "  __runtime.drawCircle(bx, 0, 12, \"#F59E0B\");                              // 小球\n" +
    "  __runtime.drawText(-225, 155, \"位移：\" + Math.round(x), \"#E2E8F0\", 15);\n" +
    "  __runtime.wait(dt);\n" +
    "}\n",
};
