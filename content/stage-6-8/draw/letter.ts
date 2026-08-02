import type { CourseProject } from "@/courses";

export const letterProject: CourseProject = {
    slug: "letter",
    category: "draw",
    title: "画字母 / 自己的名字",
    ageGroup: "6-8 岁",
    description: "用循环画一个方框，再在里面写出自己的名字。",
    missionBrief: "想用画笔写出自己的名字吗？先让二零画一个方框当本子，你就能在里面写出第一个字母啦！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面放「移动 60 步」和「右转 90 度」（画一个方框）；③ 最后「抬笔」；④ 点「运行」看方框，再想象在里面写自己的名字。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画方框" },
      { id: 3, title: "运行看到图形" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: 0, emoji: "✏️", label: "写字" }] },
  };
