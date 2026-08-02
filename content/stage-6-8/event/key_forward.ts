import type { CourseProject } from "@/courses";

export const keyForwardProject: CourseProject = {
  slug: "key_forward",
  category: "event",
  title: "按键前进",
  ageGroup: "6-8 岁",
  description: "用键盘方向键让二零前进，像操控小游戏。",
  missionBrief: "写一个小操控程序：按下「↑ 上」方向键，二零就向前走 50 步。在键盘上戳戳看！",
  erLingHint: "① 拖一个「当按下 ↑ 上」事件；② 里面放「移动 50 步」；③ 点「运行」后，用键盘的方向键 ↑ 控制二零前进（看示范会自动按一下演示）。",
  steps: [
    { id: 1, title: "使用「当按下方向键」事件" },
    { id: 2, title: "让二零向前移动" },
    { id: 3, title: "按方向键看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_key_pressed" x="60" y="60">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
        </block>
      </statement>
    </block>
  </xml>`,
};
