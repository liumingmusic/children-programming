import type { CourseProject } from "@/courses";

/**
 * N·数据可视化 · 词云：数值不只可以编码成「大小」，还可以编码成「字号」。
 * 最大的词放正中，其余用 cos / sin 绕着它排一圈（半径交错，避免挤在一起）。
 */
export const datavizWordcloud: CourseProject = {
  slug: "dataviz_wordcloud",
  title: "词云：让字号替数据说话",
  ageGroup: "13-16 岁",
  description: "换一种编码方式：不画高矮、不画角度，而是让字的大小代表数值——越大越重要。",
  category: "dataviz",
  missionBrief:
    "前面几关我们把数值编码成了**高度**（柱子）、**位置**（折线）、**角度**（饼图）。\n词云用了第四种：**字号**——数字越大，字就越大，一眼就知道谁最重要。\n\n排版思路很简单：\n· 最重要的那个词放正中间\n· 其余的词绕着它排成一圈：用 `Math.cos` / `Math.sin` 算出每个位置的角度坐标\n· 半径交错一下（一半远、一半近），词就不容易挤在一起\n\n有个容易忽略的细节：`drawText` 是从**左边**开始写的。\n想让一个词居中，得先估算它的宽度再往左挪一半——中文里一个字大约就是一个字号那么宽，\n所以 `x = 中心 - 字号 * 字数 / 2`。\n\n这一关也提醒我们：可视化不只是「把数字画出来」，更是**选一种最合适的视觉通道**去表达它。\n比重要性用字号，比趋势用折线，比占比用饼图——选错了，读者就费劲。",
  erLingHint:
    "提示：循环里先取 size = weights[i]；i === 0 时放正中（x = -30 - size * 字数 / 2）；否则用 a = (i-1) / (words.length-1) * Math.PI * 2 和 R = 100 + (i % 2) * 34 算出绕圈位置，再减去半个词宽让它居中。",
  steps: [
    { id: 1, title: "用数组存下词语与它们的权重" },
    { id: 2, title: "让字号随权重变化，并绕圈排版" },
    { id: 3, title: "运行，看到词云" },
  ],
  codeMode: true,
  defaultCode:
    "// 词云：数值 → 字号，最重要的词最大\n" +
    "const words = [\"代码\", \"循环\", \"函数\", \"变量\", \"数组\", \"积木\", \"画笔\", \"音乐\"];\n" +
    "const weights = [32, 27, 24, 21, 19, 22, 17, 20];      // 每个词的权重（直接当字号用）\n" +
    "const colors = [\"#F59E0B\", \"#38bdf8\", \"#22C55E\", \"#A78BFA\", \"#F472B6\", \"#2DD4BF\", \"#E24B4A\", \"#94A3B8\"];\n" +
    "\n" +
    "for (let i = 0; i < words.length; i++) {\n" +
    "  const size = weights[i];\n" +
    "  const half = size * words[i].length / 2;              // 半个词宽（用来居中）\n" +
    "  let x, y;\n" +
    "  if (i === 0) {\n" +
    "    x = -30 - half;                                     // 最重要的词放正中\n" +
    "    y = 6 - size / 2;\n" +
    "  } else {\n" +
    "    const a = (i - 1) / (words.length - 1) * Math.PI * 2;   // 绕圈的角度\n" +
    "    const R = 100 + (i % 2) * 34;                       // 半径交错，避免挤在一起\n" +
    "    x = -30 + R * Math.cos(a) - half;\n" +
    "    y = R * Math.sin(a) - size / 2;\n" +
    "  }\n" +
    "  __runtime.drawText(x, y, words[i], colors[i], size);\n" +
    "}\n" +
    "__runtime.drawText(-225, -165, \"这学期我学会的词\", \"#94A3B8\", 15);\n",
};
