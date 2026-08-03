import type { CourseProject } from "@/courses";

export const pitchByMoveProject: CourseProject = {
  slug: "pitch_by_move",
  category: "music",
  title: "走哪响哪",
  ageGroup: "6-8 岁",
  description: "让二零边走边按自己的位置弹音，画出声音的楼梯。",
  missionBrief: "让二零一边在舞台上移动，一边按自己所在位置发出不同音高。写一个程序：当开始运行时，用「重复执行」让二零不断前进并弹奏「按二零位置弹音」，越往右走音越高。",
  erLingHint: "① 拖一个绿色「当开始运行」事件；② 里面放「重复执行 8 次」；③ 循环里先放「移动 40 步」，再用「下一个」接「按二零位置弹音（越靠右越高）」；④ 点「运行」，听二零边走边奏出声音楼梯！",
  steps: [
    { id: 1, title: "用「当开始运行」事件" },
    { id: 2, title: "边移动边按位置弹音" },
    { id: 3, title: "点击运行听到音高变化" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO">
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
              <next>
                <block type="maker_play_by_actor"></block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
