import type { CourseProject } from "@/courses";

/** 数组：一组数据驱动出一串图形（正多边形家族）。 */
export const jsArray: CourseProject = {
  slug: "js_array",
  title: "数组：批量处理数据",
  ageGroup: "13-16 岁",
  description: "用数组把一串数字装在一起，再用循环挨个取出来——一组数据驱动出一串图形。",
  category: "js",
  missionBrief:
    "数组就是「一排格子」，每格放一个值，用下标 [0] [1] [2] 取。\n\n· const sides = [3, 4, 5]; —— 建一个数组，里面放 3、4、5\n· for (const n of sides) { ... } —— 把数组里的值挨个取出来，每次存在 n 里\n· sides.length —— 数组里有几个元素\n\n这次我们画一串正多边形：数组里每有一个数字 n，就画一个 n 边形。正 n 边形的关键是每次转 360 / n 度——转完一圈刚好回到原点。\n\n画完一个图形记得 __runtime.penUp(); 抬笔再移动，不然会在两个图形之间连出多余的线！",
  erLingHint:
    "提示：const sides = [3, 4, 6]; 然后用 for (const n of sides) 遍历，里面再套一个循环画 n 条边：__runtime.move(60); __runtime.turn(360 / n); 每个图形画完抬笔走开一点。",
  steps: [
    { id: 1, title: "创建一个数组" },
    { id: 2, title: "遍历数组，画出多个图形" },
    { id: 3, title: "运行看看效果" },
  ],
  codeMode: true,
  defaultCode:
    "// 用数组存「边数」，循环画出三角形、正方形、六边形\n" +
    "const sides = [3, 4, 6];\n" +
    "__runtime.penDown();\n" +
    "for (const n of sides) {\n" +
    "  for (let i = 0; i < n; i++) {\n" +
    "    __runtime.move(60);\n" +
    "    __runtime.turn(360 / n);\n" +
    "  }\n" +
    "  __runtime.penUp();\n" + // 抬笔，避免连到下一个图形
    "  __runtime.move(70);\n" +
    "}\n",
};
