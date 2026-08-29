import type { CourseProject } from "@/courses";

/**
 * O·创意编程 · 曼陀罗：用「对称」把一个简单的动作复制成一整幅图案。
 * 三个平行数组（半径 / 数量 / 大小）描述每一层，双层循环按极坐标摆放。
 */
export const creativeMandala: CourseProject = {
  slug: "creative_mandala",
  title: "曼陀罗：一圈一圈复制出对称",
  ageGroup: "13-16 岁",
  description: "画一个圆不难，难的是把它复制成一整幅对称的图案——用一个循环加极坐标就能做到。",
  category: "creative",
  missionBrief:
    "曼陀罗是一种一圈圈向外展开的对称图案。它看起来复杂，但道理只有一句：\n**把同一个动作，绕着中心重复很多次。**\n\n关键工具是极坐标——你已经用过两次了（圆周运动、饼图）：\n· x = R * Math.cos(a);\n· y = R * Math.sin(a);\n\n只要让角度 a 在 0 到 2π（一整圈）之间**均匀取值**，同样的小圆就会整齐地排成一圈：\n· a = i / 数量 * Math.PI * 2;   // 第 i 个占整圈的第几份\n\n然后做很多层：每一层半径更大、数量更多、圆更小。\n用三个平行数组描述这些层（radii / counts / sizes），外层循环走层、内层循环走这一圈里的每个圆。\n\n这就是程序比手画强的地方：想改成 5 层、每层 30 个，只要改数组里的数字，一瞬间就重画好了。\n\n试试改改数组里的数字，或者把小圆换成线段（从中心画到边缘），会得到完全不同的花纹。",
  erLingHint:
    "提示：建 radii / counts / sizes 三个数组；外层循环每一层，内层循环用 a = i / counts[k] * Math.PI * 2 算出角度，再用 cos / sin 换成坐标，drawCircle 画小圆；最后在中心画一个大圆收尾。",
  steps: [
    { id: 1, title: "用数组描述每一层的半径、数量与大小" },
    { id: 2, title: "双层循环：用 cos / sin 把小圆排成一圈圈" },
    { id: 3, title: "运行，看到对称的曼陀罗" },
  ],
  codeMode: true,
  defaultCode:
    "// 曼陀罗：把同一个动作绕中心重复很多次\n" +
    "const radii = [42, 74, 106, 138];              // 每一层的半径\n" +
    "const counts = [8, 12, 18, 24];                // 每一层画几个\n" +
    "const sizes = [7, 6, 5, 4];                    // 每一层小圆的大小\n" +
    "const colors = [\"#F59E0B\", \"#38bdf8\", \"#22C55E\", \"#A78BFA\"];\n" +
    "\n" +
    "for (let k = 0; k < radii.length; k++) {        // 外层：一层一层往外\n" +
    "  for (let i = 0; i < counts[k]; i++) {         // 内层：这一圈里的每一个\n" +
    "    const a = i / counts[k] * Math.PI * 2;      // 均匀分完一整圈\n" +
    "    const x = radii[k] * Math.cos(a);\n" +
    "    const y = radii[k] * Math.sin(a);\n" +
    "    __runtime.drawCircle(x, y, sizes[k], colors[k]);\n" +
    "  }\n" +
    "}\n" +
    "__runtime.drawCircle(0, 0, 16, \"#FBBF24\");      // 中心\n",
};
