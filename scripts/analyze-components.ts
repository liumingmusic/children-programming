import { getStageProjects } from "../courses/index";
import type { CourseProject } from "../courses/index";

// 积木 type -> 中文组件名映射
const BLOCK_LABELS: Record<string, string> = {
  maker_when_start: "当开始(启动帽子)",
  maker_when_stage_clicked: "当点击舞台(帽子)",
  maker_when_key_pressed: "当按下按键(帽子)",
  maker_when_receive: "当接收到消息(广播接收帽子)",
  maker_broadcast: "广播消息(多角色消息传递)",
  maker_move: "移动(前进N步)",
  maker_turn: "右转N度",
  maker_turn_left: "左转N度",
  maker_goto: "走到坐标(x,y)",
  maker_goto_mouse: "走到鼠标位置",
  maker_goto_star: "走到星星位置",
  maker_say: "说一句话",
  maker_wait: "等待N秒",
  maker_pen_down: "落笔",
  maker_pen_up: "抬笔",
  maker_pen_set_color: "设置画笔颜色",
  maker_pen_change_color: "改变画笔颜色",
  maker_pen_set_size: "设置画笔粗细",
  maker_touching_star: "碰到星星?",
  maker_touching_edge: "碰到边缘?",
  maker_touching_mark: "碰到标记?(障碍/坏人)",
  maker_touching_cloud: "碰到乌云?",
  maker_set_size: "设置大小",
  maker_change_size: "改变大小",
  maker_pen_is_red: "画笔是红色?",
  maker_mouse_x: "鼠标X坐标",
  maker_mouse_left: "鼠标在左半边?",
  maker_random_int: "随机整数",
  maker_set_var: "设置变量",
  maker_change_var: "改变变量",
  maker_get_var: "读取变量",
  maker_mod: "取模(求余)",
  maker_compare: "比较(> < =)",
  maker_get_size: "读取大小",
  maker_set_expression: "设置表情",
  // 标准 blockly 积木
  math_number: "数字",
  math_arithmetic: "四则运算",
  math_random_int: "随机整数(标准)",
  controls_repeat: "重复循环",
  controls_repeat_ext: "重复N次",
  controls_whileUntil: "重复直到",
  controls_if: "如果(条件)",
  controls_if_else: "如果-否则",
  logic_compare: "逻辑比较",
  logic_operation: "逻辑运算(与/或)",
  logic_boolean: "真/假",
  text: "文本",
};

function extractBlockTypes(xml: string): string[] {
  const types = new Set<string>();
  const re = /type="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) types.add(m[1]);
  return [...types];
}

const CAT_LABELS: Record<string, string> = {
  seq: "分类1·序列",
  loop: "分类2·循环",
  draw: "分类3·画笔",
  event: "分类4·事件",
  cond: "分类5·条件",
  game: "分类6·游戏",
};

function detectSpecial(p: CourseProject): string[] {
  const out: string[] = [];
  if (p.component === "memory") out.push("记忆翻牌组件(MemoryGame)");
  const scene = p.scene;
  if (scene?.clouds) out.push("飘动乌云(Cloud动画)");
  const marks = scene?.marks || [];
  const kinds = marks.map((m) => m.kind).filter(Boolean);
  if (kinds.includes("obstacle")) out.push("障碍标记(Obstacle)");
  if (kinds.includes("badguy")) out.push("坏人标记(Badguy/多角色)");
  return out;
}

const projects = getStageProjects("stage-6-8");
console.log(`\n=== stage-6-8 共 ${projects.length} 个项目 ===\n`);

// 每项目逐行
const agg = new Map<string, number>(); // 组件名 -> 出现项目数
const aggBlocks = new Map<string, number>();
const CAT_ORDER = ["seq", "loop", "draw", "event", "cond", "game"];

for (const cat of CAT_ORDER) {
  const ps = projects.filter((p) => p.category === cat);
  console.log(`\n### ${CAT_LABELS[cat] || cat} (${ps.length}个)`);
  for (const p of ps) {
    const blocks = p.defaultXml ? extractBlockTypes(p.defaultXml) : [];
    const special = detectSpecial(p);
    // 汇总
    for (const b of blocks) {
      const label = BLOCK_LABELS[b] || b;
      aggBlocks.set(label, (aggBlocks.get(label) || 0) + 1);
    }
    for (const s of special) agg.set(s, (agg.get(s) || 0) + 1);
    const blockList = blocks
      .map((b) => BLOCK_LABELS[b] || b)
      .filter((l) => l !== "数字" && !l.startsWith("math_") && !l.startsWith("controls_") && !l.startsWith("logic_") && l !== "文本")
      .join("、");
    const specialStr = special.length ? `  【特殊:${special.join("、")}】` : "";
    console.log(`  - ${p.slug.padEnd(20)} ${p.title}  | 积木:${blockList || "(无/非Blockly)"}${specialStr}`);
  }
}

// 无 defaultXml 但属于 stage 的项目（如 memory_match）
const noXml = projects.filter((p) => !p.defaultXml);
if (noXml.length) {
  console.log(`\n### 非Blockly项目(无defaultXml)`);
  for (const p of noXml) {
    const special = detectSpecial(p);
    console.log(`  - ${p.slug.padEnd(20)} ${p.title}  | ${special.join("、") || "(自定义组件)"}`);
  }
}

console.log(`\n\n=== 汇总：各组件被多少个项目使用（按项目数降序）===`);
const allAgg = new Map<string, number>();
for (const [k, v] of aggBlocks) allAgg.set(k, v);
for (const [k, v] of agg) allAgg.set(k, v);
const sorted = [...allAgg.entries()].sort((a, b) => b[1] - a[1]);
for (const [k, v] of sorted) {
  console.log(`  ${String(v).padStart(3)} 个项目  ->  ${k}`);
}
