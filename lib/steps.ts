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

/** 分类 8 · 音乐与节奏（全 10 项，slug 顺序与 projectSlugs 一致）。 */
const MUSIC_SLUGS = [
  "play_doremi", "twinkle", "drum_beat", "random_note", "loop_melody",
  "pitch_by_click", "pitch_by_move", "chord", "birthday", "compose",
];

/** 分类 9 · 数学启蒙（全 10 项，slug 顺序与 projectSlugs 一致）。 */
const MATH_SLUGS = [
  "count10", "count_apples", "compare_size", "add_sub", "shape_names",
  "symmetry", "multiplication", "clock", "geometry_puzzle", "calculator",
];

/** 分类 7 · 故事与动画（全 10 项，slug 顺序与 projectSlugs 一致）。
 * 后 3 项（two_talk / a_day / magic_show）带伙伴角色 cast:["sanqi"]，用到「控制角色 / 切换场景 / 隐藏 / 显示」积木。 */
const STORY_SLUGS = [
  "self_intro", "expression", "freeze", "animal_sports", "word_chain",
  "birthday_party", "good_night", "two_talk", "a_day", "magic_show",
];

/** 分类 10 · 自然科学模拟（全 10 项，slug 顺序与 projectSlugs 一致）。
 * 全部走「时间轴引擎」模式（project.timeline = true），由 runtime.timeline 驱动：
 *  - day_night / rainbow_bridge / seed_grow / moon_phase / earth_sun / food_chain 用 tween / orbit 轨道；
 *  - rain / snow / volcano 用粒子发射轨道（rain/snow/lava）；
 *  - color_wheel 用 maker_mix_color 颜色混合 reporter。
 * 判定基于真实 JS 标记（__runtime.timeline.reset/addTrack/timelineMix），非积木类型名。 */
const SCIENCE_SLUGS = [
  "day_night", "rain", "snow", "volcano", "color_wheel",
  "rainbow_bridge", "seed_grow", "earth_sun", "food_chain", "moon_phase",
];

/** 分类 11 · 综合创意 / 毕业项目（pbl，全 4 项，slug 顺序与 projectSlugs 一致）。
 * 这些是「总结性作品」，每个都把前面多个分类的本领组合起来：
 *  - singing_picture 会唱歌的画：画笔（落笔/循环/移动/转向）+ 音乐（弹奏音符）
 *  - two_actor_show 双角色小剧场：故事双角色（控制角色/表情/场景/说话）
 *  - my_solar_system 我的太阳系：科学时间轴（公转轨道 + 大小 tween + 当时间到达说）
 *  - interactive_book 互动绘本游戏：事件（点击）+ 条件（碰到星星）+ 收集（飞向星星）
 * 判定同样基于真实 JS 标记，不依赖积木类型名。完成判定以「步骤」为准（各项目无目标标记判定需求）。 */
const PBL_SLUGS = [
  "singing_picture", "two_actor_show", "my_solar_system", "interactive_book",
];

/** 分类 A · 函数与自定义积木（9-12 阶段，全 8 项）。判定基于真实 JS 标记：定义了函数、调用了函数。 */
const FN_SLUGS = [
  "fn_square", "fn_polygon", "fn_house", "fn_snowflake", "fn_tree", "fn_toolbox", "fn_spiral", "fn_castle",
];

/** 分类 B · 变量与状态（9-12 阶段，全 8 项）。判定基于真实 JS 标记（变量/取余/计时/最高分）。 */
const VAR_SLUGS = [
  "var_counter", "var_score", "var_lives", "var_speed", "var_parity", "var_gradient", "var_timer", "var_best",
];

/** 分类 C · 多角色与协作（9-12 阶段）。判定基于真实 JS 标记：控制角色 / 角色间碰撞 / 距离 / 广播消息。 */
const MULTI_SLUGS = [
  "cat_mouse", "guardian_dodge", "two_player", "message_relay",
  "two_actor_chat", "relay_race", "chorus", "animal_queue",
];

/** 分类 D · 键盘与操控游戏（9-12 阶段）。判定基于真实 JS 标记：按键事件触发 / 移动或转向 / 弹奏音符。 */
const KEY_SLUGS = [
  "key_move", "key_maze", "key_piano",
];

/** 分类 D · 键盘游戏（进阶 5 项）：每项用「按键驱动一格一判定」模型，判定基于真实 JS 标记。 */
const D_GAME: Record<string, { collide: string; score: boolean }> = {
  catch_apple: { collide: "__runtime.touchingApple(", score: true },
  dodge_fall: { collide: "__runtime.touchingCloud(", score: false },
  breakout_intro: { collide: "__runtime.touchingStar(", score: true },
  space_shooter: { collide: "__runtime.touchingCloud(", score: true },
  reaction_game: { collide: "__runtime.touchingApple(", score: true },
};

/** 统计生成代码里某个运行时调用出现的次数（基于真实 JS 标记，而非积木类型名）。 */
function countMark(code: string, mark: string): number {
  return code.split(mark).length - 1;
}

/** 统计生成代码里「音频积木」的出现总次数（任一弹奏 / 鼓 / 随机 / 和弦 / 按位置弹音均计 1）。 */
function countAudio(code: string): number {
  return (
    countMark(code, "__runtime.playNote(") +
    countMark(code, "__runtime.playDrum(") +
    countMark(code, "__runtime.playRandomNote(") +
    countMark(code, "__runtime.playChord(") +
    countMark(code, "__runtime.playToneByMouseX(") +
    countMark(code, "__runtime.playToneByActorX(")
  );
}

