import type { CourseProject } from "@/courses";

/** L·算法 1：冒泡排序可视化——相邻比较 + 交换，大数像气泡一样浮到末尾。 */
export const algoBubble: CourseProject = {
  slug: "algo_bubble",
  title: "冒泡排序：让数字排好队",
  ageGroup: "13-16 岁",
  description: "用画布把「排序」画出来：每一轮比较相邻两个数，把大的往后推，看无序如何一步步变成有序。",
  category: "algo",
  missionBrief:
    "排序是算法世界的第一课。冒泡排序的思路特别直白：\n· 从左到右，比较相邻的两个数\n· 如果左边 > 右边，就交换它们\n· 一轮下来，最大的数就像气泡一样「浮」到了最右边\n· 重复 n-1 轮，数组就有序了\n\n我们用画布把每一步画出来：\n· __runtime.clearCanvas() —— 擦掉上一帧\n· __runtime.drawRect(x, y, 宽, 高, 颜色) —— 以 (x, y) 为左下角画一个柱子，高度代表数值\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 标出数字\n· __runtime.wait(秒) —— 停一小会儿，看清这一帧\n\n舞台坐标：中心 (0,0)，y 向上为正，所以柱子要从一条基线往上画。",
  erLingHint:
    "提示：let a = [5,3,8,1,9,2,7,4]; 用两层 for 循环，内层比较 a[j] > a[j+1]，成立就交换（let t = a[j]; a[j] = a[j+1]; a[j+1] = t;）。每次比较后 clearCanvas 重画所有柱子，把正在比较的两根染成橙色，再 wait(0.2)。",
  steps: [
    { id: 1, title: "准备一个待排序的数组" },
    { id: 2, title: "用循环比较相邻元素，并在需要时交换" },
    { id: 3, title: "运行，看数组逐渐被排好序" },
  ],
  codeMode: true,
  defaultCode:
    "// 冒泡排序：相邻比较，大的往后推\n" +
    "let a = [5, 3, 8, 1, 9, 2, 7, 4];\n" +
    "const n = a.length;\n" +
    "const baseY = -160;   // 柱子从这条基线往上长\n" +
    "const bw = 30;        // 柱子宽度\n" +
    "\n" +
    "function draw(hi) {\n" +
    "  __runtime.clearCanvas();\n" +
    "  for (let i = 0; i < n; i++) {\n" +
    "    const x = -220 + i * (bw + 8);\n" +
    "    const h = a[i] * 18;\n" +
    "    const color = (i === hi || i === hi + 1) ? \"#FB923C\" : \"#F59E0B\";\n" +
    "    __runtime.drawRect(x, baseY, bw, h, color);\n" +
    "    __runtime.drawText(x + 6, baseY + h + 14, a[i], \"#1F2937\", 14);\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "for (let i = 0; i < n - 1; i++) {\n" +
    "  for (let j = 0; j < n - 1 - i; j++) {\n" +
    "    draw(j);\n" +
    "    if (a[j] > a[j + 1]) {\n" +          // 比较
    "      const t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;\n" +  // 交换
    "    }\n" +
    "    __runtime.wait(0.2);\n" +
    "  }\n" +
    "}\n" +
    "draw(-1);\n" +
    "__runtime.drawText(-220, 150, \"排序完成！\", \"#22C55E\", 18);\n",
};
