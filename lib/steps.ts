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

/** 分类 4 · 事件与互动 */
const EVENT_SLUGS = [
  "click_jump", "click_color", "click_dialog", "two_events", "click_play_dialog",
  "auto_patrol", "key_forward", "edge_bounce", "size_toggle", "expression_shake",
];

/** 分类 5 · 条件判断 */
const COND_SLUGS = [
  "if_touch_star", "if_edge_turn", "if_red_stop", "click_left_right", "collect3",
  "random_branch", "odd_even", "size_threshold", "avoid_obstacle", "escape_badguy",
];

/** 分类 6 · 收集与闯关游戏 */
const GAME_SLUGS = [
  "maze_exit", "collect_apples", "light_lanterns", "collect_rainbow",
  "treasure_map", "escort", "traffic_police", "dodge_clouds", "memory_match",
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
    } else if (EVENT_SLUGS.includes(project.slug)) {
      // 事件类（分类 4）：基于真实 JS 标记 / 运行日志判定「用了哪个事件、做了什么动作」
      const hasMove = code.includes("__runtime.move");
      const hasTurn = code.includes("__runtime.turn");
      const hasSay = code.includes("__runtime.say(");
      const sayCount = countMark(code, "__runtime.say(");
      const clickFired = logs.some((l) => l.includes("舞台被点击"));
      const startFired = logs.some((l) => l.includes("开始执行程序"));
      const keyFired = logs.some((l) => l.includes("按下按键"));
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "click_jump") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = hasMove;
        else if (id === 3) done = finished;
      } else if (project.slug === "click_color") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = code.includes("changePenColor") || code.includes("setPenColor");
        else if (id === 3) done = finished;
      } else if (project.slug === "click_dialog") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = sayCount >= 2;
        else if (id === 3) done = finished;
      } else if (project.slug === "two_events") {
        if (id === 1) done = startFired;
        else if (id === 2) done = clickFired;
        else if (id === 3) done = finished;
      } else if (project.slug === "click_play_dialog") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = sayCount >= 3;
        else if (id === 3) done = finished;
      } else if (project.slug === "auto_patrol") {
        if (id === 1) done = startFired;
        else if (id === 2) done = hasLoop && hasMove && hasTurn;
        else if (id === 3) done = finished;
      } else if (project.slug === "key_forward") {
        if (id === 1) done = keyFired;
        else if (id === 2) done = hasMove;
        else if (id === 3) done = finished;
      } else if (project.slug === "edge_bounce") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.touchingEdge()") && hasMove;
        else if (id === 3) done = finished;
      } else if (project.slug === "size_toggle") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = code.includes("__runtime.changeSize") || code.includes("__runtime.setSize");
        else if (id === 3) done = finished;
      } else if (project.slug === "expression_shake") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = code.includes("__runtime.setExpression(");
        else if (id === 3) done = finished;
      }
    } else if (COND_SLUGS.includes(project.slug)) {
      // 条件类（分类 5）：基于真实 JS 标记 / 日志判定「用了哪个判断、收集是否完成」
      const finished = logs.includes("[系统] 程序执行完毕");
      const clickFired = logs.some((l) => l.includes("舞台被点击"));
      const startFired = logs.some((l) => l.includes("开始执行程序"));
      if (project.slug === "if_touch_star") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = code.includes("__runtime.touchingStar()");
        else if (id === 3) done = finished;
      } else if (project.slug === "if_edge_turn") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.touchingEdge()") && code.includes("__runtime.move");
        else if (id === 3) done = finished;
      } else if (project.slug === "if_red_stop") {
        if (id === 1) done = startFired;
        else if (id === 2)
          done =
            code.includes("__runtime.penIsRed()") &&
            (code.includes("__runtime.setPenColor") || code.includes("__runtime.changePenColor"));
        else if (id === 3) done = finished;
      } else if (project.slug === "click_left_right") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = /__runtime\.mouseX\(\)\s*<\s*0/.test(code);
        else if (id === 3) done = finished;
      } else if (project.slug === "collect3") {
        if (id === 1) done = code.includes("__runtime.gotoStar");
        else if (id === 2) done = logs.some((log) => log.includes("收集到星星"));
        else if (id === 3) done = logs.some((log) => log.includes("所有星星都收集完了"));
      } else if (project.slug === "random_branch") {
        if (id === 1) done = startFired;
        else if (id === 2) done = /Math\.random/.test(code);
        else if (id === 3) done = finished;
      } else if (project.slug === "odd_even") {
        if (id === 1) done = code.includes("__runtime.setVar") || code.includes("__runtime.getVar");
        else if (id === 2) done = code.includes("__runtime.getVar") && code.includes("%");
        else if (id === 3) done = finished;
      } else if (project.slug === "size_threshold") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.getSize()");
        else if (id === 3) done = finished;
      } else if (project.slug === "avoid_obstacle") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.touchingMark(\"obstacle\")");
        else if (id === 3) done = finished;
      } else if (project.slug === "escape_badguy") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.touchingMark(\"badguy\")");
        else if (id === 3) done = finished;
      }
    } else if (GAME_SLUGS.includes(project.slug)) {
      // 游戏类（分类 6）：基于真实 JS 标记 / 日志判定「移动路线、收集、点亮等」
      const finished = logs.includes("[系统] 程序执行完毕");
      const startFired = logs.some((l) => l.includes("开始执行程序"));
      const clickFired = logs.some((l) => l.includes("舞台被点击"));
      if (project.slug === "maze_exit") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.move") && code.includes("__runtime.turn");
        else if (id === 3) done = finished;
      } else if (project.slug === "collect_apples" || project.slug === "collect_rainbow") {
        if (id === 1) done = code.includes("__runtime.gotoStar");
        else if (id === 2) done = logs.some((log) => log.includes("收集到星星"));
        else if (id === 3) done = logs.some((log) => log.includes("所有星星都收集完了"));
      } else if (project.slug === "light_lanterns") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.setPenColor") && countMark(code, "__runtime.say(") >= 2;
        else if (id === 3) done = finished;
      } else if (project.slug === "treasure_map") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.goto(");
        else if (id === 3) done = finished;
      } else if (project.slug === "escort") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.goto(") && code.includes("__runtime.say");
        else if (id === 3) done = finished;
      } else if (project.slug === "traffic_police") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = /__runtime\.mouseX\(\)\s*<\s*0/.test(code);
        else if (id === 3) done = finished;
      } else if (project.slug === "dodge_clouds") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.touchingCloud()");
        else if (id === 3) done = finished;
      } else if (project.slug === "memory_match") {
        // 记忆翻牌由独立组件驱动完成，步骤清单作为静态引导，不在代码层判定。
        done = false;
      }
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
  if (slug === "click_jump") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件，再把积木放进去，点舞台才会触发。";
    if (stepId === 2) return "在事件里放「移动 -30 步」让二零向上跳，再用「移动 30 步」落回来。";
    if (stepId === 3) return "点「运行」后，在舞台上点一下，二零就蹦起来啦！";
  }
  if (slug === "click_color") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件。";
    if (stepId === 2) return "在事件里放「画笔颜色增加 60」，每点一次颜色就换一种。";
    if (stepId === 3) return "点「运行」后多点几下舞台，看线条变出不同颜色。";
  }
  if (slug === "click_dialog") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件。";
    if (stepId === 2) return "在事件里连放两个紫色「说」，二零会一句接一句说。";
    if (stepId === 3) return "点「运行」后点舞台，听二零聊天吧！";
  }
  if (slug === "two_events") {
    if (stepId === 1) return "拖一个绿色「当开始运行」，里面放「说 开始啦」。";
    if (stepId === 2) return "再拖一个蓝色「当舞台被点击」，里面放「说 你点我啦」。";
    if (stepId === 3) return "点「运行」看开始的效果，再点舞台听另一句。";
  }
  if (slug === "click_play_dialog") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件。";
    if (stepId === 2) return "在事件里依次接三个紫色「说」，二零就讲出小故事。";
    if (stepId === 3) return "点「运行」后点舞台，听二零讲故事。";
  }
  if (slug === "auto_patrol") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "放「落笔」后接「重复执行 12 次」，里面放「移动 30 步」和「右转 30 度」，再「抬笔」。";
    if (stepId === 3) return "点「运行」，二零会转出一圈巡逻路线。";
  }
  if (slug === "key_forward") {
    if (stepId === 1) return "拖一个「当按下 ↑ 上」事件（方向键事件）。";
    if (stepId === 2) return "在事件里放「移动 50 步」，二号就会前进。";
    if (stepId === 3) return "点「运行」后，用键盘方向键 ↑ 控制二零前进（看示范会自动按一下）。";
  }
  if (slug === "edge_bounce") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "放「重复执行」里面放「移动 20 步」，再加「如果…那么」，条件放「碰到边缘」、那么里放「右转 120 度」。";
    if (stepId === 3) return "点「运行」，二零会一边走一边判断。";
  }
  if (slug === "size_toggle") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件。";
    if (stepId === 2) return "在事件里放「二零大小增加 1」（想变小就填 -1）。";
    if (stepId === 3) return "点「运行」后多点几下舞台，看二零变大变小。";
  }
  if (slug === "if_touch_star") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件。";
    if (stepId === 2) return "在事件里放「移到鼠标位置」，再加「如果…那么」，条件放「碰到星星」、那么里放「说 找到星星啦！」。";
    if (stepId === 3) return "点「运行」后点击那颗在中间的星星试试。";
  }
  if (slug === "if_edge_turn") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "放「重复执行」里面放「移动 15 步」，加「如果…那么」，条件放「碰到边缘」、那么里放「右转 135 度」。";
    if (stepId === 3) return "点「运行」，二零会绕场探索。";
  }
  if (slug === "if_red_stop") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "放「设置画笔颜色为 0」（红色），再加「如果…那么」，条件放「画笔是红色」、那么里放「说 红色，停下！」。";
    if (stepId === 3) return "点「运行」，看二零对红色的反应。";
  }
  if (slug === "click_left_right") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件。";
    if (stepId === 2) return "放「如果…那么…否则」，条件放「点击在左半边」；那么里放「移动 -60 步」，否则里放「移动 60 步」。点积木上的齿轮可加「否则」。";
    if (stepId === 3) return "点「运行」后分别点左边和右边，二零会走不同方向。";
  }
  if (slug === "collect3") {
    if (stepId === 1) return "拖一个绿色「当开始运行」，里面放「飞向星星 1 号」。";
    if (stepId === 2) return "继续接「飞向星星 2 号」「飞向星星 3 号」，二零飞过去就收集。";
    if (stepId === 3) return "点「运行」，二零会自己飞去集齐三颗星。";
  }
  if (slug === "maze_exit") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "用「移动」和「右转 90 度 / 左转 -90 度」拼出绕过墙的路线。";
    if (stepId === 3) return "点「运行」，看二零走到插旗子的出口。";
  }
  if (slug === "collect_apples") {
    if (stepId === 1) return "拖一个绿色「当开始运行」，里面放「飞向星星 1 号」。";
    if (stepId === 2) return "接「飞向星星 2 号」「飞向星星 3 号」，每颗苹果就是一颗星星。";
    if (stepId === 3) return "点「运行」，二零会摘光所有苹果。";
  }
  if (slug === "light_lanterns") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "用「移到 x: y:」依次飞到三盏灯，每到一个就「设置画笔颜色」换色并「说 第几盏亮了」。";
    if (stepId === 3) return "点「运行」，看灯笼依次亮起。";
  }
  if (slug === "collect_rainbow") {
    if (stepId === 1) return "拖一个绿色「当开始运行」，里面放「飞向星星 1 号」。";
    if (stepId === 2) return "接「飞向星星 2 / 3 / 4 号」，每块碎片就是一颗星星。";
    if (stepId === 3) return "点「运行」，二零会拼好彩虹。";
  }
  if (slug === "treasure_map") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "放「移到 x: 120 y: -60」（宝藏箱的位置）。";
    if (stepId === 3) return "点「运行」，看二零挖到宝藏。";
  }
  if (slug === "escort") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "放「移到 小动物坐标」并「说 我来接你啦」，再「移到 0,0（家）」并「说 回家咯」。";
    if (stepId === 3) return "点「运行」，看护送成功。";
  }
  if (slug === "traffic_police") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件。";
    if (stepId === 2) return "放「如果…那么…否则」，条件放「点击在左半边」；那么里「说 红灯，停！」，否则里「说 绿灯，走！」。";
    if (stepId === 3) return "点「运行」后分别点左边和右边，听交警指挥。";
  }
  return "照着左侧「二零说」的提示一步步搭积木，再点运行试试～";
}
