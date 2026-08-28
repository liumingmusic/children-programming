import type { CourseProject } from "@/courses";
import { jsSquare } from "./js_square";
import { jsHello } from "./js_hello";
import { jsVariable } from "./js_variable";
import { jsFunction } from "./js_function";
import { jsArray } from "./js_array";
import { jsTool } from "./js_tool";
import { jsCanvas } from "./js_canvas";
import { jsCompare } from "./js_compare";

/**
 * K·文本代码过渡（js）8 项：从积木平滑过渡到 JavaScript 文本代码。
 * 编排顺序 = 概念阶梯：画图形 → 说话输出 → 变量 → 函数 → 数组 → 小工具 → 彩色画布 → 综合复习。
 */
export const stage13JsProjects: CourseProject[] = [
  jsSquare,
  jsHello,
  jsVariable,
  jsFunction,
  jsArray,
  jsTool,
  jsCanvas,
  jsCompare,
];
