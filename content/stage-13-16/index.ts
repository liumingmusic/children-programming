import type { CourseProject } from "@/courses";

/**
 * 13-16 岁 · 进阶工坊 项目集合。
 * 起步于「文本代码过渡（js）」分类：学生从拖积木平滑切换到直接写 JavaScript，
 * 调用与积木同源的 __runtime 命令式 API（move / turn / penDown / say ...），运行时零新增即可复用。
 *
 * 本分类 8 项的编排思路（Phases 0 + 1）：
 *   js_square    循环画图形（落笔 + for 循环）           —— Phase 0 试点
 *   js_hello     你的第一个 JS 程序（用 say 产生输出）
 *   js_variable  变量与运算（用变量控制图形）
 *   js_function  函数（把画图动作封装起来再调用）
 *   js_array     数组（批量画出一串图形）
 *   js_tool      计算小工具（算完用 say 报结果）
 *   js_canvas    画布绘图（循环 + 换色，画彩色图案）
 *   js_compare   从积木到代码（落笔 / 画 / 换色 / 说话 综合复习）
 * 全部为 codeMode，完成判定复用 lib/steps.ts 的 JS_CODE_SLUGS 分支（真实 JS 标记 + 运行日志）。
 */
export const jsSquare: CourseProject = {
  slug: "js_square",
  title: "用代码画正方形",
  ageGroup: "13-16 岁",
  description: "第一次用真正的 JavaScript 指挥二零：落笔、用循环画四条边和四个直角。",
  category: "js",
  missionBrief:
    "欢迎来到代码模式！这里不再拖积木，而是直接写 JavaScript。\n\n二零能听懂一套叫 __runtime 的「指令」：\n· __runtime.penDown() 让二零拿起画笔\n· __runtime.move(100) 向前走 100 步\n· __runtime.turn(90) 向右转 90 度（一个直角）\n\n正方形有 4 条相等的边、4 个直角。试着让二零：先落笔，再用一个循环（for）重复 4 次「前进 + 右转」，就能画出正方形。",
  erLingHint:
    "提示：先写 __runtime.penDown() 拿起笔，再用 for 循环把「走 100 步、右转 90 度」重复 4 次。循环能少写很多重复代码哦！",
  steps: [
    { id: 1, title: "让二零拿起画笔（落笔）" },
    { id: 2, title: "用循环画四条边和四个直角" },
    { id: 3, title: "运行看看效果" },
  ],
  codeMode: true,
  defaultCode:
    "// 用 JavaScript 指挥二零画一个正方形\n" +
    "// __runtime 是命令式 API：move(步数) 前进、turn(角度) 转向、penDown() 落笔\n" +
    "__runtime.penDown();\n" +
    "for (let i = 0; i < 4; i++) {\n" +
    "  __runtime.move(100);\n" +
    "  __runtime.turn(90);\n" +
    "}\n",
};

export const jsHello: CourseProject = {
  slug: "js_hello",
  title: "你的第一个 JS 程序",
  ageGroup: "13-16 岁",
  description: "不画图、不拖积木——只用一行代码让二零开口说话，感受「代码真的被执行了」。",
  category: "js",
  missionBrief:
    "所有程序员入门的第一件事，都是让程序「说」一句话。\n\n写代码和拖积木最大的不同是：你写的每个字、每个标点都会被电脑照着执行。写错了，程序就会报错；写对了，二零就会照做。\n\n这次你只需要一个指令：\n· __runtime.say(\"想说的话\", 停留秒数) —— 让二零把这句话说出来\n\n注意：文字要用英文引号包起来，第二个数字是这句话停留几秒。试着把「你好，世界！」改成你想对二零说的话吧！",
  erLingHint:
    "提示：写 __runtime.say(\"你好，世界！\", 2); 然后点运行。别忘了末尾的分号，也别忘了引号要成对出现！",
  steps: [
    { id: 1, title: "写一行让二零说话的代码" },
    { id: 2, title: "运行，看到二零真的开口" },
    { id: 3, title: "程序顺利跑完" },
  ],
  codeMode: true,
  defaultCode:
    "// 你的第一行 JavaScript：让二零开口说话\n" +
    "// __runtime.say(文字, 停留秒数) —— 第二个参数是这句话显示几秒\n" +
    '__runtime.say("你好，世界！", 2);\n',
};

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

export const jsTool: CourseProject = {
  slug: "js_tool",
  title: "计算小工具",
  ageGroup: "13-16 岁",
  description: "写一个真正有用的小程序：算出结果，再让二零把答案说出来——这就是工具的雏形。",
  category: "js",
  missionBrief:
    "代码不只是让角色动，更能帮你算东西。这次我们做一个「长方形面积计算器」。\n\n· * 是乘号，/ 是除号，+ 加，- 减\n· const area = length * width; —— 把算出来的结果存进变量\n· __runtime.say(...) 可以把结果说出来，用 + 把文字和数字拼在一起\n\n注意：__runtime.say 要的是一段文字，所以要把数字拼进文字里，比如 \"面积是 \" + area。\n\n试着改改 length 和 width 的值，看看二零报出的答案对不对；再试试算周长 (length + width) * 2。",
  erLingHint:
    "提示：先 const length = 8; const width = 5; 再 const area = length * width; 最后 __runtime.say(\"面积是 \" + area, 3); 数字和文字要用 + 拼起来，不能直接写在一起。",
  steps: [
    { id: 1, title: "写一段计算逻辑" },
    { id: 2, title: "用 say 把结果告诉二零" },
    { id: 3, title: "运行看看结果" },
  ],
  codeMode: true,
  defaultCode:
    "// 长方形面积计算器：算完让二零把答案说出来\n" +
    "const length = 8;\n" +
    "const width = 5;\n" +
    "const area = length * width;\n" +
    '__runtime.say("面积是 " + area, 3);\n',
};

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

/** stage-13-16 项目（js 分类 8 项：Phase 0 试点 + Phase 1 铺满；其余分类按 Phase 节奏铺开）。 */
export const stage13Projects: CourseProject[] = [
  jsSquare,
  jsHello,
  jsVariable,
  jsFunction,
  jsArray,
  jsTool,
  jsCanvas,
  jsCompare,
];
