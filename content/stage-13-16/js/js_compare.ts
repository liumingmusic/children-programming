import type { CourseProject } from "@/courses";

/** 从积木到代码：把拖过的每一块积木都写成一行真正的代码（js 分类收尾综合关）。 */
export const jsCompare: CourseProject = {
  slug: "js_compare",
  title: "从积木到代码",
  ageGroup: "13-16 岁",
  description: "综合复习：把你以前拖过的每一块积木，都用一行真正的代码写出来。",
  category: "js",
  missionBrief:
    "回头看看：你以前拖过的积木，其实每一块都对应一行代码。\n\n· 「移动 100 步」→ __runtime.move(100);\n· 「右转 90 度」→ __runtime.turn(90);\n· 「落笔」→ __runtime.penDown();\n· 「把画笔颜色设为…」→ __runtime.setPenColor(200);\n· 「说…」→ __runtime.say(\"…\", 3);\n· 「重复 4 次」→ for (let i = 0; i < 4; i++) { ... }\n\n差别在于：积木只能按固定的形状拼，代码可以随意组合、套娃、用变量和函数。\n\n这一关是综合练习：落笔画一个图形 → 换一种颜色再画 → 最后让二零说一句话。把这学期学过的本领都串起来吧！",
  erLingHint:
    "提示：第一步 __runtime.penDown(); 加循环画图形；第二步 __runtime.setPenColor(200); 换色；第三步 __runtime.say(\"我学会用代码画画了！\", 3); 让二零说出你的感想。",
  steps: [
    { id: 1, title: "落笔，画一个图形" },
    { id: 2, title: "换一种颜色" },
    { id: 3, title: "让二零说一句话" },
    { id: 4, title: "运行，看综合效果" },
  ],
  codeMode: true,
  defaultCode:
    "// 综合复习：把你拖过的积木都写成代码\n" +
    "__runtime.penDown();\n" +
    "for (let i = 0; i < 4; i++) {\n" +
    "  __runtime.move(80);\n" +
    "  __runtime.turn(90);\n" +
    "}\n" +
    "__runtime.setPenColor(200);\n" +
    "for (let i = 0; i < 3; i++) {\n" +
    "  __runtime.move(60);\n" +
    "  __runtime.turn(120);\n" +
    "}\n" +
    '__runtime.say("我学会用代码画画了！", 3);\n',
};
