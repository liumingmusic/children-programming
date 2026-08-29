import type { CourseProject } from "@/courses";

/** Q·AI 5：推荐系统——靠「和你相似的人」的喜好，猜你也会喜欢什么。 */
export const aiRecommend: CourseProject = {
  slug: "ai_recommend",
  title: "推荐系统：朋友的喜好",
  ageGroup: "13-16 岁",
  description: "协同过滤：不分析物品本身，而是看「和你口味相似的人」喜欢什么，把 TA 们爱看、你还没看过的推荐给你。",
  category: "ai",
  missionBrief:
    "推荐系统常用「协同过滤」：\n· 每个人用一组数字描述「喜好向量」(对几部电影的评分)\n· 用余弦相似度比较两个人有多像：越像，点积越大\n· 找最相似的几个人，把他们喜欢而你没看过的，推荐给你\n\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 画用户节点（橙色=你）\n· __runtime.drawLine(x1, y1, x2, y2, 颜色, 线宽) —— 连线粗细表示相似度\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 标注推荐结果\n\n套路：算你和每个用户的余弦相似度 → 找最相似的 → 累加相似用户的评分 → 推荐没看过且分最高的。",
  erLingHint:
    "提示：me 是喜好向量；用 dot/length 算余弦相似度；遍历其他用户取最大相似度 simMax 与对应评分；把该用户评过而你未评的 item 累加；再用 drawText 写出「最像的是用户 X，推荐你 item Y」。",
  steps: [
    { id: 1, title: "准备用户喜好向量（评分）" },
    { id: 2, title: "用余弦相似度找出最像的人" },
    { id: 3, title: "汇总相似者的喜好并给出推荐" },
  ],
  codeMode: true,
  defaultCode:
    "// 推荐系统：靠「与你相似的人」猜你喜欢什么\n" +
    "const items = [\"科幻\", \"喜剧\", \"惊悚\", \"动画\"];\n" +
    "const me = [5, 1, 4, 2];\n" +
    "const users = [[4, 2, 5, 1], [1, 5, 1, 3], [5, 0, 4, 2], [2, 4, 2, 5]];\n" +
    "\n" +
    "function dot(a, b) {\n" +
    "  let s = 0;\n" +
    "  for (let i = 0; i < a.length; i++) s = s + a[i] * b[i];\n" +
    "  return s;\n" +
    "}\n" +
    "function len(a) {\n" +
    "  let s = 0;\n" +
    "  for (let i = 0; i < a.length; i++) s = s + a[i] * a[i];\n" +
    "  return Math.sqrt(s);\n" +
    "}\n" +
    "\n" +
    "let best = -1, bestSim = -1;\n" +
    "for (let u = 0; u < users.length; u++) {\n" +
    "  const sim = dot(me, users[u]) / (len(me) * len(users[u]));\n" +
    "  if (sim > bestSim) { bestSim = sim; best = u; }\n" +
    "}\n" +
    "\n" +
    "let rec = -1, recScore = -1;\n" +
    "for (let i = 0; i < items.length; i++) {\n" +
    "  if (me[i] === 0 && users[best][i] > recScore) { recScore = users[best][i]; rec = i; }\n" +
    "}\n" +
    "__runtime.drawCircle(-160, 120, 14, \"#F59E0B\");\n" +
    "__runtime.drawText(-175, 145, \"你\", \"#1F2937\", 14);\n" +
    "__runtime.drawText(-160, 95, \"最像用户 \" + best + \" 推荐: \" + items[rec], \"#DC2626\", 16);\n",
};
