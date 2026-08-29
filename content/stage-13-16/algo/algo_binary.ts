import type { CourseProject } from "@/courses";

/** L·算法 2：二分查找——在有序数组里反复折半，快速定位目标。 */
export const algoBinary: CourseProject = {
  slug: "algo_binary",
  title: "二分查找：折半的艺术",
  ageGroup: "13-16 岁",
  description: "在有序数组里找一个数，不用一个个看——每次都和「正中间」比，丢掉一半，效率飞起。",
  category: "algo",
  missionBrief:
    "如果数组已经从小到大排好，找目标就不需要从左到右遍历。二分查找的秘诀是「折半」：\n· 看当前区间正中间的数 a[mid]\n· 等于目标 → 找到了\n· 小于目标 → 目标在右半边，把左边界 lo 移到 mid+1\n· 大于目标 → 目标在左半边，把右边界 hi 移到 mid-1\n· 区间缩到 lo > hi 还没找到 → 不存在\n\nmid 用 Math.floor((lo + hi) / 2) 取整数下标。\n我们用不同颜色标出「已排除 / 当前中间」，把查找过程画出来。",
  erLingHint:
    "提示：let a = [1,3,5,7,9,11,13,15,17,19]; let lo = 0, hi = a.length - 1; 用 while (lo <= hi) 循环，mid = Math.floor((lo + hi) / 2)；判断 a[mid] === target / < target / > target 来移动边界，每轮 wait(0.4)。",
  steps: [
    { id: 1, title: "准备一个有序数组和查找目标" },
    { id: 2, title: "用循环反复折半（取中间、比较、缩边界）" },
    { id: 3, title: "运行，看查找区间如何快速缩小" },
  ],
  codeMode: true,
  defaultCode:
    "// 二分查找：每次都和正中间的数比，丢掉一半\n" +
    "let a = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];\n" +
    "const target = 13;\n" +
    "let lo = 0, hi = a.length - 1;\n" +
    "const baseY = -160, bw = 34;\n" +
    "\n" +
    "function draw(mid, found) {\n" +
    "  __runtime.clearCanvas();\n" +
    "  for (let i = 0; i < a.length; i++) {\n" +
    "    const x = -215 + i * (bw + 6);\n" +
    "    const color = (i < lo || i > hi) ? \"#CBD5E1\" : \"#F59E0B\";\n" +
    "    __runtime.drawRect(x, baseY, bw, 30, color);\n" +
    "    __runtime.drawText(x + 8, baseY + 22, a[i], \"#1F2937\", 14);\n" +
    "  }\n" +
    "  if (mid >= 0) __runtime.drawRect(-215 + mid * (bw + 6), baseY + 40, bw, 30, found ? \"#22C55E\" : \"#FB923C\");\n" +
    "}\n" +
    "\n" +
    "while (lo <= hi) {\n" +
    "  const mid = Math.floor((lo + hi) / 2);\n" +
    "  draw(mid, false);\n" +
    "  if (a[mid] === target) { draw(mid, true); break; }\n" +
    "  else if (a[mid] < target) lo = mid + 1;\n" +
    "  else hi = mid - 1;\n" +
    "  __runtime.wait(0.4);\n" +
    "}\n" +
    "__runtime.drawText(-215, 150, \"找到目标 \" + target + \"！\", \"#22C55E\", 18);\n",
};
