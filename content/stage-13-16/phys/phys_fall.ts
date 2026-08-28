import type { CourseProject } from "@/courses";

/** M·物理试点一：自由落体——变量累积重力 + 循环 + 每帧擦掉重画。 */
export const physFall: CourseProject = {
  slug: "phys_fall",
  title: "自由落体：让小球加速下落",
  ageGroup: "13-16 岁",
  description: "第一次做「模拟」：用变量记住高度和速度，在循环里被重力不断改写，再一帧一帧画出来。",
  category: "phys",
  missionBrief:
    "真实世界里，东西掉下来会越掉越快——因为重力每一刻都在给速度「加码」。\n\n这一次我们不再拖角色走，而是直接往舞台上「画图元」：\n· __runtime.clearCanvas() —— 擦掉上一帧\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 在 (x, y) 画一个圆\n· __runtime.wait(秒) —— 停一小会儿，人眼才看得清动画\n\n舞台坐标：中心是 (0, 0)，x 向右为正，y 向上为正，所以「往下掉」是 y 变小。\n\n模拟的思路只有三行：\n· v = v - g * dt; —— 速度被重力不断往下拉\n· y = y + v * dt; —— 位置跟着速度走\n· 每算完一次就擦掉重画 —— 一帧动画就诞生了\n\n改改 g（重力）或 dt（每一帧的时间），看看小球落得更快还是更慢。",
  erLingHint:
    "提示：先 let y = 150; let v = 0; 再用 for 循环，里面写 v = v - g * dt; y = y + v * dt; 然后 __runtime.clearCanvas(); __runtime.drawCircle(0, y, 12, \"#38bdf8\"); 最后 __runtime.wait(0.05); 让每帧停一下。",
  steps: [
    { id: 1, title: "用变量记住小球的高度和速度" },
    { id: 2, title: "在循环里更新速度、位置，并擦掉重画" },
    { id: 3, title: "运行，看小球越掉越快" },
  ],
  codeMode: true,
  defaultCode:
    "// 自由落体：重力每一帧都让速度更快\n" +
    "let y = 150;          // 小球高度（y 越大越靠上）\n" +
    "let v = 0;            // 速度（往下为负）\n" +
    "const g = 150;        // 重力加速度\n" +
    "const dt = 0.05;      // 每一帧走过的时间（秒）\n" +
    "\n" +
    "for (let frame = 0; frame < 36; frame++) {\n" +
    "  v = v - g * dt;     // 重力把速度往下拉\n" +
    "  y = y + v * dt;     // 位置跟着速度走\n" +
    "\n" +
    "  __runtime.clearCanvas();                                   // 擦掉上一帧\n" +
    "  __runtime.drawCircle(0, y, 12, \"#38bdf8\");                 // 在新高度画球\n" +
    "  __runtime.drawLine(0, 150, 0, y, \"rgba(148,163,184,0.5)\", 2); // 已下落的高度线\n" +
    "  __runtime.wait(dt);                                        // 停一小会儿，才看得见动画\n" +
    "}\n",
};
