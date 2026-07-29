import type { CourseProject } from "@/courses";

/**
 * 纯函数：根据当前生成的 JavaScript 代码与运行日志，判断各步骤是否完成。
 *
 * 重要：判定必须基于「生成的 JS 真实标记」，而不是 Blockly 积木的「类型名」。
 * 例如 `controls_repeat_ext` / `maker_move` / `maker_turn` 是积木类型名，
 * 它们不会出现在生成的代码里（生成的是 `for (...)` / `__runtime.move(...)` 等），
 * 若用类型名做判定，步骤将永远无法判合格——这是 rainbow 第 2 步曾踩过的坑。
 */
const SEQ_SLUGS = ["flag", "stone", "shapeL", "home", "maze", "arrow", "zigzag", "treasure", "dance", "frame"];

/** 画图 / 循环类项目：判定统一为「落笔 + 循环里移动/转向 + 程序跑完」。包含已上线的 square/triangle/star5/flower 与本次新增的分类 2、3 共 15 项。 */
const DRAW_LOOP_SLUGS = [
  "square", "triangle", "star5", "flower",
  "pentagon", "spin", "stairs", "wave", "spiral", "fence", "windmill", "pickfruit",
  "snowflake", "mandala", "concentric", "connectdot", "house", "letter", "checkerboard",
];

/** 统计生成代码里某个运行时调用出现的次数（基于真实 JS 标记，而非积木类型名）。 */
function countMark(code: string, mark: string): number {
  return code.split(mark).length - 1;
}

/** 序列类项目第 2 步：是否已写出「前进 + 转向」的路线（阈值按项目不同，低于示范但保证方向正确）。 */
function sequenceStep2(slug: string, moveCount: number, turnCount: number): boolean {
  const need: Record<string, [number, number]> = {
    flag: [2, 1], stone: [3, 2], shapeL: [2, 1], home: [2, 1],
    maze: [3, 2], arrow: [2, 1], zigzag: [3, 2], treasure: [2, 1],
    dance: [4, 4], frame: [8, 8],
  };
  const [minMove, minTurn] = need[slug] || [1, 1];
  return moveCount >= minMove && turnCount >= minTurn;
}

