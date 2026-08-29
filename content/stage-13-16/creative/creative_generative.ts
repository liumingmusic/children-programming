import type { CourseProject } from "@/courses";

/**
 * O·创意编程 · 生成艺术（万花尺）：用参数方程画一条会自己绕回来的曲线。
 * 三个参数 R / r / d 决定形状，改一个数字就是一幅全新的作品。
 */
export const creativeGenerative: CourseProject = {
  slug: "creative_generative",
  title: "生成艺术：会绕回来的曲线",
  ageGroup: "13-16 岁",
  description: "用一个参数方程和三个旋钮画曲线——改一个数字就是一幅全新作品，这就是生成艺术的魅力。",
  category: "creative",
  missionBrief:
    "小时候玩过「万花尺」吗？一个塑料齿轮在小圆里滚动，笔尖插在孔里，转几圈就能画出一朵精细的花。\n这一关我们用数学把它复现出来——它有个专门的名字，叫**内外摆线**。\n\n公式看着长，其实只有两行：\n· x = (R - r) * Math.cos(a) + d * Math.cos((R - r) / r * a);\n· y = (R - r) * Math.sin(a) - d * Math.sin((R - r) / r * a);\n\n三个参数就是三个「旋钮」：\n· R —— 大圆半径（外面的圈）\n· r —— 小圆半径（滚动的那个）\n· d —— 笔尖到小圆中心的距离\n\n让 a 一点点增大，把每个位置画成一个小点，曲线就出现了。\n\n**关键技巧：颜色跟着 a 变。**\n画布支持 CSS 颜色写法，所以可以直接拼出渐变色：\n`\"hsl(\" + (a * 18) % 360 + \", 85%, 62%)\"` —— 色相一点点推移，画出来就是一条彩虹色的线。\n\n另一个小机关：这条曲线要绕够圈数才会**闭合**（首尾接上）。\n圈数取决于 (R - r) / r 这个比值，这里是 75 / 45 = 5 / 3，所以要绕 3 圈才回到起点。\n\n试试改改 R / r / d，每个组合都是一幅新作品。",
  erLingHint:
    "提示：定 R = 120、r = 45、d = 70；循环里 a = t * 0.05，按上面的公式算出 x / y，drawCircle 画点，颜色用 \"hsl(\" + (a * 18) % 360 + \", 85%, 62%)\" 拼出渐变。",
  steps: [
    { id: 1, title: "用参数方程算出曲线上的每个点" },
    { id: 2, title: "让颜色跟着角度渐变" },
    { id: 3, title: "运行，看到曲线绕回来闭合" },
  ],
  codeMode: true,
  defaultCode:
    "// 生成艺术：万花尺（内外摆线）—— 三个参数决定一幅作品\n" +
    "const R = 120;          // 大圆半径\n" +
    "const r = 45;           // 小圆半径\n" +
    "const d = 70;           // 笔尖到小圆中心的距离\n" +
    "\n" +
    "for (let t = 0; t < 377; t++) {     // 377 步 ≈ 3 圈，正好让曲线闭合\n" +
    "  const a = t * 0.05;\n" +
    "  const x = (R - r) * Math.cos(a) + d * Math.cos((R - r) / r * a);\n" +
    "  const y = (R - r) * Math.sin(a) - d * Math.sin((R - r) / r * a);\n" +
    "  const hue = (a * 18) % 360;       // 颜色跟着角度走，形成渐变\n" +
    "  __runtime.drawCircle(x, y, 2.5, \"hsl(\" + hue + \", 85%, 62%)\");\n" +
    "}\n",
};
