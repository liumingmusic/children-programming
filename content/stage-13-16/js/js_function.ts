import type { CourseProject } from "@/courses";

/** 函数：用 function 把一串动作打包成可复用的「能力」。 */
export const jsFunction: CourseProject = {
  slug: "js_function",
  title: "函数：把动作打包",
  ageGroup: "13-16 岁",
  description: "用 function 把一串画图动作封装成可复用的「能力」，调用一次画一个，调用多次画多个。",
  category: "js",
  missionBrief:
    "如果同一串动作要重复很多次，每次都抄一遍就很傻。函数让你把这串动作「打包」并起个名字，以后只要叫它的名字就能重放。\n\n· function 名字(参数) { 动作 } —— 定义一个函数\n· 名字(值) —— 调用它，括号里的值会传进函数当参数用\n\n比如定义一个 drawSquare(size)，它负责画一个边长为 size 的正方形；接着用不同的 size 调用它两次，就能画出大小不同的两个正方形。\n\n小括号里的 size 叫「参数」，调用时传什么值进去，函数里的 size 就是什么。",
  erLingHint:
    "提示：先写 function drawSquare(size) { 里面放 penDown + 循环 move(size) / turn(90) }，定义完别忘在下面写 drawSquare(100); 调用它——只定义不调用，二零是不会动的！",
  steps: [
    { id: 1, title: "定义一个函数" },
    { id: 2, title: "调用函数，让二零画出来" },
    { id: 3, title: "运行看看效果" },
  ],
  codeMode: true,
  defaultCode:
    "// 定义一个「画正方形」的函数，再调用它\n" +
    "// size 是参数：调用时传什么，函数里的 size 就是什么\n" +
    "function drawSquare(size) {\n" +
    "  __runtime.penDown();\n" +
    "  for (let i = 0; i < 4; i++) {\n" +
    "    __runtime.move(size);\n" +
    "    __runtime.turn(90);\n" +
    "  }\n" +
    "}\n" +
    "drawSquare(100);\n",
};
