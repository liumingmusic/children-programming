import type { CourseProject } from "@/courses";

export const messageRelayProject: CourseProject = {
  slug: "message_relay",
  category: "multi",
  title: "角色间消息传递",
  ageGroup: "9-12 岁",
  description:
    "用「广播消息」和「当接收到 消息」让二零和三七互相通信：一个发信号，另一个立刻响应。这是多角色协作的核心。",
  missionBrief:
    "二零当队长，三七当队员。写一个程序：当开始运行时，控制角色二零，说「准备！」，然后「广播 出发」；再放一个「当接收到 出发」的事件帽，里面控制角色三七，说「收到，出发！」并移动 50 步。点运行，看伙伴有没有收到信号。",
  erLingHint:
    "① 拖绿色「当开始运行」，接「控制角色 二零」→「说 准备！ 2 秒」→「广播 出发」；② 另拖一顶「当接收到 出发」帽子，里面接「控制角色 三七」→「说 收到，出发！ 2 秒」→「移动 50」；③ 点运行，看三七是不是在二零广播后立刻动起来。",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "用「广播消息」把“出发”信号发给伙伴" },
    { id: 3, title: "让伙伴用「当接收到 出发」做出反应" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">erling</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">准备！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
              <next>
                <block type="maker_broadcast">
                  <field name="MSG">出发</field>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_when_receive" x="40" y="260">
      <field name="MSG">出发</field>
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">sanqi</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">收到，出发！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
              <next>
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
