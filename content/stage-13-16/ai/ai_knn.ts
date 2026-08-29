import type { CourseProject } from "@/courses";

/** Q·AI 2：K 近邻分类——看「最近的邻居」属于哪一边，少数服从多数。 */
export const aiKnn: CourseProject = {
  slug: "ai_knn",
  title: "K 近邻：看邻居是谁",
  ageGroup: "13-16 岁",
  description: "不用训练模型，K 近邻直接看「离得最近的几个点」多数属于哪一类——这就是最朴素的「物以类聚」。",
  category: "ai",
  missionBrief:
    "分类不一定非要「学」一条规则。K 近邻（KNN）的思路是：\n· 已知点分成红队 / 蓝队\n· 来了一个新点，算它到所有已知点的距离\n· 取最近的 K 个点，看它们多数属于哪一类\n\n我们用画布把点画出来，距离用 Math.hypot 计算：\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 画点（红/蓝按类别）\n· Math.hypot(dx, dy) —— 两点间的直线距离\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 标注结果\n\n套路：把所有点收集进一个数组 → 按距离排序 → 统计最近 3 个的类别票数。",
  erLingHint:
    "提示：let all = []; 把 red、blue 都 push 进去并标记类别；用双重循环 + Math.hypot 按距离冒泡排序；再取前 3 个统计 vote0/vote1，谁多就归谁。最后用 drawCircle 画所有点、把新点画成橙色，并 drawText 写出「K=3 最近邻 → 某队」。",
  steps: [
    { id: 1, title: "准备已知类别的点集" },
    { id: 2, title: "按距离排序并统计最近 K 个的票数" },
    { id: 3, title: "把点与新分类结果画出来" },
  ],
  codeMode: true,
  defaultCode:
    "// K 近邻分类：看「最近的邻居」属于哪一边\n" +
    "const red = [[-160, -90], [-120, -40], [-150, 50]];\n" +
    "const blue = [[120, 40], [150, 90], [140, -80]];\n" +
    "const q = [-20, 0];\n" +
    "\n" +
    "const all = [];\n" +
    "for (let i = 0; i < red.length; i++) all.push([red[i][0], red[i][1], 0]);\n" +
    "for (let i = 0; i < blue.length; i++) all.push([blue[i][0], blue[i][1], 1]);\n" +
    "\n" +
    "for (let i = 0; i < all.length; i++) {\n" +
    "  for (let j = i + 1; j < all.length; j++) {\n" +
    "    const d1 = Math.hypot(all[i][0] - q[0], all[i][1] - q[1]);\n" +
    "    const d2 = Math.hypot(all[j][0] - q[0], all[j][1] - q[1]);\n" +
    "    if (d2 < d1) { const t = all[i]; all[i] = all[j]; all[j] = t; }\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "let vote0 = 0, vote1 = 0;\n" +
    "for (let i = 0; i < 3; i++) {\n" +
    "  if (all[i][2] === 0) vote0++; else vote1++;\n" +
    "}\n" +
    "const cls = vote0 > vote1 ? \"红队\" : \"蓝队\";\n" +
    "\n" +
    "for (let i = 0; i < all.length; i++) {\n" +
    "  const c = all[i][2] === 0 ? \"#DC2626\" : \"#16A34A\";\n" +
    "  __runtime.drawCircle(all[i][0], all[i][1], 10, c);\n" +
    "}\n" +
    "__runtime.drawCircle(q[0], q[1], 12, \"#F59E0B\");\n" +
    "__runtime.drawText(-160, 130, \"K=3 最近邻 -> \" + cls, \"#1F2937\", 16);\n",
};
