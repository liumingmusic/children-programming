import type { CourseProject } from "@/courses";

export const relayRaceProject: CourseProject = {
  slug: "relay_race",
  category: "multi",
  title: "接力赛",
  ageGroup: "9-12 岁",
  description:
    "二零先跑一段，再用「广播」把接力棒交给三七，三七接到信号后接着跑。这是「多角色 + 消息传递」的经典协作场景。",
  missionBrief:
    "写一个程序：当开始运行时，控制角色二零，重复前进几步；跑完后「广播 接棒」。再放一顶「当接收到 接棒」的帽子，里面控制角色三七，重复前进几步。点运行，看接力棒有没有顺利传下去。",
  erLingHint:
    "① 拖绿色「当开始运行」→「控制角色 二零」→「重复 4 次」里放「移动 30」；② 重复外面接「广播 接棒」；③ 另拖一顶「当接收到 接棒」，里面接「控制角色 三七」→「重复 4 次」→「移动 30」；④ 点运行看两个角色接力前进。",
  steps: [
    { id: 1, title: "用「当开始运行」开始接力" },
    { id: 2, title: "让两个角色都跑起来，并用「广播」交接接力棒" },
    { id: 3, title: "点运行，看接力棒有没有顺利传下去" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">erling</field>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                </block>
              </statement>
              <next>
                <block type="maker_broadcast">
                  <field name="MSG">接棒</field>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_when_receive" x="40" y="260">
      <field name="MSG">接棒</field>
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">sanqi</field>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
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