/** 是否用到了任意音频积木（基于真实 JS 标记）。 */
function hasAnyAudio(code: string): boolean {
  return /__runtime\.(playNote|playDrum|playRandomNote|playChord|playToneByMouseX|playToneByActorX)\(/.test(code);
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
    } else if (MUSIC_SLUGS.includes(project.slug)) {
      // 音乐类（分类 8）：基于真实 JS 标记 / 运行日志判定「用了哪个音频积木、弹了几个音、事件是否触发」。
      // 完成判定以「步骤」为准（无 stars / 无 goalMarks，isGoalAchieved 回退为 true）。
      const finished = logs.includes("[系统] 程序执行完毕");
      const clickFired = logs.some((l) => l.includes("舞台被点击"));
      const startFired = logs.some((l) => l.includes("开始执行程序"));
      const audioCount = countAudio(code);
      const hasAudio = hasAnyAudio(code);
      if (project.slug === "play_doremi") {
        if (id === 1) done = hasAudio;
        else if (id === 2) done = audioCount >= 3;
        else if (id === 3) done = finished;
      } else if (project.slug === "twinkle") {
        if (id === 1) done = hasAudio;
        else if (id === 2) done = audioCount >= 7;
        else if (id === 3) done = finished;
      } else if (project.slug === "drum_beat") {
        if (id === 1) done = code.includes("__runtime.playDrum(");
        else if (id === 2) done = hasLoop && code.includes("__runtime.playDrum(");
        else if (id === 3) done = finished;
      } else if (project.slug === "random_note") {
        if (id === 1) done = code.includes("__runtime.playRandomNote(");
        else if (id === 2) done = hasLoop && code.includes("__runtime.playRandomNote(");
        else if (id === 3) done = finished;
      } else if (project.slug === "loop_melody") {
        if (id === 1) done = hasLoop;
        else if (id === 2) done = hasLoop && hasAudio;
        else if (id === 3) done = finished;
      } else if (project.slug === "pitch_by_click") {
        if (id === 1) done = clickFired;
        else if (id === 2) done = code.includes("__runtime.playToneByMouseX(");
        else if (id === 3) done = finished;
      } else if (project.slug === "pitch_by_move") {
        if (id === 1) done = startFired;
        else if (id === 2) done = code.includes("__runtime.playToneByActorX(") && code.includes("__runtime.move(");
        else if (id === 3) done = finished;
      } else if (project.slug === "chord") {
        if (id === 1) done = code.includes("__runtime.playChord(");
        else if (id === 2) {
          // 和弦里至少包含 2 个音符：解析 playChord([...]) 数组的元素个数
          const m = code.match(/__runtime\.playChord\(\[([^\]]*)\]\)/);
          const n = m ? m[1].split(",").length : 0;
          done = n >= 2;
        } else if (id === 3) done = finished;
      } else if (project.slug === "birthday") {
        if (id === 1) done = hasAudio;
        else if (id === 2) done = audioCount >= 6;
        else if (id === 3) done = finished;
      } else if (project.slug === "compose") {
        if (id === 1) done = hasAudio;
        else if (id === 2) done = audioCount >= 3 || hasLoop;
        else if (id === 3) done = finished;
      }
    } else if (MATH_SLUGS.includes(project.slug)) {
      // 数学启蒙（分类 9）：基于真实 JS 标记 / 运行日志判定「数数 / 比较 / 算术 / 图形」。
      // 完成判定以「步骤」为准（无 stars / 无 goalMarks，isGoalAchieved 回退为 true）。
      const finished = logs.includes("[系统] 程序执行完毕");
      const sayCount = countMark(code, "__runtime.say(");
      const hasVar = code.includes("__runtime.setVar") || code.includes("__runtime.changeVar") || code.includes("__runtime.getVar");
      // 比较积木会额外包一层括号：生成形如 `__runtime.getVar("a")) > __runtime.getVar("b")`，
      // 故 getVar(...) 后可能有 0~1 个 `)`，再用 [><]=? 兜底 ≥ / ≤。
      const hasCompare = /__runtime\.getVar\([^)]*\)\)*\s*[><]=?/.test(code);
      const hasArith = code.includes("__runtime.add(") || code.includes("__runtime.sub(") || code.includes("__runtime.mul(") || code.includes("__runtime.div(");
      // 重复执行次数（controls_repeat_ext 生成 `for (var count = 0; count < N; count++)`），用于校验「数到 10 / 数到 5」。
      const loopBound = (() => { const m = code.match(/count\s*<\s*(\d+)/); return m ? Number(m[1]) : 0; })();
      const hasChangeVar = code.includes("__runtime.changeVar(");
      if (project.slug === "count10" || project.slug === "count_apples") {
        const target = project.slug === "count10" ? 10 : 5;
        // 第 1 步：用一个「重复执行」循环 + 变量来数数（循环里要有变量增减）。
        if (id === 1) done = hasLoop && (hasChangeVar || code.includes("__runtime.getVar("));
        // 第 2 步：循环里「一边加一边说出数字」，且循环次数达到目标（数到 10 / 数到 5）。
        // 注意 say 在循环体内生成代码只出现一次，不能靠 countMark 数运行时次数，改为校验循环次数。
        else if (id === 2) done = hasLoop && hasChangeVar && code.includes("__runtime.say(") && loopBound >= target;
        else if (id === 3) done = finished;
      } else if (project.slug === "compare_size") {
        if (id === 1) done = countMark(code, "__runtime.setVar(") >= 2;
        else if (id === 2) done = hasVar && hasCompare;
        else if (id === 3) done = finished;
      } else if (project.slug === "add_sub") {
        if (id === 1) done = code.includes("__runtime.add(");
        else if (id === 2) done = code.includes("__runtime.sub(");
        else if (id === 3) done = finished;
      } else if (project.slug === "shape_names") {
        if (id === 1) done = code.includes("__runtime.penDown()");
        else if (id === 2) done = hasLoop && code.includes("__runtime.move") && code.includes("__runtime.turn");
        else if (id === 3) done = sayCount >= 1;
      } else if (project.slug === "symmetry") {
        if (id === 1) done = code.includes("__runtime.penDown()");
        else if (id === 2) done = code.includes("__runtime.goto(") && countMark(code, "__runtime.goto(") >= 2 && hasLoop;
        else if (id === 3) done = finished;
      } else if (project.slug === "multiplication") {
        if (id === 1) done = hasLoop;
        else if (id === 2) done = hasLoop && hasVar;
        else if (id === 3) done = finished;
      } else if (project.slug === "clock") {
        if (id === 1) done = code.includes("__runtime.penDown()") && hasLoop && code.includes("__runtime.move") && code.includes("__runtime.turn");
        else if (id === 2) done = sayCount >= 1;
        else if (id === 3) done = finished;
      } else if (project.slug === "geometry_puzzle") {
        if (id === 1) done = code.includes("__runtime.penDown()");
        else if (id === 2) done = code.includes("__runtime.goto(") && countMark(code, "__runtime.penDown()") >= 2 && hasLoop;
        else if (id === 3) done = finished;
      } else if (project.slug === "calculator") {
        if (id === 1) done = countMark(code, "__runtime.setVar(") >= 2;
        else if (id === 2) done = hasArith;
        else if (id === 3) done = finished;
      }
    } else if (STORY_SLUGS.includes(project.slug)) {
      // 故事与动画（分类 7）：基于真实 JS 标记 / 运行日志判定「说话 / 表情 / 场景 / 控制角色 / 显隐 / 移动」。
      // 完成判定以「步骤」为准（无 stars / 无 goalMarks，isGoalAchieved 回退为 true）。
      const finished = logs.includes("[系统] 程序执行完毕");
      const startFired = logs.some((l) => l.includes("开始执行程序"));
      const sayCount = countMark(code, "__runtime.say(");
      const hasMove = code.includes("__runtime.move");
      const hasLoop = /for\s*\(|while\s*\(/.test(code);
      const sceneCount = countMark(code, "__runtime.setScene(");
      const controlCount = countMark(code, "__runtime.controlActor(");
      const hasHide = code.includes("__runtime.hideActor(");
      const hasShow = code.includes("__runtime.showActor(");
      const hasExpression = code.includes("__runtime.setExpression(");
      if (
        project.slug === "self_intro" ||
        project.slug === "word_chain" ||
        project.slug === "freeze"
      ) {
        // 自我介绍 / 词语接龙 / 木头人：用「当开始运行」+「说」（木头人额外要移动）。
        if (id === 1) done = startFired;
        else if (id === 2) done = project.slug === "freeze" ? (hasMove && sayCount >= 1) : sayCount >= 1;
        else if (id === 3) done = finished;
      } else if (project.slug === "expression") {
        if (id === 1) done = startFired;
        else if (id === 2) done = hasExpression;
        else if (id === 3) done = finished;
      } else if (project.slug === "animal_sports") {
        if (id === 1) done = startFired;
        else if (id === 2) done = hasLoop && hasMove;
        else if (id === 3) done = finished;
      } else if (project.slug === "birthday_party" || project.slug === "good_night") {
        // 生日派对 / 晚安：用「当开始运行」+「切换场景」+「说」。
        if (id === 1) done = startFired;
        else if (id === 2) done = sceneCount >= 1 && sayCount >= 1;
        else if (id === 3) done = finished;
      } else if (project.slug === "two_talk") {
        // 两角色对话：必须「控制角色」切换且两个伙伴都开口（至少 2 句说）。
        if (id === 1) done = startFired;
        else if (id === 2) done = controlCount >= 1 && sayCount >= 2;
        else if (id === 3) done = finished;
      } else if (project.slug === "a_day") {
        // 一天的生活：切换至少两个场景讲完一天。
        if (id === 1) done = startFired;
        else if (id === 2) done = sceneCount >= 2;
        else if (id === 3) done = finished;
      } else if (project.slug === "magic_show") {
        // 变魔术：先「隐藏角色」再「显示角色」。
        if (id === 1) done = startFired;
        else if (id === 2) done = hasHide && hasShow;
        else if (id === 3) done = finished;
      }
    } else if (SCIENCE_SLUGS.includes(project.slug)) {
      // 自然科学模拟（分类 10）：基于真实 JS 标记判定「用了时间轴的哪种能力」。
      // 时间轴模式（project.timeline=true）由 runtime.timeline 驱动；完成判定以「步骤」为准。
      const hasTimeline = code.includes("__runtime.timeline.reset(10)");
      const hasAddTrack = code.includes("__runtime.timeline.addTrack(");
      const hasTween = code.includes('type: "tween"');
      const hasOrbit = code.includes('type: "orbit"');
      const hasParticle = code.includes('type: "particles"');
      const hasWhenAt = code.includes('type: "whenAt"');
      const hasMixColor = code.includes("__runtime.timelineMix(");
      if (project.slug === "day_night") {
        // 昼夜更替：背景明暗 tween + 当时间到达说一句话
        if (id === 1) done = hasTimeline && hasTween;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "rain") {
        if (id === 1) done = hasTimeline && hasParticle;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "snow") {
        if (id === 1) done = hasTimeline && hasParticle;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "volcano") {
        if (id === 1) done = hasTimeline && hasParticle;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "color_wheel") {
        // 神奇的调色盘：用 maker_mix_color 混合两种颜色并说出来
        if (id === 1) done = hasTimeline && hasMixColor;
        else if (id === 2) done = hasAddTrack && hasWhenAt && hasMixColor;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "rainbow_bridge") {
        // 彩虹桥：左右位置 tween + 当时间到达说一句话
        if (id === 1) done = hasTimeline && hasTween;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "seed_grow") {
        // 种子长大了：大小 + 上下位置 tween
        if (id === 1) done = hasTimeline && hasTween;
        else if (id === 2) done = countMark(code, 'type: "tween"') >= 2;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "earth_sun") {
        // 地球绕着太阳转：公转轨道
        if (id === 1) done = hasTimeline && hasOrbit;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "food_chain") {
        // 食物链大冒险：三七移动 tween + 二零当时间到达说一句话
        if (id === 1) done = hasTimeline && hasTween;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "moon_phase") {
        // 月亮的脸：显示程度（alpha）tween 从弯月到满月
        if (id === 1) done = hasTimeline && hasTween;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      }
    } else if (PBL_SLUGS.includes(project.slug)) {
      // 分类 11 · 综合创意 / 毕业项目：每个项目组合多种本领，判定基于真实 JS 标记。
      const finished = logs.includes("[系统] 程序执行完毕");
      const startFired = logs.some((l) => l.includes("开始执行程序"));
      const clickFired = logs.some((l) => l.includes("舞台被点击"));
      const sayCount = countMark(code, "__runtime.say(");
      const controlCount = countMark(code, "__runtime.controlActor(");
      const hasExpression = code.includes("__runtime.setExpression(");
      const sceneCount = countMark(code, "__runtime.setScene(");
      const audioCount = countAudio(code);
      // 时间轴相关标记（my_solar_system 用）：与 SCIENCE 分支同套真实标记
      const hasTimeline = code.includes("__runtime.timeline.reset(10)");
      const hasAddTrack = code.includes("__runtime.timeline.addTrack(");
      const hasTween = code.includes('type: "tween"');
      const hasOrbit = code.includes('type: "orbit"');
      const hasWhenAt = code.includes('type: "whenAt"');
      if (project.slug === "singing_picture") {
        // 会唱歌的画：落笔 + 循环画图案 + 弹奏至少 3 个音符
        if (id === 1) done = code.includes("__runtime.penDown()");
        else if (id === 2) done = hasLoop && code.includes("__runtime.move") && code.includes("__runtime.turn");
        else if (id === 3) done = audioCount >= 3;
      } else if (project.slug === "two_actor_show") {
        // 双角色小剧场：启动 + 两个伙伴都出场表演（控制角色+说话+表情）+ 切换场景讲完
        if (id === 1) done = startFired;
        else if (id === 2) done = controlCount >= 1 && sayCount >= 2 && hasExpression;
        else if (id === 3) done = sceneCount >= 1 && finished;
      } else if (project.slug === "my_solar_system") {
        // 我的太阳系：时间轴公转 + 大小 tween + 当时间到达解说
        if (id === 1) done = hasTimeline && hasOrbit;
        else if (id === 2) done = hasAddTrack && hasTween;
        else if (id === 3) done = hasTimeline && hasAddTrack && hasWhenAt;
      } else if (project.slug === "interactive_book") {
        // 互动绘本游戏：点击事件 + 条件判断（碰到星星）+ 收集所有星星
        if (id === 1) done = clickFired;
        else if (id === 2) done = code.includes("__runtime.touchingStar()") && code.includes("__runtime.gotoStar");
        else if (id === 3) done = logs.some((log) => log.includes("所有星星都收集完了")) || finished;
      }
    }
    else if (FN_SLUGS.includes(project.slug)) {
      // 函数类（分类 A）：基于真实 JS 标记判定「定义了函数 / 调用了函数」
      const finished = logs.includes("[系统] 程序执行完毕");
      if (id === 1) done = code.includes("function ");
      else if (id === 2) done = code.includes("();");
      else if (id === 3) done = finished;
    } else if (VAR_SLUGS.includes(project.slug)) {
      // 变量类（分类 B）：基于真实 JS 标记判定「用了变量 / 取余 / 计时 / 最高分」
      const finished = logs.includes("[系统] 程序执行完毕");
      const hasVar = code.includes("__runtime.setVar") || code.includes("__runtime.changeVar") || code.includes("__runtime.getVar");
      if (project.slug === "var_counter" || project.slug === "var_score") {
        if (id === 1) done = hasVar;
        else if (id === 2) done = hasVar && code.includes("__runtime.move");
        else if (id === 3) done = finished;
      } else if (project.slug === "var_lives") {
        if (id === 1) done = hasVar;
        else if (id === 2) done = code.includes("__runtime.changeVar") && /-\d/.test(code);
        else if (id === 3) done = finished;
      } else if (project.slug === "var_speed") {
        if (id === 1) done = hasVar;
        else if (id === 2) done = code.includes("__runtime.getVar") && code.includes("__runtime.move");
        else if (id === 3) done = finished;
      } else if (project.slug === "var_parity") {
        if (id === 1) done = hasVar;
        else if (id === 2) done = code.includes("__runtime.getVar") && code.includes("%");
        else if (id === 3) done = finished;
      } else if (project.slug === "var_gradient") {
        if (id === 1) done = code.includes("__runtime.penDown()") && hasVar;
        else if (id === 2) done = code.includes("__runtime.changeVar") && code.includes("__runtime.setPenColor");
        else if (id === 3) done = finished;
      } else if (project.slug === "var_timer") {
        if (id === 1) done = code.includes("Date.now()");
        else if (id === 2) done = code.includes("Date.now()") && code.includes("__runtime.sub");
        else if (id === 3) done = finished;
      } else if (project.slug === "var_best") {
        if (id === 1) done = hasVar;
        else if (id === 2) done = code.includes("__runtime.setBest");
        else if (id === 3) done = finished;
      }
      } else if (MULTI_SLUGS.includes(project.slug)) {
        // 多角色类（分类 C）：基于真实 JS 标记判定
        const finished = logs.includes("[系统] 程序执行完毕");
        const startFired = logs.some((l) => l.includes("开始执行程序"));
        if (project.slug === "message_relay") {
          // 角色间消息传递：用了「广播」积木，且接收脚本真正触发（日志里有"接收到消息"）
          const usedBroadcast = code.includes("__runtime.broadcast(");
          if (id === 1) done = startFired;
          else if (id === 2) done = usedBroadcast;
          else if (id === 3) done = logs.includes("[系统] 接收到消息");
        } else if (project.slug === "two_actor_chat") {
          // 两个角色对话：二零和三七都开口说话（两个 controlActor + say）
          const ctrlErling = code.includes('__runtime.controlActor("erling")');
          const ctrlSanqi = code.includes('__runtime.controlActor("sanqi")');
          const usedSay = code.includes("__runtime.say(");
          if (id === 1) done = startFired;
          else if (id === 2) done = ctrlErling && ctrlSanqi && usedSay;
          else if (id === 3) done = finished;
        } else if (project.slug === "relay_race") {
          // 接力赛：两个角色都跑（两个 controlActor）+ 移动 + 广播交接
          const ctrlErling = code.includes('__runtime.controlActor("erling")');
          const ctrlSanqi = code.includes('__runtime.controlActor("sanqi")');
          const hasMove = code.includes("__runtime.move");
          const usedBroadcast = code.includes("__runtime.broadcast(");
          if (id === 1) done = startFired;
          else if (id === 2) done = ctrlErling && ctrlSanqi && hasMove && usedBroadcast;
          else if (id === 3) done = finished;
        } else if (project.slug === "chorus") {
          // 合唱团：两个角色都发声（两个 controlActor + 音效）
          const ctrlErling = code.includes('__runtime.controlActor("erling")');
          const ctrlSanqi = code.includes('__runtime.controlActor("sanqi")');
          const hasAudio = hasAnyAudio(code);
          if (id === 1) done = startFired;
          else if (id === 2) done = ctrlErling && ctrlSanqi && hasAudio;
          else if (id === 3) done = finished;
        } else if (project.slug === "animal_queue") {
          // 排队的动物：两个角色列队前进（两个 controlActor + 移动 / 保持距离）
          const ctrlErling = code.includes('__runtime.controlActor("erling")');
          const ctrlSanqi = code.includes('__runtime.controlActor("sanqi")');
          const hasMove = code.includes("__runtime.move");
          const usedDist = code.includes("__runtime.distanceTo(");
          if (id === 1) done = startFired;
          else if (id === 2) done = ctrlErling && ctrlSanqi && (hasMove || usedDist);
          else if (id === 3) done = finished;
        } else {
          // 角色间碰撞 / 距离：控制角色 + (碰到角色 / 到角色的距离)
          const usedControl = code.includes("__runtime.controlActor");
          const usedTouch = code.includes("__runtime.touchingActor(");
          const usedDist = code.includes("__runtime.distanceTo(");
          if (id === 1) done = startFired;
          else if (id === 2) done = usedControl && (usedTouch || usedDist);
          else if (id === 3) done = finished;
        }
      }
      else if (KEY_SLUGS.includes(project.slug)) {
        // 键盘操控类（分类 D）：基于真实 JS 标记 / 运行日志判定「按键触发 + 移动/转向/弹奏」
        const finished = logs.includes("[系统] 程序执行完毕");
        const keyFired = logs.some((l) => l.includes("按下按键"));
        const hasMove = code.includes("__runtime.move");
        const hasTurn = code.includes("__runtime.turn");
        const hasAudio = hasAnyAudio(code);
        if (project.slug === "key_move") {
          if (id === 1) done = keyFired;
          else if (id === 2) done = hasMove;
          else if (id === 3) done = finished;
        } else if (project.slug === "key_maze") {
          if (id === 1) done = keyFired;
          else if (id === 2) done = hasMove && hasTurn;
          else if (id === 3) done = finished;
        } else if (project.slug === "key_piano") {
          if (id === 1) done = keyFired;
          else if (id === 2) done = hasAudio;
          else if (id === 3) done = finished;
        }
      } else if (project.slug in D_GAME) {
        // 键盘游戏进阶 5 项：按键驱动一格一判定，基于真实 JS 标记判定「移动 + 碰撞结算 (+ 分数)」
        const cfg = D_GAME[project.slug];
        const finished = logs.includes("[系统] 程序执行完毕");
        const keyFired = logs.some((l) => l.includes("按下按键"));
        const hasMove = code.includes("__runtime.move");
        const usedCollide = code.includes(cfg.collide);
        const usedScore = !cfg.score || code.includes("__runtime.changeVar") || code.includes("__runtime.setVar");
        if (id === 1) done = keyFired || hasMove;
        else if (id === 2) done = usedCollide && usedScore && (keyFired || hasMove);
        else if (id === 3) done = finished;
      }
    return { ...step, done };
  });
}

