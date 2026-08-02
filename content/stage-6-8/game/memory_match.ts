import type { CourseProject } from "@/courses";

export const memoryMatchProject: CourseProject = {
  slug: "memory_match",
  category: "game",
  title: "记忆翻牌",
  ageGroup: "6-8 岁",
  description: "独立的翻牌配对小游戏：记住卡片位置，找出相同的两张。",
  missionBrief: "桌面上有几对图案卡片，全部背面朝上。翻开两张，如果一样就消除，不一样就盖回去——靠记忆力把全部卡片配对成功吧！",
  erLingHint: "这是一个记忆小游戏：点一张卡片翻开，再点另一张。两张图案相同就留在桌面，不同会自动盖回去。把全部配对成功就通关啦！",
  steps: [
    { id: 1, title: "翻开两张卡片" },
    { id: 2, title: "记住并找出相同的两张" },
    { id: 3, title: "把全部卡片配对成功" },
  ],
  component: "memory",
};
