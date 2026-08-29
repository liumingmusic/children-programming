import type { CourseProject } from "@/courses";

/**
 * P·网页 / 小游戏 · 记忆力大挑战：先展示、再隐藏、再回忆——
 * 用「等待」制造时间差，用「清空 + 新面板」切换「看」与「答」两种状态。
 */
export const webMemory: CourseProject = {
  slug: "web_memory",
  title: "记忆力大挑战",
  ageGroup: "13-16 岁",
  description: "生成一个随机数字先展示，几秒后隐藏，再用输入框让用户凭记忆输入并比对。",
  category: "web",
  missionBrief:
    "记忆游戏的关键是「**先看到，再凭记忆重现**」。我们用三个动作搭出来：\n\n1. **展示**：随机生成一个三位数 `const secret = String(Math.floor(Math.random() * 900) + 100)`，用 `__runtime.ui.text` 显示出来。\n2. **等待与隐藏**：`__runtime.wait(2)` 让玩家有几秒去记，然后 `__runtime.ui.clear()` 把数字擦掉，换成输入框和「提交」按钮。\n3. **比对**：点「提交」时读取用户输入，用 `===` 和正确答案比较，对了就恭喜、错了就告诉正确数字。\n\n`__runtime.wait(秒)` 是个「暂停」积木——它会真的停那么久，再继续往下执行，正好用来制造「记住→消失」的时间差。\n\n挑战：把等待时间改短一点（比如 1 秒），看自己还能不能记住。",
  erLingHint:
    "提示：先 const secret = String(Math.floor(Math.random()*900)+100); ui.text('记住：'+secret); __runtime.wait(2); ui.clear(); 再 ui.input('请输入') + ui.button('提交',{onClick: 读取并 if(input===secret) ...})。",
  steps: [
    { id: 1, title: "先展示要记住的数字" },
    { id: 2, title: "隐藏后让用户凭记忆输入" },
    { id: 3, title: "比对并给出反馈" },
  ],
  codeMode: true,
  defaultCode:
    "// 记忆力大挑战：记住数字，凭记忆输入\n" +
    "const secret = String(Math.floor(Math.random() * 900) + 100);\n" +
    "__runtime.ui.heading(\"记忆力大挑战\");\n" +
    "__runtime.ui.text(\"记住这个数字：\" + secret);\n" +
    "__runtime.wait(2);\n" +
    "__runtime.ui.clear();\n" +
    "__runtime.ui.heading(\"现在输入你记住的数\");\n" +
    "const input = __runtime.ui.input({ placeholder: \"输入刚才的数\" });\n" +
    "__runtime.ui.button(\"提交\", {\n" +
    "  onClick: function () {\n" +
    "    const guess = __runtime.ui.value(input);\n" +
    "    if (guess === secret) {\n" +
    "      __runtime.ui.text(\"🎉 太棒了，完全记对了！\");\n" +
    "    } else {\n" +
    "      __runtime.ui.text(\"差一点点～正确答案是 \" + secret);\n" +
    "    }\n" +
    "  },\n" +
    "});\n",
};