export function computeSteps(
  project: CourseProject,
  code: string,
  logs: string[]
): Array<{ id: number; title: string; done: boolean }> {
  // 是否使用了循环（Blockly 的 repeat / while 都会生成循环语句）
  const hasLoop = /for\s*\(|while\s*\(/.test(code);

  return project.steps.map((step) => {
    const id = step.id;
    let done = false;
    if (project.slug === "hello") {
      if (id === 1) done = logs.some((log) => log.includes("二零开始移动"));
      else if (id === 2) done = logs.some((log) => log.startsWith("[二零]"));
      else if (id === 3) done = logs.includes("[系统] 程序执行完毕");
    } else if (project.slug === "rainbow") {
      // 第 1 步：落笔 + 设置/改变画笔颜色
      if (id === 1)
        done =
          code.includes("__runtime.penDown") &&
          (code.includes("__runtime.setPenColor") ||
            code.includes("__runtime.changePenColor"));
      // 第 2 步：用循环让二零边移动边转向（检测真实 JS 标记，而非积木类型名）
      else if (id === 2)
        done =
          hasLoop &&
          code.includes("__runtime.move") &&
          code.includes("__runtime.turn");
      // 第 3 步：程序跑完
      else if (id === 3) done = logs.includes("[系统] 程序执行完毕");
    } else if (DRAW_LOOP_SLUGS.includes(project.slug)) {
      // 画图类（正方形 / 三角形 / 五角星 / 花朵）：
      // 第 1 步：落笔（生成的 JS 里有 __runtime.penDown()）
      if (id === 1) done = code.includes("__runtime.penDown()");
      // 第 2 步：用循环让二零边移动边转向（检测真实 JS 标记，而非积木类型名）
      else if (id === 2)
        done =
          hasLoop &&
          code.includes("__runtime.move") &&
          code.includes("__runtime.turn");
      // 第 3 步：程序跑完
      else if (id === 3) done = logs.includes("[系统] 程序执行完毕");
    } else if (project.slug === "stars") {
      if (id === 1) done = code.includes("__runtime.gotoMouse()");
      else if (id === 2) done = code.includes("__runtime.touchingStar()");
      else if (id === 3)
        done = logs.some((log) => log.includes("所有星星都收集完了"));
    } else if (SEQ_SLUGS.includes(project.slug)) {
      // 基础序列与方向（分类一）：基于真实 JS 标记判定「前进 + 转向」路线
      const moveCount = countMark(code, "__runtime.move(");
      const turnCount = countMark(code, "__runtime.turn(");
      if (id === 1) done = moveCount + turnCount >= 1;
      else if (id === 2) done = sequenceStep2(project.slug, moveCount, turnCount);
      else if (id === 3) done = logs.includes("[系统] 程序执行完毕");
    }
    return { ...step, done };
  });
}

/** 针对「第一个未完成步骤」给出孩子能看懂的辅导提示。 */
export function coach(slug: string, stepId: number): string {
  if (slug === "hello") {
    if (stepId === 1) return "把黄色「移动」积木拖进绿色「当开始运行」里面，再点运行，二零才会动起来哦～";
    if (stepId === 2) return "再拖一个紫色「说」积木，接在「移动」下面，输入想说的话，二零就开口啦！";
    if (stepId === 3) return "点「运行」按钮，就能看到二零动起来并说话啦！";
  }
  if (slug === "rainbow") {
    if (stepId === 1) return "记得先放绿色「落笔」，再放「设置画笔颜色」或「画笔颜色增加」，二零才会画出有颜色的线。";
    if (stepId === 2) return "把「移动」「右转」都放进「重复执行」里面，二零才能一圈圈画出来。";
    if (stepId === 3) return "点「运行」，静静看二零画出彩虹吧！";
  }
  if (slug === "square") {
    if (stepId === 1) return "先放绿色「落笔」，二零才会画出线来。";
    if (stepId === 2) return "把「移动 100 步」和「右转 90 度」都放进「重复执行 4 次」里面，二零才能转着圈画出四条边。";
    if (stepId === 3) return "点「运行」，就能看到二零画出方方正正的正方形啦！";
  }
  if (slug === "triangle") {
    if (stepId === 1) return "先放绿色「落笔」。";
    if (stepId === 2) return "「重复执行 3 次」里面放「移动 100 步」和「右转 120 度」，三角形就出来咯。";
    if (stepId === 3) return "点「运行」看二零画出三角形。";
  }
  if (slug === "star5") {
    if (stepId === 1) return "先放绿色「落笔」。";
    if (stepId === 2) return "「重复执行 5 次」里放「移动 100 步」和「右转 144 度」，五角星就画好啦（144 是星星的魔法角度）。";
    if (stepId === 3) return "点「运行」看二零画出闪亮的五角星。";
  }
  if (slug === "flower") {
    if (stepId === 1) return "先放绿色「落笔」。";
    if (stepId === 2) return "用「重复执行 6 次」包住一个「重复执行 2 次」的小循环，里面放「移动 50 步」和「右转 60 度」，就能画出一片片花瓣。";
    if (stepId === 3) return "点「运行」看二零画出一朵六瓣花。";
  }
  if (slug === "stars") {
    if (stepId === 1) return "要先拖一个蓝色「当舞台被点击」事件，再把「移到鼠标位置」放进去。";
    if (stepId === 2) return "在「如果…那么」里放上「碰到星星」当条件，再在「那么」里放「说」，点击星星时才会判断。";
    if (stepId === 3) return "点「运行」后，在舞台上依次点击那 3 颗星星，每点到一颗就收集一颗！";
  }
  if (SEQ_SLUGS.includes(slug)) {
    if (stepId === 1) return "先把黄色「移动」积木拖进绿色「当开始运行」里，二零才会动起来～";
    if (stepId === 2) return "加上「右转」积木，让二零拐个弯，走出你的路线吧！";
    if (stepId === 3) return "点「运行」按钮，看二零把路线走完！";
  }
  if (DRAW_LOOP_SLUGS.includes(slug)) {
    if (stepId === 1) return "先放绿色「落笔」，二零才会画出线来。";
    if (stepId === 2) return "把「移动」和「右转」都放进「重复执行」里面，二零才能一圈圈画出来。";
    if (stepId === 3) return "点「运行」，静静看二零画出图案吧！";
  }
  return "照着左侧「二零说」的提示一步步搭积木，再点运行试试～";
}
