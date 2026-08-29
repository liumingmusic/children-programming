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
  // 13-16 代码过渡类（js 分类）：学生直接写 JS 调 __runtime API，同样的「落笔 + 循环移动转向」判定复用。
  "js_square",
];

/** 13-16 分类 K · 文本代码过渡（js 分类，Phase 1 铺满的 7 项）。
 * 与 js_square（纯绘图，已并入 DRAW_LOOP_SLUGS）不同：这 7 项分别瞄准一个 JS 语言概念
 * （输出 / 变量 / 函数 / 数组 / 计算工具 / 画布换色 / 积木→代码综合），
 * 判定同样基于**真实 JS 标记**（如 `function ` 定义、`const x = [` 数组字面量、`__runtime.say(`）
 * 与运行日志（[二零] 说话输出 / [系统] 程序执行完毕），空程序必然不通过。 */
const JS_CODE_SLUGS = [
  "js_hello", "js_variable", "js_function", "js_array", "js_tool", "js_canvas", "js_compare",
];

/**
 * 13-16 分类 M · 物理与模拟（phys 分类，Phase 2a 试点 2 项 + Phase 2b 补齐 5 项，共 7/7 满编）。
 * 与 js 分类不同：这里不再依赖画笔轨迹，而是「变量累积 + 循环 + 每帧擦掉重画」的模拟循环。
 * 判定同样基于**真实 JS 标记**：
 *   - `y = y + ...` / `v = v - ...` 形态 → 变量被循环反复改写（模拟的核心）
 *   - `__runtime.clearCanvas()` + `drawXxx(` + `__runtime.wait(` → 真的在逐帧擦掉重画
 *   - `if (` + `v = -v` / `vx[i] = -vx[i]` → 真的做了碰撞反弹
 *   - `Math.cos(` / `Math.sin(` → 圆周运动真的用三角函数换算坐标
 *   - 数组字面量 `[...]` + `px[i] = ...` 下标赋值 → 粒子系统真的用平行数组存状态
 * 空程序 / 只写注释必然不通过（最后一步还额外要求「程序执行完毕」日志）。
 */
const PHYS_CODE_SLUGS = [
  "phys_fall",
  "phys_bounce",
  "phys_parabola",
  "phys_gravity",
  "phys_spring",
  "phys_orbit",
  "phys_particle",
];

/**
 * 13-16 分类 N · 数据可视化（dataviz 分类，Phase 2c 一次铺满 7/7）。
 * 与物理模拟不同：这里的图大多是**静态**的（画一次即可，不需要 clearCanvas + wait 的动画循环），
 * 只有最后的「实时仪表盘」需要逐帧重画。因此判定不能照搬 PHYS 那套「逐帧重画」标记，
 * 而是抓每关真正要教的**数据 → 视觉属性映射**：
 *   - 数组字面量 `[...]`                     → 数据真的存在数组里
 *   - `data[i] * scale`                      → 数值被换算成了像素（缩放映射）
 *   - `lastX = x;` / `prev`                  → 折线图真的记住了上一个点
 *   - `Math.cos/sin` + `angle = angle + ...` → 饼图真的把份额换算成了角度
 *   - `counts[k] = counts[k] + 1`            → 直方图真的做了分组计数
 *   - `drawText(..., words[i], ..., size)`   → 词云的字号真的随权重变化
 *   - `.push(` + `.shift(`                   → 仪表盘真的用了滑动窗口
 * 空程序 / 只写注释必然不通过（最后一步仍要求「程序执行完毕」日志）。
 */
const DATAVIZ_CODE_SLUGS = [
  "dataviz_bar",
  "dataviz_line",
  "dataviz_pie",
  "dataviz_weather",
  "dataviz_scores",
  "dataviz_wordcloud",
  "dataviz_dashboard",
];

/**
 * 13-16 分类 O · 创意编程（creative 分类，Phase 2d 一次铺满 6/6）。
 * 这里不追求「算得对」，而是让学生体会**几条规则就能生成复杂图案**。判定抓各自的生成机制：
 *   - 数组 + `Math.cos/sin` 双层循环      → 曼陀罗的对称复制
 *   - `Math.random()` 出现多次           → 随机艺术真的引入了变化（且随机被用在绘图参数里）
 *   - 三角函数嵌套（`Math.cos(k * a)` 型）→ 生成艺术的参数方程
 *   - 函数体内调用自己                    → 分形树的递归（用大括号配对找出函数体再查）
 *   - 多个 `Math.sin` 且频率不同          → 噪声地形的多频波叠加
 *   - `v = v * 0.97` 形态的速度衰减       → 粒子烟花的阻尼
 * 空程序 / 只写注释必然不通过（最后一步仍要求「程序执行完毕」日志）。
 */
const CREATIVE_CODE_SLUGS = [
  "creative_mandala",
  "creative_random",
  "creative_generative",
  "creative_tree",
  "creative_terrain",
  "creative_firework",
];

/**
 * 13-16 分类 P · 网页 / 小游戏（web 分类，Phase 2e 铺满 6/6）。
 * 这一分类首次引入「安全 DOM 面板」——学生用 __runtime.ui.* 声明按钮 / 输入框 / 文本 / 标题，
 * 运行时把这些描述交给 StagePlayer 渲染成真实 HTML（而非画布像素）。判定仍基于**真实 JS 标记**：
 *   - `__runtime.ui.input(`                   → 真的用输入框收集用户输入
 *   - `__runtime.ui.button(` + `ui.value(` + `ui.set(` → 真的用按钮触发并回写结果（计算器）
 *   - `.push(` + `ui.clear(`                  → 真的用列表存数据并刷新面板（待办 / 聊天）
 *   - `ui.clear(` + `ui.input(` + `===`       → 真的先展示、再隐藏回忆、再比对（记忆）
 *   - `__runtime.startLoop(` + `ui.key(` + `setPos(` + `v = v -` → 真的做了实时键盘操控游戏（跳跃）
 * 空程序 / 只写注释必然不通过（最后一步还要求「程序执行完毕」日志）。
 */
const WEB_CODE_SLUGS = [
  "web_calculator", "web_todo", "web_memory", "web_typing", "web_platformer", "web_chatbot",
];

/** 13-16 分类 L · 算法与数据结构（Phase 3a，8 项）。 */
const ALGO_CODE_SLUGS = [
  "algo_bubble", "algo_binary", "algo_stack", "algo_maze", "algo_fib", "algo_prime", "algo_string", "algo_greedy",
];

/** 13-16 分类 Q · AI 启蒙（Phase 3b，6 项）。 */
const AI_CODE_SLUGS = [
  "ai_tree", "ai_knn", "ai_bayes", "ai_perceptron", "ai_recommend", "ai_network",
];

