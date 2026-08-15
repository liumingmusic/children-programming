import type { CourseProject } from "@/courses";

export const fn_treeProject: CourseProject = {
  slug: "fn_tree",
  category: "fn",
  title: "递归画树",
  ageGroup: "9-12 岁",
  description: "函数自己调用自己（递归），画出分叉的树枝。",
  missionBrief: "「画树」积木里调用了它自己：只要树枝还够长就继续分叉，直到太短就停下。这就是递归——函数自己调用自己。",
  erLingHint: "① 当开始运行：落笔 → 把变量 大小 设为 80 → 调用 画树；② 定义积木 画树：如果 大小 > 10 那么（移动 大小、右转 30、把大小设为 大小×0.7、调用 画树、左转 60、调用 画树、右转 30）；③ 运行看分叉的树。",
  steps: [
    { id: 1, title: "定义会自我调用的积木" },
    { id: 2, title: "用递归画出分叉的树" },
    { id: 3, title: "运行看到树" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="maker_set_var">
              <field name="NAME">大小</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
              <next>
                <block type="maker_func_call"><field name="NAME">画树</field></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="320">
      <field name="NAME">画树</field>
      <statement name="DO">
        <block type="controls_if">
          <value name="IF0">
            <block type="maker_compare">
              <field name="OP">></field>
              <value name="A"><block type="maker_get_var"><field name="NAME">大小</field></block></value>
              <value name="B"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
            </block>
          </value>
          <statement name="DO0">
            <block type="maker_move">
              <value name="STEPS"><block type="maker_get_var"><field name="NAME">大小</field></block></value>
              <next>
                <block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                  <next>
                    <block type="maker_set_var">
                      <field name="NAME">大小</field>
                      <value name="VALUE">
                        <block type="maker_mul">
                          <value name="A"><block type="maker_get_var"><field name="NAME">大小</field></block></value>
                          <value name="B"><shadow type="math_number"><field name="NUM">0.7</field></shadow></value>
                        </block>
                      </value>
                      <next>
                        <block type="maker_func_call">
                          <field name="NAME">画树</field>
                          <next>
                            <block type="maker_turn_left">
                              <value name="DEGREES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                              <next>
                                <block type="maker_func_call">
                                  <field name="NAME">画树</field>
                                  <next>
                                    <block type="maker_turn">
                                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
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
      </statement>
    </block>
  </xml>`,
};
