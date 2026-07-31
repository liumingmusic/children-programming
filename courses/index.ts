export interface CourseStep {
  id: number;
  title: string;
}

export interface CourseProject {
  slug: string;
  title: string;
  ageGroup: string;
  description: string;
  /** 分类 id，对应 CATEGORIES 中某阶段的分类（如 "seq" / "loop" / "draw"）。用于 /missions/[stage] 页按分类分组展示。 */
  category: string;
  missionBrief: string;
  erLingHint: string;
  steps: CourseStep[];
  defaultXml?: string;
  /** 舞台场景装饰（纯展示）：目标点 emoji、障碍、迷宫墙等。不参与运行逻辑与步骤判定。 */
  scene?: ProjectScene;
  /** 舞台上需要收集的「星星/物品」坐标。传给 Runtime 作为可收集目标（碰触即收集），用于条件与游戏类收集项目。 */
  stars?: { x: number; y: number }[];
  /** 特殊项目类型：memory=独立翻牌小游戏（不走 Blockly 积木，由专门组件实现）。 */
  component?: "memory";
}

/** 舞台上的装饰标记（纯展示用，例如小旗子、宝藏箱、石头、箭头）。 */
export interface SceneMark {
  x: number;
  y: number;
  emoji: string;
  label?: string;
  /** 交互种类：decor=纯装饰；obstacle=障碍（运行时参与碰撞判定）；badguy=坏人（运行时参与碰撞判定）。 */
  kind?: "decor" | "obstacle" | "badguy";
}
/** 舞台上的线段障碍（纯展示，例如迷宫的墙）。 */
export interface SceneWall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
/** 会缓慢飘动的乌云（躲避类游戏用），由运行时按 vx/vy 持续移动并反弹于边界。 */
export interface SceneCloud {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}
/** 项目的舞台场景配置（纯展示，不参与运行逻辑判定）。 */
export interface ProjectScene {
  marks?: SceneMark[];
  walls?: SceneWall[];
  /** 会动的乌云列表（躲避类项目用）。 */
  clouds?: SceneCloud[];
}

/** 项目分类：每个学龄段下，把项目进一步按「概念 / 题材」分组，便于在 /missions/[stage] 页分层展示。 */
export interface ProjectCategory {
  /** 分类唯一 id（同阶段内唯一） */
  id: string;
  /** 分类完整名称，如 "基础序列与方向" */
  name: string;
  /** 短标签，显示在分类名旁的胶囊里，如 "序列" */
  shortTag: string;
  /** 一句话介绍，显示在分类标题下方 */
  description: string;
}

/** 分类注册表：按学龄段 id 索引。这是「阶段 → 分类」的单一数据源；新增项目时从对应分类里选 id 作为 category 字段。 */
export const CATEGORIES: Record<string, ProjectCategory[]> = {
  "stage-6-8": [
    { id: "seq", name: "基础序列与方向", shortTag: "序列", description: "用「前进 / 转向」让二零按指令移动，先打好程序顺序的基础。" },
    { id: "loop", name: "循环与重复", shortTag: "循环", description: "用「重复执行」省去重复步骤，画出整齐的图形。" },
    { id: "draw", name: "画笔与几何艺术", shortTag: "绘图", description: "落笔 + 循环，画出彩虹、星星、花朵等美丽图案。" },
    { id: "event", name: "事件与互动", shortTag: "事件", description: "用「当点击 / 当开始」让程序响应外界动作。" },
    { id: "cond", name: "条件判断", shortTag: "条件", description: "用「如果…那么」让二零根据情况做不同选择。" },
    { id: "game", name: "收集与闯关游戏", shortTag: "游戏", description: "结合移动、判定与收集，做成好玩的小游戏。" },
    { id: "story", name: "故事与动画", shortTag: "故事", description: "让二零说话、表演，编排小动画和故事。" },
    { id: "music", name: "音乐与节奏", shortTag: "音乐", description: "用积木弹奏旋律，感受编程与节奏的结合。" },
    { id: "math", name: "数学启蒙", shortTag: "数学", description: "在玩中认识数数、图形、对称与规律。" },
    { id: "science", name: "自然科学模拟", shortTag: "科学", description: "模拟昼夜、四季、生长等自然现象。" },
    { id: "pbl", name: "综合创意 / 毕业项目", shortTag: "综合", description: "把学到的本领组合起来，做出属于自己的作品。" },
  ],
  "stage-9-12": [
    { id: "fn", name: "函数与自定义积木", shortTag: "函数", description: "把重复的动作打包成自己的积木，学会抽象。" },
    { id: "var", name: "变量与状态", shortTag: "变量", description: "用变量记录分数、步数、状态，让程序记住东西。" },
    { id: "multi", name: "多角色与协作", shortTag: "多角色", description: "让多个角色一起表演、对话、协作。" },
    { id: "key", name: "键盘与操控游戏", shortTag: "键盘", description: "用方向键控制角色，做可操控的小游戏。" },
    { id: "music", name: "音乐创作", shortTag: "音乐", description: "用积木创作旋律与节奏。" },
    { id: "math", name: "数学与逻辑进阶", shortTag: "数学", description: "乘法表、质数、坐标绘图等进阶数学。" },
    { id: "list", name: "列表与数据", shortTag: "列表", description: "用列表管理一组有序的数据。" },
    { id: "game", name: "综合小游戏", shortTag: "游戏", description: "贪吃蛇、井字棋、猜数字等综合小游戏。" },
    { id: "story", name: "交互绘本与故事", shortTag: "故事", description: "可点击、可分支的互动绘本。" },
    { id: "science", name: "科学探究", shortTag: "科学", description: "昼夜、四季、水循环等科学模拟。" },
  ],
  "stage-13-16": [
    { id: "js", name: "文本代码过渡", shortTag: "JS", description: "从积木平滑过渡到 JavaScript 文本代码。" },
    { id: "algo", name: "算法与数据结构", shortTag: "算法", description: "排序、查找、递归等算法思维。" },
    { id: "phys", name: "物理与模拟", shortTag: "物理", description: "自由落体、碰撞、重力等物理模拟。" },
    { id: "dataviz", name: "数据可视化", shortTag: "数据", description: "用图表把数据画出来。" },
    { id: "creative", name: "创意编程", shortTag: "创意", description: "分形、粒子、生成艺术等创意作品。" },
    { id: "web", name: "网页 / 小游戏开发", shortTag: "Web", description: "用 DOM 与画布做网页和小游戏。" },
    { id: "ai", name: "人工智能启蒙", shortTag: "AI", description: "决策树、分类器、聊天机器人等 AI 直觉。" },
    { id: "capstone", name: "毕业项目", shortTag: "毕业", description: "综合运用，完成属于自己的完整作品。" },
  ],
};

/** 学龄段：按年龄把项目分成不同的探险阶段，每个阶段包含多个独立项目。 */
/** 根据分类 id 返回展示用的短标签（跨学段查找）。找不到时回退为原始 id。供家长入口/作品花园按分类分组与筛选使用。 */
export function getCategoryLabel(categoryCode: string): string {
  for (const stageId of Object.keys(CATEGORIES)) {
    const cat = CATEGORIES[stageId].find((c) => c.id === categoryCode);
    if (cat) return cat.shortTag;
  }
  return categoryCode;
}

export interface Stage {
  /** 唯一 id，用于锚点与路由 */
  id: string;
  /** 年龄段文案，例如 "6-8 岁" */
  ageRange: string;
  /** 阶段名称，例如 "图形化积木启蒙" */
  name: string;
  /** 一句话介绍 */
  tagline: string;
  /** open=已开放，soon=即将开放 */
  status: "open" | "soon";
  /** 该阶段下的项目 slug 列表（按顺序） */
  projectSlugs: string[];
}

