import type { CourseProject } from "@/courses";

/**
 * 代码阅读 2 · 读懂变量与判断。
 *
 * 定位同 read_loops：只读不写。题目覆盖 13-16 手写 JS 最常用的三块——
 * 变量赋值与累加、循环总量、if 条件判断，但都以「预测结果」的形式出现。
 */
export const readVarsProject: CourseProject = {
  slug: "read_vars",
  category: "code",
  title: "读懂变量和小判断",
  ageGroup: "9-12 岁",
  description: "看懂变量是怎么记住数字的，看懂 if 是怎么做决定的。",
  missionBrief:
    "变量就像一个小盒子，可以把数字存进去、再拿出来用；if 就是「如果…就…」。这两样是写代码最常用的工具。下面三段代码都不用你写，读懂它们在做什么、选出结果就行！",
  erLingHint:
    "读代码的小技巧：① 看到 setVar 是「重新设定」，看到 changeVar 是「在原来的基础上加」；② 循环里的动作会重复好几次，问总数时记得乘一下；③ 看到 if，先算括号里的判断是真是假——是真的，大括号里的话才会被执行。",
  steps: [
    { id: 1, title: "读懂变量的设定与增加" },
    { id: 2, title: "读懂循环里的总数" },
    { id: 3, title: "读懂 if 判断" },
  ],
  component: "codequiz",
  quiz: [
    {
      code: `__runtime.setVar("分数", 10);
__runtime.changeVar("分数", 5);
__runtime.say("分数是" + __runtime.getVar("分数"), 2);`,
      question: "二零最后会说什么？",
      options: ["分数是 10", "分数是 5", "分数是 15", "分数是 105"],
      answer: 2,
      explain:
        'setVar 先把「分数」这个盒子设成 10，changeVar 再往盒子里加 5，所以变成 15。注意 "分数是" + 15 里的加号是把文字和数字**拼在一起**（变成「分数是 15」），不是做加法，所以不会变成 105。',
    },
    {
      code: `for (let i = 0; i < 6; i++) {
  __runtime.move(50);
}
__runtime.say("走完啦", 2);`,
      question: "二零一共向前走了多少步？",
      options: ["50 步", "6 步", "300 步", "56 步"],
      answer: 2,
      explain:
        "循环重复 6 次，每次前进 50 步，所以一共是 6 × 50 = 300 步。循环最厉害的地方就在这里：短短几行代码，就能让二零做很多次重复的动作。",
    },
    {
      code: `__runtime.setVar("苹果", 3);
if (__runtime.getVar("苹果") > 2) {
  __runtime.say("苹果够啦", 2);
}`,
      question: "二零会说话吗？",
      options: [
        "会，因为 3 比 2 大",
        "不会，因为 3 比 2 小",
        "会，但说的是「苹果不够」",
        "不会，因为 if 里面不能说话",
      ],
      answer: 0,
      explain:
        'if 是「如果…就…」：只有括号里的判断成立（是真的），才会去执行大括号 { } 里的动作。这里 苹果 是 3，3 > 2 成立，所以二零会说「苹果够啦」。如果苹果只有 1，1 > 2 不成立，它就一句话也不会说。',
    },
  ],
};
