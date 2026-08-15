import type { CourseProject } from "@/courses";

export const chorusProject: CourseProject = {
  slug: "chorus",
  category: "multi",
  title: "合唱团",
  ageGroup: "9-12 岁",
  description:
    "让二零和三七组成一个小小的合唱团：一个唱主旋律，一个弹和弦伴奏。多角色 + 音效，一起把歌声奏出来。",
  missionBrief:
    "写一个程序：当开始运行时，控制角色二零，连弹几个音符（do、re、mi）当主旋律；再控制角色三七，弹一个和弦（do + mi + sol）当伴奏。点运行，听两个角色是不是一起唱起来了。",
  erLingHint:
    "① 拖绿色「当开始运行」→「控制角色 二零」→ 接几个「弹奏音符」（do、re、mi，各持续 1 拍）；② 接「控制角色 三七」→「弹和弦」（选 do、mi、sol）；③ 点运行，两个角色会一起发声，像一个小合唱团。",
  steps: [
    { id: 1, title: "用「当开始运行」开始合唱" },
    { id: 2, title: "让两个角色都发出声音（控制角色 + 弹奏音符 / 和弦）" },
    { id: 3, title: "点运行，听两个角色是不是一起唱起来了" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">erling</field>
          <next>
            <block type="maker_play_note">
              <field name="NOTE">do</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">re</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">mi</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                      <next>
                        <block type="maker_control_actor">
                          <field name="ACTOR">sanqi</field>
                          <next>
                            <block type="maker_play_chord">
                              <field name="N1">do</field>
                              <field name="N2">mi</field>
                              <field name="N3">sol</field>
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
  cast: ["sanqi"],
};
