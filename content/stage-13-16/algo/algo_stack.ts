import type { CourseProject } from "@/courses";

/** L·算法 3：栈与队列——后进先出 vs 先进先出，用数组模拟。 */
export const algoStack: CourseProject = {
  slug: "algo_stack",
  title: "栈与队列：两种排队方式",
  ageGroup: "13-16 岁",
  description: "栈是「后进先出」（像一摞盘子），队列是「先进先出」（像排队买票）。用数组的 push/pop/shift 来体会。",
  category: "algo",
  missionBrief:
    "两种最基础的数据结构：\n· 栈 Stack：后进先出。最后放进去的，最先拿出来——用 push 压栈、pop 弹栈。\n· 队列 Queue：先进先出。先来的先走——用 push 入队、shift 出队。\n\nJavaScript 的数组天生就能做这两件事：\n· arr.push(x) —— 在末尾加一个\n· arr.pop() —— 拿走末尾那个（栈）\n· arr.shift() —— 拿走开头那个（队列）\n\n这一关我们重点演示「栈」：一个一个入栈，再弹出栈顶，把每个状态画出来。",
  erLingHint:
    "提示：let stack = []; 然后 stack.push(\"A\"); 画一次；stack.push(\"B\"); 画一次；stack.push(\"C\"); 画一次；最后 const top = stack.pop(); 画一次。drawStack 里用 for 循环把 stack[i] 从基线往上叠成方块。",
  steps: [
    { id: 1, title: "准备一个空数组当作栈" },
    { id: 2, title: "用 push 入栈、用 pop 出栈" },
    { id: 3, title: "运行，看栈的「后进先出」过程" },
  ],
  codeMode: true,
  defaultCode:
    "// 栈（Stack）：后进先出，最后进来的最先出去\n" +
    "let stack = [];\n" +
    "const baseY = -150, bw = 50;\n" +
    "\n" +
    "function drawStack(label) {\n" +
    "  __runtime.clearCanvas();\n" +
    "  for (let i = 0; i < stack.length; i++) {\n" +
    "    const y = baseY + i * 36;\n" +
    "    __runtime.drawRect(-100, y, bw, 30, \"#F59E0B\");\n" +
    "    __runtime.drawText(-92, y + 22, stack[i], \"#1F2937\", 16);\n" +
    "  }\n" +
    "  __runtime.drawText(-100, baseY - 30, label, \"#22C55E\", 16);\n" +
    "}\n" +
    "\n" +
    "stack.push(\"A\"); drawStack(\"入栈 A\"); __runtime.wait(0.5);\n" +
    "stack.push(\"B\"); drawStack(\"入栈 B\"); __runtime.wait(0.5);\n" +
    "stack.push(\"C\"); drawStack(\"入栈 C\"); __runtime.wait(0.5);\n" +
    "const top = stack.pop(); drawStack(\"出栈 \" + top); __runtime.wait(0.5);\n" +
    "__runtime.drawText(-100, 150, \"栈顶出栈：\" + top, \"#FB923C\", 18);\n",
};
