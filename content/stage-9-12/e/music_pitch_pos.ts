import type { CourseProject } from "@/courses";

export const musicPitchPosProject: CourseProject = {
  slug: "music_pitch_pos",
  category: "music",
  title: "音高随位置变",
  ageGroup: "9-12 岁",
  description: "用「按二零位置弹音」积木，让音高跟着二零在舞台上的位置变化——越往右声音越高，把“移动”变成“演奏”。",
  missionBrief: "写一个程序：当开始运行时，用「重复执行 10 次」一边让二零向前走、一边「按二零位置弹音」，听音高怎么随位置升高。",
  erLingHint: "① 拖绿色「当开始运行」→ 接「重复执行 10 次」；② 在重复里先「移动 30」再「按二零位置弹音（越靠右越高）」；③ 点运行听音高随走动升高。",
  steps: [
    { id: 1, title: "用「当开始运行」开始" },
    { id: 2, title: "用循环让二零边走边「按位置弹音」" },
    { id: 3, title: "点运行，听音高随位置升高" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
          <statement name="DO">
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
              <next>
                <block type="maker_play_by_actor">
                  <next>
                    <block type="maker_move">
                      <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                      <next>
                        <block type="maker_play_by_actor"></block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
