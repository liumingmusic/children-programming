import type { CourseProject } from "@/courses";

/**
 * 13-16 岁 · 进阶工坊 项目集合。
 * 起步于「文本代码过渡（js）」分类：学生从拖积木平滑切换到直接写 JavaScript，
 * 调用与积木同源的 __runtime 命令式 API（move / turn / penDown ...），运行时零新增即可复用。
 */
export const jsSquare: CourseProject = {
  slug: "js_square",
  title: "用代码画正方形",
  ageGroup: "13-16 岁",
  description: "第一次用真正的 JavaScript 指挥二零：落笔、用循环画四条边和四个直角。",
  category: "js",
  missionBrief:
    "欢迎来到代码模式！这里不再拖积木，而是直接写 JavaScript。\n\n二零能听懂一套叫 __runtime 的「指令」：\n· __runtime.penDown() 让二零拿起画笔\n· __runtime.move(100) 向前走 100 步\n· __runtime.turn(90) 向右转 90 度（一个直角）\n\n正方形有 4 条相等的边、4 个直角。试着让二零：先落笔，再用一个循环（for）重复 4 次「前进 + 右转」，就能画出正方形。",
  erLingHint:
    "提示：先写 __runtime.penDown() 拿起笔，再用 for 循环把「走 100 步、右转 90 度」重复 4 次。循环能少写很多重复代码哦！",
  steps: [
    { id: 1, title: "让二零拿起画笔（落笔）" },
    { id: 2, title: "用循环画四条边和四个直角" },
    { id: 3, title: "运行看看效果" },
  ],
  codeMode: true,
  defaultCode:
    "// 用 JavaScript 指挥二零画一个正方形\n" +
    "// __runtime 是命令式 API：move(步数) 前进、turn(角度) 转向、penDown() 落笔\n" +
    "__runtime.penDown();\n" +
    "for (let i = 0; i < 4; i++) {\n" +
    "  __runtime.move(100);\n" +
    "  __runtime.turn(90);\n" +
    "}\n",
};

/** stage-13-16 项目（首批：js 分类试点 1 项，后续分类按 Phase 节奏铺开）。 */
export const stage13Projects: CourseProject[] = [jsSquare];
