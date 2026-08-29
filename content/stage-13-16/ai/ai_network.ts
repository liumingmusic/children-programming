import type { CourseProject } from "@/courses";

/** Q·AI 6：神经网络可视化——把「输入→隐藏→输出」的前向传播画出来。 */
export const aiNetwork: CourseProject = {
  slug: "ai_network",
  title: "神经网络：前向传播",
  ageGroup: "13-16 岁",
  description: "把数据从输入层一层层传到输出层，每个节点把「输入×权重+偏置」再激活。这就是深度学习里「推理」的基本动作。",
  category: "ai",
  missionBrief:
    "神经网络前向传播：\n· 输入层 2 个节点，隐藏层 2 个，输出层 1 个\n· 每条连线有一个权重；信号 = 上层节点值 × 权重\n· 节点的「激活」= 所有输入的加权和再加偏置（这里用简单的符号函数）\n\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 画神经元节点\n· __runtime.drawLine(x1, y1, x2, y2, 颜色, 线宽) —— 画连接线（粗细=权重）\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 标注节点数值\n\n套路：先画网络结构（节点+连线），再用循环把输入逐层乘权重、加偏置，得出输出并标注。",
  erLingHint:
    "提示：先 drawCircle 画 2+2+1 个节点和连线；用两个权重数组 w1/w2；隐藏层 h[k] = x0*w1[k][0] + x1*w1[k][1]；输出 y = h[0]*w2[0] + h[1]*w2[1] + b；最后 drawText 写出输出值。",
  steps: [
    { id: 1, title: "画出三层网络结构" },
    { id: 2, title: "逐层前向计算（输入→隐藏→输出）" },
    { id: 3, title: "标注每个节点数值与最终输出" },
  ],
  codeMode: true,
  defaultCode:
    "// 神经网络前向传播：输入 -> 隐藏 -> 输出\n" +
    "const x = [0.5, 0.8];\n" +
    "const w1 = [[0.7, 0.2], [0.4, 0.9]];\n" +
    "const w2 = [0.6, 0.5];\n" +
    "const b = 0.1;\n" +
    "\n" +
    "// 画网络节点\n" +
    "__runtime.drawCircle(-150, -60, 18, \"#FBBF24\");\n" +
    "__runtime.drawCircle(-150, 60, 18, \"#FBBF24\");\n" +
    "__runtime.drawCircle(0, -60, 18, \"#38BDF8\");\n" +
    "__runtime.drawCircle(0, 60, 18, \"#38BDF8\");\n" +
    "__runtime.drawCircle(150, 0, 18, \"#DC2626\");\n" +
    "\n" +
    "for (let k = 0; k < 2; k++) {\n" +
    "  __runtime.drawLine(-150, -60, 0, -60 + k * 120, \"#94A3B8\", 2);\n" +
    "  __runtime.drawLine(-150, 60, 0, -60 + k * 120, \"#94A3B8\", 2);\n" +
    "}\n" +
    "__runtime.drawLine(0, -60, 150, 0, \"#94A3B8\", 2);\n" +
    "__runtime.drawLine(0, 60, 150, 0, \"#94A3B8\", 2);\n" +
    "\n" +
    "const h = [0, 0];\n" +
    "for (let k = 0; k < 2; k++) h[k] = x[0] * w1[k][0] + x[1] * w1[k][1];\n" +
    "const y = h[0] * w2[0] + h[1] * w2[1] + b;\n" +
    "__runtime.drawText(-150, -78, \"x0=\" + x[0], \"#1F2937\", 12);\n" +
    "__runtime.drawText(-150, 78, \"x1=\" + x[1], \"#1F2937\", 12);\n" +
    "__runtime.drawText(150, 22, \"y=\" + y.toFixed(2), \"#DC2626\", 14);\n" +
    "__runtime.drawText(-90, 130, \"前向传播输出: \" + y.toFixed(2), \"#1F2937\", 16);\n",
};
