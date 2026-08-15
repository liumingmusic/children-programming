import type { CourseProject } from "@/courses";

export const twoPlayerProject: CourseProject = {
  slug: "two_player",
  category: "multi",
  title: "双人对战小游戏",
  ageGroup: "9-12 岁",
  description: "让二零和三七两个角色互相抓：谁先「碰到角色」对方，谁就喊出胜利。",
  missionBrief:
    "二零和三七来一场抓人游戏！写一个程序：当开始运行时，控制角色二零，重复前进，并用「如果 碰到角色 三七 那么 说 抓到你了」；再用「控制角色 三七」+「如果 碰到角色 二零 那么 说 我也抓到你啦」让三七也来抓。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「控制角色 二零」接「重复 8 次」：移动 30 + 如果 碰到角色 三七 那么 说 抓到你了！ 2 秒；③ 接「控制角色 三七」+「如果 碰到角色 二零 那么 说 我也抓到你啦 2 秒」；④ 点运行看两个角色互相抓。",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "用两个「控制角色」+「碰到角色」做互相抓捕" },
    { id: 3, title: "点运行，看两个角色有没有互相抓到" },
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
                          <value name="TEXT"><shadow type="text"><field name="TEXT">抓到你了！</field></shadow></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                        </block>
                      </statement>
                    </block>
                  </next>
                </block>
              </statement>
            </block>
            <next>
              <block type="maker_control_actor">
                <field name="ACTOR">sanqi</field>
                <next>
                  <block type="controls_if">
                    <value name="IF0">
                      <block type="maker_touching_actor">
                        <field name="ACTOR">erling</field>
                      </block>
                    </value>
                    <statement name="DO0">
                      <block type="maker_say">
                        <value name="TEXT"><shadow type="text"><field name="TEXT">我也抓到你啦！</field></shadow></value>
                        <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
