import type { CourseProject } from "@/courses";

export const symmetryProject: CourseProject = {
  slug: "symmetry",
  category: "math",
  title: "对称图形",
  ageGroup: "6-8 岁",
  description: "用「移到」把两个一样的图形摆成左右镜像，感受对称。",
  missionBrief:
    "造物星球的对称花园里，左右两边要一模一样。写一个程序：当开始运行时，让二零在左边和右边各画一个一样的正方形，组成左右对称的图案。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「落笔」，再用「移到 x:-60 y:-40」定位到左边；③ 放「重复执行 4 次」画一个正方形；④ 放「抬笔」，再用「移到 x:60 y:-40」定位到右边；⑤ 再「落笔」画一个一样的正方形；⑥ 最后「说 左右两边一样，这就是对称！」；⑦ 点运行看对称图案。",
  steps: [
    { id: 1, title: "用落笔开始画画" },
    { id: 2, title: "用「移到」摆出左右对称的两部分" },
    { id: 3, title: "点运行看二零画出对称图案" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">-40</field></shadow></value>
              <next>
                <block type="controls_repeat_ext">
                  <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                  <statement name="DO">
                    <block type="maker_move">
                      <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                      <next>
                        <block type="maker_turn">
                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="maker_pen_up">
                      <next>
                        <block type="maker_goto">
                          <value name="X"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                          <value name="Y"><shadow type="math_number"><field name="NUM">-40</field></shadow></value>
                          <next>
                            <block type="maker_pen_down">
                              <next>
                                <block type="controls_repeat_ext">
                                  <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                                  <statement name="DO">
                                    <block type="maker_move">
                                      <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                      <next>
                                        <block type="maker_turn">
                                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                  <next>
                                    <block type="maker_pen_up">
                                      <next>
                                        <block type="maker_say">
                                          <value name="TEXT"><shadow type="text"><field name="TEXT">左右两边一样，这就是对称！</field></shadow></value>
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
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
