import type { CourseProject } from "@/courses";

export const rainbowProject: CourseProject = {
    slug: "rainbow",
    category: "draw",
    title: "二零画彩虹",
    ageGroup: "6-8 岁",
    description: "用循环和画笔命令让二零画出彩虹螺旋。",
    missionBrief: "二零捡到了一支神奇的画笔。只要重复转圈，它就能画出彩虹。",
    erLingHint: "① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 36 次」，里面依次放「移动」「右转」「画笔颜色增加」；③ 点「运行」，二零会一圈圈画出彩虹。找不到灵感就点「看示范」。",
    steps: [
      { id: 1, title: "使用落笔和画笔颜色积木" },
      { id: 2, title: "用循环让二零边移动边转向" },
      { id: 3, title: "运行并看到彩虹图案" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">36</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">10</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">10</field></shadow>
                        </value>
                        <next>
                          <block type="maker_pen_change_color">
                            <value name="DELTA">
                              <shadow type="math_number"><field name="NUM">10</field></shadow>
                            </value>
                          </block>
                        </next>
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
  };
