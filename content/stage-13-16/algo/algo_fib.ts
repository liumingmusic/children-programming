import type { CourseProject } from "@/courses";

/** L·算法 5：斐波那契与递归——函数自己调用自己，优雅而强大。 */
export const algoFib: CourseProject = {
  slug: "algo_fib",
  title: "斐波那契：递归之美",
  ageGroup: "13-16 岁",
  description: "斐波那契数列每一项是前两项之和。用一个「会调用自己」的函数来计算它，体会递归思想。",
  category: "algo",
  missionBrief:
    "递归就是「函数自己调用自己」，配上「退出条件」就不会无限循环。\n斐波那契数列：0, 1, 1, 2, 3, 5, 8, 13 …… 从第三项起，每一项都等于前两项之和。\n\n写成递归函数特别自然：\n· 退出条件：n < 2 时直接返回 n\n· 否则返回 fib(n-1) + fib(n-2)（自己调用自己）\n\n注意：这种最朴素的递归会重复计算很多次，效率不高——但它把「数学定义」一字不差地翻译成了代码，是理解递归最好的入口。我们把前几项画成柱子看看增长有多快。",
  erLingHint:
    "提示：function fib(n) { if (n < 2) return n; return fib(n - 1) + fib(n - 2); } 再用 for (let i=0; i<=10; i++) 循环，把 fib(i) 画成高度 ∝ 值的柱子，每画一项 wait(0.3) 看数列生长。",
  steps: [
    { id: 1, title: "写一个能计算斐波那契的函数" },
    { id: 2, title: "让函数自己调用自己（递归）" },
    { id: 3, title: "运行，画出斐波那契数列的增长" },
  ],
  codeMode: true,
  defaultCode:
    "// 斐波那契数列：每一项都等于前两项之和，用递归计算\n" +
    "function fib(n) {\n" +
    "  if (n < 2) return n;              // 退出条件\n" +
    "  return fib(n - 1) + fib(n - 2);   // 自己调用自己\n" +
    "}\n" +
    "const count = 10;\n" +
    "const baseY = -150, bw = 34;\n" +
    "\n" +
    "function draw() {\n" +
    "  __runtime.clearCanvas();\n" +
    "  for (let i = 0; i <= count; i++) {\n" +
    "    const v = fib(i);\n" +
    "    const x = -200 + i * (bw + 6);\n" +
    "    __runtime.drawRect(x, baseY, bw, v * 10, \"#F59E0B\");\n" +
    "    __runtime.drawText(x + 4, baseY + v * 10 + 14, v, \"#1F2937\", 13);\n" +
    "  }\n" +
    "}\n" +
    "for (let i = 0; i <= count; i++) { draw(); __runtime.wait(0.3); }\n" +
    "__runtime.drawText(-200, 150, \"斐波那契：递归之美\", \"#22C55E\", 18);\n",
};
