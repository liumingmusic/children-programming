import type { CourseProject } from "@/courses";

/**
 * R·毕业项目 · 我的作品集：用画布把整个阶段的作品整理成一张「展板」，回顾自己的成长。
 */
export const capstonePortfolio: CourseProject = {
  slug: "capstone_portfolio",
  title: "我的作品集：成长展板",
  ageGroup: "13-16 岁",
  description: "把这一路学过的作品（代码、物理、数据、创意、网页、AI）整理成一张画布展板，做成属于你的「作品集」。",
  category: "capstone",
  missionBrief:
    "毕业啦！最后一件事：把你的作品「展示」出来。就像画家办画展，我们也用画布做一张「作品集展板」。\n\n做法：\n· 用数组存下你做过的主题\n· 用循环把每个作品画成一张「卡片」（矩形 + 文字）\n· 加上标题和一句总结，让大家一眼看懂你都会什么\n\n舞台坐标：中心 (0,0)，y 向上为正。\n· __runtime.drawRect(x, y, 宽, 高, 颜色) —— 画卡片底\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 写标题 / 总结\n\n你可以把卡片换成自己的真实作品名，甚至给每张卡画点小图标。",
  erLingHint:
    "提示：const works=['代码','物理','数据','创意','网页','AI']; for(let i=0;i<works.length;i++){ const x=-190+i*65; __runtime.drawRect(x,-30,55,80,'#FBBF24'); __runtime.drawText(x+10,20,works[i],'#1F2937',14); } __runtime.drawText(-200,160,'我的作品集','#1F2937',20); __runtime.drawText(-200,-130,'从积木到代码，我做了一大堆作品！','#DC2626',16);",
  steps: [
    { id: 1, title: "把作品主题画成展板卡片" },
    { id: 2, title: "用循环批量生成多张作品卡片" },
    { id: 3, title: "运行，看到完整的作品集" },
  ],
  codeMode: true,
  defaultCode:
    "// 我的作品集：把学过的作品整理成一张展板\n" +
    "__runtime.drawText(-200, 160, \"我的作品集\", \"#1F2937\", 20);\n" +
    "const works = [\"代码\", \"物理\", \"数据\", \"创意\", \"网页\", \"AI\"];\n" +
    "for (let i = 0; i < works.length; i++) {\n" +
    "  const x = -190 + i * 65;\n" +
    "  __runtime.drawRect(x, -30, 55, 80, \"#FBBF24\");   // 一张卡片\n" +
    "  __runtime.drawText(x + 8, 20, works[i], \"#1F2937\", 14);\n" +
    "}\n" +
    "__runtime.drawText(-200, -130, \"从积木到代码，我做了好多作品！\", \"#DC2626\", 16);\n",
};
