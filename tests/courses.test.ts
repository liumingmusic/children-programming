import { describe, it, expect } from "vitest";
import {
  stages,
  projects,
  getProject,
  getStageProjects,
  getNextProject,
  getStageOfProject,
  getStageCategories,
  CATEGORIES,
} from "@/courses";

describe("课程层级（学龄段 → 多项目 → 独立项目）", () => {
  it("每个 open 阶段的 projectSlugs 都指向真实存在的项目（无悬空引用）", () => {
    for (const stage of stages) {
      for (const slug of stage.projectSlugs) {
        expect(getProject(slug), `阶段 ${stage.id} 引用了不存在的项目 ${slug}`).toBeDefined();
      }
    }
  });

  it("没有孤儿项目：每个已定义项目都至少被一个阶段引用", () => {
    const referenced = new Set(stages.flatMap((s) => s.projectSlugs));
    for (const p of projects) {
      expect(referenced.has(p.slug), `项目 ${p.slug} 没有被任何阶段引用（孤儿项目）`).toBe(true);
    }
  });

  it("getStageProjects 对 stage-6-8 返回正确顺序（序列→循环→绘图→事件→…）", () => {
    const ps = getStageProjects("stage-6-8");
    expect(ps.map((p) => p.slug)).toEqual([
      "hello",
      "flag",
      "stone",
      "shapeL",
      "home",
      "maze",
      "arrow",
      "zigzag",
      "treasure",
      "dance",
      "frame",
      "square",
      "triangle",
      "pentagon",
      "spin",
      "stairs",
      "wave",
      "spiral",
      "fence",
      "windmill",
      "pickfruit",
      "star5",
      "flower",
      "rainbow",
      "snowflake",
      "mandala",
      "concentric",
      "connectdot",
      "house",
      "letter",
      "checkerboard",
      "click_jump",
      "click_color",
      "click_dialog",
      "two_events",
      "click_play_dialog",
      "auto_patrol",
      "key_forward",
      "edge_bounce",
      "size_toggle",
      "expression_shake",
      "if_touch_star",
      "if_edge_turn",
      "if_red_stop",
      "click_left_right",
      "collect3",
      "random_branch",
      "odd_even",
      "size_threshold",
      "avoid_obstacle",
      "escape_badguy",
      "stars",
      "maze_exit",
      "collect_apples",
      "light_lanterns",
      "collect_rainbow",
      "treasure_map",
      "escort",
      "traffic_police",
      "dodge_clouds",
      "memory_match",
      "play_doremi",
      "twinkle",
      "drum_beat",
      "random_note",
      "loop_melody",
      "pitch_by_click",
      "pitch_by_move",
      "chord",
      "birthday",
      "compose",
      "count10",
      "count_apples",
      "compare_size",
      "add_sub",
      "shape_names",
      "symmetry",
      "multiplication",
      "clock",
      "geometry_puzzle",
      "calculator",
      "self_intro",
      "expression",
      "freeze",
      "animal_sports",
      "word_chain",
      "birthday_party",
      "good_night",
      "two_talk",
      "a_day",
      "magic_show",
    ]);
  });

  it("soon 阶段的 projectSlugs 为空时返回空数组", () => {
    expect(getStageProjects("stage-9-12")).toEqual([]);
    expect(getStageProjects("stage-13-16")).toEqual([]);
  });

  it("getProject 对全部项目返回正确标题", () => {
    expect(getProject("hello")?.title).toBe("二零，打个招呼！");
    expect(getProject("square")?.title).toBe("二零画正方形");
    expect(getProject("triangle")?.title).toBe("二零画三角形");
    expect(getProject("star5")?.title).toBe("二零画五角星");
    expect(getProject("flower")?.title).toBe("二零画花朵");
    expect(getProject("rainbow")?.title).toBe("二零画彩虹");
    expect(getProject("stars")?.title).toBe("二零收集星星");
    expect(getProject("nope")).toBeUndefined();
  });

  it("getNextProject 计算同阶段下一个项目（stage-6-8 共 91 项）", () => {
    const chain = ["hello","flag","stone","shapeL","home","maze","arrow","zigzag","treasure","dance","frame","square","triangle","pentagon","spin","stairs","wave","spiral","fence","windmill","pickfruit","star5","flower","rainbow","snowflake","mandala","concentric","connectdot","house","letter","checkerboard","click_jump","click_color","click_dialog","two_events","click_play_dialog","auto_patrol","key_forward","edge_bounce","size_toggle","expression_shake","if_touch_star","if_edge_turn","if_red_stop","click_left_right","collect3","random_branch","odd_even","size_threshold","avoid_obstacle","escape_badguy","stars","maze_exit","collect_apples","light_lanterns","collect_rainbow","treasure_map","escort","traffic_police","dodge_clouds","memory_match","play_doremi","twinkle","drum_beat","random_note","loop_melody","pitch_by_click","pitch_by_move","chord","birthday","compose","count10","count_apples","compare_size","add_sub","shape_names","symmetry","multiplication","clock","geometry_puzzle","calculator","self_intro","expression","freeze","animal_sports","word_chain","birthday_party","good_night","two_talk","a_day","magic_show"];
    for (let i = 0; i < chain.length - 1; i++) {
      expect(getNextProject(chain[i])?.slug, `${chain[i]} 的下一个`).toBe(chain[i + 1]);
    }
    // 阶段最后一个项目没有下一个
    expect(getNextProject(chain[chain.length - 1])).toBeUndefined();
    // 未知项目
    expect(getNextProject("nope")).toBeUndefined();
  });

  it("getStageOfProject 返回项目所属学段（决定「返回」去哪）", () => {
    expect(getStageOfProject("hello")?.id).toBe("stage-6-8");
    expect(getStageOfProject("square")?.id).toBe("stage-6-8");
    expect(getStageOfProject("triangle")?.id).toBe("stage-6-8");
    expect(getStageOfProject("star5")?.id).toBe("stage-6-8");
    expect(getStageOfProject("flower")?.id).toBe("stage-6-8");
    expect(getStageOfProject("rainbow")?.id).toBe("stage-6-8");
    expect(getStageOfProject("stars")?.id).toBe("stage-6-8");
    // 未知项目返回 undefined
    expect(getStageOfProject("nope")).toBeUndefined();
  });

  it("每个项目都有合法的 category，且 category 存在于所属阶段的 CATEGORIES 注册表中", () => {
    const referenced = new Set(stages.flatMap((s) => s.projectSlugs));
    for (const p of projects) {
      if (!referenced.has(p.slug)) continue; // 跳过未接入任何阶段的孤儿（理论上已被上面的测试拦截）
      const stage = stages.find((s) => s.projectSlugs.includes(p.slug))!;
      const validIds = (CATEGORIES[stage.id] ?? []).map((c) => c.id);
      expect(p.category, `项目 ${p.slug} 缺 category`).toBeDefined();
      expect(validIds, `项目 ${p.slug} 的 category=${p.category} 不在阶段 ${stage.id} 的分类表里`).toContain(p.category);
    }
  });

  it("getStageCategories 对 stage-6-8 按分类分组且不丢项目", () => {
    const sections = getStageCategories("stage-6-8");
    // 分类数量：seq / loop / draw / event / cond / game / music / math / story 共 9 个非空分类
    // （science / pbl 暂未开发，被过滤掉）
    expect(sections.map((s) => s.id)).toEqual([
      "seq", "loop", "draw", "event", "cond", "game", "story", "music", "math",
    ]);
    // 分组内项目数之和 == 全部项目数（91），不丢不重
    const total = sections.reduce((n, s) => n + s.projects.length, 0);
    expect(total).toBe(getStageProjects("stage-6-8").length);
    expect(total).toBe(91);
    // 分类内的顺序遵循 projectSlugs（seq 在前 11 个）
    expect(sections[0].id).toBe("seq");
    expect(sections[0].projects.map((p) => p.slug)).toEqual([
      "hello", "flag", "stone", "shapeL", "home", "maze", "arrow", "zigzag", "treasure", "dance", "frame",
    ]);
    expect(sections[1].projects.map((p) => p.slug)).toEqual([
      "square", "triangle", "pentagon", "spin", "stairs", "wave", "spiral", "fence", "windmill", "pickfruit",
    ]);
    expect(sections[2].projects.map((p) => p.slug)).toEqual([
      "star5", "flower", "rainbow", "snowflake", "mandala", "concentric", "connectdot", "house", "letter", "checkerboard",
    ]);
    expect(sections[3].projects.map((p) => p.slug)).toEqual([
      "click_jump", "click_color", "click_dialog", "two_events", "click_play_dialog",
      "auto_patrol", "key_forward", "edge_bounce", "size_toggle", "expression_shake",
    ]);
    expect(sections[4].projects.map((p) => p.slug)).toEqual([
      "if_touch_star", "if_edge_turn", "if_red_stop", "click_left_right", "collect3",
      "random_branch", "odd_even", "size_threshold", "avoid_obstacle", "escape_badguy",
    ]);
    expect(sections[5].projects.map((p) => p.slug)).toEqual([
      "stars", "maze_exit", "collect_apples", "light_lanterns",
      "collect_rainbow", "treasure_map", "escort", "traffic_police", "dodge_clouds", "memory_match",
    ]);
    // 分类 8 · 音乐与节奏（新增 10 项）
    expect(sections[7].id).toBe("music");
    expect(sections[7].projects.map((p) => p.slug)).toEqual([
      "play_doremi", "twinkle", "drum_beat", "random_note", "loop_melody",
      "pitch_by_click", "pitch_by_move", "chord", "birthday", "compose",
    ]);
    // 分类 9 · 数学启蒙（新增 10 项）
    expect(sections[8].id).toBe("math");
    expect(sections[8].projects.map((p) => p.slug)).toEqual([
      "count10", "count_apples", "compare_size", "add_sub", "shape_names",
      "symmetry", "multiplication", "clock", "geometry_puzzle", "calculator",
    ]);
    // 分类 7 · 故事与动画（新增 10 项）
    expect(sections[6].id).toBe("story");
    expect(sections[6].projects.map((p) => p.slug)).toEqual([
      "self_intro", "expression", "freeze", "animal_sports", "word_chain",
      "birthday_party", "good_night", "two_talk", "a_day", "magic_show",
    ]);
  });

  it("soon 阶段（无项目）getStageCategories 返回空数组", () => {
    expect(getStageCategories("stage-9-12")).toEqual([]);
    expect(getStageCategories("stage-13-16")).toEqual([]);
  });
});
