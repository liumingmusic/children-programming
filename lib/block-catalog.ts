// 组件目录（积木工具库）数据层
// 只读查阅用：列出各学龄段工具箱里的积木及特殊组件，含用途/用法/示例，
// 并自动统计「在哪些项目用到」（扫描 courses 的 defaultXml，保证与真实项目同步）。
// 注意：本文件只描述，不提供可拖拽/可运行能力——真正使用发生在 /learn/[slug] 项目里。

import { projects } from "../courses/index";

export type BlockCategory =
  | "事件"
  | "运动"
  | "外观"
  | "画笔"
  | "控制"
  | "侦测"
  | "运算"
  | "变量"
  | "声音"
  | "特殊";

export type BlockShape = "hat" | "statement" | "reporter" | "boolean" | "special";

export type BlockPart =
  | { kind: "text"; value: string }
  | {
      kind: "input";
      inputType: "number" | "text" | "boolean" | "dropdown";
      placeholder?: string;
      options?: string[];
    };

export interface BlockDoc {
  id: string;
  label: string; // 简短显示名
  category: BlockCategory;
  color: number; // Blockly hue（0-360）
  shape: BlockShape;
  parts: BlockPart[]; // 用于只读色块渲染
  purpose: string; // 用途
  usage: string; // 用法
  example?: string; // 示例
  stages: string[]; // 适用学龄段
}

// 分类配色（用于分区标题色块）
export const CATEGORY_COLORS: Record<BlockCategory, string> = {
  事件: "#3BA98C",
  运动: "#E8A33D",
  外观: "#B06FD6",
  画笔: "#2Fae8a",
  控制: "#E0964E",
  侦测: "#4A90D9",
  运算: "#D98C3F",
  变量: "#9B6CC9",
  声音: "#B45EC9",
  特殊: "#C0566B",
};

export const CATEGORY_ORDER: BlockCategory[] = [
  "事件",
  "运动",
  "外观",
  "画笔",
  "控制",
  "侦测",
  "运算",
  "变量",
  "声音",
  "特殊",
];

// 学龄段（目前仅 stage-6-8 有真实数据，其余占位）
export const STAGES: { id: string; label: string; ready: boolean }[] = [
  { id: "stage-6-8", label: "6-8 岁", ready: true },
  { id: "stage-9-12", label: "9-12 岁", ready: false },
  { id: "stage-13-16", label: "13-16 岁", ready: false },
];

const N = (placeholder: string): BlockPart => ({ kind: "input", inputType: "number", placeholder });
const T = (value: string): BlockPart => ({ kind: "text", value });
const D = (options: string[]): BlockPart => ({ kind: "input", inputType: "dropdown", options });
const B = (): BlockPart => ({ kind: "input", inputType: "boolean" });

