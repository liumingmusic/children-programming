import type { CourseProject } from "@/courses";

export const myGardenProject: CourseProject = {
  slug: "my_garden",
  category: "pbl",
  title: "我的小花园",
  ageGroup: "6-8 岁",
  description: "综合画笔与说话，让二零画出一片花园并介绍它。",
  missionBrief:
    "造物星球的空地上想种一座小花园。写一个程序：当开始运行时，让二零「落笔」用循环画出方方的花圃边框，再让二零说一句「这是我的小花园！」。把学过的画图和说话组合起来，造一座属于你的花园吧！",
  erLingHint:
    "① 绿色「当开始运行」里先放绿色「落笔」；② 放「重复执行 4 次」，里面放「移动 80 步」和「右转 90 度」画出花圃边框，最后接「抬笔」；③ 再接一个紫色「说」，让二零介绍「这是我的小花园！」；④ 点运行，看二零又画又说。",
  steps: [
    { id: 1, title: "用「落笔」开始画花园" },
    { id: 2, title: "用循环画出花园的边框" },
    { id: 3, title: "让二零说出花园的名字" },
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
                    <shadow type="math_number"><field name="NUM">80</field></shadow>
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
                <block type="maker_pen_up">
                  <next>
                    <block type="maker_say">
                      <value name="TEXT">
                        <shadow type="text"><field name="TEXT">这是我的小花园！</field></shadow>
                      </value>
                      <value name="SECONDS">
                        <shadow type="math_number"><field name="NUM">2</field></shadow>
                      </value>
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
};
