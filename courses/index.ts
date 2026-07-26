export interface CourseStep {
  id: number;
  title: string;
}

export interface CourseProject {
  slug: string;
  title: string;
  ageGroup: string;
  description: string;
  missionBrief: string;
  erLingHint: string;
  steps: CourseStep[];
  defaultXml?: string;
}

export const projects: CourseProject[] = [
  {
    slug: "hello",
    title: "二零，打个招呼！",
    ageGroup: "6-8 岁",
    description: "用积木让二零移动并说出第一句话。",
    missionBrief: "二零刚来到造物星球，它想飞到舞台中央，跟大家说声「你好」。你能帮它写出第一个程序吗？",
    erLingHint: "把「移动」积木拖到「当开始运行」下面，再拖一个「说」积木，输入你想说的话，然后点运行！",
    steps: [
      { id: 1, title: "让二零移动" },
      { id: 2, title: "让二零说话" },
      { id: 3, title: "点击运行看到效果" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_move">
            <value name="STEPS">
              <shadow type="math_number"><field name="NUM">100</field></shadow>
            </value>
            <next>
              <block type="maker_say">
                <value name="TEXT">
                  <shadow type="text"><field name="TEXT">你好！我是二零</field></shadow>
                </value>
                <value name="SECONDS">
                  <shadow type="math_number"><field name="NUM">2</field></shadow>
                </value>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  },
  {
    slug: "rainbow",
    title: "二零画彩虹",
    ageGroup: "7-8 岁",
    description: "用循环和画笔命令让二零画出彩虹螺旋。",
    missionBrief: "二零捡到了一支神奇的画笔。只要重复转圈，它就能画出彩虹。",
    erLingHint: "试试「重复执行」+「右转」+「移动」的组合，看看能画出什么图案。",
    steps: [
      { id: 1, title: "使用循环积木" },
      { id: 2, title: "让二零边移动边转向" },
      { id: 3, title: "运行并看到彩虹图案" },
    ],
  },
  {
    slug: "stars",
    title: "二零收集星星",
    ageGroup: "8-9 岁",
    description: "用事件和判断让二零飞到星星旁边收集它们。",
    missionBrief: "星球上散落着很多小星星。帮二零写一个程序，让它能飞过去收集星星。",
    erLingHint: "当舞台被点击时，让二零移到鼠标位置。如果碰到星星，就让它说「收集到啦！」",
    steps: [
      { id: 1, title: "响应点击事件" },
      { id: 2, title: "判断二零是否碰到星星" },
      { id: 3, title: "收集所有星星" },
    ],
  },
];

export function getProject(slug: string): CourseProject | undefined {
  return projects.find((p) => p.slug === slug);
}
