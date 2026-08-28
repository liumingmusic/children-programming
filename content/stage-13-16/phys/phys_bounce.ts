import type { CourseProject } from "@/courses";

/** M·物理试点二：弹跳球——碰撞检测（撞地反弹）+ 能量衰减 + 静止阈值。 */
export const physBounce: CourseProject = {
  slug: "phys_bounce",
  title: "弹跳球：撞到地面弹回来",
  ageGroup: "13-16 岁",
  description: "给自由落体加一条碰撞规则：撞地就把速度反过来，并损失一点能量——小球一次比一次弹得矮。",
  category: "phys",
  missionBrief:
    "上一关小球一路掉下去；这一次我们让它「撞到地面弹回来」。\n\n关键只有一个判断：球心低于「地面 + 半径」就是撞地了。撞地时要做两件事——\n· 把小球拉回地面（不然会陷进地里）\n· 把速度反过来：v = -v * 0.7\n\n为什么乘 0.7？真实的小球每次弹起都会损失能量，所以反弹后的速度只剩 70%，弹起的高度也就一次比一次矮。这个数字叫「弹性系数」。\n\n还有一个容易踩的坑：当速度已经很小的时候要让它停下（v = 0），否则小球会在地面上「哆嗦」，弹跳次数会一直往上加。\n\n本关新增两个指令：\n· __runtime.drawRect(x, y, 宽, 高, 颜色) —— 画矩形（这里用来画地面）\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 在舞台上写字\n\n试着把 0.7 改成 0.95（超弹的球）或 0.3（一滩泥），看看小球多快停下来。",
  erLingHint:
    "提示：在循环里先更新 v 和 y，再写 if (y < ground + r && v < 0) { y = ground + r; v = -v * 0.7; }；然后 clearCanvas → drawRect 画地面 → drawCircle 画球 → drawText 写次数 → wait(dt)。",
  steps: [
    { id: 1, title: "在循环里更新速度和位置" },
    { id: 2, title: "判断撞地，让速度反向并衰减" },
    { id: 3, title: "每帧擦掉重画，看小球弹跳" },
  ],
  codeMode: true,
  defaultCode:
    "// 弹跳球：撞到地面就把速度反过来，每次弹起都矮一点\n" +
    "const ground = -150;   // 地面的高度\n" +
    "const r = 12;          // 小球半径\n" +
    "let y = 80;            // 小球高度\n" +
    "let v = 0;             // 速度（往下为负）\n" +
    "const g = 800;         // 重力加速度\n" +
    "const dt = 0.05;       // 每一帧走过的时间（秒）\n" +
    "let bounces = 0;       // 弹了几次\n" +
    "\n" +
    "for (let frame = 0; frame < 50; frame++) {\n" +
    "  v = v - g * dt;      // 重力拉低速度\n" +
    "  y = y + v * dt;      // 位置跟着速度走\n" +
    "\n" +
    "  if (y < ground + r && v < 0) {   // 球心低于「地面 + 半径」= 撞地了\n" +
    "    y = ground + r;                // 拉回地面，别陷进去\n" +
    "    if (-v > 60) {                 // 还弹得动 → 反弹\n" +
    "      v = -v * 0.7;                // 速度反向，只保留 70% 能量\n" +
    "      bounces = bounces + 1;\n" +
    "    } else {\n" +
    "      v = 0;                       // 弹不动了，安静地停在地面\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  __runtime.clearCanvas();                                        // 擦掉上一帧\n" +
    "  __runtime.drawRect(-240, ground - 40, 480, 40, \"#334155\");       // 地面\n" +
    "  __runtime.drawCircle(0, y, r, \"#F59E0B\");                        // 小球\n" +
    "  __runtime.drawText(-225, 155, \"弹跳次数：\" + bounces, \"#E2E8F0\", 16);\n" +
    "  __runtime.wait(dt);                                             // 停一下才看得见\n" +
    "}\n",
};
