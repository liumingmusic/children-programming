import type { CourseProject } from "@/courses";

/**
 * P·网页 / 小游戏 · 迷你计算器：第一次用「安全 DOM 面板」——
 * 不是画布像素，而是真正的 HTML 输入框和按钮。学生用 __runtime.ui.* 声明界面，
 * 运行时把它们交给 StagePlayer 渲染成可交互的网页元件。
 */
export const webCalculator: CourseProject = {
  slug: "web_calculator",
  title: "迷你计算器",
  ageGroup: "13-16 岁",
  description: "用 DOM 面板做一个网页计算器：输入框收集算式，按钮触发计算，结果写回面板。",
  category: "web",
  missionBrief:
    "之前我们都在「画布」上画画、让二零走路。\n但真正的网页应用需要**按钮、输入框、文字**这些网页元件，画布画不出来。\n\n这一关我们用一套「安全 DOM 面板」：`__runtime.ui`——\n· `__runtime.ui.heading(\"标题\")` 大标题\n· `__runtime.ui.text(\"说明\")` 一行说明文字\n· `__runtime.ui.input({ placeholder })` 输入框（返回一个 id）\n· `__runtime.ui.button(\"按钮名\", { onClick })` 按钮，点它时会执行你写的 onClick 函数\n· `__runtime.ui.value(id)` 读取输入框当前内容\n· `__runtime.ui.set(id, \"新内容\")` ===== 把输入框 / 文本换成新内容\n\n小技巧：直接拿用户输入当代码执行很危险，所以计算器只放行 `0-9 + - * / ( )` 这些字符，\n用 `Function('return (' + expr + ')')()` 安全地算出一个结果。**只认这些符号，其它一律拒绝**，就不会被乱七八糟的输入搞崩。\n\n试试输入 `3 + 5`、`12 * 8`、`(10 + 2) * 3`，看看计算器怎么把答案写回面板。",
  erLingHint:
    "提示：先 ui.input 拿到输入框 id，再 ui.button('计算', { onClick })——在 onClick 里用 __runtime.ui.value(id) 取内容，用正则 /^\\d+[\\d+\\-*/().\\s]*$/ 校验后 Function 求值，最后 __runtime.ui.set(id, 结果)。",
  steps: [
    { id: 1, title: "用输入框收集算式" },
    { id: 2, title: "用按钮触发并把结果写回面板" },
    { id: 3, title: "运行，看到计算器算出答案" },
  ],
  codeMode: true,
  defaultCode:
    "// 迷你计算器：输入算式，点按钮算结果\n" +
    "__runtime.ui.heading(\"迷你计算器\");\n" +
    "__runtime.ui.text(\"在下方输入一个算式，例如 3 + 5，再点「计算」\");\n" +
    "const exprInput = __runtime.ui.input({ placeholder: \"例如 3 + 5\" });\n" +
    "__runtime.ui.button(\"计算\", {\n" +
    "  onClick: function () {\n" +
    "    const expr = __runtime.ui.value(exprInput);\n" +
    "    // 只放行数字与 + - * / ( )，避免危险输入\n" +
    "    if (/^[0-9+\\-*/().\\s]+$/.test(expr)) {\n" +
    "      const result = Function(\"return (\" + expr + \")\")();\n" +
    "      __runtime.ui.set(exprInput, expr + \" = \" + result);\n" +
    "    } else {\n" +
    "      __runtime.ui.set(exprInput, \"算式看不懂～请用数字和 + - * /\");\n" +
    "    }\n" +
    "  },\n" +
    "});\n",
};
