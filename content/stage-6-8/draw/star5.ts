import type { CourseProject } from "@/courses";

export const star5Project: CourseProject = {
    slug: "star5",
    category: "draw",
    title: "二零画五角星",
    ageGroup: "6-8 岁",
    description: "用循环和画笔，让二零画出闪闪发光的五角星。",
    missionBrief: "夜空里少了一颗星星。帮二零用「重复执行 5 次」画出一颗五角星，挂回造物星球的夜空吧！",
    erLingHint: "① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 5 次」，里面放「移动 100 步」和「右转 144 度」；③ 最后接「抬笔」；④ 点「运行」。记住：星星的魔法角度是 144 度！",
    steps: [
      { id: 1, title: "让二零落笔开始画" },
      { id: 2, title: "用循环画出五角星" },
      { id: 3, title: "运行看到五角星" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">5</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">100</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">144</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_pen_up"></block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  };
