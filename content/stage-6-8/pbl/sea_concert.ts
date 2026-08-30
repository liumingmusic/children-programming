import type { CourseProject } from "@/courses";

export const seaConcertProject: CourseProject = {
  slug: "sea_concert",
  category: "pbl",
  title: "海底音乐会",
  ageGroup: "6-8 岁",
  description: "画出海浪当舞台，让二零和三七轮流弹琴，最后一起奏响和弦谢幕。",
  missionBrief:
    "海底要开一场音乐会！写一个程序：当开始运行时，先「落笔」用「重复执行」画出海浪当舞台，再让二零弹 do、三七弹 mi 轮流上台演奏，最后两个人一起弹一个「和弦」，并说一句谢幕词。把画笔、角色和音乐三种本领合起来，办一场属于你的海底音乐会吧！",
  erLingHint:
    "① 绿色「当开始运行」里先放绿色「落笔」，接一个「重复执行 4 次」，里面放「移动 60 步」和「右转 90 度」画出海浪，最后「抬笔」；② 放「控制角色 二零」+「弹奏音符 do」，再放「控制角色 三七」+「弹奏音符 mi」，让两个伙伴轮流上台；③ 最后放一个「弹和弦」（do、mi、sol）和一句「说 海底音乐会圆满成功！」。点运行，看海浪舞台上两个伙伴一起合奏！",
  steps: [
    { id: 1, title: "落笔，用循环画出海浪舞台" },
    { id: 2, title: "让二零和三七轮流上台弹琴" },
    { id: 3, title: "一起奏响和弦，说一句谢幕词" },
  ],
  cast: ["sanqi"],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
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
                    <block type="maker_control_actor">
                      <field name="ACTOR">erling</field>
                      <next>
                        <block type="maker_play_note">
                          <field name="NOTE">do</field>
                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                          <next>
                            <block type="maker_control_actor">
                              <field name="ACTOR">sanqi</field>
                              <next>
                                <block type="maker_play_note">
                                  <field name="NOTE">mi</field>
                                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                  <next>
                                    <block type="maker_play_chord">
                                      <field name="N1">do</field>
                                      <field name="N2">mi</field>
                                      <field name="N3">sol</field>
                                      <next>
                                        <block type="maker_say">
                                          <value name="TEXT"><shadow type="text"><field name="TEXT">海底音乐会圆满成功！</field></shadow></value>
                                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
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
