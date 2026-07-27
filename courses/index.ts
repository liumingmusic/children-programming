export interface CourseStep {
  id: number;
  title: string;
}

export interface CourseProject {
  slug: string;
  title: string;
  ageGroup: string;
  description: string;
  missionBrief: string;
  erLingHint: string;
  steps: CourseStep[];
  defaultXml?: string;
}

export const projects: CourseProject[] = [
  {
    slug: "hello",
    title: "二零，打个招呼！",
    ageGroup: "6-8 岁",
    description: "用积木让二零移动并说出第一句话。",
    missionBrief: "二零刚来到造物星球，它想飞到舞台中央，跟大家说声「你好」。你能帮它写出第一个程序吗？",
    erLingHint: "把「移动」积木拖到「当开始运行」下面，再拖一个「说」积木，输入你想说的话，然后点运行！",
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
    title: "二零画彩虹",
    ageGroup: "7-8 岁",
    description: "用循环和画笔命令让二零画出彩虹螺旋。",
    missionBrief: "二零捡到了一支神奇的画笔。只要重复转圈，它就能画出彩虹。",
    erLingHint: "先「落笔」，再用「重复执行」让二零边移动、边右转，同时不断改变画笔颜色。",
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
    slug: "stars",
    title: "二零收集星星",
    ageGroup: "8-9 岁",
    description: "点击舞台，用事件和判断让二零收集星星。",
    missionBrief: "星球上散落着 3 颗小星星。写一个程序：当点击舞台时，二零飞到鼠标位置；如果碰到星星，就宣布「收集到啦！」。",
    erLingHint: "把「当舞台被点击」事件拖到工作区，里面放「移到鼠标位置」和「如果碰到星星那么说…」。然后点击舞台上的星星试试！",
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
];

export function getProject(slug: string): CourseProject | undefined {
  return projects.find((p) => p.slug === slug);
}
