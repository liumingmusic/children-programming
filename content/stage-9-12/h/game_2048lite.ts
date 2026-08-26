import type { CourseProject } from "@/courses";

export const game2048LiteProject: CourseProject = {
  slug: "game_2048lite",
  category: "game",
  title: "数字合成（2048 入门）",
  ageGroup: "9-12 岁",
  description: "2048 的玩法核心是：把两个相同的数字碰到一起，合成一个更大的数。用「列表」装数字块，用「修改列表第几项」和「删除第几项」来模拟「合成」。",
  missionBrief:
    "把相邻的相同数字合成翻倍。当开始运行时，新建「数字块」列表，加入「2」「2」「4」；把第 1 项改成「4」（两个 2 合成），再删除第 2 项（旧的 2）；「说 列表 数字块」展示结果，最后「说 合成」。",
  erLingHint:
    "① 新建列表「数字块」并加入 2、2、4；② 用「修改列表 数字块 的第 1 项为 4」把前两个 2 合成；③ 用「删除列表 数字块 的第 2 项」去掉多余的 2；④「说 列表」「说 合成」。点运行，看数字块变少了、变大了。",
  steps: [
    { id: 1, title: "新建「数字块」列表并放入数字" },
    { id: 2, title: "用修改 / 删除把相同的数字合成（列表操作）" },
    { id: 3, title: "运行展示合成结果并说出「合成」" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create"><field name="NAME">数字块</field>
          <next><block type="maker_list_add"><field name="NAME">数字块</field><value name="VALUE"><shadow type="text"><field name="TEXT">2</field></shadow></value>
            <next><block type="maker_list_add"><field name="NAME">数字块</field><value name="VALUE"><shadow type="text"><field name="TEXT">2</field></shadow></value>
              <next><block type="maker_list_add"><field name="NAME">数字块</field><value name="VALUE"><shadow type="text"><field name="TEXT">4</field></shadow></value>
                <next><block type="maker_list_set"><field name="NAME">数字块</field><value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="VALUE"><shadow type="text"><field name="TEXT">4</field></shadow></value>
                  <next><block type="maker_list_remove"><field name="NAME">数字块</field><value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                    <next><block type="maker_say"><value name="TEXT"><block type="maker_list_var"><field name="NAME">数字块</field></block></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                      <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">合成</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next>
                    </block></next>
                  </block></next>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
  goal: { saidIncludes: ["合成"] },
};
