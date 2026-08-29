import type { CourseProject } from "@/courses";

/** Q·AI 3：朴素贝叶斯直觉——用「关键词命中数」判断一封邮件是广告还是正常。 */
export const aiBayes: CourseProject = {
  slug: "ai_bayes",
  title: "朴素贝叶斯：猜一猜这封信",
  ageGroup: "13-16 岁",
  description: "不真正算概率，也能量出「广告味」：数一数一封信里广告词和正常词各出现了几个，谁多就归谁。",
  category: "ai",
  missionBrief:
    "垃圾邮件过滤器背后常有一个经典算法——朴素贝叶斯。这里我们做一个超简化版：\n· 准备两组「词表」：广告词、正常词\n· 看一封新邮件，统计它命中了哪组词更多\n· 命中多的一侧就是它的「类别」\n\n这抓住了核心思想：用「证据计数」代替「理解语义」。\n· __runtime.drawRect(x, y, 宽, 高, 颜色) —— 画计分条（高度代表命中数）\n· msg.includes(词) —— 判断邮件里有没有这个词\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 标注判定\n\n套路：两个 for 循环分别统计 spamScore / normalScore，再比大小。",
  erLingHint:
    "提示：let spamScore=0; for(...) if(msg.includes(spamWords[i])) spamScore++; 同理统计 normalScore；最后 label = spamScore>normalScore ? \"广告\":\"正常\"。用 drawRect 把两个分数画成柱状条，再 drawText 写出判定。",
  steps: [
    { id: 1, title: "准备广告词与正常词两组词表" },
    { id: 2, title: "统计邮件命中两组词的数量" },
    { id: 3, title: "按计数大小判定并画出结果" },
  ],
  codeMode: true,
  defaultCode:
    "// 朴素贝叶斯直觉：看一封邮件里「广告词」和「正常词」哪个更多\n" +
    "const spamWords = [\"免费\", \"优惠\", \"中奖\", \"点击\", \"赚钱\"];\n" +
    "const normalWords = [\"你好\", \"会议\", \"报告\", \"午餐\", \"项目\"];\n" +
    "const msg = \"点击链接免费中奖\";\n" +
    "\n" +
    "let spamScore = 0;\n" +
    "for (let i = 0; i < spamWords.length; i++) {\n" +
    "  if (msg.includes(spamWords[i])) spamScore = spamScore + 1;\n" +
    "}\n" +
    "let normalScore = 0;\n" +
    "for (let i = 0; i < normalWords.length; i++) {\n" +
    "  if (msg.includes(normalWords[i])) normalScore = normalScore + 1;\n" +
    "}\n" +
    "const label = spamScore > normalScore ? \"广告\" : \"正常\";\n" +
    "\n" +
    "__runtime.drawRect(-180, -150, 140, spamScore * 30, \"#DC2626\");\n" +
    "__runtime.drawRect(20, -150, 140, normalScore * 30, \"#16A34A\");\n" +
    "__runtime.drawText(-180, -165, \"广告词: \" + spamScore, \"#1F2937\", 14);\n" +
    "__runtime.drawText(20, -165, \"正常词: \" + normalScore, \"#1F2937\", 14);\n" +
    "__runtime.drawText(-180, 150, \"判定: \" + label, \"#1F2937\", 18);\n",
};
