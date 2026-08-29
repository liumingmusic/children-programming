import type { CourseProject } from "@/courses";

/** Q·AI 1：决策树分类——用「如果…就…」把特征映射到类别，并把决策路径画出来。 */
export const aiTree: CourseProject = {
  slug: "ai_tree",
  title: "决策树：会思考的如果",
  ageGroup: "13-16 岁",
  description: "用嵌套的「如果…就…」判断来做分类：先看一个特征，再看下一个，最终得出结果——这就是决策树的核心。",
  category: "ai",
  missionBrief:
    "人工智能常常要把「情况」分成几类。决策树就是一串嵌套的判断：\n· 先看第一个特征，决定往左还是往右\n· 再看下一个特征，继续分\n· 走到叶子就得到分类结果\n\n我们用「动物识别」来体会：\n· 会飞吗？会 → 有毛吗？ → 蝙蝠 / 麻雀\n· 不会飞 → 有毛吗？ → 小猫 / 小鱼\n\n舞台坐标：中心 (0,0)，往下是负 y。用画布把树画出来：\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 画节点（圆）\n· __runtime.drawLine(x1, y1, x2, y2, 颜色, 线宽) —— 画分支\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 标结果\n\n先写一个 classify(s) 函数（用嵌套 if / else），再把它画出来。",
  erLingHint:
    "提示：const sample = { fly: true, fur: true }; 写一个 function classify(s){ if(s.fly){ if(s.fur) return \"蝙蝠\"; return \"麻雀\"; } else { if(s.fur) return \"小猫\"; return \"小鱼\"; } }，然后 drawCircle 画节点、drawLine 画分支，最后 drawText 写「分类结果: 」+ classify(sample)。",
  steps: [
    { id: 1, title: "写一个 classify 分类函数" },
    { id: 2, title: "用嵌套 if / else 表达决策路径" },
    { id: 3, title: "把决策树与分类结果画出来" },
  ],
  codeMode: true,
  defaultCode:
    "// 决策树：用「如果…就…」做出分类判断\n" +
    "const sample = { fly: true, fur: true };\n" +
    "\n" +
    "function classify(s) {\n" +
    "  if (s.fly) {\n" +
    "    if (s.fur) return \"蝙蝠\";\n" +
    "    return \"麻雀\";\n" +
    "  } else {\n" +
    "    if (s.fur) return \"小猫\";\n" +
    "    return \"小鱼\";\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "const result = classify(sample);\n" +
    "\n" +
    "// 把决策树画出来\n" +
    "__runtime.drawText(-160, 135, \"决策树分类\", \"#1F2937\", 18);\n" +
    "__runtime.drawCircle(0, 80, 16, \"#F59E0B\");\n" +
    "__runtime.drawLine(-16, 80, -110, 20, \"#64748B\", 2);\n" +
    "__runtime.drawLine( 16, 80, 110, 20, \"#64748B\", 2);\n" +
    "__runtime.drawCircle(-110, 20, 16, \"#22C55E\");\n" +
    "__runtime.drawCircle(110, 20, 16, \"#22C55E\");\n" +
    "__runtime.drawText(-130, 24, \"猫\", \"#FFFFFF\", 12);\n" +
    "__runtime.drawText(92, 24, \"蝙蝠\", \"#FFFFFF\", 12);\n" +
    "__runtime.drawText(-160, -30, \"输入: 会飞 + 有毛\", \"#1F2937\", 16);\n" +
    "__runtime.drawText(-160, -65, \"分类结果: \" + result, \"#DC2626\", 20);\n",
};
