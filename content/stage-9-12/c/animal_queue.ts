import type { CourseProject } from "@/courses";

export const animalQueueProject: CourseProject = {
  slug: "animal_queue",
  category: "multi",
  title: "排队的动物",
  ageGroup: "9-12 岁",
  description:
    "让二零和三七像两支小动物排成一队：二零在前面带队，三七用「到角色的距离」跟在后面保持队形，一起向前走。",
  missionBrief:
    "写一个程序：当开始运行时，控制角色二零，重复向前走几步带队；再控制角色三七，重复判断「到二零的距离」如果大于 40 就向前走一步，这样三七会一直跟在二零后面排成一支队伍。点运行，看两只小动物是不是整齐地列队前进。",
  erLingHint:
    "① 拖绿色「当开始运行」→「控制角色 二零」→「重复 6 次」里放「移动 20」；② 接「控制角色 三七」→「重复 6 次」→「如果 到角色的距离 二零 大于 40 那么 移动 20」；③ 点运行，三七会用距离判断紧紧跟在二零后面，排成一条线一起走。",
  steps: [
    { id: 1, title: "用「当开始运行」开始列队" },
    { id: 2, title: "让两个角色排成一队前进（控制两个角色 + 移动 / 保持距离）" },
    { id: 3, title: "点运行，看两只小动物是不是整齐地列队前进" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">erling</field>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                </block>
              </statement>
              <next>
                <block type="maker_control_actor">
                  <field name="ACTOR">sanqi</field>
                  <next>
                    <block type="controls_repeat_ext">
                      <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
                      <statement name="DO">
                        <block type="controls_if">
                          <value name="IF0">
                            <block type="logic_compare">
                              <field name="OP">GT</field>
                              <value name="A">
                                <block type="maker_distance_to">
                                  <field name="ACTOR">erling</field>
                                </block>
                              </value>
                              <value name="B">
                                <shadow type="math_number"><field name="NUM">40</field></shadow></value>
                              </value>
                            </block>
                          </value>
                          <statement name="DO0">
                            <block type="maker_move">
                              <value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                            </block>
                          </statement>
                        </block>
                      </statement>
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
  cast: ["sanqi"],
};
