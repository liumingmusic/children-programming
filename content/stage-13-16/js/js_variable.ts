import type { CourseProject } from "@/courses";

/** 变量与运算：用 let / const 存数字，再让图形大小由变量决定。 */
export const jsVariable: CourseProject = {
  slug: "js_variable",
  title: "变量与运算",
  ageGroup: "13-16 岁",
  description: "用 let / const 把数字存进变量，再让图形的大小由变量决定——改一个数，图形就跟着变。",
  category: "js",
  missionBrief:
    "变量就像一个贴了标签的盒子，你可以往里面放一个数字，之后用名字把它取出来用。\n\n· const side = 120; 表示「新建一个叫 side 的盒子，放入 120」\n· __runtime.move(side); 表示「让二零走 side 这么多步」\n\n用变量的好处：想改图形大小，只需要改 side 那一行的数字，不用去改每一行 move。\n\n试着声明一个变量存边长，然后落笔、循环画一个正方形；再改改变量的值，看看图形怎么变。",
  erLingHint:
    "提示：先用 const side = 120; 存一个边长，再 __runtime.penDown(); 落笔，最后用 for 循环把 __runtime.move(side); 和 __runtime.turn(90); 重复 4 次。",
  steps: [
    { id: 1, title: "用 let / const 声明一个变量" },
    { id: 2, title: "用循环 + 变量画一个图形" },
    { id: 3, title: "运行看看效果" },
  ],
  codeMode: true,
  defaultCode:
    "// 用变量存「边长」，再画一个正方形\n" +
    "const side = 120;\n" +
    "__runtime.penDown();\n" +
    "for (let i = 0; i < 4; i++) {\n" +
    "  __runtime.move(side);\n" +
    "  __runtime.turn(90);\n" +
    "}\n",
};
