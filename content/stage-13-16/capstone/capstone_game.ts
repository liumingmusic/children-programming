import type { CourseProject } from "@/courses";

/**
 * R·毕业项目 · 我的完整小游戏：综合运用「状态变量 + 循环 + 画布逐帧绘制」做出一个能跑的迷你游戏。
 * 采用 clearCanvas + wait 的逐帧模拟写法（与物理项目同源，确定性好、可在测试中稳定跑通）。
 */
export const capstoneGame: CourseProject = {
  slug: "capstone_game",
  title: "我的完整小游戏：接金币",
  ageGroup: "13-16 岁",
  description: "把前面学过的变量、循环、条件、画布全部用上，做出一个会动的迷你游戏：金币落下，篮子接住就加分。",
  category: "capstone",
  missionBrief:
    "毕业项目就要「自己做主」了！这一次不教你具体步骤，只给你工具箱，让你做一款真正能玩的小游戏。\n\n你可以做任何游戏——下面用「接金币」做示范，但你可以改成打砖块、躲避障碍、关卡跳跃……\n\n核心套路（通用）：\n· 用数组 / 变量记住游戏状态（金币位置、得分、玩家位置）\n· 用 for 循环 + `__runtime.clearCanvas()` 每一帧把舞台擦干净\n· 在循环里更新状态（金币下落、玩家移动），再用 `__runtime.drawXxx` 画出来\n· `__runtime.wait(0.03)` 让每一帧之间停一下，人眼才看得清动画\n\n舞台坐标：中心 (0,0)，x 向右为正，y 向上为正，所以「往下掉」是 y 变小。\n· __runtime.drawRect(x, y, 宽, 高, 颜色) —— 画矩形（篮子）\n· __runtime.drawCircle(x, y, 半径, 颜色) —— 画金币\n· __runtime.drawText(x, y, 文字, 颜色, 字号) —— 画得分\n\n试着把篮子接金币改成「左右移动的玩家」或「随机出现的障碍」，做出属于你的版本！",
  erLingHint:
    "提示：const coins=[]; for(let i=0;i<10;i++) coins.push({x:-180+i*40,y:150-i*30}); 再用 for(frame=0;frame<45;frame++){ __runtime.clearCanvas(); for(let i=0;i<coins.length;i++){ coins[i].y=coins[i].y-7; __runtime.drawCircle(coins[i].x,coins[i].y,9,'#FBBF24'); if(coins[i].y<=-140 && Math.abs(coins[i].x-0)<30) score=score+1; } __runtime.drawRect(-30,-140,60,14,'#F59E0B'); __runtime.drawText(-200,134,'得分: '+score,'#DC2626',16); __runtime.wait(, 0.03); }",
  steps: [
    { id: 1, title: "搭好游戏状态（用数组或变量记录金币、得分等）" },
    { id: 2, title: "用循环 + 逐帧重画做出动的画面" },
    { id: 3, title: "运行，看到游戏画面与得分" },
  ],
  codeMode: true,
  defaultCode:
    "// 我的完整小游戏：接金币（自动演示版，你可以改成自己的玩法）\n" +
    "__runtime.drawText(-200, 158, \"我的小游戏：接金币\", \"#1F2937\", 18);\n" +
    "let score = 0;\n" +
    "const bx = 0;                         // 篮子所在的 x\n" +
    "const coins = [];                     // 用数组记录每枚金币的位置\n" +
    "for (let i = 0; i < 10; i++) {\n" +
    "  coins.push({ x: -180 + i * 40, y: 150 - i * 30 });\n" +
    "}\n" +
    "\n" +
    "for (let frame = 0; frame < 45; frame++) {\n" +
    "  __runtime.clearCanvas();            // 每一帧先擦掉旧画面\n" +
    "  // 画篮子\n" +
    "  __runtime.drawRect(bx - 30, -140, 60, 14, \"#F59E0B\");\n" +
    "  // 金币下落 + 接住判定\n" +
    "  for (let i = 0; i < coins.length; i++) {\n" +
    "    coins[i].y = coins[i].y - 7;     // 金币往下掉\n" +
    "    __runtime.drawCircle(coins[i].x, coins[i].y, 9, \"#FBBF24\");\n" +
    "    if (coins[i].y <= -140 && Math.abs(coins[i].x - bx) < 30) {\n" +
    "      score = score + 1;             // 接住一枚，得分 +1\n" +
    "    }\n" +
    "  }\n" +
    "  __runtime.drawText(-200, 134, \"得分: \" + score, \"#DC2626\", 16);\n" +
    "  __runtime.wait(0.03);              // 停一下，才看得见动画\n" +
    "}\n",
};
