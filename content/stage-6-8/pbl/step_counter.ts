import type { CourseProject } from "@/courses";

export const stepCounterProject: CourseProject = {
  slug: "step_counter",
  category: "pbl",
  title: "步数记录仪",
  ageGroup: "6-8 岁",
  description: "用变量当计数器，让二零边走边记步数，走完把总步数说出来。",
  missionBrief:
    "做一个会数数的计步器！写一个程序：当开始运行时，先把变量「steps」设成 0 当计数器，再用「重复执行 5 次」让二零每走一步就给「steps」加 1，走完后用「说」把变量 steps 里的总步数报出来。把变量、循环、运动和说话合起来，做一个真正会数数的小工具吧！",
  erLingHint:
    "① 绿色「当开始运行」里先放「把变量 steps 设为 0」，这就是计数器的起点；② 放一个「重复执行 5 次」，里面放「移动 40 步」和「把变量 steps 增加 1」，每走一步计数就加一；③ 循环结束后放一个「说」，把「变量 steps」积木拖进说的框里，二零就会报出总步数。点运行，看二零走完 5 步后说出数字！",
  steps: [
    { id: 1, title: "用变量当计数器，先归零" },
    { id: 2, title: "每走一步就给计数加 1" },
    { id: 3, title: "走完把总步数说出来" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">steps</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                  <next>
                    <block type="maker_change_var">
                      <field name="NAME">steps</field>
                      <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">steps</field></block></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
