import type { CourseProject } from "@/courses";

/**
 * R·毕业项目 · 我的创意工具：把常用画法封装成「可复用的工具函数」，再用它批量生成图案。
 */
export const capstoneTool: CourseProject = {
  slug: "capstone_tool",
  title: "我的创意工具：对称图案生成器",
  ageGroup: "13-16 岁",
  description: "写一个「画图小工具」函数（比如沿圆周均匀摆放点），再用循环调用它，一键生成漂亮的对称图案。",
  category: "capstone",
  missionBrief:
    "「工具思维」是编程里超重要的能力：把重复的事写成一个函数，以后只要一行就能调用。\n\n这次请做一个「创意工具」：\n1. 先写一个工具函数（比如 drawRing(cx, cy, r, n) 在一个圆上均匀画 n 个点）\n2. 再用循环，调用这个工具画出一圈又一圈的图案\n\n舞台坐标：中心 (0,0)，y 向上为正；Math.cos / Math.sin 能帮你把「角度」变成「坐标」。\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 画点 / 圆\n· __runtime.drawLine(x1, y1, x2, y2, 颜色, 线宽) —— 连线\n\n下面用「万花尺」做示范，你可以改成雪花、花纹、星座图……",
  erLingHint:
    "提示：function ring(cx,cy,r,n){ for(let k=0;k<n;k++){ const a=k/n*Math.PI*2; __runtime.drawCircle(cx+Math.cos(a)*r, cy+Math.sin(a)*r, 6, '#F59E0B'); } } 再 for(let rr=1;rr<=5;rr++){ ring(0,0,rr*22,12); }",
  steps: [
    { id: 1, title: "写一个可复用的画图工具函数" },
    { id: 2, title: "用循环调用工具，生成一幅图案" },
    { id: 3, title: "运行，看到完整创意作品" },
  ],
  codeMode: true,
  defaultCode:
    "// 我的创意工具：万花尺（可复用的「画一圈点」工具函数）\n" +
    "function ring(cx, cy, r, n) {\n" +
    "  for (let k = 0; k < n; k++) {\n" +
    "    const a = k / n * Math.PI * 2;                 // 把序号变成角度\n" +
    "    const x = cx + Math.cos(a) * r;\n" +
    "    const y = cy + Math.sin(a) * r;\n" +
    "    __runtime.drawCircle(x, y, 6, \"#F59E0B\");\n" +
    "  }\n" +
    "}\n" +
    "__runtime.drawText(-200, 160, \"我的创意工具：万花尺\", \"#1F2937\", 18);\n" +
    "for (let rr = 1; rr <= 5; rr++) {\n" +
    "  ring(0, 0, rr * 22, 12);                       // 调用工具，一圈圈画出去\n" +
    "}\n",
};
