import type { CourseProject } from "@/courses";

/**
 * P·网页 / 小游戏 · 简易聊天机器人：用「关键词规则」让网页会对话——
 * 列表存对话历史，if/else 按用户输入的关键词给出不同回复。
 */
export const webChatbot: CourseProject = {
  slug: "web_chatbot",
  title: "小鹦鹉聊天室",
  ageGroup: "13-16 岁",
  description: "本地规则聊天机器人：输入框收集消息，按关键词匹配回复，并用列表展示完整对话。",
  category: "web",
  missionBrief:
    "真正的「人工智能」聊天很远，但「规则聊天」今天就能做：\n**看用户输入里有没有某些词，有就回对应的话**。\n\n套路：\n· 用 `const history = []` 记录每一句对话（你说了什么、鹦鹉回了什么）\n· 写一个 `reply(msg)` 函数：用一串 `if (msg.includes(\"你好\")) ... else if (msg.includes(\"名字\")) ...` 判断关键词，返回不同回复\n· 写一个 `render()`：先 `ui.clear()`，把 history 里每句都 `ui.text` 出来，再放输入框和「发送」按钮\n· 点「发送」时：把用户的话 push 进 history，把 `reply` 的结果也 push 进去，再 `render()` 刷新\n\n这就是「基于规则的对话系统」的雏形——比死板的固定回复聪明一点，又不像大模型那样难。\n\n挑战：多写几个关键词规则（比如「天气」「作业」「游戏」），让小鹦鹉更懂你。",
  erLingHint:
    "提示：const history=[]; function reply(msg){ let r='我不太明白'; if(msg.includes('你好')) r='你好呀！我是会写代码的小鹦鹉🦜'; else if(msg.includes('名字')) r='我叫二零'; return r; } function render(){ ui.clear(); ui.heading('小鹦鹉聊天'); for(...) ui.text(history[i]); const input=ui.input(...); ui.button('发送',{onClick: const m=ui.value(input); history.push('你：'+m); history.push('鹦鹉：'+reply(m)); render();}); } render();",
  steps: [
    { id: 1, title: "用输入框收集用户消息" },
    { id: 2, title: "按关键词规则生成回复并记录对话" },
    { id: 3, title: "展示完整对话" },
  ],
  codeMode: true,
  defaultCode:
    "// 本地规则聊天机器人：输入一句话，按关键词回复\n" +
    "__runtime.ui.heading(\"小鹦鹉聊天\");\n" +
    "const history = [];\n" +
    "function reply(msg) {\n" +
    "  let r = \"我不太明白，但我在听呢～\";\n" +
    "  if (msg.includes(\"你好\")) r = \"你好呀！我是会写代码的小鹦鹉 🦜\";\n" +
    "  else if (msg.includes(\"名字\")) r = \"我叫二零，是造物星球的一员！\";\n" +
    "  else if (msg.includes(\"游戏\") || msg.includes(\"玩\")) r = \"我们去 /learn 玩游戏吧~\";\n" +
    "  return r;\n" +
    "}\n" +
    "function render() {\n" +
    "  __runtime.ui.clear();\n" +
    "  __runtime.ui.heading(\"小鹦鹉聊天\");\n" +
    "  for (let i = 0; i < history.length; i++) {\n" +
    "    __runtime.ui.text(history[i]);\n" +
    "  }\n" +
    "  const input = __runtime.ui.input({ placeholder: \"说点什么…\" });\n" +
    "  __runtime.ui.button(\"发送\", {\n" +
    "    onClick: function () {\n" +
    "      const msg = __runtime.ui.value(input);\n" +
    "      history.push(\"你：\" + msg);\n" +
    "      history.push(\"鹦鹉：\" + reply(msg));\n" +
    "      render();\n" +
    "    },\n" +
    "  });\n" +
    "}\n" +
    "render();\n",
};
