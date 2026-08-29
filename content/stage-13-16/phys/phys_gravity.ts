import type { CourseProject } from "@/courses";

/**
 * M·物理 · 重力对比：同一个高度，换一个 g，落地快慢完全不同。
 * 用三个等长数组（gs / ys / vs）平行存放三颗小球的状态，循环里按下标挨个更新。
 */
export const physGravity: CourseProject = {
  slug: "phys_gravity",
  title: "重力模拟：换个星球会怎样",
  ageGroup: "13-16 岁",
  description: "三颗球、三个不同的重力加速度同时下落——原来 g 只是一个可以换的参数。",
  category: "phys",
  missionBrief:
    "自由落体那一关里，g 是写死的一个数。其实它就是一个**参数**：换一颗星球，g 就换一个值，落地的快慢立刻不一样。\n\n· 月球重力约为地球的 1/6 → g 小得多，落得慢\n· 木星重力约为地球的 2.5 倍 → g 大得多，落得快\n\n这一次我们同时模拟三颗球。诀窍是**平行数组**：把三颗球的重力、高度、速度分别装进三个等长的数组，\n按下标 i 一一对应：gs[i] 是第 i 颗球的重力，ys[i] 是它的高度，vs[i] 是它的速度。\n循环里 `for (let i = 0; i < 3; i++)` 挨个更新，就是一份代码模拟三个物体。\n\n这种「一组数据 + 一次循环」的写法，正是真实物理引擎处理成百上千个物体的基本思路。\n\n注意撞地后要 `vs[i] = 0;` 让它停住，否则会一直往下掉到画面外。",
  erLingHint:
    "提示：建三个数组 const gs = [300, 50, 750]; const xs = [-140, 0, 140]; let ys = [140, 140, 140]; let vs = [0, 0, 0]; 然后循环里再套一个 for (let i = 0; i < 3; i++)，更新 vs[i] 和 ys[i]，撞地就停；最后 clearCanvas 画地面和三颗球。",
  steps: [
    { id: 1, title: "用数组同时装下三颗球的状态" },
    { id: 2, title: "每颗球各自受重力、撞地就停" },
    { id: 3, title: "每帧擦掉重画，看谁先落地" },
  ],
  codeMode: true,
  defaultCode:
    "// 重力模拟：同一高度，三个不同的 g，看谁先落地\n" +
    "const gs = [300, 50, 750];                                       // 地球 / 月球 / 木星\n" +
    "const xs = [-140, 0, 140];                                       // 三颗球的横向位置\n" +
    "const colors = [\"#F59E0B\", \"#E2E8F0\", \"#38bdf8\"];\n" +
    "let ys = [140, 140, 140];                                        // 三颗球的高度\n" +
    "let vs = [0, 0, 0];                                              // 三颗球的速度\n" +
    "const dt = 0.05, ground = -150, r = 12;\n" +
    "\n" +
    "for (let frame = 0; frame < 30; frame++) {\n" +
    "  for (let i = 0; i < 3; i++) {                                  // 挨个更新每颗球\n" +
    "    vs[i] = vs[i] - gs[i] * dt;                                  // 各用各的重力\n" +
    "    ys[i] = ys[i] + vs[i] * dt;\n" +
    "    if (ys[i] < ground + r) {                                    // 撞到地面\n" +
    "      ys[i] = ground + r;\n" +
    "      vs[i] = 0;                                                 // 停住，别掉出画面\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  __runtime.clearCanvas();\n" +
    "  __runtime.drawRect(-240, ground - 40, 480, 40, \"#334155\");      // 地面\n" +
    "  for (let i = 0; i < 3; i++) {\n" +
    "    __runtime.drawCircle(xs[i], ys[i], r, colors[i]);\n" +
    "  }\n" +
    "  __runtime.drawText(-225, 160, \"重力：300 / 50 / 750\", \"#E2E8F0\", 15);\n" +
    "  __runtime.wait(dt);\n" +
    "}\n",
};