/** 13-16 分类 R · 毕业项目（Phase 3c，5 项）。 */
const CAPSTONE_CODE_SLUGS = [
  "capstone_game", "capstone_data", "capstone_tool", "capstone_oss", "capstone_portfolio",
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

/** 分类 H · 综合小游戏（9-12 阶段，全 8 项）。
 * 复用三套已验证的判定模型（与 D / G / multi 同思路，杜绝「随便搭积木也能通过」）：
 *  - 键盘操控型（game_snake / game_shooter / game_dodge / game_race）：isGoalAchieved 只校验「真的配置了按键处理器」(keyHandlers>0)，
 *    computeSteps 用真实 JS 标记把关（按键 + 移动 + 碰撞结算）。
 *  - 逻辑 / 数据型（game_guess / game_memory / game_2048lite）：用「真实结果」把关——game_guess 靠「说 猜中啦」，
 *    game_memory / game_2048lite 靠「非空列表 + 说 目标词」。
 *  - 多角色型（game_puzzle）：靠 companionEngaged（真的控制了伙伴角色 三七）。
 * 空程序 / 只搭一半 必然不通过。 */
const GAME9_SLUGS = [
  "game_snake", "game_shooter", "game_dodge", "game_race",
  "game_guess", "game_memory", "game_2048lite", "game_puzzle",
];
/** 键盘操控型综合小游戏：碰撞检测标记 + 是否计分（与 D_GAME 同构）。 */
const GAME9_KEY: Record<string, { collide: string; score: boolean }> = {
  game_snake: { collide: "__runtime.touchingApple(", score: true },
  game_shooter: { collide: "__runtime.touchingCloud(", score: true },
  game_dodge: { collide: "__runtime.touchingCloud(", score: false },
  game_race: { collide: "__runtime.touchingApple(", score: true },
};

/** 分类 I · 交互绘本与故事（9-12 阶段）。判定基于真实 JS 标记：必须真的配置了「舞台点击事件」（空程序则为 0）。
 * 交互绘本的本质是「点击触发」，完成判定以注册点击处理器数量为信号（与键盘类同思路，时序安全）。 */
const STORY9_SLUGS = [
  "story_branch", "story_clickable", "story_adventure", "story_growth", "story_science", "story_card",
];

/** 分类 E · 音乐创作（9-12 阶段，全 8 项）。判定基于真实运行时信号：程序运行过程中「真的播放过声音」（sounded）。
 * 与多角色 companionEngaged / 键盘 keyHandlers 同源——发声动作在 performAction 时同步置位 sounded，
 * 完成判定在「程序执行完毕」时据此把关，空程序（不发声）必然不通过，杜绝「随便搭积木也能通过」。 */
const MUSIC9_SLUGS = [
  "music_doremi", "music_twinkle", "music_loop", "music_random",
  "music_pitch_pos", "music_chord", "music_birthday", "music_compose",
];

/** 分类 F · 数学与逻辑进阶（9-12 阶段，全 8 项；math_sudoku 数独填空复用列表判定模型，归在 LIST9_SLUGS）。
 * 其余 7 项判定复用 VAR 的「goal 真实结果断言」分支（声明 saidIncludes / drew，空程序无输出必然不通过）。 */
const MATH9_SLUGS = [
  "math_mul_table", "math_factor_prime", "math_area", "math_fib",
  "math_prime_sieve", "math_polygon", "math_coords",
];

/** 分类 J · 科学探究（9-12 阶段，全 7 项）。复用分类 10·科学的时间轴引擎（marker_tween_prop / maker_orbit /
 * maker_emit_* / maker_when_at_* 生成 __runtime.timeline 轨道），判定逻辑与 6-8 科学一致：
 * 基于真实 JS 标记（hasTimeline / hasAddTrack / 能力轨道 tween·orbit·particles / hasWhenAt），
 * 空程序（只 reset 无 addTrack）必然 step1 不通过，杜绝「随便搭积木也能通过」。
 * 注意：时间轴项目在 LearnPageClient 走独立分支，完成判定只看 computeSteps（不进 isGoalAchieved），故此处仅补 computeSteps + coach。 */
const SCIENCE9_SLUGS = [
  "science_day_night", "science_seasons", "science_orbit", "science_water_cycle",
  "science_grow", "science_sound", "science_light",
];

/** 分类 G · 列表与数据（9-12 阶段，全 8 项）。依赖「列表」运行时基石（setList / listAppend / listItem /
 * listLength / listRemoveAt / listSetItem / getList）。
 * 完成判定（isGoalAchieved）双保险：① state 里存在「非空列表」（证明新建并填充了列表）；
 * ② 项目声明的 goal.saidIncludes 子串出现在运行日志（证明把列表内容展示了出来）。
 * 空程序（只新建空表 / 不展示）必然不通过，杜绝「随便搭积木也能通过」。
 * 注意：本项目为非时间轴（事件驱动「当开始运行」），isGoalAchieved 走非 timeline 分支，故此处 computeSteps 仅作三步引导 UI，
 * 最终完成把关在 isGoalAchieved 的 LIST9 分支。 */
const LIST9_SLUGS = [
  "list_shopping", "list_rollcall", "list_ranking", "list_lottery",
  "list_todo", "list_words", "list_scores", "list_queue",
  "math_sudoku",
];

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
    } else if (JS_CODE_SLUGS.includes(project.slug)) {
      // 13-16 代码模式：判定基于「学生手写 JS 的真实标记」+ 运行日志（杜绝空程序 / 只写注释通过）。
      const hasSay = code.includes("__runtime.say(");
      const hasColor =
        code.includes("__runtime.setPenColor") ||
        code.includes("__runtime.changePenColor");
      const hasVar = /\b(let|const|var)\b/.test(code);
      const hasFunc = /function\s+\w+\s*\(/.test(code);
      const hasArray = /\b(?:let|const|var)\s+\w+\s*=\s*\[/.test(code);
      // 去掉 // 行注释再判运算，否则只写一句注释里的「/」也会被误判为「有计算」
      const codeNoComment = code.replace(/\/\/.*$/gm, "");
      const hasArith = /[\*/]/.test(codeNoComment) || /Math\./.test(codeNoComment);
      // 变量是否真的「用」在了画图指令里（move/turn 的参数是变量名而非写死的数字）。
      // 仅凭 /\blet\b/ 判断会被 for 循环的计数器 let i 蒙混过关，故额外校验这一条。
      const usesVarInDraw =
        /__runtime\.move\(\s*[A-Za-z_$]/.test(code) ||
        /__runtime\.turn\(\s*[A-Za-z_$]/.test(code);
      const saidOutput = logs.some((l) => l.startsWith("[二零]"));
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "js_hello") {
        // 输出类：写了 say → 真的说出话（[二零] 日志）→ 跑完
        if (id === 1) done = hasSay;
        else if (id === 2) done = saidOutput;
        else if (id === 3) done = finished;
      } else if (project.slug === "js_variable") {
        if (id === 1) done = hasVar;
        else if (id === 2)
          done =
            code.includes("__runtime.penDown()") &&
            hasLoop &&
            code.includes("__runtime.move") &&
            code.includes("__runtime.turn") &&
            usesVarInDraw;
        else if (id === 3) done = finished;
      } else if (project.slug === "js_function") {
        // 函数类：真的定义了函数（function 名(...)）并真的画出了图形
        if (id === 1) done = hasFunc;
        else if (id === 2)
          done =
            code.includes("__runtime.penDown()") &&
            code.includes("__runtime.move") &&
            code.includes("__runtime.turn");
        else if (id === 3) done = finished;
      } else if (project.slug === "js_array") {
        if (id === 1) done = hasArray;
        else if (id === 2)
          done =
            code.includes("__runtime.penDown()") &&
            hasLoop &&
            code.includes("__runtime.move") &&
            code.includes("__runtime.turn");
        else if (id === 3) done = finished;
      } else if (project.slug === "js_tool") {
        // 计算工具类：真的算了（* / / / Math.）并把结果说出来
        if (id === 1) done = hasArith;
        else if (id === 2) done = hasSay;
        else if (id === 3) done = finished;
      } else if (project.slug === "js_canvas") {
        if (id === 1) done = code.includes("__runtime.penDown()");
        else if (id === 2)
          done =
            hasLoop &&
            code.includes("__runtime.move") &&
            code.includes("__runtime.turn") &&
            hasColor;
        else if (id === 3) done = finished;
      } else if (project.slug === "js_compare") {
        // 综合复习：落笔画 → 换色 → 说话 → 跑完
        if (id === 1)
          done =
            code.includes("__runtime.penDown()") &&
            code.includes("__runtime.move") &&
            code.includes("__runtime.turn");
        else if (id === 2) done = hasColor;
        else if (id === 3) done = hasSay;
        else if (id === 4) done = finished;
      }
    } else if (PHYS_CODE_SLUGS.includes(project.slug)) {
      // 13-16 物理模拟类：判定「变量被循环改写」+「逐帧擦掉重画」+「碰撞反弹」，
      // 全部基于真实 JS 标记；去掉行注释，避免注释里的示例被误判。
      const codeNoComment = code.replace(/\/\/.*$/gm, "");
      const hasVar = /\b(let|const|var)\b/.test(codeNoComment);
      const hasClear = code.includes("__runtime.clearCanvas()");
      const hasWait = code.includes("__runtime.wait(");
      const hasDraw =
        code.includes("__runtime.drawCircle(") ||
        code.includes("__runtime.drawRect(") ||
        code.includes("__runtime.drawLine(") ||
        code.includes("__runtime.drawText(");
      // 变量被「自己加上/减去一个增量」地反复改写 —— 模拟循环的核心形态。
      // 正则允许变量名带后缀与下标（v / vy / vs[i] 都算），因为各关的命名并不统一。
      // 变量名允许带后缀与下标（v / vy / vs[i] 都算），因为各关的命名并不统一。
      const updatesPosition = /\by[\w\[\]]*\s*=\s*y[\w\[\]]*\s*[-+]/.test(codeNoComment);
      const updatesVelocity = /\bv[\w\[\]]*\s*=\s*v[\w\[\]]*\s*[-+]/.test(codeNoComment);
      const updatesX = /\bx[\w\[\]]*\s*=\s*x[\w\[\]]*\s*[-+]/.test(codeNoComment);
      const hasIf = /\bif\s*\(/.test(codeNoComment);
      const reversesVelocity = /\bv[\w\[\]]*\s*=\s*-\s*v[\w\[\]]*/.test(codeNoComment);
      // 数组下标被赋值（vs[i] = ...）→ 真的是「一组数据 + 一次循环」在驱动多个物体
      const updatesIndexed = /\b\w+\s*\[\s*\w+\s*\]\s*=\s*[^=]/.test(codeNoComment);
      const hasArrayLiteral = /\b(?:let|const|var)\s+\w+\s*=\s*\[/.test(codeNoComment);
      // 圆周运动：真的用三角函数把角度换算成坐标
      const usesTrig = /Math\.(cos|sin)\s*\(/.test(codeNoComment);
      const updatesAngle = /\bangle\s*=\s*angle\s*[-+]/.test(codeNoComment);
      // 弹簧：速度的增量里引用了位移变量 x（v = v + (-k * x) * dt），即「力与位移成正比」
      const springPull = /\bv[\w\[\]]*\s*=\s*v[\w\[\]]*\s*[-+][^;]*\bx\b/.test(codeNoComment);
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "phys_fall") {
        // 变量记状态 → 循环里改写速度/位置并逐帧重画 → 跑完
        if (id === 1) done = hasVar && (updatesPosition || updatesVelocity);
        else if (id === 2)
          done = hasLoop && updatesPosition && updatesVelocity && hasClear && hasDraw && hasWait;
        else if (id === 3) done = finished;
      } else if (project.slug === "phys_bounce") {
        if (id === 1) done = hasLoop && updatesPosition && updatesVelocity;
        else if (id === 2) done = hasIf && reversesVelocity;
        else if (id === 3) done = hasClear && hasDraw && finished;
      } else if (project.slug === "phys_parabola") {
        // 水平匀速 + 竖直加速：两个方向必须各有一条自更新语句，且逐帧重画
        if (id === 1) done = updatesX && updatesVelocity;
        else if (id === 2) done = hasLoop && hasClear && hasDraw && hasWait;
        else if (id === 3) done = finished;
      } else if (project.slug === "phys_gravity") {
        // 平行数组：数组字面量 + 下标赋值（vs[i] = ...）+ 撞地停下
        if (id === 1) done = hasArrayLiteral && updatesIndexed;
        else if (id === 2) done = updatesVelocity && hasIf;
        else if (id === 3) done = hasClear && hasDraw && finished;
      } else if (project.slug === "phys_spring") {
        // 位移自更新 + 速度的增量里引用了位移（力与位移成正比、方向相反）
        if (id === 1) done = hasVar && (updatesPosition || updatesX);
        else if (id === 2) done = springPull;
        else if (id === 3) done = hasClear && hasDraw && finished;
      } else if (project.slug === "phys_orbit") {
        // 三角函数换算坐标 + 角度匀速自增 + 逐帧重画
        if (id === 1) done = usesTrig;
        else if (id === 2) done = updatesAngle && hasLoop && hasClear && hasDraw && hasWait;
        else if (id === 3) done = finished;
      } else if (project.slug === "phys_particle") {
        // 粒子系统：平行数组存状态 + 遍历更新 + 碰撞速度反向
        if (id === 1) done = hasArrayLiteral && updatesIndexed;
        else if (id === 2) done = updatesVelocity && hasIf && reversesVelocity;
        else if (id === 3) done = hasClear && hasDraw && finished;
      }
    } else if (DATAVIZ_CODE_SLUGS.includes(project.slug)) {
      // 13-16 数据可视化类：抓「数据 → 视觉属性」的那一步，而非「有没有在动」。
      // 前 6 项是静态图（画一次即可），只有仪表盘需要逐帧重画，故判定按项目分开写。
      const codeNoComment = code.replace(/\/\/.*$/gm, "");
      const hasArrayLiteral = /\b(?:let|const|var)\s+\w+\s*=\s*\[/.test(codeNoComment);
      const hasText = code.includes("__runtime.drawText(");
      const hasRect = code.includes("__runtime.drawRect(");
      const hasLine = code.includes("__runtime.drawLine(");
      const hasCircle = code.includes("__runtime.drawCircle(");
      const hasClear = code.includes("__runtime.clearCanvas()");
      const hasWait = code.includes("__runtime.wait(");
      const usesTrig = /Math\.(cos|sin)\s*\(/.test(codeNoComment);
      // 数值 → 像素：`data[i] * scale`（数组元素参与了乘法）
      const scalesArrayValue =
        /\w+\s*\[\s*\w+\s*\]\s*\*/.test(codeNoComment) ||
        /\*\s*\w+\s*\[\s*\w+\s*\]/.test(codeNoComment);
      // 折线图：记住了上一个点（lastX / prevX 之类的变量被赋值）
      const remembersLast = /\b(last|prev)\w*\s*=/.test(codeNoComment);
      // 饼图：角度被累加（angle = angle + ...）
      const accumulatesAngle = /\bangle\s*=\s*angle\s*[-+]/.test(codeNoComment);
      // 直方图：分组计数（counts[k] = counts[k] + 1）
      const countsIntoBucket =
        /\w+\s*\[\s*\w+\s*\]\s*=\s*\w+\s*\[\s*\w+\s*\]\s*\+/.test(codeNoComment);
      // 分桶前先按区间判断（if (s >= 90) else if (s >= 80) ... 至少两段分支）
      const bucketBranch = (codeNoComment.match(/else\s+if\s*\(/g) ?? []).length >= 2;
      // 词云的字号是否随权重变化：检查 drawText 的**最后一个参数**（字号）是不是写死的数字。
      // 只查「drawText 里出现了数组下标」是不够的——那可能只是词的数组 words[i]，
      // 字号照样写死，图也就没有表达任何数据。
      const lastArgs = (codeNoComment.match(/__runtime\.drawText\([^()]*\)/g) ?? []).map((c) => {
        const inner = c.slice(c.indexOf("(") + 1, -1);
        const parts = inner.split(",");
        return parts[parts.length - 1].trim();
      });
      const sizeIsDynamic = lastArgs.some(
        (a) =>
          !/^-?\d+(\.\d+)?$/.test(a) &&
          (/\[\s*\w+\s*\]/.test(a) || /^[A-Za-z_$][\w$]*$/.test(a))
      );
      // 滑动窗口：新数据 push、老数据 shift
      const usesPush = /\.\s*push\s*\(/.test(codeNoComment);
      const usesShift = /\.\s*shift\s*\(/.test(codeNoComment);
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "dataviz_bar") {
        // 数组存数据 → 循环按数值画柱子（高度 = 数值 × 缩放）→ 跑完
        if (id === 1) done = hasArrayLiteral;
        else if (id === 2) done = hasLoop && hasRect && scalesArrayValue;
        else if (id === 3) done = finished;
      } else if (project.slug === "dataviz_line") {
        // 数组存数据 → 记住上一个点、把相邻点连起来 → 跑完
        if (id === 1) done = hasArrayLiteral;
        else if (id === 2) done = hasLoop && hasCircle && hasLine && remembersLast;
        else if (id === 3) done = finished;
      } else if (project.slug === "dataviz_pie") {
        // 份额 → 角度 → 三角函数换算坐标
        if (id === 1) done = hasArrayLiteral;
        else if (id === 2) done = usesTrig && accumulatesAngle && hasLine;
        else if (id === 3) done = finished;
      } else if (project.slug === "dataviz_weather") {
        // 求总和/极值 + 让颜色随数据变化 + 用文字标注数值
        if (id === 1) done = hasArrayLiteral && /\bsum\s*=\s*sum\s*\+/.test(codeNoComment);
        else if (id === 2) done = hasLoop && hasRect && hasText && /\bif\s*\(/.test(codeNoComment);
        else if (id === 3) done = finished;
      } else if (project.slug === "dataviz_scores") {
        // 先分组计数（分桶），再按最高桶自动缩放画直方图
        if (id === 1) done = hasArrayLiteral && countsIntoBucket && bucketBranch;
        else if (id === 2) done = hasLoop && hasRect && scalesArrayValue;
        else if (id === 3) done = finished;
      } else if (project.slug === "dataviz_wordcloud") {
        // 字号随权重变化（drawText 的字号/内容取自数组元素）
        if (id === 1) done = hasArrayLiteral && /\[\s*"/.test(codeNoComment);
        else if (id === 2) done = hasLoop && hasText && sizeIsDynamic;
        else if (id === 3) done = finished;
      } else if (project.slug === "dataviz_dashboard") {
        // 滑动窗口：push 新数据、shift 老数据，并逐帧擦掉重画
        if (id === 1) done = hasArrayLiteral && usesPush;
        else if (id === 2) done = hasLoop && usesShift && hasClear && hasWait;
        else if (id === 3) done = finished;
      }
    } else if (CREATIVE_CODE_SLUGS.includes(project.slug)) {
      // 13-16 创意编程类：抓各自的「生成机制」，证明图案是算出来的而不是随手画的。
      const codeNoComment = code.replace(/\/\/.*$/gm, "");
      const hasArrayLiteral = /\b(?:let|const|var)\s+\w+\s*=\s*\[/.test(codeNoComment);
      const hasCircle = code.includes("__runtime.drawCircle(");
      const hasLine = code.includes("__runtime.drawLine(");
      const hasClear = code.includes("__runtime.clearCanvas()");
      const hasWait = code.includes("__runtime.wait(");
      const usesTrig = /Math\.(cos|sin)\s*\(/.test(codeNoComment);
      const randomCount = (codeNoComment.match(/Math\.random\s*\(/g) ?? []).length;
      const sinCount = (codeNoComment.match(/Math\.sin\s*\(/g) ?? []).length;
      // 多个不同频率的波叠加：Math.sin 里出现至少两个不同的频率系数
      const multiFreq =
        sinCount >= 3 &&
        new Set(codeNoComment.match(/Math\.sin\(\s*\w+\s*\*\s*([\d.]+)/g) ?? []).size >= 3;
      // 参数方程：三角函数的参数里是一个「系数 * 角度」的复合表达式。
      // 注意参数里可能带嵌套括号（如 Math.cos((R - r) / r * a)），故用非贪婪的 [\s\S]*?，
      // 不能写成 [^()]*——那会在 (R - r) 的第一个 ) 处提前截断。
      const nestedTrig = /Math\.(cos|sin)\([\s\S]*?\*\s*[a-zA-Z_$][\w$]*\s*\)/.test(codeNoComment);
      // 递归：找出函数体（大括号配对），再看里面有没有调用自己
      const recurses = (() => {
        const m = codeNoComment.match(/function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/);
        if (!m) return false;
        const name = m[1];
        const start = m.index! + m[0].length - 1; // 指向函数体的左花括号
        let depth = 0;
        let end = start;
        for (let k = start; k < codeNoComment.length; k++) {
          if (codeNoComment[k] === "{") depth++;
          else if (codeNoComment[k] === "}") {
            depth--;
            if (depth === 0) { end = k; break; }
          }
        }
        return new RegExp(`\\b${name}\\s*\\(`).test(codeNoComment.slice(start, end));
      })();
      // 阻尼：速度被乘上一个小于 1 的系数。乘数可能是字面量（v * 0.97）也可能是变量（v * drag），
      // 故两者都接受；但只认小数或变量，不接受 v * 2 这种放大写法。
      const hasDrag = /\bv[\w\[\]]*\s*=\s*v[\w\[\]]*\s*\*\s*(0?\.\d+|[A-Za-z_$][\w$]*)\s*;/.test(
        codeNoComment
      );
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "creative_mandala") {
        // 数组描述各层参数 → 双层循环用极坐标把小圆排成一圈圈
        if (id === 1) done = hasArrayLiteral;
        else if (id === 2) done = hasLoop && hasCircle && usesTrig;
        else if (id === 3) done = finished;
      } else if (project.slug === "creative_random") {
        // 随机制造变化，且随机被真正用在绘图参数里
        if (id === 1) done = randomCount >= 2;
        else if (id === 2) done = hasLoop && hasCircle && randomCount >= 2;
        else if (id === 3) done = finished;
      } else if (project.slug === "creative_generative") {
        // 参数方程（三角函数嵌套）算坐标 → 画点成线
        if (id === 1) done = hasLoop && usesTrig && nestedTrig;
        else if (id === 2) done = hasCircle;
        else if (id === 3) done = finished;
      } else if (project.slug === "creative_tree") {
        // 定义函数 → 函数体内调用自己（递归）
        if (id === 1) done = /function\s+\w+\s*\(/.test(codeNoComment);
        else if (id === 2) done = recurses && hasLine;
        else if (id === 3) done = finished;
      } else if (project.slug === "creative_terrain") {
        // 多个不同频率的波叠加 → 把高度画成山体
        if (id === 1) done = multiFreq;
        else if (id === 2) done = hasLoop && hasLine;
        else if (id === 3) done = finished;
      } else if (project.slug === "creative_firework") {
        // 粒子炸开（平行数组）→ 重力 + 阻尼，并逐帧擦掉重画
        if (id === 1) done = hasArrayLiteral && usesTrig;
        else if (id === 2) done = hasDrag && hasClear && hasWait && hasLoop;
        else if (id === 3) done = finished;
      }
    } else if (WEB_CODE_SLUGS.includes(project.slug)) {
      // 13-16 网页 / 小游戏：抓「学生真的用 DOM 面板交互 / 用游戏循环操控角色」的真实标记。
      const codeNoComment = code.replace(/\/\/.*$/gm, "");
      const hasInput = code.includes("__runtime.ui.input(");
      const hasButton = code.includes("__runtime.ui.button(");
      const hasValue = code.includes("__runtime.ui.value(");
      const hasSet = code.includes("__runtime.ui.set(");
      const hasShow = code.includes("__runtime.ui.text(") || code.includes("__runtime.ui.heading(");
      const hasClear = code.includes("__runtime.ui.clear(");
      const hasPush = /\.\s*push\s*\(/.test(codeNoComment);
      const hasIf = /\bif\s*\(/.test(codeNoComment);
      const hasCompare = /===|!==/.test(codeNoComment);
      const hasStartLoop = code.includes("__runtime.startLoop(");
      const hasKey = code.includes("__runtime.key(");
      const hasSetPos = code.includes("__runtime.setPos(");
      // 重力 / 速度的「自更新」（v = v - g*dt 形态），平台跳跃的核心。
      const updatesVelocity = /\bv[\w\[\]]*\s*=\s*v[\w\[\]]*\s*[-+]/.test(codeNoComment);
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "web_calculator") {
        // 输入框收集算式 → 按钮触发并把结果写回面板 → 跑完
        if (id === 1) done = hasInput;
        else if (id === 2) done = hasButton && hasValue && hasSet;
        else if (id === 3) done = finished;
      } else if (project.slug === "web_todo") {
        // 输入框收集任务 → 加到列表并重新渲染面板 → 跑完
        if (id === 1) done = hasInput;
        else if (id === 2) done = hasPush && hasClear;
        else if (id === 3) done = finished;
      } else if (project.slug === "web_memory") {
        // 先展示要记的内容 → 隐藏让用户凭记忆输入 → 比对并反馈
        if (id === 1) done = hasShow;
        else if (id === 2) done = hasClear && hasInput;
        else if (id === 3) done = hasButton && hasCompare && finished;
      } else if (   project.slug === "web_typing") {
        // 展示目标词 → 输入框收集用户输入 → 比对并统计
        if (id === 1) done = hasShow;
        else if (id === 2) done = hasInput;
        else if (id === 3) done = hasButton && hasCompare && finished;
      } else if (project.slug === "web_platformer") {
        // 启动游戏循环 → 用键盘控制移动并用重力落地 → 跑完
        if (id === 1) done = hasStartLoop;
        else if (id === 2) done = hasKey && hasSetPos && updatesVelocity;
        else if (id === 3) done = finished;
      } else if (project.slug === "web_chatbot") {
        // 输入框收集消息 → 按关键词规则（if + includes）生成回复并记录对话 → 展示对话
        // 注意：聊天机器人用的是「包含关键词」判断（msg.includes(...)），不是 === 比较，
        // 故 id2 只要求 push + if，不放 hasCompare（避免把示范代码判失败）。
        if (id === 1) done = hasInput;
        else if (id === 2) done = hasPush && hasIf;
        else if (id === 3)  done = hasButton && hasShow && finished;
      }
    } else if (ALGO_CODE_SLUGS.includes(project.slug)) {
      // 13-16 算法可视化：抓「学生真的写了数组/循环/递归/查找/图，并用画布画出来」的真实标记。
      const codeNoComment = code.replace(/\/\/.*$/gm, "");
      const hasArray = /(const|let|var)\s+\w+\s*=\s*\[/.test(codeNoComment);
      const hasLoop = /\b(for|while)\b/.test(codeNoComment);
      const hasFunction = /function\s+\w+\s*\(/.test(codeNoComment);
      const hasDraw = /__runtime\.(drawRect|drawCircle|drawText|drawLine)\(/.test(codeNoComment);
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "algo_bubble") {
        // 声明数组 → 循环里比较相邻并交换 → 画出来
        if (id === 1) done = hasArray;
        else if (id === 2) done = hasLoop && /a\[j\]\s*>\s*a\[j\s*\+\s*1\]/.test(codeNoComment) && /a\[j\]\s*=\s*a\[j\s*\+\s*1\]/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "algo_binary") {
        // 声明有序数组 → while 折半（取中间、比较、缩边界）→ 画出来
        if (id === 1) done = hasArray;
        else if (id === 2) done = /while\s*\(/.test(codeNoComment) && /Math\.floor\(/.test(codeNoComment) && /a\[mid\]/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "algo_stack") {
        // 空数组 → push 入栈 + pop 出栈 → 画出来
        if (id === 1) done = hasArray;
        else if (id === 2) done = /\.\s*push\s*\(/.test(codeNoComment) && /\.\s*pop\s*\(|\.\s*shift\s*\(/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "algo_maze") {
        // 二维数组地图 → 队列 BFS（push + shift + visited）→ 画出来
        if (id === 1) done = /const\s+\w+\s*=\s*\[\[/.test(codeNoComment);
        else if (id === 2) done = /\.\s*push\s*\(/.test(codeNoComment) && /\.\s*shift\s*\(/.test(codeNoComment) && /visited/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "algo_fib") {
        // 写递归函数 → 必须有自调用（fib(参数-1) 这种递归形态）→ 画出来
        if (id === 1) done = hasFunction;
        else if (id === 2) done = /fib\s*\(\s*\w+\s*-\s*1\s*\)/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "algo_prime") {
        // 循环试除 → 取余判断整除且只试到根号（i*i<=n）→ 画出来
        if (id === 1) done = hasLoop;
        else if (id === 2) done = /%/.test(codeNoComment) && /i\s*\*\s*i\s*<=/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "algo_string") {
        // 声明字符串 → 遍历字符并计数（counts[...]）→ 画出来
        if (id === 1) done = /let\s+\w+\s*=\s*"[^"]*"/.test(codeNoComment);
        else if (id === 2) done = hasLoop && /counts\[/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "algo_greedy") {
        // 声明面额数组与金额 → 循环 + while 贪心不断减（amount - coins[i]）→ 画出来
        if (id === 1) done = hasArray;
        else if (id === 2)  done = hasLoop && /while\s*\(/.test(codeNoComment) && /=.*-\s*coins\[/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      }
    } else if (AI_CODE_SLUGS.includes(project.slug)) {
      // 13-16 AI 启蒙：抓「学生真的用了 AI 概念（决策树归类 / 相似度 / 证据计数 / 训练更新 / 前向传播）并用画布画出」的真实标记。
      const codeNoComment = code.replace(/\/\/.*$/gm, "");
      const hasArray = /(const|let|var)\s+\w+\s*=\s*\[/.test(codeNoComment);
      const hasLoop = /\b(for|while)\b/.test(codeNoComment);
      const hasDraw = /__runtime\.(drawRect|drawCircle|drawText|drawLine)\(/.test(codeNoComment);
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "ai_tree") {
        if (id === 1) done = /function\s+\w+\s*\(/.test(codeNoComment);
        else if (id === 2) done = /if\s*\(/.test(codeNoComment) && /else/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "ai_knn") {
        if (id === 1) done = hasArray;
        else if (id === 2) done = hasLoop && /Math\.hypot/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "ai_bayes") {
        if (id === 1) done = /(const|let)\s+\w*[Ww]ords/.test(codeNoComment);
        else if (id === 2) done = hasLoop && /msg\.includes/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "ai_perceptron") {
        if (id === 1) done = hasArray;
        else if (id === 2) done = hasLoop && /err/.test(codeNoComment) && /w0|w1|b/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "ai_recommend") {
        if (id === 1) done = hasArray;
        else if (id === 2) done = /Math\.(sqrt|cos)/.test(codeNoComment) || /\.\s*dot/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      } else if (project.slug === "ai_network") {
        if (id === 1)  done = hasArray;
        else if (id === 2) done = hasLoop && /w1|w2/.test(codeNoComment);
        else if (id === 3) done = hasDraw && finished;
      }
    } else if (CAPSTONE_CODE_SLUGS.includes(project.slug)) {
      // 13-16 毕业项目：综合类，抓「学生真的搭了状态/函数/循环、并用画布画出作品」的真实标记。
      const codeNoComment = code.replace(/\/\/.*$/gm, "");
      const hasArray = /(const|let|var)\s+\w+\s*=\s*\[/.test(codeNoComment);
      const hasFunction = /function\s+\w+\s*\(/.test(codeNoComment);
      const hasLoop = /\b(for|while)\b/.test(codeNoComment);
      const hasDraw = /__runtime\.(drawRect|drawCircle|drawLine|drawText)\(/.test(codeNoComment);
      const hasAnim = code.includes("__runtime.clearCanvas(") || code.includes("__runtime.startLoop(");
      const finished = logs.includes("[系统] 程序执行完毕");
      if (project.slug === "capstone_game") {
        // 搭好状态（数组/函数）→ 循环 + 逐帧重画做出动的画面 → 跑完且画出来
        if (id === 1) done = hasArray || hasFunction;
        else if (id === 2) done = hasLoop && hasAnim && hasDraw;
        else if (id === 3) done = finished && hasDraw;
      } else if (project.slug === "capstone_data") {
        // 准备数据 → 循环把数据映射成图形 → 跑完且画出来
        if (id === 1) done = hasArray;
        else if (id === 2) done = hasLoop && hasDraw;
        else if (id === 3) done = finished && hasDraw;
      } else if (project.slug === "capstone_tool") {
        // 写可复用工具函数 → 循环调用生成图案 → 跑完且画出来
        if (id === 1) done = hasFunction;
        else if (id === 2) done = hasLoop && hasDraw;
        else if (id === 3) done = finished && hasDraw;
      } else if (project.slug === "capstone_oss") {
        // 写通用工具函数库 → 循环调用演示 → 跑完且画出来
        if (id === 1) done = hasFunction;
        else if (id === 2) done = hasLoop && hasDraw;
        else if (id === 3) done = finished && hasDraw;
      } else if (project.slug === "capstone_portfolio") {
        // 把作品画成展板卡片 → 循环批量生成 → 跑完且画出来
        if (id === 1) done = hasDraw;
        else if (id === 2) done = hasLoop && hasDraw;
        else if (id === 3) done = finished && hasDraw;
      }
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
    } else if (SCIENCE9_SLUGS.includes(project.slug)) {
      // 分类 J · 科学探究（9-12）：与 6-8 科学同套真实 JS 标记判定（时间轴引擎）。
      // 时间轴项目在 LearnPageClient 走独立分支，完成判定只看 computeSteps（不进 isGoalAchieved），
      // 故此处基于真实标记把关：空程序（只 reset 无 addTrack）必然 step1 不通过。
      const hasTimeline = code.includes("__runtime.timeline.reset(10)");
      const hasAddTrack = code.includes("__runtime.timeline.addTrack(");
      const hasTween = code.includes('type: "tween"');
      const hasOrbit = code.includes('type: "orbit"');
      const hasParticle = code.includes('type: "particles"');
      const hasWhenAt = code.includes('type: "whenAt"');
      if (project.slug === "science_orbit") {
        // 太阳系公转：公转轨道
        if (id === 1) done = hasTimeline && hasOrbit;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "science_water_cycle") {
        // 水循环：蒸发上升（tween）+ 下雨（particles）+ 解说
        if (id === 1) done = hasTimeline && hasParticle;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else if (project.slug === "science_grow" || project.slug === "science_light") {
        // 植物生长 / 光的折射：需要两条以上变化轨道（size+y 或 直线+斜向）
        if (id === 1) done = hasTimeline && hasTween;
        else if (id === 2) done = countMark(code, 'type: "tween"') >= 2 && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      } else {
        // science_day_night / science_seasons / science_sound：单条 tween + 解说
        if (id === 1) done = hasTimeline && hasTween;
        else if (id === 2) done = hasAddTrack && hasWhenAt;
        else if (id === 3) done = hasTimeline && hasAddTrack;
      }
    } else if (LIST9_SLUGS.includes(project.slug)) {
      // 分类 G · 列表与数据（9-12）：三步引导基于真实 JS 标记——
      // ① 新建了列表；② 往列表里加了内容；③ 把列表内容展示了出来（说 + 列表 reporter）。
      const hasSetList = code.includes("__runtime.setList(");
      const hasAppend = code.includes("__runtime.listAppend(") || code.includes("__runtime.listSetItem(") || code.includes("__runtime.listRemoveAt(");
      const hasSay = code.includes("__runtime.say(");
      const hasListReporter = code.includes("__runtime.getList(") || code.includes("__runtime.listItem(") || code.includes("__runtime.listLength(");
      const finished = logs.includes("[系统] 程序执行完毕");
      if (id === 1) done = hasSetList;
      else if (id === 2) done = hasAppend;
      else       if (id === 3) done = hasSay && hasListReporter && finished;
    } else if (GAME9_SLUGS.includes(project.slug)) {
      // 分类 H · 综合小游戏（9-12）：复用 D / G / multi 三套真实标记模型。
      if (project.slug in GAME9_KEY) {
        // 键盘操控型：按键驱动一格一判定（与 D_GAME 同构）
        const cfg = GAME9_KEY[project.slug];
        const keyFired = logs.some((l) => l.includes("按下按键"));
        const hasMove = code.includes("__runtime.move");
        const usedCollide = code.includes(cfg.collide);
        const usedScore = !cfg.score || code.includes("__runtime.changeVar") || code.includes("__runtime.setVar");
        const finished = logs.includes("[系统] 程序执行完毕");
        if (id === 1) done = keyFired || hasMove;
        else if (id === 2) done = usedCollide && usedScore && (keyFired || hasMove);
        else if (id === 3) done = finished;
      } else {
        // 逻辑 / 数据 / 多角色型：搭建基础 → 核心玩法 → 展示结果（与 G 同构）
        const hasFoundation = code.includes("__runtime.setList(") || code.includes("__runtime.setVar(") || code.includes("__runtime.controlActor(");
        const hasCore = code.includes("__runtime.changeVar(") || code.includes("__runtime.listAppend(") || code.includes("__runtime.listItem(") || code.includes("__runtime.listLength(") || code.includes("__runtime.listSetItem(") || code.includes("__runtime.listRemoveAt(") || code.includes("__runtime.goto(") || code.includes("__runtime.controlActor(");
        const hasSay = code.includes("__runtime.say(");
        const finished = logs.includes("[系统] 程序执行完毕");
        if (id === 1) done = hasFoundation;
        else if (id === 2) done = hasCore;
        else if (id === 3) done = hasSay && finished;
      }
    } else if (STORY9_SLUGS.includes(project.slug)) {
      // 分类 I · 交互绘本与故事（9-12）：基于真实 JS 标记 / 运行日志判定「当开始运行 + 舞台点击 + 讲出/表现出故事内容」。
      // 交互绘本的本质是「点击触发」，故第 2 步以「舞台被点击」日志为信号。
      const finished = logs.includes("[系统] 程序执行完毕");
      const startFired = logs.some((l) => l.includes("开始执行程序"));
      const clickFired = logs.some((l) => l.includes("舞台被点击"));
      const sayCount = countMark(code, "__runtime.say(");
      const controlCount = countMark(code, "__runtime.controlActor(");
      const sceneCount = countMark(code, "__runtime.setScene(");
      const hasShow = code.includes("__runtime.showActor(");
      const hasHide = code.includes("__runtime.hideActor(");
      const hasSize = code.includes("__runtime.setSize(") || code.includes("__runtime.changeSize(");
      // 「讲出 / 表现出故事内容」任一信号即可（说话、切换场景、控制伙伴、显隐、改变大小）。
      const contentMark = sayCount >= 1 || sceneCount >= 1 || controlCount >= 1 || hasShow || hasHide || hasSize;
      if (id === 1) done = startFired;
      else if (id === 2) done = clickFired;
      else if (id === 3) done = contentMark && finished;
    } else if (MUSIC9_SLUGS.includes(project.slug)) {
      // 分类 E · 音乐创作（9-12）：基于真实 JS 标记 / 运行日志判定「当开始运行 + 用到了音频积木 + 真的播放出来」。
      const finished = logs.includes("[系统] 程序执行完毕");
      const startFired = logs.some((l) => l.includes("开始执行程序"));
      const audio = hasAnyAudio(code);
      if (id === 1) done = startFired;
      else if (id === 2) done = audio;
      else if (id === 3) done = finished && audio;
    } else if (MATH9_SLUGS.includes(project.slug)) {
      // 分类 F · 数学与逻辑进阶（9-12）：基于真实 JS 标记判定「用了变量 / 循环 / 画笔」引导三步；
      // 真实结果由 isGoalAchieved 的 goal 断言把关（saidIncludes / drew），空程序无输出必然不通过。
      const finished = logs.includes("[系统] 程序执行完毕");
      const hasVar = code.includes("__runtime.setVar") || code.includes("__runtime.changeVar") || code.includes("__runtime.getVar");
      const hasLoop = code.includes("for (");
      const hasPen = code.includes("__runtime.penDown");
      if (id === 1) done = hasVar || hasPen;
      else if (id === 2) done = hasLoop || hasPen;
      else if (id === 3) done = finished;
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
    vars?: Record<string, number | unknown[]>;
    movedDistance?: number;
    log?: string[];
    /** 各角色是否已真正执行过动作（多角色类完成判定用）。 */
    actors?: { id: string; acted?: boolean }[];
    /** 程序是否真正 engage 了伙伴角色（多角色类完成判定用）。 */
    companionEngaged?: boolean;
    /** 已注册按键处理器数量（键盘类完成判定用）。 */
    keyHandlers?: number;
    /** 已注册舞台点击处理器数量（交互绘本类完成判定用）。 */
    clickHandlers?: number;
    /** 程序运行过程中是否真的播放过声音（音乐创作类完成判定用，空程序为 false）。 */
    sounded?: boolean;
  },
  _logs?: string[],
  code?: string
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

  // 变量类（var）与 数学类（math）：必须真正产出「目标结果」，不能「用了变量就算完成」。
  // 这是与 FN 同一 P0 缺陷的收尾——逐项目用 goal 声明期望值（saidIncludes / drew / vars），对运行时终态做断言。
  // 数学类复用同一分支：每个项目都声明 goal，空程序（不产出任何输出）必然不通过。
  if (VAR_SLUGS.includes(project.slug) || MATH9_SLUGS.includes(project.slug)) {
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

  // 分类 I · 交互绘本与故事：必须真的配置了「舞台点击事件」处理器。
  // 绘本/故事本质是「点击触发」，与键盘类同理——完成判定在「当开始运行」跑完时触发，点击在其后才派发，
  // 故校验注册数而非「真的点过」（时序安全，杜绝空程序通过）。
  if (STORY9_SLUGS.includes(project.slug)) {
    return (state.clickHandlers ?? 0) > 0;
  }

  // 分类 E · 音乐创作：必须真的播放过声音（sounded 在 performAction 发声时同步置位）。
  // 发声动作在「当开始运行」执行过程中触发，完成判定在「程序执行完毕」时据 sounded 把关，
  // 空程序（不发声）必然 sounded===false → 不通过（杜绝「随便搭积木也能通过」）。
  if (MUSIC9_SLUGS.includes(project.slug)) {
    return state.sounded === true;
  }

  // 分类 G · 列表与数据：必须真的「新建并填充列表」且「把列表内容展示出来」（杜绝随便搭）。
  // 双保险：① state 里存在非空列表（setList + listAppend 跑过）；② 项目声明 goal.saidIncludes，
  // 其任一子串出现在运行日志（证明说出了列表内容）。未声明 goal → 不允许通过。
  if (LIST9_SLUGS.includes(project.slug)) {
    if (!project.goal) return false;
    const finalVars = state.vars ?? {};
    const hasNonEmptyList = Object.values(finalVars).some(
      (v) => Array.isArray(v) && v.length > 0
    );
    if (!hasNonEmptyList) return false;
    const goal = project.goal;
    if (goal.saidIncludes && goal.saidIncludes.length > 0) {
      // 只比对「说」的输出（[二零] 前缀），避免「列表加入「苹果」」这类系统日志误命中 saidIncludes，
      // 否则不展示列表、只往里加东西也能通过，违背「必须展示列表内容」的初衷。
      const saidLog = (state.log ?? [])
        .filter((l) => l.startsWith("[二零]"))
        .join("\n");
      if (!goal.saidIncludes.some((s) => saidLog.includes(s))) return false;
    }
    return true;
  }

  // 分类 H · 综合小游戏：按子类型用真实结果把关（杜绝随便搭积木通过）。
  if (GAME9_SLUGS.includes(project.slug)) {
    if (project.slug in GAME9_KEY) {
      // 键盘操控型：必须真的配置了按键处理器（时序安全，与分类 D 同思路）。
      return (state.keyHandlers ?? 0) > 0;
    }
    if (project.slug === "game_puzzle" && state.companionEngaged !== true) {
      // 拼图归位：必须真的控制了伙伴角色（三七），否则不算完成。
      return false;
    }
    // 逻辑 / 数据 / 多角色型（game_guess / game_memory / game_2048lite / game_puzzle）：必须真的展示出结果。
    if (!project.goal) return false;
    const saidLog = (state.log ?? []).filter((l) => l.startsWith("[二零]")).join("\n");
    if (project.goal.saidIncludes && project.goal.saidIncludes.length > 0) {
      if (!project.goal.saidIncludes.some((s) => saidLog.includes(s))) return false;
    }
    // 列表型（记忆翻牌 / 数字合成）还必须有非空列表，证明真的用列表存了数据。
    if (project.slug === "game_memory" || project.slug === "game_2048lite") {
      const hasNonEmptyList = Object.values(state.vars ?? {}).some(
        (v) => Array.isArray(v) && v.length > 0
      );
      if (!hasNonEmptyList) return false;
    }
    return true;
  }

  // 其余（绘图/事件/条件/无标记序列/音乐/数学/故事等）：以步骤判定为准——
  // 复用 computeSteps 的真实 JS 标记校验（用了哪些核心积木 / 触发了哪些事件 / 程序是否跑完），
  // 杜绝「空程序 / 随便拖几块」也能通过；示范（按步骤设计）天然满足三步，不会误伤。
  const logs = _logs ?? state.log ?? [];
  return computeSteps(project, code ?? "", logs).every((s) => s.done);
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
  if (SCIENCE9_SLUGS.includes(slug)) {
    if (slug === "science_day_night") {
      if (stepId === 1) return "用橙色「当开始运行（时间轴）」开头，里面放「让零零的背景明暗从 0 渐变到 220」，天空会由亮变暗。";
      if (stepId === 2) return "加「当时间到 5 秒 让零零说 地球自转一圈……」，时间走到那一刻就会自动冒出对话。";
      if (stepId === 3) return "点「运行」，用下方时间轴控件播放，看白天慢慢变成黑夜！";
    }
    if (slug === "science_seasons") {
      if (stepId === 1) return "用橙色「当开始运行（时间轴）」开头，放「让零零的背景明暗从 20 渐变到 200」，光线会随季节流转。";
      if (stepId === 2) return "再接连放几个「当时间到达 0/2/4/6 秒 让零零说」对应四季的话。";
      if (stepId === 3) return "点「运行」播放时间轴，看春夏秋冬轮转！";
    }
    if (slug === "science_orbit") {
      if (stepId === 1) return "用橙色「当开始运行（时间轴）」开头，放「让零零绕中心转 1 圈」，它会绕着太阳画圈。";
      if (stepId === 2) return "加「当时间到 1 秒 让零零说 地球绕太阳转一圈就是一年」，讲清公转的意义。";
      if (stepId === 3) return "点「运行」播放时间轴，看地球公转吧！";
    }
    if (slug === "science_water_cycle") {
      if (stepId === 1) return "用橙色「当开始运行（时间轴）」开头，先放「让零零的上下位置从 0 到 -80」代表蒸发上升。";
      if (stepId === 2) return "接着放「让天空下起雨」，再加「当时间到 8 秒 让零零说 雨水落回地面……」。";
      if (stepId === 3) return "点「运行」播放时间轴，看水怎么循环旅行！";
    }
    if (slug === "science_grow") {
      if (stepId === 1) return "用橙色「当开始运行（时间轴）」开头，放「让种子大小从 0.1 渐变到 1」。";
      if (stepId === 2) return "再加一条「让种子的上下位置从 -80 渐变到 0」，让它从土里钻出来（两条变化轨道）。";
      if (stepId === 3) return "点「运行」播放时间轴，看种子发芽长大！";
    }
    if (slug === "science_sound") {
      if (stepId === 1) return "用橙色「当开始运行（时间轴）」开头，放「让零零的大小从 0.2 渐变到 3」，声波会一圈圈变大。";
      if (stepId === 2) return "加「当时间到 4 秒 让零零说 声音像一圈圈水波……」，讲清声音怎么传。";
      if (stepId === 3) return "点「运行」播放时间轴，看声波向外扩散！";
    }
    if (slug === "science_light") {
      if (stepId === 1) return "用橙色「当开始运行（时间轴）」开头，放「让零零的上下位置从 -100 到 0」代表空气中的直线光。";
      if (stepId === 2) return "再放两条「左右位置 0→60」「上下位置 0→100（都在 4~8 秒）」让光斜着走，并在第 4 秒加一句解说。";
      if (stepId === 3) return "点「运行」播放时间轴，看光路怎么拐弯（折射）！";
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
  if (STORY9_SLUGS.includes(slug)) {
    if (stepId === 1) return "拖一个绿色「当开始运行」事件，作为绘本翻开的第一页。";
    if (stepId === 2) return "再拖一个蓝色「当舞台被点击」事件——这是绘本能「翻页 / 互动」的关键，点舞台才会触发下一页。";
    if (stepId === 3) return "在「当舞台被点击」里放「说」「切换场景」或「控制角色 三七」，点「运行」后再点舞台，看故事是不是真的讲出来了。";
  }
  if (MUSIC9_SLUGS.includes(slug)) {
    if (stepId === 1) return "拖一个绿色「当开始运行」事件，让演奏开始。";
    if (stepId === 2) return "从紫色「声音」分类里拖「弹奏音符 / 弹和弦 / 敲响鼓 / 随机弹一个音」等积木接上去——要用到声音积木才算在创作音乐哦。";
    if (stepId === 3) return "点「运行」，听程序是不是真的奏出了声音。空程序可不会响，要先搭好音符再运行！";
  }
  if (MATH9_SLUGS.includes(slug)) {
    if (stepId === 1) return "拖一个绿色「当开始运行」，再用「设置变量」记下要算的数。";
    if (stepId === 2) return "用「重复执行」或「画笔」把计算过程跑起来——循环能替你一遍遍算，画笔能把图形画出来。";
    if (stepId === 3) return "点「运行」，看程序是不是真的算出了结果并说出来 / 画出来了。空程序可不会出答案哦！";
  }
  if (LIST9_SLUGS.includes(slug)) {
    if (stepId === 1) return "从「列表」分类拖一个紫色「新建列表」，给列表起个名字（比如 购物清单），这就是一个能装很多东西的容器。";
    if (stepId === 2) return "用「把 X 加入列表」把一样样东西（文字或数字）放进去——可以连续放好几条，列表才有内容。";
    if (stepId === 3) return "用「说 列表 XXX」或「列表的第几项 / 长度」把列表内容展示出来，点「运行」，看二零是不是把清单念出来了。只建表不放东西、或不展示，都不算完成哦！";
  }
  if (GAME9_SLUGS.includes(slug)) {
    if (slug in GAME9_KEY) {
      if (stepId === 1) return "从「事件」分类拖「当按下方向键」事件——这是操控游戏的核心，没有按键就动不起来。";
      if (stepId === 2) return "在按键里放「移动 / 转向」，再接「如果 碰到 ×× 那么 变量 加分 / 说」，把碰撞和计分接上。";
      if (stepId === 3) return "点「运行」，用方向键操控二零，看它是不是真的碰到了目标、加了分。没配按键可不算完成哦！";
    }
    if (slug === "game_guess") {
      if (stepId === 1) return "用「设置变量」记下目标数字和当前猜测，程序才知道在找什么。";
      if (stepId === 2) return "用「重复执行」+「如果…那么」一步步试：每次把「当前」加 1，相等时就「说 猜中啦」。";
      if (stepId === 3) return "点「运行」，看程序数到目标并喊出「猜中啦」。只循环不判断可不算完成哦！";
    }
    if (slug === "game_memory" || slug === "game_2048lite") {
      if (stepId === 1) return "从「列表」分类拖「新建列表」，给卡片 / 数字块一个容器。";
      if (stepId === 2) return "用「加入 / 修改 / 删除」把列表填好或合成——列表有内容才算在用它。";
      if (stepId === 3) return "用「说 列表」把内容展示出来，再「说」出完成词，点运行看结果。只建表不展示不算完成哦！";
    }
    if (slug === "game_puzzle") {
      if (stepId === 1) return "用「控制角色 三七」让伙伴先就位——多角色游戏要先会指挥伙伴。";
      if (stepId === 2) return "再「控制角色 二零」并「移到」指定坐标，把两片拼图各归其位。";
      if (stepId === 3) return "点「运行」，看两个角色各就各位并「说 归位完成」。没真的控制伙伴不算完成哦！";
    }
  }
  if (WEB_CODE_SLUGS.includes(slug)) {
    if (slug === "web_calculator") {
      if (stepId === 1) return "用「网页·输入框」先放一个输入框，收集用户写的算式。";
      if (stepId === 2) return "再用「网页·按钮」做一个「计算」按钮，点击时读取输入框内容算出结果，并用「网页·设置」把答案写回面板。";
      if (stepId === 3) return "点「运行」，在输入框里写 3 + 5 再点按钮，看答案是不是 8！";
    }
    if (slug === "web_todo") {
      if (stepId === 1) return "用「网页·输入框」收集要记的任务。";
      if (stepId === 2) return "点「添加」按钮时，把输入内容放进一个列表（push），并用「网页·清空 + 重新渲染」把清单刷新出来。";
      if (stepId === 3) return "点「运行」，连加几项任务，看清单是不是一条条列出来。";
    }
    if (slug === "web_memory") {
      if (stepId === 1) return "先用「网页·文本」展示一个要记住的数字（比如随机三位数）。";
      if (stepId === 2) return "用「等待」几秒后「网页·清空」，再放一个输入框让用户凭记忆输入。";
      if (stepId === 3) return "点「运行」，记住数字→等它消失→输入答案→比对反馈，看你能不能过记忆关！";
    }
    if (slug === "web_typing") {
      if (stepId === 1) return "先用「网页·文本」展示一个目标词（从词库随机抽）。";
      if (stepId === 2) return "放一个输入框，让用户照着目标词打字。";
      if (stepId === 3) return "点「运行」，正确输入目标词就能加分，点「提交」看反馈！";
    }
    if (slug === "web_platformer") {
      if (stepId === 1) return "用「游戏循环」让角色每一帧都更新位置，这是实时游戏的基础。";
      if (stepId === 2) return "在循环里读「按键」（← → 移动、↑/空格 跳），用「设位置」移动角色，并给个重力让它落回地面。";
      if (stepId === 3) return "点「运行」，用键盘方向键操控二零蹦跳，看它怎么落回地面！";
    }
    if (slug === "web_chatbot") {
      if (stepId === 1) return "用「网页·输入框」收集用户说的话。";
      if (stepId === 2) return "用「如果包含关键词」判断用户意图，列表（push）记下对话，生成回复。";
      if (stepId === 3) return "点「运行」，跟小鹦鹉聊几句，看它是不是真的按规则回话！";
    }
  }
  if (ALGO_CODE_SLUGS.includes(slug)) {
    if (slug === "algo_bubble") {
      if (stepId === 1) return "先准备一个数组（比如 let a = [5,3,8,1,9,2,7,4]），这就是要排序的一排数字。";
      if (stepId === 2) return "用两层循环，内层比较相邻两个数 a[j] 和 a[j+1]，左边大就交换它们（let t=a[j]; a[j]=a[j+1]; a[j+1]=t;）。";
      if (stepId === 3) return "每次比较后 clearCanvas 重画柱子并 wait(0.2)，点「运行」看大数怎么一步步浮到右边！";
    }
    if (slug === "algo_binary") {
      if (stepId === 1) return "准备一个从小到大排好序的数组和一个 target，二分查找只认有序数组。";
      if (stepId === 2) return "用 while 循环，每轮取中间 mid = Math.floor((lo+hi)/2)，比较 a[mid] 与 target 来移动左/右边界。";
      if (stepId === 3) return "每轮把查找区间画出来并 wait(0.4)，点「运行」看区间怎么快速缩小到目标！";
    }
    if (slug === "algo_stack") {
      if (stepId === 1) return "准备一个空数组当栈：let stack = [];。";
      if (stepId === 2) return "用 stack.push(x) 入栈、stack.pop() 出栈，体会「后进先出」——最后进来的最先出去。";
      if (stepId === 3) return "每入栈 / 出栈一次就重画一遍堆叠的方块，点「运行」看栈的变化！";
    }
    if (slug === "algo_maze") {
      if (stepId === 1) return "用二维数组 const maze = [[0,1,...],...] 表示迷宫：0 是路、1 是墙。";
      if (stepId === 2) return "用队列做 BFS：queue.push(邻居) 入队、queue.shift() 出队，配合 visited 二维数组记录已探索格子。";
      if (stepId === 3) return "每轮把已探索的格子染黄并 wait(0.25)，点「运行」看波纹如何扩散找到出口！";
    }
    if (slug === "algo_fib") {
      if (stepId === 1) return "写一个函数 function fib(n)，这就是你要计算斐波那契的工具。";
      if (stepId === 2) return "在函数里自己调用自己：return fib(n-1) + fib(n-2)，并写好退出条件 if (n < 2) return n;。";
      if (stepId === 3) return "把前几项画成柱子，点「运行」看数列怎么快速增长——这就是递归之美！";
    }
    if (slug === "algo_prime") {
      if (stepId === 1) return "用循环去试除：for (let i=2; ...) 拿 n 除以 i。";
      if (stepId === 2) return "用 n % i === 0 判断整除，并把循环条件写成 i * i <= n，只试到根号就能砍掉一半工作量。";
      if (stepId === 3) return "把 2~30 每个数是不是素数画成柱子（绿高灰矮），点「运行」圈出所有素数！";
    }
    if (slug === "algo_string") {
      if (stepId === 1) return "准备一段字符串，比如 let s = \"helloworld\";。";
      if (stepId === 2) return "用 for 遍历每个字符 s[i]，用一个计数表（对象 counts）记录每个字母出现了几次。";
      if (stepId === 3) return "把每个字母的出现次数画成柱子，点「运行」看词频分布！";
    }
    if (slug === "algo_greedy") {
      if (stepId === 1) return "准备面额数组 const coins = [25,10,5,1] 和要凑的金额 amount。";
      if (stepId === 2) return "贪心：从最大面额开始，while (amount >= coins[i]) 就不断 amount = amount - coins[i] 并记下用掉的硬币。";
      if (stepId === 3) return "把用掉的硬币画出来，点「运行」看是不是用最少的硬币凑出了金额！";
    }
  } else if (AI_CODE_SLUGS.includes(slug)) {
    if (slug === "ai_tree") {
      if (stepId === 1) return "准备一份「特征→类别」的样本数据，比如几个 (天气, 是否出门) 的例子。";
      if (stepId === 2) return "用 if / else 列出判断规则：先看某个特征，满足走左、不满足走右，把样本分到两类里。";
      if (stepId === 3) return "把分类结果画出来，点「运行」看规则如何把新样本归到对应类别！";
    }
    if (slug === "ai_knn") {
      if (stepId === 1) return "准备已知类别的点（红队 / 蓝队）和一个待判定点。";
      if (stepId === 2) return "用 Math.hypot 算待判定点到每个点的距离，取最近的 K 个，看多数属于哪一类。";
      if (stepId === 3) return "把点和判定结果画出来，点「运行」看「少数服从多数」如何分类！";
    }
    if (slug === "ai_bayes") {
      if (stepId === 1) return "准备两组词表：广告词和正常词，再准备一封待判断的邮件。";
      if (stepId === 2) return "用 for 循环配合 msg.includes(词) 统计命中两组词的数量。";
      if (stepId === 3) return "把两组计数画成柱子，点「运行」看哪一边的「证据」更多，从而判定！";
    }
    if (slug === "ai_perceptron") {
      if (stepId === 1) return "准备带标签的点（0 类 / 1 类）和初始权重 w0、w1、偏置 b。";
      if (stepId === 2) return "循环里预测 pred，算误差 err = 真实 - 预测，错了就 w = w + err * 输入，一步步「学」出分界线。";
      if (stepId === 3) return "把点和分界线画出来，点「运行」看感知机如何把两类点分开！";
    }
    if (slug === "ai_recommend") {
      if (stepId === 1) return "用喜好向量描述你和几个「其他用户」对几部作品的评分。";
      if (stepId === 2) return "用点积 / 余弦相似度算出最像你的那个人，再推荐他喜欢而你还没看过的。";
      if (stepId === 3) return "把推荐结果画出来，点「运行」看「朋友的喜好」如何变成你的推荐！";
    }
    if (slug === "ai_network") {
      if (stepId === 1) return "准备好输入节点、权重和偏置，把三层网络画出来（输入→隐藏→输出）。";
      if (stepId === 2) return "逐层乘权重、加偏置，把输入从输入层传到隐藏层再到输出层（前向传播）。";
      if (stepId === 3) return "标注每个节点数值和最终输出，点「运行」看一次「推理」是怎么算出来的！";
    }
  } else if (CAPSTONE_CODE_SLUGS.includes(slug)) {
    if (slug === "capstone_game") {
      if (stepId === 1) return "用数组或变量记住游戏状态，比如金币的位置数组、当前得分。";
      if (stepId === 2) return "用 for 循环配合 __runtime.clearCanvas() 每帧擦掉重画，再用 __runtime.drawXxx 画角色与道具。";
      if (stepId === 3) return "点「运行」看游戏画面动起来、得分不断变化——你做出了第一个游戏！";
    }
    if (slug === "capstone_data") {
      if (stepId === 1) return "挑一组你关心的数据，存进数组，比如一周气温或最爱的水果票数。";
      if (stepId === 2) return "用 for 循环遍历数据，把「数值」换算成「柱子的高度 / 点的位置」再画出来。";
      if (stepId === 3) return "点「运行」得到一张清晰的图表，分享给他人也能一眼看懂！";
    }
    if (slug === "capstone_tool") {
      if (stepId === 1) return "把重复画法写成一个函数，比如 ring(cx,cy,r,n) 在圆上均匀画点。";
      if (stepId === 2) return "用 for 循环调用你的工具函数，一圈圈批量生成对称图案。";
      if (stepId === 3) return "点「运行」看工具如何「一行调用、百点生成」，这就是工具思维！";
    }
    if (slug === "capstone_oss") {
      if (stepId === 1) return "写几个通用的小函数（mapRange / dot / grid），不依赖具体业务，谁都能用。";
      if (stepId === 2) return "用 for 循环批量调用你的工具函数，演示它能画出什么。";
      if (stepId === 3) return "点「运行」看你的「开源工具库」画出的示例，把它分享给别人就能复用！";
    }
    if (slug === "capstone_portfolio") {
      if (stepId === 1) return "把你的作品主题存成数组，再用 __runtime.drawRect 画成一张张卡片底。";
      if (stepId === 2) return "用 for 循环批量生成多张卡片，并用 __runtime.drawText 给每张写上标题。";
      if (stepId === 3) return "点「运行」看完整的「作品集展板」，这就是你的成长记录！";
    }
  }
  return "照着左侧「二零说」的提示一步步搭积木，再点运行试试～";
}