export const stages: Stage[] = [
  {
    id: "stage-6-8",
    ageRange: "6-8 岁",
    name: "图形化积木启蒙",
    tagline: "拖拽彩色积木，让二零动起来、画图案、做小游戏。",
    status: "open",
    projectSlugs: ["hello", "flag", "stone", "shapeL", "home", "maze", "arrow", "zigzag", "treasure", "dance", "frame", "square", "triangle", "pentagon", "spin", "stairs", "wave", "spiral", "fence", "windmill", "pickfruit", "star5", "flower", "rainbow", "snowflake", "mandala", "concentric", "connectdot", "house", "letter", "checkerboard", "click_jump", "click_color", "click_dialog", "two_events", "click_play_dialog", "auto_patrol", "key_forward", "edge_bounce", "size_toggle", "expression_shake", "if_touch_star", "if_edge_turn", "if_red_stop", "click_left_right", "collect3", "random_branch", "odd_even", "size_threshold", "avoid_obstacle", "escape_badguy", "stars", "maze_exit", "collect_apples", "light_lanterns", "collect_rainbow", "treasure_map", "escort", "traffic_police", "dodge_clouds", "memory_match"],
  },
  {
    id: "stage-9-12",
    ageRange: "9-12 岁",
    name: "代码初探",
    tagline: "从积木过渡到 JavaScript，做小工具与互动游戏。",
    status: "soon",
    projectSlugs: [],
  },
  {
    id: "stage-13-16",
    ageRange: "13-16 岁",
    name: "进阶工坊",
    tagline: "用 Python 与网页技术，完成属于自己的独立项目。",
    status: "soon",
    projectSlugs: [],
  },
];

