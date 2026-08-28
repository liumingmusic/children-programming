import type { CourseProject } from "@/courses";

/** 计算小工具：算出结果再用 say 报出来——程序第一次「有用」。 */
export const jsTool: CourseProject = {
  slug: "js_tool",
  title: "计算小工具",
  ageGroup: "13-16 岁",
  description: "写一个真正有用的小程序：算出结果，再让二零把答案说出来——这就是工具的雏形。",
  category: "js",
  missionBrief:
    "代码不只是让角色动，更能帮你算东西。这次我们做一个「长方形面积计算器」。\n\n· * 是乘号，/ 是除号，+ 加，- 减\n· const area = length * width; —— 把算出来的结果存进变量\n· __runtime.say(...) 可以把结果说出来，用 + 把文字和数字拼在一起\n\n注意：__runtime.say 要的是一段文字，所以要把数字拼进文字里，比如 \"面积是 \" + area。\n\n试着改改 length 和 width 的值，看看二零报出的答案对不对；再试试算周长 (length + width) * 2。",
  erLingHint:
    "提示：先 const length = 8; const width = 5; 再 const area = length * width; 最后 __runtime.say(\"面积是 \" + area, 3); 数字和文字要用 + 拼起来，不能直接写在一起。",
  steps: [
    { id: 1, title: "写一段计算逻辑" },
    { id: 2, title: "用 say 把结果告诉二零" },
    { id: 3, title: "运行看看结果" },
  ],
  codeMode: true,
  defaultCode:
    "// 长方形面积计算器：算完让二零把答案说出来\n" +
    "const length = 8;\n" +
    "const width = 5;\n" +
    "const area = length * width;\n" +
    '__runtime.say("面积是 " + area, 3);\n',
};
