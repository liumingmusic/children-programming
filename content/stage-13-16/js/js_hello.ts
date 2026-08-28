import type { CourseProject } from "@/courses";

/** 你的第一个 JS 程序：只用一行 say 让二零开口，感受「代码真的被执行了」。 */
export const jsHello: CourseProject = {
  slug: "js_hello",
  title: "你的第一个 JS 程序",
  ageGroup: "13-16 岁",
  description: "不画图、不拖积木——只用一行代码让二零开口说话，感受「代码真的被执行了」。",
  category: "js",
  missionBrief:
    "所有程序员入门的第一件事，都是让程序「说」一句话。\n\n写代码和拖积木最大的不同是：你写的每个字、每个标点都会被电脑照着执行。写错了，程序就会报错；写对了，二零就会照做。\n\n这次你只需要一个指令：\n· __runtime.say(\"想说的话\", 停留秒数) —— 让二零把这句话说出来\n\n注意：文字要用英文引号包起来，第二个数字是这句话停留几秒。试着把「你好，世界！」改成你想对二零说的话吧！",
  erLingHint:
    "提示：写 __runtime.say(\"你好，世界！\", 2); 然后点运行。别忘了末尾的分号，也别忘了引号要成对出现！",
  steps: [
    { id: 1, title: "写一行让二零说话的代码" },
    { id: 2, title: "运行，看到二零真的开口" },
    { id: 3, title: "程序顺利跑完" },
  ],
  codeMode: true,
  defaultCode:
    "// 你的第一行 JavaScript：让二零开口说话\n" +
    "// __runtime.say(文字, 停留秒数) —— 第二个参数是这句话显示几秒\n" +
    '__runtime.say("你好，世界！", 2);\n',
};