// ============ 6-8 岁 · 全部积木 ============
export const BLOCK_CATALOG: BlockDoc[] = [
  // —— 事件 ——
  {
    id: "maker_when_start",
    label: "当开始运行",
    category: "事件",
    color: 160,
    shape: "hat",
    parts: [T("当开始运行")],
    purpose: "程序的「开关」。放在最上面的帽子积木，点「运行」后，它下面接的积木会按顺序执行。",
    usage: "把其它积木拖到这顶「帽子」下面，形成一条执行链条。每个项目通常只需要一个。",
    example: "当开始运行 ▸ 移动 100 步 ▸ 右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_when_stage_clicked",
    label: "当舞台被点击",
    category: "事件",
    color: 170,
    shape: "hat",
    parts: [T("当舞台被点击")],
    purpose: "交互触发。点一下画布（舞台），它下面接的积木就执行一次。适合做「点我有反应」的小游戏。",
    usage: "常用于「点击换颜色」「点击对话」等项目；可以和有「当开始运行」同时存在，两种触发互不干扰。",
    example: "当舞台被点击 ▸ 说「你好！」持续 2 秒",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_when_key_pressed",
    label: "当按下方向键",
    category: "事件",
    color: 160,
    shape: "hat",
    parts: [T("当按下"), D(["↑ 上", "↓ 下", "← 左", "→ 右"])],
    purpose: "用键盘控制二零。按下指定方向键时执行，用来做「按键前进」等操控类项目。",
    usage: "在下拉里选 ↑/↓/←/→；可建多个「当按下」帽子分别响应不同方向。",
    example: "当按下 → ▸ 移动 30 步",
    stages: ["stage-6-8"],
  },

  // —— 运动 ——
  {
    id: "maker_move",
    label: "移动",
    category: "运动",
    color: 230,
    shape: "statement",
    parts: [T("移动"), N("100"), T("步")],
    purpose: "让二零沿「当前朝向」前进指定步数（步数越大走得越远）。",
    usage: "先想清楚二零现在脸朝哪边（默认朝下），再填步数；配合「右转/左转」就能走到任意位置。",
    example: "移动 100 步",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_turn",
    label: "右转",
    category: "运动",
    color: 230,
    shape: "statement",
    parts: [T("右转"), N("15"), T("度")],
    purpose: "让二零向右（顺时针）转指定角度。90 度就是转一个直角。",
    usage: "画正方形要「移动 + 右转 90 度」重复 4 次；角度可调小一点让转弯更平滑。",
    example: "右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_turn_left",
    label: "左转",
    category: "运动",
    color: 230,
    shape: "statement",
    parts: [T("左转"), N("15"), T("度")],
    purpose: "让二零向左（逆时针）转指定角度。和右转方向相反，方便左右都能拐弯。",
    usage: "和右转用法完全一样，只是方向相反；需要往左绕行时就用它。",
    example: "左转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_goto",
    label: "移到坐标",
    category: "运动",
    color: 230,
    shape: "statement",
    parts: [T("移到 x:"), N("0"), T("y:"), N("0")],
    purpose: "直接把二零瞬移到指定的 (x, y) 坐标，不走过去。x 是左右、y 是上下。",
    usage: "用来「精准到达某个点」，比如按顺序点亮灯笼、寻宝。坐标正数偏右/下，负数偏左/上。",
    example: "移到 x: -80 y: 80（小旗子的位置）",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_goto_mouse",
    label: "移到鼠标位置",
    category: "运动",
    color: 230,
    shape: "statement",
    parts: [T("移到鼠标位置")],
    purpose: "让二零立刻飞到最近一次鼠标点击的地方，常配合「点击舞台」做跟随。",
    usage: "放在「当舞台被点击」下方，点哪二零去哪；再接「碰到星星」就能做收集游戏。",
    example: "当舞台被点击 ▸ 移到鼠标位置",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_goto_star",
    label: "飞向星星",
    category: "运动",
    color: 230,
    shape: "statement",
    parts: [T("飞向星星"), N("1"), T("号")],
    purpose: "让二零直接飞向第 N 颗星星并收集它，省去自己算坐标。",
    usage: "星星按出现顺序编号；常放在「当开始运行」下，按顺序把每颗星都收掉。",
    example: "飞向星星 1 号",
    stages: ["stage-6-8"],
  },

  // —— 外观 ——
  {
    id: "maker_say",
    label: "说",
    category: "外观",
    color: 290,
    shape: "statement",
    parts: [T("说"), { kind: "input", inputType: "text", placeholder: "你好！我是二零" }, T("持续"), N("2"), T("秒")],
    purpose: "让二零头顶冒出一个对话气泡，说出一段话（可设显示几秒）。",
    usage: "用来讲故事、做点击对话；文字自己填，秒数控制气泡停留时间。",
    example: "说「你好！我是二零」持续 2 秒",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_set_expression",
    label: "设置表情",
    category: "外观",
    color: 290,
    shape: "statement",
    parts: [T("让二零表情变成"), D(["普通", "开心", "生气", "惊讶", "睡觉"])],
    purpose: "给二零换表情：普通 / 开心 / 生气 / 惊讶 / 睡觉，让角色更有情绪。",
    usage: "在下拉里选表情；可配合「移动」做「边走边生气」之类的动画。",
    example: "让二零表情变成 开心",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_set_size",
    label: "设置大小",
    category: "外观",
    color: 230,
    shape: "statement",
    parts: [T("将二零大小设为"), N("2"), T("倍")],
    purpose: "把二零整体缩放到指定倍数（1 是原大小，2 是放大一倍，0.5 是缩小一半）。",
    usage: "用「当点击舞台」+「设置大小」做「点一下变大」；范围约 0.2~5。",
    example: "将二零大小设为 2 倍",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_change_size",
    label: "改变大小",
    category: "外观",
    color: 230,
    shape: "statement",
    parts: [T("二零大小增加"), N("1")],
    purpose: "在「当前大小」基础上增减；正数变大、负数变小，可放进循环里逐渐变化。",
    usage: "配合「重复执行」做「越长越大」的动画；用「如果…大小>3」做阈值判断。",
    example: "二零大小增加 1",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_get_size",
    label: "读取大小",
    category: "外观",
    color: 230,
    shape: "reporter",
    parts: [T("二零当前大小")],
    purpose: "返回一个数字，表示二零现在的大小倍数，常放进「如果…那么」做条件。",
    usage: "例：如果 二零当前大小 > 3 那么 说「我太大了」。",
    example: "如果 二零当前大小 > 3 那么 说「停下」",
    stages: ["stage-6-8"],
  },

  // —— 画笔 ——
  {
    id: "maker_pen_down",
    label: "落笔",
    category: "画笔",
    color: 120,
    shape: "statement",
    parts: [T("落笔")],
    purpose: "让二零「拿起笔」。之后每走一步都会在身后留下线条，用来画画。",
    usage: "画任何图案前先「落笔」，画完用「抬笔」收尾，否则会多出杂线。",
    example: "落笔 ▸ 移动 100 ▸ 右转 90 ▸ … ▸ 抬笔",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_pen_up",
    label: "抬笔",
    category: "画笔",
    color: 120,
    shape: "statement",
    parts: [T("抬笔")],
    purpose: "让二零「抬起笔」，之后移动不再画线，用来在图案之间「空移」到新起点。",
    usage: "每段线条画完抬笔，再到新位置落笔，图案才干净。",
    example: "抬笔",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_pen_set_color",
    label: "设置画笔颜色",
    category: "画笔",
    color: 120,
    shape: "statement",
    parts: [T("设置画笔颜色为"), N("0"), T("(0-360)")],
    purpose: "把画笔颜色设为某个色相（0-360 的色环：0 红、120 绿、240 蓝…）。",
    usage: "画彩虹时，每画一笔「改变画笔颜色」一点，颜色就渐变出彩带。",
    example: "设置画笔颜色为 0（红）",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_pen_change_color",
    label: "改变画笔颜色",
    category: "画笔",
    color: 120,
    shape: "statement",
    parts: [T("画笔颜色增加"), N("10")],
    purpose: "在「当前颜色」基础上加一点，让颜色慢慢变化（配合循环画出渐变）。",
    usage: "放在「重复执行」里，每次 +10，就能画出红→橙→黄→绿的彩虹。",
    example: "画笔颜色增加 10",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_pen_set_size",
    label: "设置画笔粗细",
    category: "画笔",
    color: 120,
    shape: "statement",
    parts: [T("设置画笔粗细为"), N("3"), T("像素")],
    purpose: "设置线条的粗细（默认 3，数字越大线越粗）。",
    usage: "想要粗轮廓就调大；细线就调小。",
    example: "设置画笔粗细为 5 像素",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_pen_is_red",
    label: "画笔是红色?",
    category: "画笔",
    color: 120,
    shape: "boolean",
    parts: [T("画笔是红色")],
    purpose: "判断当前画笔是不是红色，成立返回「真」。常放进「如果…那么」做颜色分支。",
    usage: "例：如果 画笔是红色 那么 停下（红绿灯类项目）。",
    example: "如果 画笔是红色 那么 说「停」",
    stages: ["stage-6-8"],
  },

  // —— 控制 ——
  {
    id: "controls_repeat_ext",
    label: "重复执行",
    category: "控制",
    color: 120,
    shape: "statement",
    parts: [T("重复"), N("10"), T("次")],
    purpose: "把里面套的积木「原样」重复执行 N 次，避免反复复制，是画规则图案的关键。",
    usage: "画正多边形：把「移动 + 右转」放进「重复 4 次」就出正方形。",
    example: "重复 4 次 ▸ 移动 100 ▸ 右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "controls_if",
    label: "如果…那么",
    category: "控制",
    color: 210,
    shape: "statement",
    parts: [T("如果"), B(), T("那么")],
    purpose: "「条件判断」。里面的条件成立时才执行「那么」里的积木，否则跳过。",
    usage: "条件槽放一个能返回真/假的六边形积木（如「碰到边缘」「比较」）。",
    example: "如果 碰到边缘 那么 右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_wait",
    label: "等待",
    category: "控制",
    color: 60,
    shape: "statement",
    parts: [T("等待"), N("1"), T("秒")],
    purpose: "暂停指定秒数再继续，用来控制节奏（如「跳一下」中间的停顿）。",
    usage: "放在两段动作之间，让动画看得清；也可配合「当点击舞台」做一下一下的反馈。",
    example: "等待 1 秒",
    stages: ["stage-6-8"],
  },

  // —— 侦测 ——
  {
    id: "maker_touching_star",
    label: "碰到星星?",
    category: "侦测",
    color: 210,
    shape: "boolean",
    parts: [T("碰到星星")],
    purpose: "判断二零这会儿有没有碰到星星，成立返回「真」。收集游戏的条件。",
    usage: "常放「如果…那么」里，碰到星星就说句话或计数。",
    example: "如果 碰到星星 那么 说「收到！」",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_touching_edge",
    label: "碰到边缘?",
    category: "侦测",
    color: 210,
    shape: "boolean",
    parts: [T("碰到边缘")],
    purpose: "判断二零是否撞到舞台边界，成立返回「真」。用来做碰壁转弯。",
    usage: "配合「如果…那么 右转」让二零走到边就拐弯，不会卡住。",
    example: "如果 碰到边缘 那么 右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_mouse_x",
    label: "鼠标 x 坐标",
    category: "侦测",
    color: 210,
    shape: "reporter",
    parts: [T("鼠标 x 坐标")],
    purpose: "返回最近一次点击的左右位置（负数偏左、正数偏右），用来判断点了哪半边。",
    usage: "例：如果 鼠标 x 坐标 < 0 那么 走左边，否则走右边。",
    example: "如果 鼠标 x 坐标 < 0 那么 移动 -50",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_mouse_left",
    label: "点击在左半边?",
    category: "侦测",
    color: 210,
    shape: "boolean",
    parts: [T("点击在左半边")],
    purpose: "专门判断最近一次点击是否在舞台左半边，成立返回「真」。是「点击左/右走不同路」的快捷条件。",
    usage: "直接放进「如果…那么 否则」，左半边走一条路、右半边走另一条。",
    example: "如果 点击在左半边 那么 移动 -50 否则 移动 50",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_touching_mark",
    label: "碰到标记?",
    category: "侦测",
    color: 210,
    shape: "boolean",
    parts: [T("碰到"), D(["障碍", "坏人"])],
    purpose: "判断二零是否碰到某种舞台标记：障碍（如石头）或坏人。成立返回「真」。",
    usage: "用「如果 碰到 障碍 那么 右转」做自动绕行；换「坏人」就做逃跑。",
    example: "如果 碰到 障碍 那么 右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_touching_cloud",
    label: "碰到乌云?",
    category: "侦测",
    color: 210,
    shape: "boolean",
    parts: [T("碰到乌云")],
    purpose: "判断二零是否碰到飘动的乌云，成立返回「真」。躲避乌云游戏的条件。",
    usage: "用「如果 碰到乌云 那么 右转」避开；云是动态飘动的，所以要边走边判断。",
    example: "如果 碰到乌云 那么 右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_compare",
    label: "比较",
    category: "侦测",
    color: 210,
    shape: "boolean",
    parts: [T("比较"), N("0"), D(["等于", "小于", "大于", "不大于", "不小于", "不等于"]), T("与"), N("0")],
    purpose: "比较两个数字的大小关系（等于/小于/大于/…），成立返回「真」。",
    usage: "把数字或变量填进两个槽，选好关系，放进「如果…那么」做判断。",
    example: "如果 比较 7 除以2的余数 等于 0 那么 …（奇偶判断）",
    stages: ["stage-6-8"],
  },

  // —— 运算 ——
  {
    id: "maker_random_int",
    label: "随机整数",
    category: "运算",
    color: 60,
    shape: "reporter",
    parts: [T("随机整数，从"), N("1"), T("到"), N("2")],
    purpose: "随机生成一个在 MIN 到 MAX 之间的整数（含两端），让程序每次运行不一样。",
    usage: "放进「比较」或「如果…那么」做随机选择，如随机走左还是走右。",
    example: "如果 随机整数 从 1 到 2 等于 1 那么 左转 否则 右转",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_mod",
    label: "取余数",
    category: "运算",
    color: 230,
    shape: "reporter",
    parts: [T("取余数："), N("7"), T("÷"), N("2")],
    purpose: "求 A 除以 B 的余数（取模）。判断奇偶最常用：余数等于 0 就是偶数。",
    usage: "配合「变量」做计数器，用「余数 等于 0」区分奇偶步数走不同路。",
    example: "比较 (步数 取余数 2) 等于 0 那么 走直路 否则 拐弯",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_add",
    label: "加",
    category: "运算",
    color: 60,
    shape: "reporter",
    parts: [N("3"), T("加"), N("5")],
    purpose: "把两个数字相加，吐出一个结果数字。可嵌进「说」「比较」等积木里参与运算。",
    usage: "两个槽都填数字或算式；结果常接「说」显示，如：说 (3 加 5)。",
    example: "说 (3 加 5) → 屏幕显示 8",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_sub",
    label: "减",
    category: "运算",
    color: 60,
    shape: "reporter",
    parts: [N("8"), T("减"), N("2")],
    purpose: "把两个数字相减（A − B），吐出结果数字。",
    usage: "算「还剩多少」「差多少」时用；结果可接「说」显示。",
    example: "说 (8 减 2) → 屏幕显示 6",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_mul",
    label: "乘",
    category: "运算",
    color: 60,
    shape: "reporter",
    parts: [N("3"), T("乘"), N("4")],
    purpose: "把两个数字相乘（A × B），吐出结果数字。是「重复累加」的快速写法。",
    usage: "算「几组共有多少」时用，比如 3 个 4 就是 3 乘 4；结果可接「说」。",
    example: "说 (3 乘 4) → 屏幕显示 12",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_div",
    label: "除以",
    category: "运算",
    color: 60,
    shape: "reporter",
    parts: [N("12"), T("除以"), N("3")],
    purpose: "把两个数字相除（A ÷ B），吐出结果数字（除以 0 时自动按 1 算，避免出错）。",
    usage: "算「平均分」时用；结果可接「说」显示。",
    example: "说 (12 除以 3) → 屏幕显示 4",
    stages: ["stage-6-8"],
  },

  // —— 变量 ——
  {
    id: "maker_set_var",
    label: "设置变量",
    category: "变量",
    color: 330,
    shape: "statement",
    parts: [T("把变量"), { kind: "input", inputType: "text", placeholder: "n" }, T("设为"), N("0")],
    purpose: "给一个变量（名字默认 n，可改名）赋一个数值，像给盒子贴上标签存个数字。",
    usage: "先用「设置变量」定初值，再在别处用「读取变量」「改变变量」来用。",
    example: "把变量 n 设为 0",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_change_var",
    label: "改变变量",
    category: "变量",
    color: 330,
    shape: "statement",
    parts: [T("变量"), { kind: "input", inputType: "text", placeholder: "n" }, T("增加"), N("1")],
    purpose: "让变量的值加上一个量（正数变大、负数变小），常放在「重复执行」里当计数器。",
    usage: "例：重复里放「变量 n 增加 1」，n 就会 0→1→2…用来数步数。",
    example: "变量 n 增加 1",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_get_var",
    label: "读取变量",
    category: "变量",
    color: 330,
    shape: "reporter",
    parts: [T("变量"), { kind: "input", inputType: "text", placeholder: "n" }],
    purpose: "取出某个变量当前的值，可放进「比较」「取余数」或算式里参与运算。",
    usage: "配合「设置/改变变量」一起用，是做计数、奇偶、随机分支的基础。",
    example: "比较 变量 n 取余数 2 等于 0 那么 …",
    stages: ["stage-6-8"],
  },

  // —— 声音 ——
  {
    id: "maker_play_note",
    label: "弹奏音符",
    category: "声音",
    color: 280,
    shape: "statement",
    parts: [T("弹奏"), D(["do", "re", "mi", "fa", "sol", "la", "ti", "高音do"]), T("持续"), N("1"), T("拍")],
    purpose: "让二零发出一个音符（do~ti 或高音do），并持续指定拍数。是「作曲」的最小单位。",
    usage: "在「当开始运行」下接几个「弹奏音符」，就能弹出一段简单旋律；拍数控制每个音多长。",
    example: "当开始运行 ▸ 弹奏 do 持续1拍 ▸ 弹奏 re 持续1拍",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_play_chord",
    label: "弹奏和弦",
    category: "声音",
    color: 280,
    shape: "statement",
    parts: [T("弹和弦"), D(["do", "re", "mi", "fa", "sol", "la", "ti", "高音do"]), T("+"), D(["do", "re", "mi", "fa", "sol", "la", "ti", "高音do"]), T("+"), D(["do", "re", "mi", "fa", "sol", "la", "ti", "高音do"])],
    purpose: "一次同时发出三个音符（根音/三度/五度），形成「和弦」，比单音更饱满。",
    usage: "三个下拉各自选一个音；常放在旋律开头做「前奏」或结尾做「收束」。",
    example: "弹和弦 do + mi + sol（大三和弦）",
    stages: ["stage-6-8"],
  },
  {
    id: "maker_random_note",
    label: "随机音符",
    category: "声音",
    color: 280,
    shape: "statement",
    parts: [T("随机弹一个音")],
    purpose: "每次运行从 do~ti 里随机挑一个音弹出来，让旋律每次都不一样，充满惊喜。",
    usage: "放在「重复执行」里，就能生成一段随机的小曲子。",
    example: "重复 5 次 ▸ 随机弹一个音",
    stages: ["stage-6-8"],
  },

  // ============ 特殊组件（非积木，但属于项目用到的能力） ============
  {
    id: "special_cloud",
    label: "飘动乌云",
    category: "特殊",
    color: 210,
    shape: "special",
    parts: [],
    purpose: "舞台上缓慢飘动、碰到边界会反弹的乌云。它是「躲避乌云」项目的核心障碍。",
    usage: "云由项目自动生成并飘动，你用「碰到乌云?」积木实时判断来躲开它。",
    example: "在「躲避乌云」项目里：如果 碰到乌云 那么 右转。",
    stages: ["stage-6-8"],
  },
  {
    id: "special_obstacle",
    label: "障碍标记",
    category: "特殊",
    color: 210,
    shape: "special",
    parts: [],
    purpose: "舞台上的静态障碍物（如小石头），用「碰到标记(障碍)」来侦测是否撞上。",
    usage: "在「遇到石头绕过去」项目里，用「如果 碰到 障碍 那么 右转」练习自动绕行。",
    example: "如果 碰到 障碍 那么 右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "special_badguy",
    label: "坏人标记",
    category: "特殊",
    color: 210,
    shape: "special",
    parts: [],
    purpose: "舞台上的「坏人」角色，用「碰到标记(坏人)」侦测，用来练习逃跑。",
    usage: "在「碰到坏人就快跑」项目里，用「如果 碰到 坏人 那么 右转」赶紧避开。",
    example: "如果 碰到 坏人 那么 右转 90 度",
    stages: ["stage-6-8"],
  },
  {
    id: "special_memory",
    label: "记忆翻牌",
    category: "特殊",
    color: 210,
    shape: "special",
    parts: [],
    purpose: "一个独立的小游戏组件（不是积木）：翻开两张牌，相同就配对成功，锻炼记忆力。",
    usage: "在「记忆翻牌」项目里单独游玩，靠记忆记住卡片位置，把 6 对全部配对。",
    example: "翻开 🍎，再翻 🍎 → 配对成功。",
    stages: ["stage-6-8"],
  },
];

// ============ 自动统计：每个积木在哪些项目用到 ============
function computeUsedIn(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const p of projects) {
    if (!p.defaultXml) continue;
    for (const b of BLOCK_CATALOG) {
      if (b.shape === "special") continue; // 特殊组件不在 defaultXml 里
      if (p.defaultXml.includes(`type="${b.id}"`)) {
        (map[b.id] ||= []).push(p.slug);
      }
    }
  }
  return map;
}

export const USED_IN: Record<string, string[]> = computeUsedIn();

export function getBlocksByStage(stageId: string): BlockDoc[] {
  return BLOCK_CATALOG.filter((b) => b.stages.includes(stageId));
}

export function getProjectTitle(slug: string): string | undefined {
  return projects.find((p) => p.slug === slug)?.title;
}
