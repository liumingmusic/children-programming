import type { CourseProject } from "@/courses";

export const catMouseProject: CourseProject = {
  slug: "cat_mouse",
  category: "multi",
  title: "猫追老鼠",
  ageGroup: "9-12 岁",
  description: "用「控制角色」让二零扮演猫，用「碰到角色」判断有没有抓到三七扮演的小老鼠。",
  missionBrief:
    "二零要当一只猫，去抓三七扮演的小老鼠！写一个程序：当开始运行时，控制角色二零，重复前进，并用「如果 碰到角色 三七 那么 说 抓到老鼠啦」来判断抓没抓到。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「控制角色 二零」，接「重复 8 次」：里面放「移动 30」+「如果 碰到角色 三七 那么 说 抓到老鼠啦！ 2 秒」；③ 点运行看猫有没有抓到老鼠。",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "用「控制角色」+「碰到角色」让猫去抓老鼠" },
    { id: 3, title: "点运行，看猫有没有抓到老鼠" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">erling</field>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                  <next>
                    <block type="controls_if">
                      <value name="IF0">
                        <block type="maker_touching_actor">
                          <field name="ACTOR">sanqi</field>
                        </block>
                      </value>
                      <statement name="DO0">
                        <block type="maker_say">
                          <value name="TEXT"><shadow type="text"><field name="TEXT">抓到老鼠啦！</field></shadow></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                        </block>
                      </statement>
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
  cast: ["sanqi"],
};
