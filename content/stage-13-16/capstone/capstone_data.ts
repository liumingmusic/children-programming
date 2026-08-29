import type { CourseProject } from "@/courses";

/**
 * R·毕业项目 · 我的数据作品：学生自选数据，用「数据 → 图形」的映射做成可视化作品。
 */
export const capstoneData: CourseProject = {
  slug: "capstone_data",
  title: "我的数据作品：数据可视化",
  ageGroup: "13-16 岁",
  description: "挑一组你感兴趣的数据（气温、爱好、运动、零花钱……），用柱状图等图表把它们画出来，让别人一眼看懂。",
  category: "capstone",
  missionBrief:
    "数据是今天的「新石油」。毕业项目里，请做一件「把数据变成图」的作品。\n\n思路：\n· 先准备一组数据，存进数组\n· 用循环遍历每个数据，把「数值」换算成「高度 / 位置」，再画出来\n· 别忘了坐标轴说明和标题，让看的人知道你在画什么\n\n舞台坐标：中心 (0,0)，y 向上为正。\n· __runtime.drawRect(x, y, 宽, 高, 颜色) —— 画柱子（柱子的高度由数值决定）\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 标刻度 / 标签\n\n下面用「一周气温」做示范，你可以换成「班级最爱的水果」「每天运动分钟数」等任何数据。",
  erLingHint:
    "提示：const temps=[22,26,24,29,27,30,25]; for(let i=0;i<temps.length;i++){ const h=temps[i]/32*200; const x=-180+i*55; __runtime.drawRect(x,-150,30,h,'#22C55E'); __runtime.drawText(x,-150+h+12,'周'+(i+1),'#1F2937',12); __runtime.drawText(x,-150+h+30,''+temps[i],'#DC2626',12); }",
  steps: [
    { id: 1, title: "准备一组真实或模拟的数据（存进数组）" },
    { id: 2, title: "用循环把数据映射成图形画出来" },
    { id: 3, title: "运行，得到一张清晰的数据作品" },
  ],
  codeMode: true,
  defaultCode:
    "// 我的数据作品：本周气温可视化\n" +
    "const temps = [22, 26, 24, 29, 27, 30, 25];   // 一周气温（℃）\n" +
    "const days = [\"一\", \"二\", \"三\", \"四\", \"五\", \"六\", \"日\"];\n" +
    "const maxT = 32;\n" +
    "const baseY = -150;\n" +
    "__runtime.drawText(-200, 160, \"我的数据作品：本周气温\", \"#1F2937\", 18);\n" +
    "for (let i = 0; i < temps.length; i++) {\n" +
    "  const h = temps[i] / maxT * 200;             // 数值 → 柱子高度\n" +
    "  const x = -180 + i * 55;\n" +
    "  __runtime.drawRect(x, baseY, 30, h, \"#22C55E\");\n" +
    "  __runtime.drawText(x, baseY + h + 12, days[i], \"#1F2937\", 12);\n" +
    "  __runtime.drawText(x, baseY + h + 30, \"\" + temps[i], \"#DC2626\", 12);\n" +
    "}\n",
};