export const projects: CourseProject[] = [
  {
    slug: "hello",
    category: "seq",
    title: "二零，打个招呼！",
    ageGroup: "6-8 岁",
    description: "用积木让二零移动并说出第一句话。",
    missionBrief: "二零刚来到造物星球，它想飞到舞台中央，跟大家说声「你好」。你能帮它写出第一个程序吗？",
    erLingHint: "① 先从积木区拖一个绿色「当开始运行」事件到工作区；② 把黄色「移动」积木拖进它的里面；③ 再拖一个紫色「说」积木接在后面，输入想说的话；④ 点「运行」！卡住时点右上角「看示范」照着学。",
    steps: [
      { id: 1, title: "让二零移动" },
      { id: 2, title: "让二零说话" },
      { id: 3, title: "点击运行看到效果" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_move">
            <value name="STEPS">
              <shadow type="math_number"><field name="NUM">100</field></shadow>
            </value>
            <next>
              <block type="maker_say">
                <value name="TEXT">
                  <shadow type="text"><field name="TEXT">你好！我是二零</field></shadow>
                </value>
                <value name="SECONDS">
                  <shadow type="math_number"><field name="NUM">2</field></shadow>
                </value>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "rainbow",
    category: "draw",
    title: "二零画彩虹",
    ageGroup: "6-8 岁",
    description: "用循环和画笔命令让二零画出彩虹螺旋。",
    missionBrief: "二零捡到了一支神奇的画笔。只要重复转圈，它就能画出彩虹。",
    erLingHint: "① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 36 次」，里面依次放「移动」「右转」「画笔颜色增加」；③ 点「运行」，二零会一圈圈画出彩虹。找不到灵感就点「看示范」。",
    steps: [
      { id: 1, title: "使用落笔和画笔颜色积木" },
      { id: 2, title: "用循环让二零边移动边转向" },
      { id: 3, title: "运行并看到彩虹图案" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">36</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">10</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">10</field></shadow>
                        </value>
                        <next>
                          <block type="maker_pen_change_color">
                            <value name="DELTA">
                              <shadow type="math_number"><field name="NUM">10</field></shadow>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "flag",
    category: "seq",
    title: "走到小旗子",
    ageGroup: "6-8 岁",
    description: "用前进和转向，指挥二零穿过星球走到小旗子旁。",
    missionBrief: "造物星球上插着一面小旗子🚩。帮二零按顺序前进、转向，稳稳地走到小旗子旁边吧！",
    erLingHint: "① 先拖一个绿色「当开始运行」事件到工作区；② 在里面放「落笔」，让路线看得见；③ 再依次放「移动」和「右转」积木，指挥二零前进、拐弯；④ 点「运行」，看二零走到小旗子旁。卡住就点「看示范」。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "用转向走到小旗子" },
      { id: 3, title: "运行看二零到达" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                <next>
                                  <block type="maker_pen_up"></block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: -80, y: 80, emoji: "🚩", label: "小旗子" }] },
  },
  {
    slug: "stone",
    category: "seq",
    title: "绕过小石头",
    ageGroup: "6-8 岁",
    description: "路上有一块小石头，指挥二零拐个弯绕过去。",
    missionBrief: "一颗小石头🪨挡在前面。让二零先往前走一点，再拐弯从旁边绕过去，别撞上它！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 先「移动」往前走一段；③ 用「右转」拐弯，从石头旁边绕过去；④ 再「移动」继续前进，最后「抬笔」。点「运行」看看绕行的路线。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "拐弯绕过小石头" },
      { id: 3, title: "运行看绕行路线" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">140</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                            <next>
                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">75</field></shadow></value>
                                                <next>
                                                  <block type="maker_pen_up"></block>
                                                </next>
                                              </block>
                                            </next>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: {
      marks: [
        { x: 0, y: 75, emoji: "🪨", label: "小石头" },
        { x: 100, y: 75, emoji: "🏁", label: "终点" },
      ],
    },
  },
  {
    slug: "shapeL",
    category: "seq",
    title: "画一个「L」形路线",
    ageGroup: "6-8 岁",
    description: "指挥二零画出一条笔直的 L 形路线。",
    missionBrief: "用画笔让二零画出一条 L 形路线：先直直往上，再拐个弯往旁边。看，像不像字母 L？",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；②「移动」往上走一段；③「右转」拐弯；④ 再「移动」往旁边走一段，最后「抬笔」。运行后就能看到一条 L 形线。",
    steps: [
      { id: 1, title: "让二零落笔画线" },
      { id: 2, title: "拐弯画出 L 的另一边" },
      { id: 3, title: "运行看 L 形图案" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                        <next>
                          <block type="maker_pen_up"></block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: -100, y: 100, emoji: "🏁", label: "终点" }] },
  },
  {
    slug: "home",
    category: "seq",
    title: "送信使回家",
    ageGroup: "6-8 岁",
    description: "送信使迷路了，指挥二零带它回到小屋。",
    missionBrief: "一只送信使🏠找不到回家的路。帮二零按顺序走，把它平安送回小屋门口吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 先「移动」往前；③「右转」换方向；④ 再「移动」走到小屋，最后「抬笔」。点「运行」看二零送它回家。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "转向走到小屋" },
      { id: 3, title: "运行看到达小屋" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                        <next>
                          <block type="maker_pen_up"></block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: -120, y: 80, emoji: "🏠", label: "信使的家" }] },
  },
  {
    slug: "maze",
    category: "seq",
    title: "走方格迷宫",
    ageGroup: "6-8 岁",
    description: "沿着格子路线，不靠循环走到出口。",
    missionBrief: "造物星球有个小迷宫，出口🚪在一角。用一步一步的前进和转向，把二零带到出口吧（这一关先不用循环哦）！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 按路线「移动」前进；③ 遇到墙就「右转」换方向；④ 继续「移动」直到出口，最后「抬笔」。点「运行」走一遍迷宫。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "拐弯穿过迷宫" },
      { id: 3, title: "运行走到出口" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                <next>
                                  <block type="maker_pen_up"></block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: {
      marks: [{ x: -80, y: 0, emoji: "🚪", label: "出口" }],
      walls: [
        { x1: 40, y1: 0, x2: 40, y2: 90 },
        { x1: 0, y1: 40, x2: 110, y2: 40 },
      ],
    },
  },
  {
    slug: "arrow",
    category: "seq",
    title: "跟着箭头走",
    ageGroup: "6-8 岁",
    description: "沿着箭头指的方向，一步步走到终点。",
    missionBrief: "地上画着箭头⬆️⬅️，指引二零前进的方向。照着箭头走，把它带到终点🎯吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 跟着箭头「移动」前进；③ 箭头转弯处用「右转」换方向；④ 走到终点🎯后「抬笔」。点「运行」照箭头走一遍。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "按箭头转向前进" },
      { id: 3, title: "运行到终点" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                        <next>
                          <block type="maker_pen_up"></block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: {
      marks: [
        { x: 0, y: 50, emoji: "⬆️" },
        { x: -50, y: 100, emoji: "⬅️" },
        { x: -100, y: 100, emoji: "🎯", label: "终点" },
      ],
    },
  },
  {
    slug: "zigzag",
    category: "seq",
    title: "折线探险",
    ageGroup: "6-8 岁",
    description: "画出一条上下折返的折线探险路线。",
    missionBrief: "造物星球有一条 zigzag 小路。指挥二零一会上、一会下，画出一条弯弯折折的探险路线吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；②「移动」、「右转」交替使用，让路线一会上、一会下；③ 重复几次「移动 + 右转」画出折线，最后「抬笔」。点「运行」看折线。",
    steps: [
      { id: 1, title: "让二零落笔画线" },
      { id: 2, title: "画出上下折返的折线" },
      { id: 3, title: "运行看折线图案" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                            <next>
                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                <next>
                                                  <block type="maker_pen_up"></block>
                                                </next>
                                              </block>
                                            </next>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "treasure",
    category: "seq",
    title: "到达宝藏箱",
    ageGroup: "6-8 岁",
    description: "找到藏起来的宝藏箱📦，指挥二零过去。",
    missionBrief: "造物星球藏着一只宝藏箱📦！指挥二零穿过草地，走到宝藏箱旁边，把它找出来吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 先「移动」往前；③「右转」换方向；④ 再「移动」走到宝藏箱，最后「抬笔」。点「运行」看二零找到宝藏。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "转向走到宝藏箱" },
      { id: 3, title: "运行看找到宝藏" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">70</field></shadow></value>
                        <next>
                          <block type="maker_pen_up"></block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: -70, y: 90, emoji: "📦", label: "宝藏箱" }] },
  },
  {
    slug: "dance",
    category: "seq",
    title: "按指令跳舞",
    ageGroup: "6-8 岁",
    description: "用移动和转向，给二零编一段方块舞。",
    missionBrief: "音乐响起来🎵！给二零下一串「移动 + 右转」的指令，看它转出一段可爱的方块舞步吧。",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 重复放「移动」和「右转」（比如 8 次），每次转一个小角度；③ 二零就会转着圈跳舞，最后「抬笔」。点「运行」看舞步。",
    steps: [
      { id: 1, title: "让二零动起来" },
      { id: 2, title: "用转向跳出舞步" },
      { id: 3, title: "运行看跳舞" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                            <next>
                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                <next>
                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                    <next>
                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                        <next>
                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                            <next>
                                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                <next>
                                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                    <next>
                                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                        <next>
                                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                            <next>
                                                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                                <next>
                                                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                                    <next>
                                                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                                        <next>
                                                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                                            <next>
                                                                                              <block type="maker_pen_up"></block>
                                                                                            </next>
                                                                                          </block>
                                                                                        </next>
                                                                                      </block>
                                                                                    </next>
                                                                                  </block>
                                                                                </next>
                                                                              </block>
                                                                            </next>
                                                                          </block>
                                                                        </next>
                                                                      </block>
                                                                    </next>
                                                                  </block>
                                                                </next>
                                                              </block>
                                                            </next>
                                                          </block>
                                                        </next>
                                                      </block>
                                                    </next>
                                                  </block>
                                                </next>
                                              </block>
                                            </next>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: 0, emoji: "💃", label: "跳舞" }] },
  },
  {
    slug: "frame",
    category: "seq",
    title: "走「回」字路线",
    ageGroup: "6-8 岁",
    description: "指挥二零走出一个「回」字形路线。",
    missionBrief: "挑战一下：让二零先走一个大正方形外框，再走一个小正方形内框，连起来就像汉字「回」啦！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 用「移动 + 右转」重复 4 次画出外框；③ 走到中间，再「移动 + 右转」重复 4 次画出内框；④ 最后「抬笔」。点「运行」看「回」字。",
    steps: [
      { id: 1, title: "让二零落笔画外框" },
      { id: 2, title: "走到中间画内框" },
      { id: 3, title: "运行看「回」字" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                            <next>
                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                <next>
                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                                                    <next>
                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                        <next>
                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                                                            <next>
                                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                <next>
                                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                    <next>
                                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                        <next>
                                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                            <next>
                                                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                                <next>
                                                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                                    <next>
                                                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                                        <next>
                                                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                                            <next>
                                                                                              <block type="maker_pen_up"></block>
                                                                                            </next>
                                                                                          </block>
                                                                                        </next>
                                                                                      </block>
                                                                                    </next>
                                                                                  </block>
                                                                                </next>
                                                                              </block>
                                                                            </next>
                                                                          </block>
                                                                        </next>
                                                                      </block>
                                                                    </next>
                                                                  </block>
                                                                </next>
                                                              </block>
                                                            </next>
                                                          </block>
                                                        </next>
                                                      </block>
                                                    </next>
                                                  </block>
                                                </next>
                                              </block>
                                            </next>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "square",
    category: "loop",
    title: "二零画正方形",
    ageGroup: "6-8 岁",
    description: "用循环和画笔，让二零画出方方正正的正方形。",
    missionBrief: "造物星球要盖一座方形的小房子，需要一条笔直的四边围墙。帮二零拿起画笔，用「重复执行」一次画出四条边吧！",
    erLingHint: "① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 4 次」，里面依次放「移动 100 步」和「右转 90 度」；③ 最后接一个「抬笔」收尾；④ 点「运行」，二零会转着圈画出正方形。卡住就点「看示范」。",
    steps: [
      { id: 1, title: "让二零落笔开始画" },
      { id: 2, title: "用循环画出四条边" },
      { id: 3, title: "运行看到正方形" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">4</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">100</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">90</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_pen_up"></block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "triangle",
    category: "loop",
    title: "二零画三角形",
    ageGroup: "6-8 岁",
    description: "用循环和画笔，让二零画出三条边一样长的正三角形。",
    missionBrief: "小树的影子是一个三角形。帮二零用「重复执行 3 次」，画出三条等长边，拼出一个稳稳的三角形吧！",
    erLingHint: "① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 3 次」，里面放「移动 100 步」和「右转 120 度」；③ 最后接「抬笔」；④ 点「运行」看二零画三角形。提示：三角形每个角是 120 度哦。",
    steps: [
      { id: 1, title: "让二零落笔开始画" },
      { id: 2, title: "用循环画出三条边" },
      { id: 3, title: "运行看到三角形" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">3</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">100</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">120</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_pen_up"></block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "star5",
    category: "draw",
    title: "二零画五角星",
    ageGroup: "6-8 岁",
    description: "用循环和画笔，让二零画出闪闪发光的五角星。",
    missionBrief: "夜空里少了一颗星星。帮二零用「重复执行 5 次」画出一颗五角星，挂回造物星球的夜空吧！",
    erLingHint: "① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 5 次」，里面放「移动 100 步」和「右转 144 度」；③ 最后接「抬笔」；④ 点「运行」。记住：星星的魔法角度是 144 度！",
    steps: [
      { id: 1, title: "让二零落笔开始画" },
      { id: 2, title: "用循环画出五角星" },
      { id: 3, title: "运行看到五角星" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">5</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">100</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">144</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_pen_up"></block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "flower",
    category: "draw",
    title: "二零画花朵",
    ageGroup: "6-8 岁",
    description: "用嵌套循环和画笔，让二零画出一朵六瓣花。",
    missionBrief: "造物星球的花园空空的。帮二零用「循环里再套循环」画出一片片花瓣，变出一朵六瓣花送给伙伴吧！",
    erLingHint: "① 绿色「当开始运行」里先放「落笔」；② 放「重复执行 6 次」（画 6 片花瓣），里面再放一个「重复执行 2 次」的小循环；③ 小循环里放「移动 50 步」和「右转 60 度」，小循环后面接一个「右转 60 度」收一片花瓣；④ 大循环后面再「右转 60 度」转到下一片；⑤ 点「运行」看花朵绽放。",
    steps: [
      { id: 1, title: "让二零落笔开始画" },
      { id: 2, title: "用嵌套循环画出花瓣" },
      { id: 3, title: "运行看到花朵" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">6</field></shadow>
                </value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES">
                      <shadow type="math_number"><field name="NUM">2</field></shadow>
                    </value>
                    <statement name="DO">
                      <block type="maker_move">
                        <value name="STEPS">
                          <shadow type="math_number"><field name="NUM">50</field></shadow>
                        </value>
                        <next>
                          <block type="maker_turn">
                            <value name="DEGREES">
                              <shadow type="math_number"><field name="NUM">60</field></shadow>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">60</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_turn">
                    <value name="DEGREES">
                      <shadow type="math_number"><field name="NUM">60</field></shadow>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "stars",
    category: "game",
    title: "二零收集星星",
    ageGroup: "6-8 岁",
    description: "点击舞台，用事件和判断让二零收集星星。",
    missionBrief: "星球上散落着 3 颗小星星。写一个程序：当点击舞台时，二零飞到鼠标位置；如果碰到星星，就宣布「收集到啦！」。",
    erLingHint: "① 拖一个蓝色「当舞台被点击」事件；② 里面放「移到鼠标位置」，再加「如果…那么」，条件放「碰到星星」、那么里放「说 收集到啦！」；③ 点「运行」后，在舞台上依次点击那 3 颗星星就能收集！",
    steps: [
      { id: 1, title: "使用「当舞台被点击」事件" },
      { id: 2, title: "使用「如果碰到星星」判断" },
      { id: 3, title: "收集所有 3 颗星星" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_stage_clicked" x="60" y="60">
        <statement name="STACK">
          <block type="maker_goto_mouse">
            <next>
              <block type="controls_if">
                <value name="IF0">
                  <block type="maker_touching_star"></block>
                </value>
                <statement name="DO0">
                  <block type="maker_say">
                    <value name="TEXT">
                      <shadow type="text"><field name="TEXT">收集到啦！</field></shadow>
                    </value>
                    <value name="SECONDS">
                      <shadow type="math_number"><field name="NUM">1</field></shadow>
                    </value>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },

  // === 分类 2 · 循环与重复（新增 8 项） ===
  {
    slug: "pentagon",
    category: "loop",
    title: "画正五边形",
    ageGroup: "6-8 岁",
    description: "用循环和画笔，让二零画出五条边一样长的正五边形。",
    missionBrief: "造物星球要做一个五边形的路标。帮二零用「重复执行 5 次」，画出五条等长边，拼出一个正五边形吧！",
    erLingHint: "① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 5 次」，里面放「移动 100 步」和「右转 72 度」；③ 最后接「抬笔」；④ 点「运行」。提示：五边形每个外角是 72 度哦。",
    steps: [
      { id: 1, title: "让二零落笔开始画" },
      { id: 2, title: "用循环画出五条边" },
      { id: 3, title: "运行看到正五边形" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">72</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "spin",
    category: "loop",
    title: "原地转圈 12 次",
    ageGroup: "6-8 岁",
    description: "用循环让二零转着圈走 12 步，画出一个圆。",
    missionBrief: "二零想在原地转个圈热身。用「重复执行 12 次」，每次走一小步再转一点点，它就转出一圈啦！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 12 次」，里面放「移动 20 步」和「右转 30 度」；③ 最后「抬笔」；④ 点「运行」，二零会转着圈走成一个圆。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环转圈 12 步" },
      { id: 3, title: "运行看到圆圈" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "stairs",
    category: "loop",
    title: "爬楼梯",
    ageGroup: "6-8 岁",
    description: "用循环画出一级一级向上爬的台阶。",
    missionBrief: "造物星球的小屋有台阶。帮二零用「重复执行」画出一级级向上爬的楼梯吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 6 次」，里面依次放「移动 50」「右转 90」「移动 50」「右转 90」（一阶一阶地往上爬）；③ 最后「抬笔」；④ 点「运行」看楼梯。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画出台阶" },
      { id: 3, title: "运行看到楼梯" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "wave",
    category: "loop",
    title: "波浪线",
    ageGroup: "6-8 岁",
    description: "用嵌套循环画出上下起伏的波浪线。",
    missionBrief: "小河边的水波一上一下。帮二零用「循环里再套循环」画出弯弯的波浪线吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面先放一个「重复执行 9 次」画上半圆（移动 10、右转 20），再放一个「重复执行 9 次」画下半圆（移动 10、右转 -20）；③ 最后「抬笔」；④ 点「运行」看波浪。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用嵌套循环画波浪" },
      { id: 3, title: "运行看到波浪线" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">9</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">20</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="controls_repeat_ext">
                        <value name="TIMES"><shadow type="math_number"><field name="NUM">9</field></shadow></value>
                        <statement name="DO">
                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                            <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-20</field></shadow></value></block></next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "spiral",
    category: "loop",
    title: "螺旋线",
    ageGroup: "6-8 岁",
    description: "用几段循环让二零画出越转越大的螺旋。",
    missionBrief: "蜗牛壳是螺旋形的！帮二零把几段「重复执行」拼起来，每一步走得更远，画出一条螺旋线吧。",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放 4 个「重复执行 8 次」，里面的「移动」步数分别用 10、20、30、40，每次都「右转 15 度」；③ 最后「抬笔」；④ 点「运行」看螺旋。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用多段循环画出螺旋" },
      { id: 3, title: "运行看到螺旋线" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                  </block>
                </statement>
                <next>
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="controls_repeat_ext">
                        <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                        <statement name="DO">
                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                            <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                          </block>
                        </statement>
                        <next>
                          <block type="controls_repeat_ext">
                            <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                            <statement name="DO">
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                              </block>
                            </statement>
                            <next><block type="maker_pen_up"></block></next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "fence",
    category: "loop",
    title: "画栅栏",
    ageGroup: "6-8 岁",
    description: "用循环画出一排整齐的栅栏。",
    missionBrief: "农场需要一圈栅栏。帮二零用「重复执行」画出一根根竖起的栅栏吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 5 次」，里面放「移动 60」「右转 90」「移动 20」「右转 -90」（画一根竖条再挪到下一根）；③ 最后「抬笔」；④ 点「运行」看栅栏。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画出栅栏" },
      { id: 3, title: "运行看到栅栏" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "windmill",
    category: "loop",
    title: "风车",
    ageGroup: "6-8 岁",
    description: "用循环画出一架四叶风车。",
    missionBrief: "造物星球的风车转呀转。帮二零用「重复执行 4 次」画出四片风车叶片吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面放「移动 100」「右转 180」「移动 100」「右转 90」（出去再回来，再转向下一叶）；③ 最后「抬笔」；④ 点「运行」看风车。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画出叶片" },
      { id: 3, title: "运行看到风车" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">180</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: 0, emoji: "🌬️", label: "风车" }] },
  },
  {
    slug: "pickfruit",
    category: "loop",
    title: "重复 N 次摘果子",
    ageGroup: "6-8 岁",
    description: "用循环绕着果树走，练习重复 N 次。",
    missionBrief: "果树上挂满了果子🍎。让二零用「重复执行 8 次」绕着树转圈去摘果子吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 8 次」，里面放「移动 60 步」和「右转 45 度」；③ 最后「抬笔」；④ 点「运行」，二零会绕着果树转一圈。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环绕树转圈" },
      { id: 3, title: "运行看到路线" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: 0, emoji: "🌳", label: "果树" }] },
  },

  // === 分类 3 · 画笔与几何艺术（新增 7 项） ===
  {
    slug: "snowflake",
    category: "draw",
    title: "雪花",
    ageGroup: "6-8 岁",
    description: "用循环画出六角对称的雪花。",
    missionBrief: "冬天到了，天上飘着雪花❄️。帮二零用「重复执行 6 次」画出六条放射的雪花瓣吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 6 次」，里面放「移动 80」「右转 180」「移动 80」「右转 60」（画一条出去再回来的放射线，再转到下一瓣）；③ 最后「抬笔」；④ 点「运行」看雪花。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画出雪花瓣" },
      { id: 3, title: "运行看到雪花" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">180</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">60</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: 0, emoji: "❄️", label: "雪花" }] },
  },
  {
    slug: "mandala",
    category: "draw",
    title: "曼陀罗 / 万花筒",
    ageGroup: "6-8 岁",
    description: "用嵌套循环画出对称的曼陀罗花纹。",
    missionBrief: "万花筒里的图案好漂亮！帮二零用「循环里再套循环」画出一圈圈对称的花纹吧。",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 12 次」，里面先放「重复执行 3 次」画一个小三角（移动 40、右转 120），再放「右转 30 度」换到下一朵；③ 最后「抬笔」；④ 点「运行」看曼陀罗。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用嵌套循环画花纹" },
      { id: 3, title: "运行看到曼陀罗" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "concentric",
    category: "draw",
    title: "同心圆",
    ageGroup: "6-8 岁",
    description: "用几段循环画出一圈套一圈的同心圆。",
    missionBrief: "水面上的波纹一圈圈散开。帮二零用几段「重复执行」画出大小不同的同心圆吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放 3 个「重复执行 24 次」，里面的「移动」步数分别用 3、5、7，每次都「右转 15 度」（步子越大圆越大）；③ 最后「抬笔」；④ 点「运行」看同心圆。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用多段循环画圆" },
      { id: 3, title: "运行看到同心圆" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">24</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                  </block>
                </statement>
                <next>
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">24</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="controls_repeat_ext">
                        <value name="TIMES"><shadow type="math_number"><field name="NUM">24</field></shadow></value>
                        <statement name="DO">
                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">7</field></shadow></value>
                            <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                          </block>
                        </statement>
                        <next><block type="maker_pen_up"></block></next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "connectdot",
    category: "draw",
    title: "折线连点画",
    ageGroup: "6-8 岁",
    description: "用循环把点连成折线图形。",
    missionBrief: "把桌面上的小点用线连起来，就能变出图形！帮二零用「重复执行」连出一条折线吧。",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 8 次」，里面放「移动 60 步」和「右转 45 度」；③ 最后「抬笔」；④ 点「运行」，二零会把点连成一个八边形。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环连点成图" },
      { id: 3, title: "运行看到图形" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: 0, emoji: "🔗", label: "连点" }] },
  },
  {
    slug: "house",
    category: "draw",
    title: "画小房子",
    ageGroup: "6-8 岁",
    description: "用循环画出房身和屋顶，拼出小房子。",
    missionBrief: "造物星球需要一座小房子🏠。帮二零先用「重复执行 4 次」画方方的房身，再画一个三角形的屋顶吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」画房身（移动 80、右转 90）；③ 再放「重复执行 3 次」画屋顶（移动 80、右转 120）；④ 最后「抬笔」；⑤ 点「运行」看小房子。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画房身和屋顶" },
      { id: 3, title: "运行看到小房子" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                  </block>
                </statement>
                <next>
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next><block type="maker_pen_up"></block></next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: -40, emoji: "🏠", label: "小房子" }] },
  },
  {
    slug: "letter",
    category: "draw",
    title: "画字母 / 自己的名字",
    ageGroup: "6-8 岁",
    description: "用循环画一个方框，再在里面写出自己的名字。",
    missionBrief: "想用画笔写出自己的名字吗？先让二零画一个方框当本子，你就能在里面写出第一个字母啦！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面放「移动 60 步」和「右转 90 度」（画一个方框）；③ 最后「抬笔」；④ 点「运行」看方框，再想象在里面写自己的名字。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画方框" },
      { id: 3, title: "运行看到图形" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: 0, emoji: "✏️", label: "写字" }] },
  },
  {
    slug: "checkerboard",
    category: "draw",
    title: "棋盘格",
    ageGroup: "6-8 岁",
    description: "用嵌套循环画出一排排小方格，组成棋盘。",
    missionBrief: "下棋需要棋盘格。帮二零用「循环里再套循环」画出一格格的小方块吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面先放「重复执行 4 次」画一个小方格（移动 40、右转 90），再放「右转 90」「移动 50」「右转 -90」挪到下一格；③ 最后「抬笔」；④ 点「运行」看棋盘格。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用嵌套循环画方格" },
      { id: 3, title: "运行看到棋盘格" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                        <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                          <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block></next>
                        </block></next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },

// === 分类 4 · 事件与互动（9 项） ===
{
  slug: "click_jump",
  category: "event",
  title: "点一下，二零跳一跳",
  ageGroup: "6-8 岁",
  description: "点击舞台，让二零向上跳一下再落回来。",
  missionBrief: "造物星球上有一只爱蹦跳的二零。写一个程序：当舞台被点击时，二零先向上跳一下，停一小会儿，再落回原处。",
  erLingHint: "① 拖一个蓝色「当舞台被点击」事件；② 里面放「移动 -30 步」（向上跳），接「等待 0.3 秒」，再接「移动 30 步」（落回来）；③ 点「运行」后在舞台上点一下，二零就蹦起来啦！",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "让二零向上跳起" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">-30</field></shadow></value>
          <next><block type="maker_wait">
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">0.3</field></shadow></value>
            <next><block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "click_color",
  category: "event",
  title: "点一下换颜色",
  ageGroup: "6-8 岁",
  description: "每次点击舞台，让二零画出不同颜色的线。",
  missionBrief: "二零有一支会变色的画笔。写一个程序：当舞台被点击时，它落下笔、换个颜色、向前画一小段，再抬笔。每点一次颜色都不一样！",
  erLingHint: "① 蓝色「当舞台被点击」里面放「落笔」；② 接「画笔颜色增加 60」（每次换色）；③ 接「移动 40 步」和「抬笔」；④ 点「运行」后多戳几下舞台，看线条变色。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "使用换画笔颜色积木" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next><block type="maker_pen_change_color">
            <value name="DELTA"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
            <next><block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
              <next><block type="maker_pen_up"></block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "click_dialog",
  category: "event",
  title: "连续点击对话",
  ageGroup: "6-8 岁",
  description: "每点一次舞台，二零说出不同的话。",
  missionBrief: "二零是个小话痨。写一个程序：每次点击舞台，它先说一句「你好呀！」，再说一句「今天天气真好！」，像在跟你聊天。",
  erLingHint: "① 蓝色「当舞台被点击」里放第一个紫色「说 你好呀！ 1 秒」；② 接第二个「说 今天天气真好！ 1 秒」；③ 点「运行」后多点几下舞台，听听二零聊天。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "让二零说出两句话" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">你好呀！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">今天天气真好！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "two_events",
  category: "event",
  title: "两个事件一起用",
  ageGroup: "6-8 岁",
  description: "把「当开始运行」和「当舞台被点击」两个事件组合到一起。",
  missionBrief: "一个程序可以有好几个事件！写一个程序：点「运行」时二零说「开始啦」，点击舞台时它又说「你点我啦」。",
  erLingHint: "① 拖一个绿色「当开始运行」，里面放「说 开始啦！ 1 秒」；② 再拖一个蓝色「当舞台被点击」，里面放「说 你点我啦！ 1 秒」；③ 点「运行」看看开始的效果，再点舞台听听另一句。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "使用「当舞台被点击」事件" },
    { id: 3, title: "两个事件都能触发" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">开始啦！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
        </block>
      </statement>
    </block>
    <block type="maker_when_stage_clicked" x="60" y="200">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">你点我啦！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "click_play_dialog",
  category: "event",
  title: "点我讲故事",
  ageGroup: "6-8 岁",
  description: "点击舞台，让二零讲出三段小故事。",
  missionBrief: "二零想当小小讲故事员。写一个程序：点击舞台时，它连着说出三句话，像一个迷你小故事。",
  erLingHint: "① 蓝色「当舞台被点击」里依次接三个紫色「说」积木；② 分别输入「从前有只二零」「它最爱编程」「你也来吗？」每段 1 秒；③ 点「运行」后点舞台，听二零讲故事。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "让二零连说三句话" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">从前有只二零</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">它最爱编程</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            <next><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">你也来吗？</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "auto_patrol",
  category: "event",
  title: "自动巡逻一圈",
  ageGroup: "6-8 岁",
  description: "点「运行」就让二零自己转圈巡逻。",
  missionBrief: "哨兵二零要绕场巡逻一圈。写一个程序：当开始运行时，它落下笔，重复转着圈走，画出一圈巡逻路线。",
  erLingHint: "① 绿色「当开始运行」里放「落笔」；② 接「重复执行 12 次」，里面放「移动 30 步」和「右转 30 度」；③ 最后接「抬笔」；④ 点「运行」，二零会转出一圈。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用循环让二零边走边转" },
    { id: 3, title: "运行看到巡逻路线" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down"><next>
          <block type="controls_repeat_ext">
            <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
            <statement name="DO">
              <block type="maker_move">
                <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                <next><block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                </block></next>
              </block>
            </statement>
            <next><block type="maker_pen_up"></block></next>
          </block>
        </next></block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "key_forward",
  category: "event",
  title: "按键前进",
  ageGroup: "6-8 岁",
  description: "用键盘方向键让二零前进，像操控小游戏。",
  missionBrief: "写一个小操控程序：按下「↑ 上」方向键，二零就向前走 50 步。在键盘上戳戳看！",
  erLingHint: "① 拖一个「当按下 ↑ 上」事件；② 里面放「移动 50 步」；③ 点「运行」后，用键盘的方向键 ↑ 控制二零前进（看示范会自动按一下演示）。",
  steps: [
    { id: 1, title: "使用「当按下方向键」事件" },
    { id: 2, title: "让二零向前移动" },
    { id: 3, title: "按方向键看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_key_pressed" x="60" y="60">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "edge_bounce",
  category: "event",
  title: "碰壁就转弯",
  ageGroup: "6-8 岁",
  description: "让二零边走边判断，碰到边缘就转弯。",
  missionBrief: "聪明的二零会看路。写一个程序：它一直向前走，一旦「碰到边缘」就转个弯，继续探索。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 60 次」；② 里面放「移动 20 步」，再放「如果…那么」，条件放「碰到边缘」、那么里放「右转 120 度」；③ 点「运行」看二零闯关。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「如果碰到边缘」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          <statement name="DO">
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
              <next><block type="controls_if">
                <value name="IF0"><block type="maker_touching_edge"></block></value>
                <statement name="DO0"><block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                </block></statement>
              </block></next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "size_toggle",
  category: "event",
  title: "点一下变大",
  ageGroup: "6-8 岁",
  description: "每次点击舞台，让二零变大一点。",
  missionBrief: "点一下舞台，二零就长大一点，像充气一样！再试试把它变小。",
  erLingHint: "① 蓝色「当舞台被点击」里放「二零大小增加 1」（每点一次变大）；② 想让它变小，就把数字改成 -1；③ 点「运行」后多点几下舞台看二零变大变小。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "改变二零的大小" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_change_size">
          <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
        </block>
      </statement>
    </block>
  </xml>`,
},

// === 分类 5 · 条件判断（5 项） ===
{
  slug: "if_touch_star",
  category: "cond",
  title: "碰到星星就说话",
  ageGroup: "6-8 岁",
  description: "用「如果…那么」判断碰到星星时说话。",
  missionBrief: "舞台上有几颗星星。写一个程序：点击舞台让二零飞过去，如果碰到了星星，就大声说「找到星星啦！」。",
  erLingHint: "① 蓝色「当舞台被点击」里放「移到鼠标位置」；② 接「如果…那么」，条件放「碰到星星」，那么里放「说 找到星星啦！」；③ 点「运行」后点击那颗在中间的星星试试。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "用「如果碰到星星」做判断" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  stars: [{ x: 0, y: 0 }, { x: 130, y: -70 }, { x: -130, y: -70 }],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_mouse"><next>
          <block type="controls_if">
            <value name="IF0"><block type="maker_touching_star"></block></value>
            <statement name="DO0"><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">找到星星啦！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            </block></statement>
          </block>
        </next></block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "if_edge_turn",
  category: "cond",
  title: "到边缘就拐弯",
  ageGroup: "6-8 岁",
  description: "用条件判断「如果碰到边缘就拐弯」。",
  missionBrief: "二零在星球上探险。写一个程序：它一直往前走，一旦「碰到边缘」就拐个弯，换方向继续走。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 80 次」；② 里面放「移动 15 步」，再放「如果…那么」，条件放「碰到边缘」、那么里放「右转 135 度」；③ 点「运行」看二零绕场。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「如果碰到边缘」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <statement name="DO">
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
              <next><block type="controls_if">
                <value name="IF0"><block type="maker_touching_edge"></block></value>
                <statement name="DO0"><block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">135</field></shadow></value>
                </block></statement>
              </block></next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "if_red_stop",
  category: "cond",
  title: "红色就停下",
  ageGroup: "6-8 岁",
  description: "用「如果画笔是红色就停下」做判断。",
  missionBrief: "二月学会了看信号灯。写一个程序：先把画笔设成红色，如果「画笔是红色」就大声说「红色，停下！」。",
  erLingHint: "① 绿色「当开始运行」里放「设置画笔颜色为 0」（红色）；② 接「如果…那么」，条件放「画笔是红色」，那么里放「说 红色，停下！ 2 秒」；③ 点「运行」看二零的反应。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「如果画笔是红色」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_set_color">
          <value name="HUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next><block type="controls_if">
            <value name="IF0"><block type="maker_pen_is_red"></block></value>
            <statement name="DO0"><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">红色，停下！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block></statement>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "click_left_right",
  category: "cond",
  title: "点左点右走不同路",
  ageGroup: "6-8 岁",
  description: "用「如果…否则」根据点击位置走不同方向。",
  missionBrief: "点舞台左边，二零向左走；点右边，它向右走。写一个程序：用「点击在左半边」判断，走不同的路。",
  erLingHint: "① 蓝色「当舞台被点击」里放「如果…那么…否则」（点积木上的齿轮加「否则」）；② 条件放「点击在左半边」，那么里放「移动 -60 步」，否则里放「移动 60 步」；③ 点「运行」后分别点左边和右边试试。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "用「点击在左半边」做判断" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_mouse_left"></block></value>
          <statement name="DO0"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
          </block></statement>
          <statement name="ELSE"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "collect3",
  category: "cond",
  title: "集齐三颗星",
  ageGroup: "6-8 岁",
  description: "飞向三颗星星全部收集，再庆祝。",
  missionBrief: "星球上散落着 3 颗星星。写一个程序：让二零依次飞向 1、2、3 号星星把它们都收集起来，最后说「全部收集完成，庆祝！」。",
  erLingHint: "① 绿色「当开始运行」里依次放三个「飞向星星 1 号 / 2 号 / 3 号」；② 最后放「说 全部收集完成，庆祝！ 1 秒」；③ 点「运行」，二零会自己飞去集齐三颗星。",
  steps: [
    { id: 1, title: "让二零飞向星星" },
    { id: 2, title: "收集到星星" },
    { id: 3, title: "集齐所有星星" },
  ],
  stars: [{ x: -100, y: 80 }, { x: 100, y: 0 }, { x: 0, y: -100 }],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_star">
          <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_goto_star">
            <value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            <next><block type="maker_goto_star">
              <value name="INDEX"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">全部收集完成，庆祝！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},

// === 分类 6 · 收集与闯关游戏（7 项） ===
{
  slug: "maze_exit",
  category: "game",
  title: "走迷宫到出口",
  ageGroup: "6-8 岁",
  description: "用前进和转向，带二零穿过迷宫走到出口。",
  missionBrief: "迷宫的墙挡住了去路。写一个程序：用「移动」和「右转 / 左转」带二零绕过墙，走到插着小旗子的出口。",
  erLingHint: "① 绿色「当开始运行」里用「移动」和「右转 90 度 / 左转 -90 度」拼出一条路线；② 让二零先往上、再拐弯、最后到出口；③ 点「运行」看它走到小旗子。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用前进和转向走出路线" },
    { id: 3, title: "运行走到出口" },
  ],
  scene: {
    walls: [
      { x1: -150, y1: -150, x2: -150, y2: 30 },
      { x1: -150, y1: 30, x2: -30, y2: 30 },
      { x1: 40, y1: 150, x2: 40, y2: -30 },
      { x1: 40, y1: -30, x2: 150, y2: -30 },
    ],
    marks: [{ x: -60, y: 120, emoji: "🏁", label: "出口" }],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_turn">
            <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
            <next><block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
              <next><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value>
                <next><block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "collect_apples",
  category: "game",
  title: "摘完所有苹果",
  ageGroup: "6-8 岁",
  description: "飞向每颗苹果树，把苹果都摘回家。",
  missionBrief: "果园里有 3 棵苹果树。写一个程序：让二零依次飞向 1、2、3 号苹果把它们都摘下来，最后说「苹果都摘完啦！」。",
  erLingHint: "① 绿色「当开始运行」里放三个「飞向星星 1 / 2 / 3 号」（每颗苹果就是一颗星星）；② 最后放「说 苹果都摘完啦！ 1 秒」；③ 点「运行」看二零摘光苹果。",
  steps: [
    { id: 1, title: "让二零飞向苹果" },
    { id: 2, title: "收集到苹果" },
    { id: 3, title: "摘完所有苹果" },
  ],
  stars: [{ x: -110, y: 70 }, { x: 110, y: 50 }, { x: 0, y: -100 }],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_star">
          <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_goto_star">
            <value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            <next><block type="maker_goto_star">
              <value name="INDEX"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">苹果都摘完啦！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "light_lanterns",
  category: "game",
  title: "按顺序点灯笼",
  ageGroup: "6-8 岁",
  description: "依次飞到三盏灯笼前，把它们依次点亮。",
  missionBrief: "节日到了，三盏灯笼还没亮。写一个程序：让二零依次飞到 1、2、3 号灯笼前，每到一个就换个颜色、说一句「第几盏亮了」。",
  erLingHint: "① 绿色「当开始运行」里用「移到 x: y:」依次飞到三个位置；② 每到一个就「设置画笔颜色」换色、再「说 第几盏亮了」；③ 点「运行」看灯笼依次亮起。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "依次点亮多盏灯笼" },
    { id: 3, title: "运行看到点亮效果" },
  ],
  scene: {
    marks: [
      { x: -100, y: 80, emoji: "🏮", label: "灯1" },
      { x: 0, y: 0, emoji: "🏮", label: "灯2" },
      { x: 100, y: -80, emoji: "🏮", label: "灯3" },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">-100</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_pen_set_color">
            <value name="HUE"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
            <next><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">第一盏亮了</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next><block type="maker_goto">
                <value name="X"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                <value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                <next><block type="maker_pen_set_color">
                  <value name="HUE"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                  <next><block type="maker_say">
                    <value name="TEXT"><shadow type="text"><field name="TEXT">第二盏亮了</field></shadow></value>
                    <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <next><block type="maker_goto">
                      <value name="X"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                      <value name="Y"><shadow type="math_number"><field name="NUM">-80</field></shadow></value>
                      <next><block type="maker_pen_set_color">
                        <value name="HUE"><shadow type="math_number"><field name="NUM">240</field></shadow></value>
                        <next><block type="maker_say">
                          <value name="TEXT"><shadow type="text"><field name="TEXT">第三盏亮了</field></shadow></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                        </block></next>
                      </block></next>
                    </block></next>
                  </block></next>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block></next>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "collect_rainbow",
  category: "game",
  title: "收集彩虹碎片",
  ageGroup: "6-8 岁",
  description: "飞向四块彩虹碎片，把它们都收集齐。",
  missionBrief: "彩虹碎成了 4 块散落各地。写一个程序：让二零依次飞向 1、2、3、4 号碎片，把它们都找回来，最后说「彩虹拼好啦！」。",
  erLingHint: "① 绿色「当开始运行」里放四个「飞向星星 1 / 2 / 3 / 4 号」；② 最后放「说 彩虹拼好啦！ 1 秒」；③ 点「运行」看二零拼好彩虹。",
  steps: [
    { id: 1, title: "让二零飞向彩虹碎片" },
    { id: 2, title: "收集到碎片" },
    { id: 3, title: "集齐所有碎片" },
  ],
  stars: [{ x: -130, y: 60 }, { x: -50, y: -90 }, { x: 50, y: -90 }, { x: 130, y: 60 }],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_star">
          <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_goto_star">
            <value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            <next><block type="maker_goto_star">
              <value name="INDEX"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next><block type="maker_goto_star">
                <value name="INDEX"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <next><block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">彩虹拼好啦！</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "treasure_map",
  category: "game",
  title: "跟着地图找宝藏",
  ageGroup: "6-8 岁",
  description: "按地图标记飞到宝藏箱的位置。",
  missionBrief: "你有一张藏宝图，宝藏箱在右下角。写一个程序：让二零直接飞到宝藏的位置，然后说「找到宝藏啦！」。",
  erLingHint: "① 绿色「当开始运行」里放「移到 x: 120 y: -60」（宝藏箱的位置）；② 接「说 找到宝藏啦！ 1 秒」；③ 点「运行」看二零挖到宝。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "飞到宝藏的位置" },
    { id: 3, title: "运行找到宝藏" },
  ],
  scene: {
    marks: [{ x: 120, y: -60, emoji: "📦", label: "宝藏" }],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">找到宝藏啦！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "escort",
  category: "game",
  title: "护送小动物回家",
  ageGroup: "6-8 岁",
  description: "飞到小动物身边接它，再送它回小屋。",
  missionBrief: "一只小动物在左上角迷路了，家在舞台中间。写一个程序：让二零先飞到小动物身边说「我来接你啦」，再飞回家说「回家咯」。",
  erLingHint: "① 绿色「当开始运行」里放「移到 小动物坐标」，接「说 我来接你啦 1 秒」；② 再放「移到 0,0（家）」，接「说 回家咯 1 秒」；③ 点「运行」看护送成功。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "飞到小动物并接它" },
    { id: 3, title: "运行护送它回家" },
  ],
  scene: {
    marks: [
      { x: -100, y: 80, emoji: "🐰", label: "小动物" },
      { x: 0, y: 0, emoji: "🏠", label: "家" },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">-100</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">我来接你啦</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            <next><block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">回家咯</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "traffic_police",
  category: "game",
  title: "交通警察指挥",
  ageGroup: "6-8 岁",
  description: "根据点击位置，指挥红绿灯：左半边停，右半边走。",
  missionBrief: "二月当上了小交警。写一个程序：点击舞台左半边，它说「红灯，停！」；点击右半边，它说「绿灯，走！」。",
  erLingHint: "① 蓝色「当舞台被点击」里放「如果…那么…否则」；② 条件放「点击在左半边」，那么里放「说 红灯，停！ 1 秒」，否则里放「说 绿灯，走！ 1 秒」；③ 点「运行」后分别点左边和右边。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "用「点击在左半边」做判断" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_mouse_left"></block></value>
          <statement name="DO0"><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">红灯，停！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></statement>
          <statement name="ELSE"><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">绿灯，走！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "expression_shake",
  category: "event",
  title: "摇晃变表情",
  ageGroup: "6-8 岁",
  description: "点击舞台让二零摇晃一下，并换上开心的表情。",
  missionBrief: "二零想用表情表达心情。写一个程序：点击舞台，二零先左右摇晃一下，然后换上「开心」的表情说一句话。",
  erLingHint: "① 蓝色「当舞台被点击」里先放两个「移动」（一个 -15、一个 15）让二零晃一晃；② 接「让二零表情变成 开心」；③ 最后接「说 我变开心啦！ 1 秒」；④ 点「运行」后点击舞台试试。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "用「让二零表情变成」换表情" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">-15</field></shadow></value>
          <next><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
            <next><block type="maker_set_expression">
              <field name="EXPR">happy</field>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">我变开心啦！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "random_branch",
  category: "cond",
  title: "随机走不同路",
  ageGroup: "6-8 岁",
  description: "用「随机整数」让二零走不同的方向。",
  missionBrief: "让二零每次都有点不一样：用「随机整数」决定它向左还是向右走。",
  erLingHint: "① 绿色「当开始运行」里放「如果…那么…否则」（点齿轮加「否则」）；② 条件放「比较：随机整数 1 到 2 等于 1」；③ 那么里放「移动 -60 步」，否则里放「移动 60 步」；④ 点「运行」多试几次，看二零每次方向是否不同。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「随机整数」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_compare">
            <value name="A"><block type="maker_random_int">
              <value name="MIN"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <value name="MAX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block></value>
            <field name="OP">==</field>
            <value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></value>
          <statement name="DO0"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
          </block></statement>
          <statement name="ELSE"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "odd_even",
  category: "cond",
  title: "奇偶步数走不同路",
  ageGroup: "6-8 岁",
  description: "用「变量 + 取余数」判断奇偶，让二零走锯齿路线。",
  missionBrief: "数数小游戏：让二零重复走 6 步，第「偶数」步走左边、第「奇数」步走右边，走出一条锯齿小路。",
  erLingHint: "① 绿色「当开始运行」里先放「把变量 n 设为 0」；② 接「重复执行 6 次」，里面放「如果…那么…否则」：条件放「比较：变量 n 取余数 2 等于 0」，那么里放「右转 30 度」、否则里放「右转 -30 度」；③ 接着放「变量 n 增加 1」和「移动 40 步」；④ 点「运行」看锯齿形。",
  steps: [
    { id: 1, title: "设置并使用变量" },
    { id: 2, title: "用「取余数」判断奇偶" },
    { id: 3, title: "运行看到锯齿路线" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">n</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next><block type="controls_repeat_ext">
            <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
            <statement name="DO"><block type="controls_if">
              <mutation else="1"></mutation>
              <value name="IF0"><block type="maker_compare">
                <value name="A"><block type="maker_mod">
                  <value name="A"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                  <value name="B"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block></value>
                <field name="OP">==</field>
                <value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              </block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
              </block></statement>
              <statement name="ELSE"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">-30</field></shadow></value>
              </block></statement>
            </block><next>
              <block type="maker_change_var">
                <field name="NAME">n</field>
                <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                <next><block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                </block></next>
              </block>
            </next></block></statement>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "size_threshold",
  category: "cond",
  title: "长到一定大小就停",
  ageGroup: "6-8 岁",
  description: "用「比较 + 二零当前大小」做阈值判断。",
  missionBrief: "二零一点点变大。写一个程序：它不断变大，一旦「大小超过 2」就大声说「够大啦！」停下来。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 8 次」；② 里面先放「二零大小增加 0.4」；③ 接「如果…那么」，条件放「比较：二零当前大小 大于 2」，那么里放「说 够大啦！ 1 秒」；④ 点「运行」，看二零变大到阈值就喊停。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「比较 + 二零当前大小」做阈值判断" },
    { id: 3, title: "运行看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO"><block type="maker_change_size">
            <value name="DELTA"><shadow type="math_number"><field name="NUM">0.4</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_compare">
                <value name="A"><block type="maker_get_size"></block></value>
                <field name="OP">></field>
                <value name="B"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
              </block></value>
              <statement name="DO0"><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">够大啦！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "avoid_obstacle",
  category: "cond",
  title: "遇到石头绕过去",
  ageGroup: "6-8 岁",
  description: "用「碰到障碍」判断，让二零绕开石头。",
  missionBrief: "舞台上有块石头 🪨。写一个程序：二零一直往前走，一「碰到障碍」就拐个弯继续走。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 40 次」；② 里面放「移动 15 步」，再放「如果…那么」，条件放「碰到 障碍」、那么里放「右转 90 度」；③ 点「运行」看二零绕开石头。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「碰到障碍」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  scene: {
    marks: [{ x: 60, y: 0, emoji: "🪨", label: "石头", kind: "obstacle" }],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_mark"><field name="KIND">obstacle</field></block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "escape_badguy",
  category: "cond",
  title: "碰到坏人就快跑",
  ageGroup: "6-8 岁",
  description: "用「碰到坏人」判断，让二零遇到坏猫咪就掉头逃跑。",
  missionBrief: "星球上有只坏猫咪 🐱。写一个程序：二零往前走，一旦「碰到坏人」就立刻掉头跑开。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 60 次」；② 里面放「移动 10 步」，再放「如果…那么」，条件放「碰到 坏人」、那么里放「右转 180 度」+「移动 30 步」；③ 点「运行」看二零遇到坏猫咪就掉头。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「碰到坏人」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  scene: {
    marks: [{ x: 40, y: 40, emoji: "🐱", label: "坏猫咪", kind: "badguy" }],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_mark"><field name="KIND">badguy</field></block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">180</field></shadow></value>
                <next><block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                </block></next>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "dodge_clouds",
  category: "game",
  title: "躲避乌云",
  ageGroup: "6-8 岁",
  description: "乌云会飘动，让二零躲开它们。",
  missionBrief: "天上有几朵会飘的乌云 ☁，碰到就糟糕啦。写一个程序：二零一直往前走，一「碰到乌云」就拐弯躲开。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 100 次」；② 里面放「移动 12 步」，再放「如果…那么」，条件放「碰到乌云」、那么里放「右转 120 度」；③ 点「运行」，看乌云慢慢飘、二零一路躲。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「碰到乌云」做判断" },
    { id: 3, title: "运行看到乌云飘动与躲避" },
  ],
  scene: {
    clouds: [
      { x: 0, y: 0, vx: 1.2, vy: 0.8, r: 35 },
      { x: -110, y: 70, vx: -1, vy: 1, r: 30 },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_cloud"></block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
},
{
  slug: "memory_match",
  category: "game",
  title: "记忆翻牌",
  ageGroup: "6-8 岁",
  description: "独立的翻牌配对小游戏：记住卡片位置，找出相同的两张。",
  missionBrief: "桌面上有几对图案卡片，全部背面朝上。翻开两张，如果一样就消除，不一样就盖回去——靠记忆力把全部卡片配对成功吧！",
  erLingHint: "这是一个记忆小游戏：点一张卡片翻开，再点另一张。两张图案相同就留在桌面，不同会自动盖回去。把全部配对成功就通关啦！",
  steps: [
    { id: 1, title: "翻开两张卡片" },
    { id: 2, title: "记住并找出相同的两张" },
    { id: 3, title: "把全部卡片配对成功" },
  ],
  component: "memory",
},
];

// ⚠️ 坐标体系（2026-07-31 修正）：
//  渲染世界 Y 轴朝上（StagePlayer.toScreen 用 ch/2 - wy），而 runtime 的 move
//  原本用 dy = steps·sin(angle)，导致「脸朝上(angle=270)时身体往下走」= 倒着走。
//  已把 move 的 Y 分量改为 dy = -steps·sin(angle)，使「脸朝方向 == 移动方向」。
//  初始 angle 保持 270（朝上）：move(100) → 世界 Y +100 → 屏幕向上，头朝上，一致。
//  场景坐标只需做 X 镜像（x→-x）即可让「看示范」路径仍落在旗子/星星/障碍上；
//  Y 不再镜像（已由 move 的 dy 负向修正统一处理，避免再翻一次）。
//  （不要在此手工逐个改坐标；要改某关目标位置，改镜像前的原始值即可。）
for (const p of projects) {
  if (p.stars) for (const s of p.stars) { s.x = -s.x; }
  const marks = p.scene?.marks;
  if (marks) for (const m of marks) { m.x = -m.x; }
  const clouds = p.scene?.clouds;
  if (clouds) for (const c of clouds) { c.x = -c.x; }
}

export function getProject(slug: string): CourseProject | undefined {
  return projects.find((p) => p.slug === slug);
}

/** 取某个学龄段下的全部项目（按 projectSlugs 顺序，过滤掉不存在的）。 */
export function getStageProjects(stageId: string): CourseProject[] {
  const stage = stages.find((s) => s.id === stageId);
  if (!stage) return [];
  return stage.projectSlugs
    .map((slug) => getProject(slug))
    .filter((p): p is CourseProject => Boolean(p));
}

/** 取某个学龄段下「按分类分组」的项目列表。只返回非空分类，分类顺序遵循 CATEGORIES 注册表，分类内项目遵循 projectSlugs 顺序。 */
export function getStageCategories(
  stageId: string
): Array<ProjectCategory & { projects: CourseProject[] }> {
  const stage = stages.find((s) => s.id === stageId);
  if (!stage) return [];
  const catDefs = CATEGORIES[stageId] ?? [];
  const projects = getStageProjects(stageId);
  return catDefs
    .map((cat) => ({ ...cat, projects: projects.filter((p) => p.category === cat.id) }))
    .filter((c) => c.projects.length > 0);
}

/** 取某个项目在同一学龄段里的下一个项目（用于完成弹窗的「挑战下一个」）。没有则返回 undefined。 */
export function getNextProject(slug: string): CourseProject | undefined {
  for (const stage of stages) {
    const ps = getStageProjects(stage.id);
    const idx = ps.findIndex((p) => p.slug === slug);
    if (idx >= 0 && idx < ps.length - 1) return ps[idx + 1];
  }
  return undefined;
}

/** 取某个项目所属的年段（用于项目页「返回」定位到对应的项目集合）。找不到返回 undefined。 */
export function getStageOfProject(slug: string): Stage | undefined {
  return stages.find((s) => s.projectSlugs.includes(slug));
}
