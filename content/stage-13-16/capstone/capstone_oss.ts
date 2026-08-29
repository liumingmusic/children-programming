import type { CourseProject } from "@/courses";

/**
 * R·毕业项目 · 开源贡献：把平时积累的「小工具函数」整理成一套可分享的代码库，并演示它的用法。
 */
export const capstoneOss: CourseProject = {
  slug: "capstone_oss",
  title: "开源贡献：我的绘图工具库",
  ageGroup: "13-16 岁",
  description: "「开源」就是把自己的代码分享给别人用。请写几个通用的小函数（映射、画点、画网格），再演示怎么调用它们。",
  category: "capstone",
  missionBrief:
    "真正的程序员会把好用的代码「开源」出去，让更多人直接用。毕业项目里，请整理一套「绘图小工具库」：\n\n1. 写几个通用函数（不依赖具体业务，谁都能用）：\n   · mapRange(v, a, b, c, d) —— 把一个数从一个区间映射到另一个区间\n   · dot(x, y, r, color) —— 画一个点\n   · grid() —— 画一张背景网格\n2. 再用循环批量调用它们，做出一个示例画面\n\n这就等于你「开源」了一份迷你绘图库，别人 import 就能用。\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 画点\n· __runtime.drawLine(x1, y1, x2, y2, 颜色, 线宽) —— 画网格线\n· Math.cos / Math.sin 用于坐标换算",
  erLingHint:
    "提示：function mapRange(v,a,b,c,d){ return (v-a)/(b-a)*(d-c)+c; } function dot(x,y,r,color){ __runtime.drawCircle(x,y,r,color); } function grid(){ for(let i=-6;i<=6;i++){ __runtime.drawLine(i*30,-180,i*30,180,'rgba(148,163,184,0.4)',1); } } 先 grid(); 再 for(let i=0;i<=10;i++){ dot(mapRange(i,0,10,-180,180), 100-i*18, 8, '#22C55E'); }",
  steps: [
    { id: 1, title: "写出可复用、通用的工具函数" },
    { id: 2, title: "用循环调用工具函数，演示它的效果" },
    { id: 3, title: "运行，看到工具库画出的示例" },
  ],
  codeMode: true,
  defaultCode:
    "// 开源贡献：我把自己的绘图小工具分享出来（可复用！）\n" +
    "function mapRange(v, a, b, c, d) {\n" +
    "  return (v - a) / (b - a) * (d - c) + c;   // 区间映射\n" +
    "}\n" +
    "function dot(x, y, r, color) {\n" +
    "  __runtime.drawCircle(x, y, r, color);\n" +
    "}\n" +
    "function grid() {\n" +
    "  for (let i = -6; i <= 6; i++) {\n" +
    "    __runtime.drawLine(i * 30, -180, i * 30, 180, \"rgba(148, 163, 184, 0.4)\", 1);\n" +
    "  }\n" +
    "}\n" +
    "__runtime.drawText(-200, 160, \"开源工具：网格 + 映射\", \"#1F2937\", 18);\n" +
    "grid();\n" +
    "for (let i = 0; i <= 10; i++) {\n" +
    "  const x = mapRange(i, 0, 10, -180, 180);   // 用工具函数把序号映射到坐标\n" +
    "  dot(x, 100 - i * 18, 8, \"#22C55E\");\n" +
    "}\n",
};
