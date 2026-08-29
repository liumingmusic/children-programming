import type { CourseProject } from "@/courses";
import { webCalculator } from "./web_calculator";
import { webTodo } from "./web_todo";
import { webMemory } from "./web_memory";
import { webTyping } from "./web_typing";
import { webPlatformer } from "./web_platformer";
import { webChatbot } from "./web_chatbot";

/**
 * P·网页 / 小游戏（web）：用「安全 DOM 面板」做真正的网页与小游戏。
 * 顺序即概念阶梯（也是 /learn 页的解锁顺序）：
 *   计算器（输入框→按钮→回写）→ 待办（列表+重渲染）→ 记忆（展示/隐藏/比对）
 *   → 打字（出题/输入/计分）→ 平台跳跃（游戏循环+键盘+重力）→ 聊天机器人（关键词规则+列表）
 * Phase 2e 一次铺满，本分类 6/6。依赖 Phase 2e 新建的「安全 DOM 面板」运行时能力。
 */
export const stage13WebProjects: CourseProject[] = [
  webCalculator,
  webTodo,
  webMemory,
  webTyping,
  webPlatformer,
  webChatbot,
];
