import type { CourseProject } from "@/courses";

/**
 * O·创意编程 · 分形树：递归——函数自己调用自己，一句话长出一整棵树。
 * 递归的两个要件：① 函数内部调用自己（带着更小的规模）② 有终止条件，否则永远停不下来。
 */
export const creativeTree: CourseProject = {
  slug: "creative_tree",
  title: "分形树：一句话长出一棵树",
  ageGroup: "13-16 岁",
  description: "让函数自己调用自己——每个枝头再长出两个更小的枝，几行代码就长出一整棵树。",
  category: "creative",
  missionBrief:
    "观察一根树枝：它顶端会分叉成两根更小的枝，而那两根更小的枝**又会各自分叉**……\n一层套一层，永远一个样子。这种「自己的一部分长得像整体」的结构叫**分形**，自然界里到处都是：树、雪花、海岸线。\n\n要用代码表达它，靠的是一个厉害的念头：**函数自己调用自己**。这叫**递归**。\n\n```\nfunction branch(x, y, angle, len, depth) {\n  if (depth === 0) return;        // ① 终止条件：长到头了就停\n  ...画这一段树枝...\n  branch(x2, y2, angle - 25, len * 0.7, depth - 1);   // ② 左枝\n  branch(x2, y2, angle + 25, len * 0.7, depth - 1);   //    右枝\n}\n```\n\n两个要件缺一不可：\n· **终止条件**：`if (depth === 0) return;` —— 没有它，函数会无限调用下去，页面直接卡死\n· **规模递减**：每次调用 depth 减 1、长度乘 0.7 —— 问题必须越变越小，才能走到终止条件\n\ndepth 从 7 开始，每一层都一分为二，最后会画出 127 段树枝——而你只写了一个函数。\n\n试试改分叉角度（25 度）、缩短比例（0.7）或起始深度，看看能长出什么样的树。",
  erLingHint:
    "提示：先写终止条件 if (depth === 0) return; 再用 cos / sin 算出这段枝的终点 (x2, y2) 并 drawLine 画出来；最后调用自己两次画左枝（angle - 25）和右枝（angle + 25），记得 depth - 1、len * 0.7。",
  steps: [
    { id: 1, title: "定义一个画树枝的函数" },
    { id: 2, title: "让函数调用自己，并加上终止条件" },
    { id: 3, title: "运行，看树长出来" },
  ],
  codeMode: true,
  defaultCode:
    "// 分形树：函数自己调用自己（递归）\n" +
    "function branch(x, y, angle, len, depth) {\n" +
    "  if (depth === 0) return;                       // 终止条件：长到头就停\n" +
    "  const rad = angle * Math.PI / 180;\n" +
    "  const x2 = x + len * Math.cos(rad);            // 这段枝的终点\n" +
    "  const y2 = y + len * Math.sin(rad);\n" +
    "  const color = depth > 3 ? \"#78350F\" : \"#22C55E\";   // 粗枝是树干，细枝是叶子\n" +
    "  __runtime.drawLine(x, y, x2, y2, color, Math.max(1, depth * 1.2));\n" +
    "\n" +
    "  branch(x2, y2, angle - 25, len * 0.7, depth - 1);   // 左枝\n" +
    "  branch(x2, y2, angle + 25, len * 0.7, depth - 1);   // 右枝\n" +
    "}\n" +
    "\n" +
    "branch(0, -170, 90, 72, 7);                     // 从底部向上（90 度）长出整棵树\n",
};
