import type { CourseProject } from "@/courses";

export const gameMemoryProject: CourseProject = {
  slug: "game_memory",
  category: "game",
  title: "记忆翻牌",
  ageGroup: "9-12 岁",
  description: "把一组牌面放进「列表」，再想办法找出成对的牌。这是「列表 + 随机抽取」的第一次综合练习——列表像一个能装很多张卡片的盒子。",
  missionBrief:
    "整理一副记忆牌。当开始运行时，新建「牌面」列表，依次加入「苹果」「香蕉」「苹果」「香蕉」「橙子」「橙子」六张牌；把整副牌「说」出来，再「说 配对成功」表示已经完成配对整理。",
  erLingHint:
    "① 新建列表「牌面」；② 用「加入」积木把六张牌（苹果、香蕉、苹果、香蕉、橙子、橙子）依次放进列表；③「说 列表 牌面」把整副牌展示出来；④「说 配对成功」。点运行，看列表里装了什么。",
  steps: [
    { id: 1, title: "新建一个「牌面」列表并加入卡片" },
    { id: 2, title: "把列表整理好（用列表存放一组有序数据）" },
    { id: 3, title: "运行把牌面展示出来并说出「配对成功」" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create"><field name="NAME">牌面</field>
          <next><block type="maker_list_add"><field name="NAME">牌面</field><value name="VALUE"><shadow type="text"><field name="TEXT">苹果</field></shadow></value>
            <next><block type="maker_list_add"><field name="NAME">牌面</field><value name="VALUE"><shadow type="text"><field name="TEXT">香蕉</field></shadow></value>
              <next><block type="maker_list_add"><field name="NAME">牌面</field><value name="VALUE"><shadow type="text"><field name="TEXT">苹果</field></shadow></value>
                <next><block type="maker_list_add"><field name="NAME">牌面</field><value name="VALUE"><shadow type="text"><field name="TEXT">香蕉</field></shadow></value>
                  <next><block type="maker_list_add"><field name="NAME">牌面</field><value name="VALUE"><shadow type="text"><field name="TEXT">橙子</field></shadow></value>
                    <next><block type="maker_list_add"><field name="NAME">牌面</field><value name="VALUE"><shadow type="text"><field name="TEXT">橙子</field></shadow></value>
                      <next><block type="maker_say"><value name="TEXT"><block type="maker_list_var"><field name="NAME">牌面</field></block></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                        <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">配对成功</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next>
                      </block></next>
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
  goal: { saidIncludes: ["配对成功"] },
};
