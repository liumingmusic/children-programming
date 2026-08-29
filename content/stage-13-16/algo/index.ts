import type { CourseProject } from "@/courses";
import { algoBubble } from "./algo_bubble";
import { algoBinary } from "./algo_binary";
import { algoStack } from "./algo_stack";
import { algoMaze } from "./algo_maze";
import { algoFib } from "./algo_fib";
import { algoPrime } from "./algo_prime";
import { algoString } from "./algo_string";
import { algoGreedy } from "./algo_greedy";

/**
 * 13-16 岁 · 分类 L · 算法与数据结构（Phase 3a，8/8 满编）
 * 全部 codeMode（直接写 JavaScript），用画布原语 + wait 做算法可视化。
 */
export const stage13AlgoProjects: CourseProject[] = [
  algoBubble, // 冒泡排序可视化
  algoBinary, // 二分查找
  algoStack, // 栈与队列
  algoMaze, // BFS 迷宫求解
  algoFib, // 斐波那契与递归
  algoPrime, // 素数判断优化
  algoString, // 字符串处理
  algoGreedy, // 贪心入门
];
