import type { CourseProject } from "@/courses";

/**
 * O·创意编程 · 随机艺术：用 Math.random() 制造变化，用规则约束它——
 * 纯随机会变成噪点，规则 + 随机才有「每次都不同、但每次都好看」的生成艺术。
 */
export const creativeRandom: CourseProject = {
  slug: "creative_random",
  title: "随机艺术：规则加一点意外",
  ageGroup: "13-16 岁",
  description: "用随机数让每次运行都不一样，再用规则把它约束住——这正是生成艺术的窍门。",
  category: "creative",
  missionBrief:
    "`Math.random()` 会给你一个 0 到 1 之间的随机小数。\n\n但**纯随机并不好看**——在画布上撒 100 个随机位置的圆，得到的只是一团乱七八糟的噪点。\n生成艺术的真正窍门是：**用规则定骨架，用随机制造变化**。\n\n这一关我们画一个「星环」：\n· **规则**：星星沿着一圈圈同心环排列，角度均匀分布（这就是骨架）\n· **随机**：每一环的数量随机、每颗星的角度抖一点、大小也随机（这就是变化）\n\n常用的两个随机技巧：\n· 想要 a 到 b 之间的随机数：`a + Math.random() * (b - a)`\n· 想要一个 0 到 n 的随机整数：`Math.floor(Math.random() * n)`\n\n注意：抖动幅度不能太大。`Math.random() * 0.3` 只是轻轻推一下；\n要是写成 `* 3`，星星就飞得到处都是，图案也就不成形了。\n\n每次点运行，你都会得到一幅独一无二的作品——这就是「生成艺术」名字的由来。",
  erLingHint:
    "提示：外层循环 5 个环，每环 R = 40 + ring * 26、数量 count = 10 + Math.floor(Math.random() * 8)；内层用 a = i / count * Math.PI * 2 + Math.random() * 0.3（均匀分布 + 轻微抖动），画大小 2 + Math.random() * 4 的小圆。",
  steps: [
    { id: 1, title: "用 Math.random() 引入变化" },
    { id: 2, title: "用规则约束随机：星星沿同心环排列" },
    { id: 3, title: "运行，得到一幅独一无二的作品" },
  ],
  codeMode: true,
  defaultCode:
    "// 随机艺术：规则定骨架，随机制造变化\n" +
    "const colors = [\"#FBBF24\", \"#38bdf8\", \"#A78BFA\", \"#22C55E\", \"#F472B6\"];\n" +
    "\n" +
    "for (let ring = 0; ring < 5; ring++) {\n" +
    "  const R = 40 + ring * 26;                            // 规则：一圈圈往外\n" +
    "  const count = 10 + Math.floor(Math.random() * 8);    // 随机：这一环有多少颗\n" +
    "  for (let i = 0; i < count; i++) {\n" +
    "    const a = i / count * Math.PI * 2 + Math.random() * 0.3;   // 均匀分布 + 轻微抖动\n" +
    "    const x = R * Math.cos(a);\n" +
    "    const y = R * Math.sin(a);\n" +
    "    __runtime.drawCircle(x, y, 2 + Math.random() * 4, colors[ring]);\n" +
    "  }\n" +
    "}\n",
};
