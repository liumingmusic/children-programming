import type { CourseProject } from "@/courses";

/**
 * P·网页 / 小游戏 · 打字练习：从词库随机抽一个目标词，用户输入正确就加分——
 * 练习「随机出题 + 输入比对 + 计分」这套常见的游戏骨架。
 */
export const webTyping: CourseProject = {
  slug: "web_typing",
  title: "打字练习小游戏",
  ageGroup: "13-16 岁",
  description: "随机出一个英文词，用户在输入框照着打，正确就加分，错了给出正确答案。",
  category: "web",
  missionBrief:
    "很多小游戏（背单词、打字、答题）都是同一个骨架：\n**出题 → 收答案 → 比对 → 计分**。\n\n这一关我们做打字练习：\n· 用 `const words = [\"apple\",\"code\",...]` 准备词库，随机抽一个当目标 `target`\n· 用 `__runtime.ui.text` 把目标词展示出来\n· 放一个输入框 + 「提交」按钮\n· 点「提交」时读取输入，用 `===` 和 `target` 比较：对了给 `score` 加 1，错了提示正确拼写\n\n计分用一个普通变量 `let score = 0`，每次对了就 `score = score + 1`，再用文字把分数显示出来。\n\n挑战：把词库换成你喜欢的中文拼音或英文单词，做你自己的单词卡。",
  erLingHint:
    "提示：const words=[...]; const target=words[Math.floor(Math.random()*words.length)]; ui.text('请打出：'+target); 然后 ui.input + ui.button('提交',{onClick: const g=ui.value(input); if(g===target){score=score+1; ...}else{...}})。",
  steps: [
    { id: 1, title: "展示目标词" },
    { id: 2, title: "用输入框收集用户输入" },
    { id: 3, title: "比对并统计正确次数" },
  ],
  codeMode: true,
  defaultCode:
    "// 打字练习：照着目标词打出来，越快越准越好\n" +
    "__runtime.ui.heading(\"打字练习\");\n" +
    "const words = [\"apple\", \"banana\", \"code\", \"planet\", \"sunrise\", \"parrot\"];\n" +
    "const target = words[Math.floor(Math.random() * words.length)];\n" +
    "let score = 0;\n" +
    "__runtime.ui.text(\"请打出：\" + target);\n" +
    "const input = __runtime.ui.input({ placeholder: \"在这里输入\" });\n" +
    "__runtime.ui.button(\"提交\", {\n" +
    "  onClick: function () {\n" +
    "    const guess = __runtime.ui.value(input);\n" +
    "    if (guess === target) {\n" +
    "      score = score + 1;\n" +
    "      __runtime.ui.text(\"✅ 正确！当前得分 \" + score);\n" +
    "    } else {\n" +
    "      __runtime.ui.text(\"❌ 正确拼写是 \" + target);\n" +
    "    }\n" +
    "  },\n" +
    "});\n",
};
