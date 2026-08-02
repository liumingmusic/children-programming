import type { CourseProject } from "@/courses";

export const clickColorProject: CourseProject = {
  slug: "click_color",
  category: "event",
  title: "点一下换颜色",
  ageGroup: "6-8 岁",
  description: "每次点击舞台，让二零画出不同颜色的线。",
  missionBrief: "二零有一支会变色的画笔。写一个程序：当舞台被点击时，它落下笔、换个颜色、向前画一小段，再抬笔。每点一次颜色都不一样！",
  erLingHint: "① 蓝色「当舞台被点击」里面放「落笔」；② 接「画笔颜色增加 60」（每次换色）；③ 接「移动 40 步」和「抬笔」；④ 点「运行」后多戳几下舞台，看线条变色。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "使用换画笔颜色积木" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next><block type="maker_pen_change_color">
            <value name="DELTA"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
            <next><block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
              <next><block type="maker_pen_up"></block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
