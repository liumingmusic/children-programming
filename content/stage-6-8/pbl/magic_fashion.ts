import type { CourseProject } from "@/courses";

export const magicFashionProject: CourseProject = {
  slug: "magic_fashion",
  category: "pbl",
  title: "魔法变装秀",
  ageGroup: "6-8 岁",
  description: "用循环让二零每转一圈就变大一点、换个颜色，再配上鼓点走一场秀。",
  missionBrief:
    "造物星球要办一场变装秀！写一个程序：当开始运行时，用「重复执行 4 次」让二零每循环一次就「改变大小」一点、「改变画笔颜色」换一身新装，循环里再「敲响」一下鼓当节拍，走完秀最后说一句。把循环、外观、颜色和鼓点合起来，办一场属于你的魔法变装秀吧！",
  erLingHint:
    "① 绿色「当开始运行」里放一个「重复执行 4 次」；② 循环里面依次放「改变大小 0.5」和「改变画笔颜色 60」，二零每转一圈就会变大一点、换个新颜色；③ 循环里再放一个「敲响 镲」当走秀的节拍，循环结束后接一句「说 变装秀好看吗？」。点运行，看二零一场换四套新装！",
  steps: [
    { id: 1, title: "用循环开始变装秀" },
    { id: 2, title: "每次循环都变大一点、换个颜色" },
    { id: 3, title: "配上鼓点节拍，说一句谢幕" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
          <statement name="DO">
            <block type="maker_change_size">
              <value name="DELTA"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value>
              <next>
                <block type="maker_pen_change_color">
                  <value name="DELTA"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                  <next>
                    <block type="maker_play_drum">
                      <field name="KIND">hat</field>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">变装秀好看吗？</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
