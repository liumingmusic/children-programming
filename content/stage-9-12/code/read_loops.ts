import type { CourseProject } from "@/courses";

/**
 * 代码阅读 1 · 读懂循环。
 *
 * 定位：9-12 的最后一级台阶。这里的题目**只要求读懂**——
 * 孩子看一段真正的 JavaScript，预测它会让二零做什么，全程不需要写一个字。
 * 题目刻意只覆盖「积木里学过、但换成 JS 写法」的概念（循环次数、转角、变量累加），
 * 把「看代码」推进到「能预测代码」，为 13-16 手写 JS 打底。
 */
export const readLoopsProject: CourseProject = {
  slug: "read_loops",
  category: "code",
  title: "读懂循环里的小秘密",
  ageGroup: "9-12 岁",
  description: "看三小段真正的 JavaScript，猜出二零会画出什么、说出什么。",
  missionBrief:
    "你在积木页看到过「自己搭的积木变成了这段代码」。现在反过来试试：只读代码，猜出二零会做什么！下面每段代码都是真正的 JavaScript，不用你写，只要读懂它、选出正确答案就行。",
  erLingHint:
    "别急着乱选，一行一行读：① 先找 for 循环，看括号里的数字是几（重复几次）；② 再看大括号 { } 里面做了什么动作；③ 遇到 setVar / changeVar，就在心里帮它记一下数字。答错也没关系，看看解析再试一次～",
  steps: [
    { id: 1, title: "读懂循环画出的图形" },
    { id: 2, title: "读懂转角和圈数" },
    { id: 3, title: "读懂变量的累加" },
  ],
  component: "codequiz",
  quiz: [
    {
      code: `__runtime.penDown();
for (let i = 0; i < 4; i++) {
  __runtime.move(100);
  __runtime.turn(90);
}`,
      question: "运行这段代码，二零会画出什么图形？",
      options: ["正方形", "三角形", "一条直线", "圆形"],
      answer: 0,
      explain:
        "for 括号里的 4 表示重复 4 次，每次都做「前进 100 步 + 右转 90 度」。4 条一样长的边、4 个直角，正好是一个正方形。这和你在积木里用「重复执行 4 次」画正方形是一回事。",
    },
    {
      code: `__runtime.penDown();
for (let i = 0; i < 3; i++) {
  __runtime.move(80);
  __runtime.turn(120);
}`,
      question: "如果把次数改成 3 次、转角改成 120 度，会画出什么？",
      options: ["还是正方形", "等边三角形", "五边形", "一条直线"],
      answer: 1,
      explain:
        "转满一圈是 360 度。这里转 3 次、每次 120 度，120 × 3 = 360，正好绕一整圈回到起点，所以是等边三角形。小窍门：转的角度 × 次数 = 360，就能画出一个封闭的图形！",
    },
    {
      code: `__runtime.setVar("步数", 0);
for (let i = 0; i < 5; i++) {
  __runtime.move(40);
  __runtime.changeVar("步数", 1);
}
__runtime.say(__runtime.getVar("步数"), 2);`,
      question: "最后二零会说出的数字是几？",
      options: ["4", "5", "40", "200"],
      answer: 1,
      explain:
        '变量「步数」一开始被 setVar 设成 0；循环每跑一次，changeVar 就给它加 1。循环跑了 5 次，所以最后是 5。注意 move(40) 的 40 是每步的距离，和「走了几步」是两回事，别被它带跑啦。',
    },
  ],
};
