import type { CourseProject } from "@/courses";

/** L·算法 7：字符串处理——统计一段文字里每个字母出现的次数。 */
export const algoString: CourseProject = {
  slug: "algo_string",
  title: "字符串处理：字母频次统计",
  ageGroup: "13-16 岁",
  description: "遍历一段文字的每一个字符，用「计数表」记录每个字母出现了几次，再把结果画成柱状图。",
  category: "algo",
  missionBrief:
    "字符串就是一串字符。很多文本任务都要「挨个看字符」：统计词频、找回文、替换字符……\n\n这一关做最经典的「频次统计」：\n· 准备一个空对象 counts 当计数表\n· 用 for 循环遍历字符串的每个字符 s[i]\n· 第一次见到某字母：counts[c] = 0 再 +1；之后直接 counts[c] = counts[c] + 1\n· 最后把每个字母的出现次数画成柱子\n\n这是「用数据结构（哈希表/对象）来计数」的入门，几乎是所有词频分析的基础。",
  erLingHint:
    "提示：let s = \"helloworld\"; const counts = {}; 用 for (let i=0; i<s.length; i++) 遍历，c = s[i]，if (counts[c]===undefined) counts[c]=0; counts[c]=counts[c]+1。最后把 Object.keys(counts) 画成柱子。",
  steps: [
    { id: 1, title: "准备一段字符串" },
    { id: 2, title: "遍历每个字符并用计数表统计频次" },
    { id: 3, title: "运行，画出每个字母的出现次数" },
  ],
  codeMode: true,
  defaultCode:
    "// 字符串处理：统计每个字母出现的次数\n" +
    "let s = \"helloworld\";\n" +
    "const counts = {};\n" +
    "for (let i = 0; i < s.length; i++) {\n" +
    "  const c = s[i];\n" +
    "  if (counts[c] === undefined) counts[c] = 0;\n" +
    "  counts[c] = counts[c] + 1;\n" +        // 频次累加
    "}\n" +
    "const baseY = -150, bw = 40;\n" +
    "const keys = Object.keys(counts);\n" +
    "function draw() {\n" +
    "  __runtime.clearCanvas();\n" +
    "  for (let i = 0; i < keys.length; i++) {\n" +
    "    const k = keys[i];\n" +
    "    const x = -200 + i * (bw + 10);\n" +
    "    const h = counts[k] * 30;\n" +
    "    __runtime.drawRect(x, baseY, bw, h, \"#F59E0B\");\n" +
    "    __runtime.drawText(x + 12, baseY + h + 14, k, \"#1F2937\", 16);\n" +
    "    __runtime.drawText(x + 12, baseY + h + 32, counts[k], \"#1F2937\", 14);\n" +
    "  }\n" +
    "}\n" +
    "draw();\n" +
    "__runtime.drawText(-200, 150, \"字母频次统计完成\", \"#22C55E\", 18);\n",
};
