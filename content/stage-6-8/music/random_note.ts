import type { CourseProject } from "@/courses";

export const randomNoteProject: CourseProject = {
  slug: "random_note",
  category: "music",
  title: "随机变奏小曲",
  ageGroup: "6-8 岁",
  description: "用「随机弹一个音」，让每次弹奏都不一样。",
  missionBrief: "想让二零即兴来一段吗？写一个程序：当开始运行时，用「重复执行」让二零连续随机弹出音符，每次运行都能听到不一样的旋律。",
  erLingHint: "① 拖一个绿色「当开始运行」事件；② 里面放「重复执行 8 次」；③ 循环里放一个橙色「随机弹一个音」；④ 多点几次「运行」，听二零每次即兴的不同小曲！",
  steps: [
    { id: 1, title: "用「随机弹一个音」积木" },
    { id: 2, title: "用循环连续随机弹奏" },
    { id: 3, title: "点击运行听到即兴旋律" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO">
            <block type="maker_random_note"></block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
