import type { CourseProject } from "@/courses";

/** L·算法 8：贪心入门——每次都选「当前能选的最大」，快速凑出金额（零钱问题）。 */
export const algoGreedy: CourseProject = {
  slug: "algo_greedy",
  title: "贪心算法：凑零钱",
  ageGroup: "13-16 岁",
  description: "给定几种面额，要凑出某个金额，每次都优先用「最大面额」——这是贪心思想最直观的例子。",
  category: "algo",
  missionBrief:
    "贪心算法：每一步都做「当下看起来最好」的选择，期望最后得到全局最优。\n\n凑零钱是最经典的贪心：面额 [25, 10, 5, 1]，要凑 67 分。\n· 从最大面额开始，只要「金额还 ≥ 这个硬币」，就一直用它\n· 用掉一枚：amount = amount - coin，并把这枚记到 used 里\n· 换下一个更小面额，直到 amount 归零\n\n贪心不总是万能，但在「标准货币面额」下它恰好能得到最少硬币数。我们把用掉的硬币一个个画出来。",
  erLingHint:
    "提示：const coins = [25,10,5,1]; let amount = 67; let used = []; 外层 for 遍历 coins，内层 while (amount >= coins[i]) { amount = amount - coins[i]; used.push(coins[i]); }。最后把 used 画成一圈圈硬币。",
  steps: [
    { id: 1, title: "准备面额数组和要凑的金额" },
    { id: 2, title: "用循环 + 贪心（优先用最大面额）不断减" },
    { id: 3, title: "运行，看用哪些硬币凑出了金额" },
  ],
  codeMode: true,
  defaultCode:
    "// 贪心算法：每次都优先用当前能选的最大面额硬币\n" +
    "const coins = [25, 10, 5, 1];\n" +
    "let amount = 67;\n" +
    "let used = [];\n" +
    "const baseY = -150, bw = 30;\n" +
    "\n" +
    "for (let i = 0; i < coins.length; i++) {\n" +
    "  while (amount >= coins[i]) {\n" +       // 只要还够，就一直用这枚
    "    amount = amount - coins[i];\n" +       // 贪心：减掉一枚
    "    used.push(coins[i]);\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "function draw() {\n" +
    "  __runtime.clearCanvas();\n" +
    "  for (let i = 0; i < used.length; i++) {\n" +
    "    const x = -200 + i * (bw + 4);\n" +
    "    __runtime.drawCircle(x + bw / 2, baseY + 20, 14, \"#F59E0B\");\n" +
    "    __runtime.drawText(x + bw / 2 - 6, baseY + 26, used[i], \"#1F2937\", 12);\n" +
    "  }\n" +
    "}\n" +
    "draw();\n" +
    "__runtime.drawText(-200, 150, \"凑 67 分用了 \" + used.length + \" 枚硬币\", \"#22C55E\", 18);\n",
};
