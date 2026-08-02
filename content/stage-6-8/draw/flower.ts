import type { CourseProject } from "@/courses";

export const flowerProject: CourseProject = {
    slug: "flower",
    category: "draw",
    title: "二零画花朵",
    ageGroup: "6-8 岁",
    description: "用嵌套循环和画笔，让二零画出一朵六瓣花。",
    missionBrief: "造物星球的花园空空的。帮二零用「循环里再套循环」画出一片片花瓣，变出一朵六瓣花送给伙伴吧！",
    erLingHint: "① 绿色「当开始运行」里先放「落笔」；② 放「重复执行 6 次」（画 6 片花瓣），里面再放一个「重复执行 2 次」的小循环；③ 小循环里放「移动 50 步」和「右转 60 度」，小循环后面接一个「右转 60 度」收一片花瓣；④ 大循环后面再「右转 60 度」转到下一片；⑤ 点「运行」看花朵绽放。",
    steps: [
      { id: 1, title: "让二零落笔开始画" },
      { id: 2, title: "用嵌套循环画出花瓣" },
      { id: 3, title: "运行看到花朵" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">6</field></shadow>
                </value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES">
                      <shadow type="math_number"><field name="NUM">2</field></shadow>
                    </value>
                    <statement name="DO">
                      <block type="maker_move">
                        <value name="STEPS">
                          <shadow type="math_number"><field name="NUM">50</field></shadow>
                        </value>
                        <next>
                          <block type="maker_turn">
                            <value name="DEGREES">
                              <shadow type="math_number"><field name="NUM">60</field></shadow>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">60</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_turn">
                    <value name="DEGREES">
                      <shadow type="math_number"><field name="NUM">60</field></shadow>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  };
