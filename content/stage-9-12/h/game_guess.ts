import type { CourseProject } from "@/courses";

export const gameGuessProject: CourseProject = {
  slug: "game_guess",
  category: "game",
  title: "自动猜数器",
  ageGroup: "9-12 岁",
  description: "电脑要在 1 到 10 之间找出一个藏起来的数字。用「变量」记下当前猜的数，用「重复执行」一次次往上试，再用「如果…那么」判断有没有猜中——这就是程序里的「搜索」。",
  missionBrief:
    "找出藏起来的数字 8。当开始运行时，设置「神秘数 = 8」「当前 = 1」；「重复 10 次」：先把「当前」说出来，再用「如果 当前 等于 神秘数 那么 说 猜中啦」；每轮结束让「当前」加 1。点运行，看程序一步步试出来。",
  erLingHint:
    "① 设置变量 神秘数=8、当前=1；② 拖「重复执行」10 次，里面放「说 当前」「如果 当前=神秘数 那么 说 猜中啦」「变量 当前 增加 1」；③ 点运行，程序会数到 8 并喊「猜中啦」。",
  steps: [
    { id: 1, title: "用变量记下目标数字和当前猜测" },
    { id: 2, title: "用循环 + 条件一步步尝试并判断是否猜中" },
    { id: 3, title: "运行说出「猜中啦」，看到搜索过程" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var"><field name="NAME">神秘数</field><value name="VALUE"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <next><block type="maker_set_var"><field name="NAME">当前</field><value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            <next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
              <statement name="DO">
                <block type="maker_say"><value name="TEXT"><block type="maker_get_var"><field name="NAME">当前</field></block></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value>
                  <next><block type="controls_if">
                    <value name="IF0"><block type="maker_compare"><field name="OP">==</field><value name="A"><block type="maker_get_var"><field name="NAME">当前</field></block></value><value name="B"><block type="maker_get_var"><field name="NAME">神秘数</field></block></value></block></value>
                    <statement name="DO0"><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">猜中啦</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></statement>
                    <next><block type="maker_change_var"><field name="NAME">当前</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
                  </block></next>
                </block>
              </statement>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
  goal: { saidIncludes: ["猜中啦"] },
};
