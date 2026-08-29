import type { CourseProject } from "@/courses";

/**
 * M·物理 · 抛物线：水平匀速 + 竖直加速，两个方向互不影响。
 * 用两个数组 trailX / trailY 记住走过的轨迹点，每帧擦掉重画，抛物线就一点点显形。
 */
export const physParabola: CourseProject = {
  slug: "phys_parabola",
  title: "抛物线：两个方向各走各的",
  ageGroup: "13-16 岁",
  description: "把运动拆成水平和竖直两个方向：水平匀速、竖直受重力，合起来就是一条抛物线。",
  category: "phys",
  missionBrief:
    "扔出去的球为什么会走一条弧线？秘密是：**水平和竖直两个方向互不干扰**。\n\n· 水平方向：没有力推它，速度 vx 一直不变 —— 匀速\n· 竖直方向：一直被重力拉着，速度 vy 每帧都在减小 —— 加速\n\n所以每帧只要各算各的：\n· vx 保持不变\n· vy = vy - g * dt;   （重力持续拉低竖直速度）\n· x = x + vx * dt;     （水平位置按 vx 走）\n· y = y + vy * dt;     （竖直位置按 vy 走）\n\n把两个方向合起来，画出来就是抛物线。\n\n这一关还学一招：用两个数组 `trailX / trailY` 把走过的点存起来，每帧清屏后先重画所有历史点（画成小圆），再画当前的大球——轨迹就一点点显形了。\n\n试试改改 vx（抛得远不远）或 vy（抛得高不高），看看落点怎么变。",
  erLingHint:
    "提示：每帧先 vy = vy - g * dt; 再 x = x + vx * dt; y = y + vy * dt; 然后把新位置 push 进 trailX / trailY 两个数组；clearCanvas 后用 for 循环把数组里的点全画成半径 3 的小圆，最后画当前的大球并 wait(dt)。",
  steps: [
    { id: 1, title: "水平匀速 + 竖直加速，两个方向分开算" },
    { id: 2, title: "用数组记住轨迹，每帧擦掉重画" },
    { id: 3, title: "运行，看抛物线一点点显形" },
  ],
  codeMode: true,
  defaultCode:
    "// 抛物线：水平匀速、竖直加速，两个方向各算各的\n" +
    "const g = 300;         // 重力加速度\n" +
    "const dt = 0.05;       // 每一帧走过的时间（秒）\n" +
    "const ground = -150;\n" +
    "let x = -180;          // 水平位置（起点在左边）\n" +
    "let y = 100;           // 竖直位置\n" +
    "let vx = 90;           // 水平速度：不受力，永远不变\n" +
    "let vy = 120;          // 竖直速度：被重力一直拉低\n" +
    "const trailX = [];     // 轨迹：把走过的 x 都记下来\n" +
    "const trailY = [];     // 轨迹：把走过的 y 都记下来\n" +
    "\n" +
    "for (let frame = 0; frame < 34; frame++) {\n" +
    "  vy = vy - g * dt;    // 只有竖直速度被重力改变\n" +
    "  x = x + vx * dt;     // 水平：匀速前进\n" +
    "  y = y + vy * dt;     // 竖直：先升后降\n" +
    "  trailX.push(x);\n" +
    "  trailY.push(y);\n" +
    "\n" +
    "  __runtime.clearCanvas();\n" +
    "  __runtime.drawLine(-240, ground, 240, ground, \"#334155\", 4);   // 地面\n" +
    "  for (let i = 0; i < trailX.length; i++) {                       // 重画轨迹\n" +
    "    __runtime.drawCircle(trailX[i], trailY[i], 3, \"#64748B\");\n" +
    "  }\n" +
    "  __runtime.drawCircle(x, y, 10, \"#F59E0B\");                      // 当前位置的大球\n" +
    "  __runtime.wait(dt);\n" +
    "}\n",
};
