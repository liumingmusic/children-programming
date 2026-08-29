import type { CourseProject } from "@/courses";

/** Q·AI 4：感知机——通过「试错」学出一条分界线，把两类点分开（神经网络的基石）。 */
export const aiPerceptron: CourseProject = {
  slug: "ai_perceptron",
  title: "感知机：自己学会画线",
  ageGroup: "13-16 岁",
  description: "感知机是最简单的「神经网络神经元」：看一批带标签的点，反复修正权重，直到能分开两类。",
  category: "ai",
  missionBrief:
    "感知机是神经网络的基本单元。它做的事是：\n· 每个输入乘一个权重 w，加一个偏置 b，得到分数\n· 分数 >= 0 判为 1，否则判为 0\n· 分错了就「改权重」：把权重朝正确的方向挪一点点\n\n这就是「用数据训练」的雏形。\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 画数据点（颜色代表真实类别）\n· __runtime.drawLine(x1, y1, x2, y2, 颜色, 线宽) —— 画学出来的分界线\n· 权重更新写法：w = w + 误差 * 输入（误差 = 真实标签 - 预测）\n\n套路：eps 轮里遍历每个点，预测、算误差、错了就更新 w0/w1/b。",
  erLingHint:
    "提示：let w0=0,w1=0,b=0; 双重循环：预测 pred = (p[0]*w0+p[1]*w1+b)>=0?1:0; err = p[2]-pred; if(err!==0){ w0=w0+err*p[0]; w1=w1+err*p[1]; b=b+err; }。最后画点 + 用 w0*x+w1*y+b=0 求两点画分界线。",
  steps: [
    { id: 1, title: "准备带标签的数据点" },
    { id: 2, title: "用循环训练：预测→算误差→更新权重" },
    { id: 3, title: "画出数据点与学出的分界线" },
  ],
  codeMode: true,
  defaultCode:
    "// 感知机：通过「试错」学会一条分界线，把两类点分开\n" +
    "const pts = [[-150, -70, 0], [-100, 40, 0], [120, -40, 1], [160, 90, 1]];\n" +
    "let w0 = 0, w1 = 0, b = 0;\n" +
    "\n" +
    "for (let epoch = 0; epoch < 30; epoch++) {\n" +
    "  for (let i = 0; i < pts.length; i++) {\n" +
    "    const p = pts[i];\n" +
    "    const pred = (p[0] * w0 + p[1] * w1 + b) >= 0 ? 1 : 0;\n" +
    "    const err = p[2] - pred;\n" +
    "    if (err !== 0) {\n" +
    "      w0 = w0 + err * p[0];\n" +
    "      w1 = w1 + err * p[1];\n" +
    "      b = b + err;\n" +
    "    }\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "for (let i = 0; i < pts.length; i++) {\n" +
    "  const c = pts[i][ 2] === 0 ? \"#DC2626\" : \"#16A34A\";\n" +
    "  __runtime.drawCircle(pts[i][0], pts[i][1], 12, c);\n" +
    "}\n" +
    "if (Math.abs(w1) > 0.001) {\n" +
    "  const y1 = -(w0 * -200 + b) / w1;\n" +
    "  const y2 = -(w0 * 200 + b) / w1;\n" +
    "  __runtime.drawLine(-200, y1, 200, y2, \"#F59E0B\", 3);\n" +
    "}\n" +
    "__runtime.drawText(-170, 150, \"感知机已学会分界线\", \"#1F2937\", 16);\n",
};
