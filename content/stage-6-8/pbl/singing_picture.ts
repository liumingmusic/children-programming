import type { CourseProject } from "@/courses";

export const singingPictureProject: CourseProject = {
  slug: "singing_picture",
  category: "pbl",
  title: "会唱歌的画",
  ageGroup: "6-8 岁",
  description: "一边用循环画出图案，一边弹奏出旋律，把画画和音乐合在一起。",
  missionBrief:
    "把画画和音乐组合起来！写一个程序：当开始运行时，先「落笔」，用「重复执行 4 次」画出正方形，最后抬起笔，再接几个「弹奏音符」，让二零边画边唱出 do、re、mi。",
  erLingHint:
    "① 绿色「当开始运行」里先放「落笔」；② 放「重复执行 4 次」，里面放「移动 100 步」和「右转 90 度」，再接「抬笔」；③ 在后面接 3 个「弹奏音符」do、re、mi。点运行，看二零画出画还唱出歌！",
  steps: [
    { id: 1, title: "用「落笔」开始画画" },
    { id: 2, title: "用循环画出一幅图案" },
    { id: 3, title: "弹奏出一段旋律" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <shadow type="math_number"><field name="NUM">4</field></shadow>
              </value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS">
                    <shadow type="math_number"><field name="NUM">100</field></shadow>
                  </value>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES">
                        <shadow type="math_number"><field name="NUM">90</field></shadow>
                      </value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_pen_up">
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">do</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                      <next>
                        <block type="maker_play_note">
                          <field name="NOTE">re</field>
                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                          <next>
                            <block type="maker_play_note">
                              <field name="NOTE">mi</field>
                              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
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
