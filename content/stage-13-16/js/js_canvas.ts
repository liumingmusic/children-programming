import type { CourseProject } from "@/courses";

/** 画布绘图：循环里步长与颜色一起变化，画出积木难搭的彩色螺旋。 */
export const jsCanvas: CourseProject = {
  slug: "js_canvas",
  title: "画布绘图：彩色图案",
  ageGroup: "13-16 岁",
  description: "在循环里让步长和颜色一起变化，用代码画出积木很难搭出来的彩色图案。",
  category: "js",
  missionBrief:
    "到这一步，你已经能写出积木很难表达的东西了：让「每一步都和前一步不一样」。\n\n· __runtime.setPenColor(色值) —— 换画笔颜色，色值 0~360（0 红、120 绿、240 蓝）\n· __runtime.changePenColor(增量) —— 在当前颜色上继续偏移\n\n如果每循环一次就让步长变大一点、颜色偏移一点，画出来就会是一条不断展开的彩色螺旋——这种「每一步都在变」的效果，正是代码比积木强的地方。\n\n试试改循环次数、每次转的角度，或把 i * 3 换成别的公式，看看能画出什么意外的图案。",
  erLingHint:
    "提示：先 __runtime.penDown(); 然后 for (let i = 0; i < 36; i++) 循环，里面写 __runtime.move(10 + i * 3); __runtime.turn(25); __runtime.setPenColor(i * 10); —— 步长和颜色都跟着 i 变。",
  steps: [
    { id: 1, title: "让二零落笔" },
    { id: 2, title: "在循环里移动 + 转向 + 换色" },
    { id: 3, title: "运行，画出彩色图案" },
  ],
  codeMode: true,
  defaultCode:
    "// 步长和颜色一起变化的彩色螺旋\n" +
    "__runtime.penDown();\n" +
    "for (let i = 0; i < 36; i++) {\n" +
    "  __runtime.move(10 + i * 3);\n" +
    "  __runtime.turn(25);\n" +
    "  __runtime.setPenColor(i * 10);\n" +
    "}\n",
};