/**
 * 校验「目标是否真正达成」——这是修复「自己瞎做也提示作业完成」的核心。
 *
 * computeSteps 只检查「用了哪些积木 / 触发了哪些事件 / 程序是否跑完」，
 * 从不验证结果是否正确。本函数补上「结果校验」：
 *  - 收集类（项目定义了 stars）：必须集齐所有星星；
 *  - 导航/到达类（分类为 seq 或 game，且场景里存在非障碍/非坏人的目标标记）：
 *    角色必须真正走到某个目标标记附近（容差 55 世界单位）；
 *  - 其余（绘图/事件/条件/无标记序列）：以步骤判定为准（积木使用正确即视为达成）。
 *
 * 注意：避开类项目（avoid_obstacle / escape_badguy / dodge_clouds）以「不撞上」为目标，
 * 其达成与否无法从终态简单判定，故回退到步骤判定。
 */
export function isGoalAchieved(
  project: CourseProject,
  state: {
    actor: { x: number; y: number };
    stars: { collected: boolean }[];
    penPaths?: { points: { x: number; y: number }[] }[];
    vars?: Record<string, number>;
    movedDistance?: number;
    log?: string[];
    /** 各角色是否已真正执行过动作（多角色类完成判定用）。 */
    actors?: { id: string; acted?: boolean }[];
    /** 程序是否真正 engage 了伙伴角色（多角色类完成判定用）。 */
    companionEngaged?: boolean;
    /** 已注册按键处理器数量（键盘类完成判定用）。 */
    keyHandlers?: number;
  },
  _logs?: string[]
): boolean {
  const allMarks = project.scene?.marks ?? [];
  const goalMarks = allMarks.filter(
    (m) => m.kind !== "obstacle" && m.kind !== "badguy"
  );
  const avoidType = ["avoid_obstacle", "escape_badguy", "dodge_clouds"].includes(project.slug);

  // dance 是绘图类，原点标记💃为纯装饰，不应要求抵达；以步骤判定为准即可。
  if (project.slug === "dance") return true;

  // 收集类（仅限 game 分类，如 collect3 / collect_apples / collect_rainbow / stars）：必须集齐所有星星。
  // 注意 cond 分类的 if_touch_star 虽也有 stars，但它是「条件判断」演示，不应被要求集齐全部星星。
  if (project.stars && project.stars.length > 0 && project.category === "game") {
    return state.stars.length > 0 && state.stars.every((s) => s.collected);
  }
  // 导航/到达类（seq / game 且存在目标标记）：必须走到某个目标标记附近（容差 55 世界单位）。
  if (!avoidType && (project.category === "seq" || project.category === "game") && goalMarks.length > 0) {
    return goalMarks.some(
      (m) => Math.hypot(state.actor.x - m.x, state.actor.y - m.y) < 55
    );
  }
  // 几何判定：从绘制轨迹识别「闭合多边形」「正方形」。
  const segLengths = (points: { x: number; y: number }[]) => {
    const segs: number[] = [];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      if (len > 1) segs.push(len);
    }
    return segs;
  };
  const totalSegments = (paths: { points: { x: number; y: number }[] }[]) =>
    (paths ?? []).reduce((sum, p) => sum + segLengths(p.points).length, 0);
  const hasClosedPolygon = (paths: { points: { x: number; y: number }[] }[], minSides: number) =>
    (paths ?? []).some((p) => {
      const segs = segLengths(p.points);
      if (segs.length < minSides) return false;
      const max = Math.max(...segs), min = Math.min(...segs);
      if (max / min > 1.4) return false; // 不等长 → 不是正多边形
      const first = p.points[0], last = p.points[p.points.length - 1];
      if (Math.hypot(last.x - first.x, last.y - first.y) > max * 0.5) return false; // 不闭合
      return true;
    });
  const isSquareStroke = (points: { x: number; y: number }[]) => {
    const segs = segLengths(points);
    if (segs.length !== 4) return false;
    const max = Math.max(...segs), min = Math.min(...segs);
    if (max / min > 1.4) return false; // 不等长
    for (let i = 0; i < segs.length - 1; i++) {
      const v1x = points[i + 1].x - points[i].x, v1y = points[i + 1].y - points[i].y;
      const v2x = points[i + 2].x - points[i + 1].x, v2y = points[i + 2].y - points[i + 1].y;
      const dot = v1x * v2x + v1y * v2y;
      if (Math.abs(dot) > 0.3 * segs[i] * segs[i + 1]) return false; // 相邻边不垂直
    }
    return true;
  };
  const hasSquare = (paths: { points: { x: number; y: number }[] }[]) =>
    (paths ?? []).some((p) => isSquareStroke(p.points));

  // 自定义积木（函数）类：必须真正画出图形，不能「有函数定义就算完成」——
  // 这是修复「随便搭积木也能通过校验」的核心。
  if (FN_SLUGS.includes(project.slug)) {
    const paths = state.penPaths ?? [];
    if (project.slug === "fn_square") return hasSquare(paths);
    if (project.slug === "fn_polygon") return hasClosedPolygon(paths, 3);
    // 其余自定义积木项目：至少画出不少于 4 条线段，证明「真的用积木绘制了」。
    return totalSegments(paths) >= 4;
  }

  // 变量类（var）：必须真正产出「目标结果」，不能「用了变量就算完成」。
  // 这是与 FN 同一 P0 缺陷的收尾——逐项目用 goal 声明期望值，对运行时终态做断言。
  if (VAR_SLUGS.includes(project.slug)) {
    if (!project.goal) return false; // 未声明目标 → 不允许通过（杜绝随便搭）
    const goal = project.goal;
    const finalVars = state.vars ?? {};
    if (goal.vars) {
      for (const v of goal.vars) {
        const val = finalVars[v.name];
        if (typeof val !== "number") return false;
        if (v.equals !== undefined && val !== v.equals) return false;
        if (v.min !== undefined && val < v.min) return false;
        if (v.max !== undefined && val > v.max) return false;
      }
    }
    if (goal.drew && totalSegments(state.penPaths ?? []) < 4) return false;
    if (goal.moved && (state.movedDistance ?? 0) < 1) return false;
    if (goal.saidIncludes && goal.saidIncludes.length > 0) {
      const log = (state.log ?? []).join("\n");
      if (!goal.saidIncludes.some((s) => log.includes(s))) return false;
    }
    return true;
  }

  // 分类 C · 多角色与协作：程序必须真正 engage 了伙伴角色（控制它 / 广播给它 / 触碰或测量它）。
  // 伙伴在很多项目里是被动目标（如猫追老鼠的小老鼠、守护判断的对象），并非都要「动」，
  // 所以以「是否引用了伙伴角色」为信号，而非「伙伴是否执行了动作」。
  // 空程序不会 engage → 判定不通过，杜绝「随便搭积木也能通过校验」。
  if (MULTI_SLUGS.includes(project.slug)) {
    return state.companionEngaged === true;
  }

  // 分类 D · 键盘与操控游戏：必须真的配置了按键处理器。
  // 完成判定在「当开始运行」跑完时触发，按键在其后才执行，故校验注册数而非「真的按过」（时序安全，杜绝空程序通过）。
  if (KEY_SLUGS.includes(project.slug) || project.slug in D_GAME) {
    return (state.keyHandlers ?? 0) > 0;
  }

  // 其余（绘图/事件/条件/无标记序列）：以步骤判定为准
  return true;
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
  if (slug === "play_doremi") {
    if (stepId === 1) return "拖一个紫色「弹奏音符」积木（默认就是 do）放进绿色「当开始运行」里。";
    if (stepId === 2) return "在 do 下面再接两个「弹奏音符」，把音符分别改成 re、mi，二零就会唱出 do re mi。";
    if (stepId === 3) return "点「运行」，听二零弹出 do re mi！";
  }
  if (slug === "twinkle") {
    if (stepId === 1) return "从紫色「弹奏音符」积木开始搭。";
    if (stepId === 2) return "依次接 7 个「弹奏音符」，按顺序设成 do、do、sol、sol、la、la、sol，就是《小星星》第一句。";
    if (stepId === 3) return "点「运行」，听二零唱出《小星星》！";
  }
  if (slug === "drum_beat") {
    if (stepId === 1) return "先放一个「敲响 鼓」积木。";
    if (stepId === 2) return "把它放进「重复执行 8 次」里，并在它下面用「下一个」接一个「敲响 镲」，就成了一段节奏。";
    if (stepId === 3) return "点「运行」，听二零敲出咚嚓咚嚓的鼓点！";
  }
  if (slug === "random_note") {
    if (stepId === 1) return "拖一个橙色「随机弹一个音」积木。";
    if (stepId === 2) return "把它放进「重复执行 8 次」里，每次运行二零都会即兴弹出不同音符。";
    if (stepId === 3) return "多点几次「运行」，听二零每次不一样的随机小曲！";
  }
  if (slug === "loop_melody") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」，里面放「重复执行 4 次」。";
    if (stepId === 2) return "循环里依次放「弹奏音符」do、mi、sol，旋律就会一遍遍回荡。";
    if (stepId === 3) return "点「运行」，听循环旋律！";
  }
  if (slug === "pitch_by_click") {
    if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件。";
    if (stepId === 2) return "在事件里放「按点击位置弹音（越靠右越高）」，点不同位置音高会不同。";
    if (stepId === 3) return "点「运行」后在舞台上不同位置点几下，听音高随位置变化！";
  }
  if (slug === "pitch_by_move") {
    if (stepId === 1) return "先拖一个绿色「当开始运行」。";
    if (stepId === 2) return "放「重复执行 8 次」，里面先放「移动 40 步」，再用「下一个」接「按二零位置弹音」，边走边奏。";
    if (stepId === 3) return "点「运行」，听二零边走边弹出越来越高的音！";
  }
  if (slug === "chord") {
    if (stepId === 1) return "拖一个紫色「弹和弦」积木（默认就是 do、mi、sol 三个音）。";
    if (stepId === 2) return "和弦里至少放 2 个音符（默认三个），点运行就能同时听到饱满的和声。";
    if (stepId === 3) return "点「运行」，听几个音一起响起的厚实声音！";
  }
  if (slug === "birthday") {
    if (stepId === 1) return "从紫色「弹奏音符」积木开始搭。";
    if (stepId === 2) return "依次接 6 个「弹奏音符」，顺序为 sol、sol、la、sol、高音do、ti，就是《生日快乐歌》第一句。";
    if (stepId === 3) return "点「运行」，为小伙伴唱一首生日歌！";
  }
  if (slug === "compose") {
    if (stepId === 1) return "拖一个紫色「弹奏音符」积木开始你的创作。";
    if (stepId === 2) return "随便排至少 3 个「弹奏音符」（或用一个循环包住几个音），没有标准答案，好听就行。";
    if (stepId === 3) return "点「运行」，听二零唱出你的原创小曲！";
  }
  if (slug === "count10") {
    if (stepId === 1) return "先把橙色「重复执行 10 次」拖进绿色「当开始运行」里，二零才会一遍遍数。";
    if (stepId === 2) return "循环里放「变量 n 增加 1」，再用「说 变量 n」把数字说出来，二零就能数 1、2、3……10。";
    if (stepId === 3) return "点「运行」，听二零把 1 到 10 数出来！";
  }
  if (slug === "count_apples") {
    if (stepId === 1) return "用橙色「重复执行 5 次」包住「变量 n 增加 1」和「说 变量 n」，就能一个个数苹果。";
    if (stepId === 2) return "循环里每数一个就说出来，数到 5 个后，外面再放一个「说 一共 5 个苹果！」。";
    if (stepId === 3) return "点「运行」，听二零清点苹果。";
  }
  if (slug === "compare_size") {
    if (stepId === 1) return "先放两个「把变量 a 设为 8」「把变量 b 设为 3」，把两个数存起来。";
    if (stepId === 2) return "在「如果…那么」里放「比较 变量 a 大于 变量 b」，二零就能判断谁大。";
    if (stepId === 3) return "点「运行」，看二零比出大小！";
  }
  if (slug === "add_sub") {
    if (stepId === 1) return "拖一个粉色「说」，把数字口接上黄色「加」积木（左边 3、右边 5），二零就会算 3+5。";
    if (stepId === 2) return "再放一个「说」，接上黄色「减」积木（左边 8、右边 2），算一算 8-2。";
    if (stepId === 3) return "点「运行」，听二零报出 8 和 6！";
  }
  if (slug === "shape_names") {
    if (stepId === 1) return "先放绿色「落笔」，二零才会画出线来。";
    if (stepId === 2) return "把「移动 80 步」和「右转 90 度」都放进「重复执行 4 次」里，就画出正方形。";
    if (stepId === 3) return "最后放「说 我画了一个正方形！」，点运行看二零报名。";
  }
  if (slug === "symmetry") {
    if (stepId === 1) return "先「落笔」，用「移到」定位到左边。";
    if (stepId === 2) return "画完左边，再用「移到」定位到右边画一个一样的图形，左右就对称啦。";
    if (stepId === 3) return "点「运行」，看二零拼出对称图案！";
  }
  if (slug === "multiplication") {
    if (stepId === 1) return "先拖一个「重复执行 4 次」。";
    if (stepId === 2) return "里面放「变量 sum 增加 3」，把 3 加 4 次就是 3×4，再用「说 变量 sum」报答案。";
    if (stepId === 3) return "点「运行」，看二零用加法变出乘法！";
  }
  if (slug === "clock") {
    if (stepId === 1) return "「落笔」后放「重复执行 36 次」，里面「移动 10 步 + 右转 10 度」，就能画出圆圆的表盘。";
    if (stepId === 2) return "最后放「说 3 点整啦！」，给钟楼报时。";
    if (stepId === 3) return "点「运行」，看二零画出时钟。";
  }
  if (slug === "geometry_puzzle") {
    if (stepId === 1) return "先「落笔」，用「移到」定位画第一个图形。";
    if (stepId === 2) return "「抬笔」后再「落笔」，用「移到」定位到另一处画第二个图形，拼成一幅画。";
    if (stepId === 3) return "点「运行」，看二零拼出图案！";
  }
  if (slug === "calculator") {
    if (stepId === 1) return "先放「把变量 x 设为 12」「把变量 y 设为 7」，把两个数字存进变量。";
    if (stepId === 2) return "「说」的数字口接上「加」或「减」积木，左右都放进「变量 x」「变量 y」，二零就当小计算器。";
    if (stepId === 3) return "点「运行」，听二零算出答案！";
  }
  if (STORY_SLUGS.includes(slug)) {
    if (stepId === 1) return "先拖一个绿色「当开始运行」，把积木放进去，程序才会启动哦～";
    if (slug === "self_intro") {
      if (stepId === 2) return "在「当开始运行」里放紫色「说」，输入你的名字和爱好，二零就开口介绍自己啦！";
      if (stepId === 3) return "点「运行」，听二零说出自己的故事！";
    }
    if (slug === "expression") {
      if (stepId === 2) return "放粉色「让二零表情变成」积木，选开心或惊讶，再接「说」，二零的表情就会变来变去。";
      if (stepId === 3) return "点「运行」，看二零生动的表情表演！";
    }
    if (slug === "freeze") {
      if (stepId === 2) return "先放黄色「移动」让二零跑起来，再接紫色「说 我们都是木头人」，就完成口令啦！";
      if (stepId === 3) return "点「运行」，玩一局木头人游戏！";
    }
    if (slug === "animal_sports") {
      if (stepId === 2) return "先「说 运动会开始啦」，再用「重复执行」包住「移动」让二零一圈圈跑起来。";
      if (stepId === 3) return "点「运行」，看动物运动会开幕！";
    }
    if (slug === "word_chain") {
      if (stepId === 2) return "连放两个以上的紫色「说」，分别输入接龙的词（比如 苹果→果实→实力）。";
      if (stepId === 3) return "点「运行」，听二零玩词语接龙！";
    }
    if (slug === "birthday_party") {
      if (stepId === 2) return "先放「切换场景 白天」，再放「说 生日快乐！」和「说 大家一起吃蛋糕吧！」。";
      if (stepId === 3) return "点「运行」，一起给小伙伴庆祝！";
    }
    if (slug === "good_night") {
      if (stepId === 2) return "先「切换场景 夜晚」，再「说 月亮出来了」，最后「让二零表情变成 睡觉」并说晚安。";
      if (stepId === 3) return "点「运行」，听二零温柔地道晚安！";
    }
    if (slug === "two_talk") {
      if (stepId === 2) return "用「控制角色 二零」说一句，再「控制角色 三七」说一句，来回切换两个伙伴就聊起来啦！";
      if (stepId === 3) return "点「运行」，看二零和三七你一句我一句！";
    }
    if (slug === "a_day") {
      if (stepId === 2) return "多放几个「切换场景」（白天 / 学校 / 夜晚），每个场景接一句「说」，讲完一整天的故事。";
      if (stepId === 3) return "点「运行」，跟二零过完充实的一天！";
    }
    if (slug === "magic_show") {
      if (stepId === 2) return "先「说 看我变魔术」，再「隐藏角色 三七」接「说 不见啦」，最后「显示角色 三七」接「说 又回来啦」！";
      if (stepId === 3) return "点「运行」，看神奇的魔术秀！";
    }
  }
  if (SCIENCE_SLUGS.includes(slug)) {
    if (slug === "day_night") {
      if (stepId === 1) return "用橙色「当时间轴开始」开头，里面放「让背景明暗从 0 渐变到 220」，天空就会由亮变暗。";
      if (stepId === 2) return "再加「当时间到 5 秒 让二零说 天黑了」，时间走到那一刻就会自动冒出对话。";
      if (stepId === 3) return "点「运行」，用下方时间轴控件播放，看白天慢慢变成黑夜！";
    }
    if (slug === "rain") {
      if (stepId === 1) return "用橙色「当时间轴开始」，里面放「让天空下起雨」（设置下雨的时间段和密度）。";
      if (stepId === 2) return "加「当时间到 1 秒 让二零说 下雨啦」，提醒大家带伞。";
      if (stepId === 3) return "点「运行」播放时间轴，看雨点落下来吧！";
    }
    if (slug === "snow") {
      if (stepId === 1) return "用橙色「当时间轴开始」，里面放「让天空下起雪」（雪花比雨点更慢更轻柔）。";
      if (stepId === 2) return "加「当时间到 1 秒 让二零说 下雪了」，世界就变白了。";
      if (stepId === 3) return "点「运行」播放时间轴，看雪花飘落吧！";
    }
    if (slug === "volcano") {
      if (stepId === 1) return "用橙色「当时间轴开始」，里面放「让火山喷发」（橙红色岩浆向上飞）。";
      if (stepId === 2) return "加「当时间到 1 秒 让二零说 快躲远一点」，提醒注意安全。";
      if (stepId === 3) return "点「运行」播放时间轴，看火山喷发吧！";
    }
    if (slug === "color_wheel") {
      if (stepId === 1) return "用橙色「当时间轴开始」，在「当时间到 1 秒 让二零说」里，文字嵌套一个紫色「混合颜色」积木（比如 红 与 黄）。";
      if (stepId === 2) return "再多加几句「当时间到达」，分别混合 黄与蓝、红与蓝，二零会说出得到的颜色名字。";
      if (stepId === 3) return "点「运行」播放时间轴，看调色盘变出不同颜色！";
    }
    if (slug === "rainbow_bridge") {
      if (stepId === 1) return "用橙色「当时间轴开始」，放「让二零的左右位置从 -160 渐变到 160」，它会从左边走到右边。";
      if (stepId === 2) return "加「当时间到 8 秒 让二零说 看，彩虹出来啦」，走完就出现彩虹。";
      if (stepId === 3) return "点「运行」播放时间轴，看二零架起彩虹桥！";
    }
    if (slug === "seed_grow") {
      if (stepId === 1) return "用橙色「当时间轴开始」，放「让种子大小从 0.1 渐变到 1」，小种子会慢慢长大。";
      if (stepId === 2) return "再加一条「让种子的上下位置从 -80 渐变到 0」，让它从土里钻出来。";
      if (stepId === 3) return "点「运行」播放时间轴，看种子发芽长大！";
    }
    if (slug === "earth_sun") {
      if (stepId === 1) return "用橙色「当时间轴开始」，放「让地球绕中心转 1 圈」，它就会绕着太阳画圈。";
      if (stepId === 2) return "加「当时间到 1 秒 让二零说 我绕太阳转一圈就是一年」，讲清公转的意义。";
      if (stepId === 3) return "点「运行」播放时间轴，看地球公转吧！";
    }
    if (slug === "food_chain") {
      if (stepId === 1) return "用橙色「当时间轴开始」，放「让三七的左右位置从 160 渐变到 -40」，虫子会自己走过来。";
      if (stepId === 2) return "加「当时间到 4 秒 让二零说 虫子和我都被小鸟吃掉了」，讲食物链的关系。";
      if (stepId === 3) return "点「运行」播放时间轴，看食物链大冒险！";
    }
    if (slug === "moon_phase") {
      if (stepId === 1) return "用橙色「当时间轴开始」，放「让月亮的显示程度从 0.15 渐变到 1」，月牙会慢慢变圆。";
      if (stepId === 2) return "加「当时间到 1 秒 让二零说 我从弯弯的月牙变成圆圆的满月」，讲清月相变化。";
      if (stepId === 3) return "点「运行」播放时间轴，看月亮的脸变化吧！";
    }
  }
  if (PBL_SLUGS.includes(slug)) {
    if (slug === "singing_picture") {
      if (stepId === 1) return "先放绿色「落笔」，二零才会画出线来。";
      if (stepId === 2) return "把「移动」和「右转」都放进「重复执行」里面，二零才能一圈圈画出正方形。";
      if (stepId === 3) return "在画画之后接 3 个紫色「弹奏音符」（do、re、mi），二零就边画边唱啦！";
    }
    if (slug === "two_actor_show") {
      if (stepId === 1) return "先拖一个绿色「当开始运行」，把积木放进去，小剧场就开场了～";
      if (stepId === 2) return "用「控制角色 二零」让它变表情、说话，再用「控制角色 三七」让三七也表演，两个伙伴都出来才热闹。";
      if (stepId === 3) return "最后加一个「切换场景」并说一句，讲完这一幕，点运行看两个伙伴演戏！";
    }
    if (slug === "my_solar_system") {
      if (stepId === 1) return "用橙色「当时间轴开始」，里面放「让 二零 绕舞台中心转 1 圈」，它就会绕着太阳画圈。";
      if (stepId === 2) return "再放「让 二零 的大小 从 0.6 渐变到 1」，地球会一边转一边长大。";
      if (stepId === 3) return "加「当时间到 1 秒 让二零说 地球转一圈就是一年，大约365天」，点运行播放时间轴看公转！";
    }
    if (slug === "interactive_book") {
      if (stepId === 1) return "先拖一个蓝色「当舞台被点击」事件，点舞台才会触发互动。";
      if (stepId === 2) return "在事件里放「如果 碰到星星 那么 说 找到星星啦」，再接三个「飞向星星 1/2/3 号」收集起来。";
      if (stepId === 3) return "点「运行」后点一下舞台，二零会收集完所有星星并说「绘本讲完啦」，这本互动绘本就完成咯！";
    }
    if (slug === "two_actor_chat") {
      if (stepId === 1) return "拖一个绿色「当开始运行」事件，程序才会启动。";
      if (stepId === 2) return "用「控制角色 二零」让二零说话，再用「控制角色 三七」让三七接话——两个角色都要开口才算对话哦。";
      if (stepId === 3) return "点「运行」，看二零和三七是不是你一言我一语聊起来啦！";
    }
    if (slug === "relay_race") {
      if (stepId === 1) return "拖一个绿色「当开始运行」事件作为起跑枪。";
      if (stepId === 2) return "让二零重复前进，再用「广播 接棒」把接力棒交出去；另放「当接收到 接棒」让三七接棒继续跑。两个角色都要动起来！";
      if (stepId === 3) return "点「运行」，看接力棒从二零顺利传到三七手里没有。";
    }
    if (slug === "chorus") {
      if (stepId === 1) return "拖一个绿色「当开始运行」事件开始演唱。";
      if (stepId === 2) return "「控制角色 二零」连弹几个音符当主旋律，「控制角色 三七」弹一个和弦当伴奏——两个角色都要发出声音！";
      if (stepId === 3) return "点「运行」，听二零和三七是不是一起把歌声奏出来了。";
    }
    if (slug === "animal_queue") {
      if (stepId === 1) return "拖一个绿色「当开始运行」事件开始列队。";
      if (stepId === 2) return "「控制角色 二零」带队向前走，「控制角色 三七」用「如果 到二零的距离 大于 40 那么 移动」紧紧跟在后面，排成一支队伍。";
      if (stepId === 3) return "点「运行」，看两只小动物是不是整齐地列队前进。";
    }
  }
  return "照着左侧「二零说」的提示一步步搭积木，再点运行试试～";
}
