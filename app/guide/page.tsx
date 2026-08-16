import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Code2,
  Trophy,
  Gamepad2,
  Palette,
  Blocks,
  Eye,
  Shield,
  HeartHandshake,
  Rocket,
  ChevronRight,
  ListOrdered,
  RefreshCw,
  MousePointerClick,
  GitBranch,
  Boxes,
  Variable,
  GraduationCap,
  Smartphone,
  Lock,
  Globe,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import ErLingAvatar from "@/components/ErLingAvatar";
import SanQiAvatar from "@/components/SanQiAvatar";
import SiteHeader from "@/components/SiteHeader";
import { getProject, getStageProjects } from "@/courses";

export const metadata: Metadata = {
  title: "平台指南 - 造物星球",
  description:
    "造物星球是什么、怎么分龄、孩子能学到什么、有哪些模块、如何开始，以及家长如何陪伴与隐私保护，一篇讲清。",
};

/* 真实项目数量（按阶段统计） */
const COUNT_68 = getStageProjects("stage-6-8").length;
const COUNT_912 = getStageProjects("stage-9-12").length;

/* 每个阶段的代表项目（取真实标题/描述） */
const STAGE_EXAMPLES: Record<string, string[]> = {
  "stage-6-8": ["rainbow", "snowflake", "house", "birthday", "my_solar_system", "two_actor_show"],
  "stage-9-12": ["fn_square", "var_counter", "key_piano", "chorus", "catch_apple", "breakout_intro"],
};

const STAGES = [
  {
    age: "6-8 岁",
    title: "图形化积木启蒙",
    tech: "彩色积木（不打字）",
    icon: <Gamepad2 className="h-6 w-6 text-[#7F77DD]" />,
    color: "purple" as const,
    count: COUNT_68,
    themes: "11 个主题",
    stageId: "stage-6-8",
    desc: "拖一拖彩色积木，让二零动起来、画图案、讲小故事、弹小曲子。全程不用键盘打字，在玩中建立顺序、循环、条件的直觉。",
  },
  {
    age: "9-12 岁",
    title: "代码初探",
    tech: "积木 → JavaScript",
    icon: <Code2 className="h-6 w-6 text-[#378ADD]" />,
    color: "blue" as const,
    count: COUNT_912,
    themes: "11 个主题",
    stageId: "stage-9-12",
    desc: "从积木平滑过渡到写代码：拖积木的同时能看到它生成的 JavaScript，自然学会函数、变量、多角色协作，做出工具和小游戏。",
  },
  {
    age: "13-16 岁",
    title: "进阶工坊",
    tech: "Python / 网页技术",
    icon: <Trophy className="h-6 w-6 text-[#0F6E56]" />,
    color: "teal" as const,
    count: 0,
    themes: "即将开放",
    stageId: "stage-13-16",
    desc: "用更接近真实世界的语言与网页技术，独立完成完整的项目——从算法、物理模拟到数据可视化，为更长远的创造打底。",
  },
];

const MODULES = [
  {
    icon: <BookOpen className="h-6 w-6 text-[#0F6E56]" />,
    title: "星球任务",
    desc: "按年龄挑选能跑起来的小项目，像闯关一样一步步解锁，每个任务都有「看示范」参考答案。",
    href: "/missions",
    badge: `${COUNT_68 + COUNT_912} 个项目`,
  },
  {
    icon: <Gamepad2 className="h-6 w-6 text-[#7F77DD]" />,
    title: "星球游乐场",
    desc: "学累了来放松的小游戏：2048、打节拍、星球赛车、星星钢琴……和编程无关，纯粹好玩。",
    href: "/playground",
    badge: "17 个小游戏",
  },
  {
    icon: <Palette className="h-6 w-6 text-[#D85A30]" />,
    title: "造物工坊",
    desc: "没有题目的自由创作空间：拖积木让二零和三七动起来、画画、做音乐、讲故事，作品存在本地随时回看。",
    href: "/studio",
    badge: "自由创作",
  },
  {
    icon: <Blocks className="h-6 w-6 text-[#378ADD]" />,
    title: "组件库",
    desc: "把平台用到的每一块积木都摊开讲解：它长什么样、能做什么、怎么拼。想知道某个积木就查这里。",
    href: "/toolbox",
    badge: "积木字典",
  },
  {
    icon: <Eye className="h-6 w-6 text-[#EF9F27]" />,
    title: "作品花园",
    desc: "孩子们做出的小作品集合，看看同龄人用同样的积木能创造出什么，给自己的灵感加点料。",
    href: "/gallery",
    badge: "灵感广场",
  },
  {
    icon: <HeartHandshake className="h-6 w-6 text-[#0F6E56]" />,
    title: "家长入口",
    desc: "记录孩子的作品、投入的时间与探索足迹。没有分数排名，只让成长看得见。",
    href: "/parent",
    badge: "成长记录",
  },
];

const STEPS = [
  { n: 1, title: "选一个任务", desc: "从「画一条线」到「做一张贺卡」，每个都是一个小目标。" },
  { n: 2, title: "拖一拖积木", desc: "像拼图一样把彩色积木拼起来，让二零动起来。" },
  { n: 3, title: "看到作品", desc: "点一下运行，立刻看到自己做出来的东西。" },
];

/* 学习阶梯：孩子会一步步掌握的思维方式 */
const LADDER = [
  {
    step: 1,
    concept: "顺序",
    tag: "序列",
    icon: <ListOrdered className="h-5 w-5" />,
    color: "purple" as const,
    desc: "把指令一条条排好，让二零按顺序执行——这就是程序最基本的样子。",
    example: "画一条线、走一个正方形",
  },
  {
    step: 2,
    concept: "循环",
    tag: "重复",
    icon: <RefreshCw className="h-5 w-5" />,
    color: "blue" as const,
    desc: "用「重复执行」替代一遍遍抄积木，把重复交给电脑，画出整齐的图案。",
    example: "彩虹、花朵、万花筒",
  },
  {
    step: 3,
    concept: "事件",
    tag: "互动",
    icon: <MousePointerClick className="h-5 w-5" />,
    color: "teal" as const,
    desc: "用「当点击 / 当按下」让程序响应你的动作，作品从此能被「玩」。",
    example: "点一下让二零跳起来",
  },
  {
    step: 4,
    concept: "条件",
    tag: "判断",
    icon: <GitBranch className="h-5 w-5" />,
    color: "amber" as const,
    desc: "用「如果…那么」让二零看情况做不同选择，开始像人一样「做决定」。",
    example: "碰到边缘就转弯、躲避坏人",
  },
  {
    step: 5,
    concept: "函数",
    tag: "抽象",
    icon: <Boxes className="h-5 w-5" />,
    color: "coral" as const,
    desc: "把一串动作打包成自己的积木，一次定义、反复使用——学会「抽象」。",
    example: "用「画雪花」拼出整片雪景",
  },
  {
    step: 6,
    concept: "变量",
    tag: "数据",
    icon: <Variable className="h-5 w-5" />,
    color: "blue" as const,
    desc: "用变量记住分数、步数、状态，让程序能「算账」、能记住东西。",
    example: "计数器、计时器、最高分",
  },
  {
    step: 7,
    concept: "代码",
    tag: "文本",
    icon: <Code2 className="h-5 w-5" />,
    color: "teal" as const,
    desc: "积木背后就是 JavaScript——看得见代码，自然过渡到亲手写代码。",
    example: "读得懂、改得动自己做的工具",
  },
];

const LADDER_COLOR: Record<string, { ring: string; bg: string; text: string }> = {
  purple: { ring: "ring-[#7F77DD]/30", bg: "bg-[#EEEDFE]", text: "text-[#7F77DD]" },
  blue: { ring: "ring-[#378ADD]/30", bg: "bg-[#E6F1FB]", text: "text-[#378ADD]" },
  teal: { ring: "ring-[#0F6E56]/30", bg: "bg-[#E1F5EE]", text: "text-[#0F6E56]" },
  amber: { ring: "ring-[#EF9F27]/30", bg: "bg-[#FAEEDA]", text: "text-[#D98A0E]" },
  coral: { ring: "ring-[#D85A30]/30", bg: "bg-[#FAECE7]", text: "text-[#D85A30]" },
};

const STAGE_COLOR: Record<string, { border: string; bg: string }> = {
  purple: { border: "border-[#7F77DD]/30", bg: "bg-[#EEEDFE]/50" },
  blue: { border: "border-[#378ADD]/30", bg: "bg-[#E6F1FB]/50" },
  teal: { border: "border-[#0F6E56]/30", bg: "bg-[#E1F5EE]/50" },
};

/* 首页同款「已能做的小作品」精选（跨两个已开放阶段） */
const SHOWCASE = [
  "hello",
  "rainbow",
  "snowflake",
  "star5",
  "house",
  "birthday",
  "my_solar_system",
  "interactive_book",
  "fn_square",
  "chorus",
  "catch_apple",
];

const FAQS = [
  { q: "需要会打字吗？", a: "6-8 岁阶段全程用彩色积木，拖一拖就能编程，不需要键盘打字；9 岁以上会自然过渡到看代码、写代码。" },
  { q: "适合几岁的孩子？", a: "平台按年龄分三个阶段：6-8 岁图形化积木、9-12 岁代码初探、13-16 岁进阶工坊。前一阶段是后一阶段的基础，顺着走最顺畅。" },
  { q: "要花钱吗？", a: "完全免费、没有会员、没有广告，所有功能对孩子开放。" },
  { q: "需要联网吗？能在平板上用吗？", a: "打开页面需要联网；界面是响应式的，手机、平板、电脑的浏览器都能用，触屏拖积木也没问题。" },
  { q: "孩子的作品会保存吗？安全吗？", a: "在「造物工坊」里创作的作品只保存在你自己的设备本地，不上传任何服务器，更不会用于广告。家长入口记录的是本地的探索足迹。" },
  { q: "孩子不会做怎么办？", a: "每个任务都有「看示范」参考答案，可以照着学，关掉就回到自己的画布继续探索；不会卡住，也不会有排名压力。" },
];

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#E1F5EE] via-white to-[#FAECE7] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#5DCAA5]/30 bg-white/70 px-4 py-1.5 text-sm text-[#0F6E56]">
                  <Sparkles className="h-4 w-4" />
                  免费 · 无广告 · 沉浸式学习
                </div>
                <h1 className="text-4xl font-medium leading-tight tracking-tight text-[#04342C] sm:text-5xl">
                  造物星球，
                  <br />
                  是一个什么样的平台？
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-[#5F5E5A]">
                  一个安静的少儿编程工作室。没有充值、没有广告，只有一个个
                  <span className="font-medium text-[#0F6E56]">能跑起来的小项目</span>
                  ——从画一条线，到做一张节日贺卡，再到写出第一段代码。这里把「对孩子好」放在「好看」前面。
                </p>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link
                    href="/missions"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0F6E56] px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#085041]"
                  >
                    开始第一个任务
                  </Link>
                  <Link
                    href="/studio"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0F6E56]/20 bg-white px-8 text-base font-medium text-[#0F6E56] transition-colors hover:bg-[#E1F5EE]"
                  >
                    去工坊自由创作
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-6 rounded-full bg-[#F5C4B3]/30 blur-2xl" />
                  <div className="relative flex items-end gap-2">
                    <ErLingAvatar className="h-56 w-56 sm:h-72 sm:w-72" />
                    <SanQiAvatar className="mb-6 h-24 w-24 shrink-0 sm:mb-10 sm:h-32 sm:w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 我们坚持的三件事 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">我们坚持的三件事</h2>
              <p className="mt-2 text-[#5F5E5A]">把「对孩子好」放在「好看」前面</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-black/5 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAECE7]">
                  <Shield className="h-6 w-6 text-[#D85A30]" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-[#04342C]">完全免费，无套路</h3>
                <p className="text-sm leading-relaxed text-[#5F5E5A]">
                  没有会员等级，没有隐藏付费，所有功能对孩子开放。编程学习不该是一道付费墙。
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAEEDA]">
                  <Sparkles className="h-6 w-6 text-[#EF9F27]" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-[#04342C]">无广告，沉浸式</h3>
                <p className="text-sm leading-relaxed text-[#5F5E5A]">
                  打开就是创作，没有弹窗和推销，孩子能专注在自己的作品上，而不是被各种 red dot 牵着走。
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE]">
                  <HeartHandshake className="h-6 w-6 text-[#0F6E56]" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-[#04342C]">保护儿童隐私</h3>
                <p className="text-sm leading-relaxed text-[#5F5E5A]">
                  作品只保存在你自己的设备本地，不上传到任何服务器，更不会拿去打广告或做用户画像。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 按年龄，分三个阶段 */}
        <section className="border-y border-black/5 bg-[#FBFCFD] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">按年龄，分三个阶段</h2>
              <p className="mt-2 text-[#5F5E5A]">难度和能力阶梯自然递进，前一阶段是后一阶段的基础</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {STAGES.map((s) => {
                const examples = (STAGE_EXAMPLES[s.stageId] ?? [])
                  .map((slug) => getProject(slug))
                  .filter((p): p is NonNullable<typeof p> => Boolean(p));
                const c = STAGE_COLOR[s.color];
                const soon = s.count === 0;
                return (
                  <div key={s.age} className={`flex flex-col rounded-2xl border p-6 ${c.border} ${c.bg}`}>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                      {s.icon}
                    </div>
                    <span className="text-sm font-medium text-[#5F5E5A]">{s.age}</span>
                    <h3 className="mt-1 text-xl font-medium text-[#04342C]">{s.title}</h3>
                    <p className="mt-1 text-xs font-medium text-[#0F6E56]">{s.tech}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#5F5E5A]">
                      <span className="rounded-full bg-white/70 px-2.5 py-1 font-medium">
                        {soon ? s.themes : `${s.count} 个小项目`}
                      </span>
                      {!soon && (
                        <span className="rounded-full bg-white/70 px-2.5 py-1 font-medium">{s.themes}</span>
                      )}
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5F5E5A]">{s.desc}</p>

                    {!soon && examples.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-medium text-[#5F5E5A]">孩子能做出这些：</p>
                        <div className="flex flex-wrap gap-1.5">
                          {examples.map((p) => (
                            <Link
                              key={p.slug}
                              href={`/learn/${p.slug}`}
                              className="rounded-full border border-black/5 bg-white px-2.5 py-1 text-xs font-medium text-[#0F6E56] transition-colors hover:bg-[#E1F5EE]"
                            >
                              {p.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/missions/${s.stageId}`}
                      className="mt-5 inline-flex items-center text-sm font-medium text-[#0F6E56]"
                    >
                      {soon ? "敬请期待" : "看看这个年龄段的任务"}
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 孩子能收获什么：学习阶梯 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">孩子一步步能收获什么</h2>
              <p className="mt-2 text-[#5F5E5A]">
                不是记住语法，而是建立一套可以带走的思维方式——从拼第一条积木，到看懂第一行代码
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LADDER.map((l) => {
                const c = LADDER_COLOR[l.color];
                return (
                  <div
                    key={l.step}
                    className={`relative flex flex-col rounded-2xl border border-black/5 bg-white p-5 ring-1 ${c.ring}`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F6E56] text-sm font-medium text-white">
                        {l.step}
                      </span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
                        {l.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-[#04342C]">{l.concept}</h3>
                        <span className={`text-xs font-medium ${c.text}`}>{l.tag}</span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[#5F5E5A]">{l.desc}</p>
                    <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-[#FBFCFD] px-3 py-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F6E56]" />
                      <p className="text-xs leading-relaxed text-[#5F5E5A]">
                        <span className="font-medium text-[#04342C]">做出来的样子：</span>
                        {l.example}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 真实作品展示 */}
        <section className="border-y border-black/5 bg-[#FBFCFD] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-medium text-[#04342C]">这些，孩子都做得出来</h2>
                <p className="mt-2 text-[#5F5E5A]">下面每一个，都是孩子一步步搭出来的小作品，点开就能试</p>
              </div>
              <Link
                href="/missions"
                className="hidden items-center gap-1 text-sm font-medium text-[#0F6E56] hover:text-[#085041] sm:flex"
              >
                看全部任务 <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SHOWCASE.map((slug) => {
                const p = getProject(slug);
                if (!p) return null;
                return (
                  <Link
                    key={slug}
                    href={`/learn/${slug}`}
                    className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#0F6E56]">
                        {p.ageGroup}
                      </span>
                      <Sparkles className="h-4 w-4 text-[#EF9F27]" />
                    </div>
                    <h3 className="mb-1 text-base font-medium text-[#04342C]">{p.title}</h3>
                    <p className="mb-4 flex-1 text-sm text-[#5F5E5A]">{p.description}</p>
                    <span className="inline-flex items-center text-sm font-medium text-[#0F6E56]">
                      去挑战
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 六大模块 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">平台里有哪些模块</h2>
              <p className="mt-2 text-[#5F5E5A]">任务、游乐场、工坊、组件库、作品花园、家长入口，各司其职</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1EFE8]">
                    {m.icon}
                  </div>
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="flex items-center gap-1 text-base font-medium text-[#04342C]">
                      {m.title}
                    </h3>
                    <span className="rounded-full bg-[#F1EFE8] px-2 py-0.5 text-xs font-medium text-[#5F5E5A]">
                      {m.badge}
                    </span>
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-[#5F5E5A]">{m.desc}</p>
                  <span className="inline-flex items-center text-sm font-medium text-[#0F6E56]">
                    去看看
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 三步上手 */}
        <section className="border-t border-black/5 bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">三步，就能做出第一个作品</h2>
              <p className="mt-2 text-[#5F5E5A]">不需要基础，打开就能开始</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="relative rounded-2xl border border-black/5 bg-white p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1EFE8]">
                    <Rocket className="h-6 w-6 text-[#0F6E56]" />
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F6E56] text-xs font-medium text-white">
                      {s.n}
                    </span>
                    <h3 className="text-lg font-medium text-[#04342C]">{s.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#5F5E5A]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 常见问题 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1F5EE]">
                <HelpCircle className="h-6 w-6 text-[#0F6E56]" />
              </div>
              <h2 className="text-2xl font-medium text-[#04342C]">常见问题</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl border border-black/5 bg-white p-5">
                  <h3 className="mb-1.5 flex items-start gap-2 text-base font-medium text-[#04342C]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F6E56]" />
                    {f.q}
                  </h3>
                  <p className="pl-3.5 text-sm leading-relaxed text-[#5F5E5A]">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 家长放心 + 给家长的话 */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-[#EF9F27]/30 bg-gradient-to-br from-[#FAEEDA] to-[#FDF6E8] px-6 py-8 sm:px-10">
              <div className="flex items-start gap-4">
                <GraduationCap className="h-8 w-8 shrink-0 text-[#EF9F27]" />
                <div>
                  <h3 className="text-lg font-medium text-[#412402]">和刷题培训班，不一样</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#7A5A12]">
                    这里不背概念、不排名次、不催进度。孩子做出来的每一个小作品，都是「我能创造点什么」的证据——这份信心，比一张证书走得更远。
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F6E56] to-[#085041] px-6 py-8 text-center sm:px-10">
              <h2 className="text-2xl font-medium text-white sm:text-3xl">给家长的话</h2>
              <p className="mx-auto mt-3 max-w-xl text-[#D7EFE7]">
                这里没有排行榜、没有「别人家孩子」。我们记录孩子做了什么、探索了多久，只为让你看见成长，而不是焦虑。所有作品都存在本地设备，安心陪伴就好。
              </p>
              <Link
                href="/parent"
                className="mt-6 inline-flex h-12 items-center justify-center self-center rounded-xl bg-white px-8 text-base font-medium text-[#0F6E56] shadow-sm transition-colors hover:bg-[#E1F5EE]"
              >
                进入家长入口
              </Link>
            </div>
          </div>

          {/* 安心承诺小条 */}
          <div className="mx-auto mt-6 grid max-w-6xl gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[#5F5E5A]">
              <Lock className="h-5 w-5 shrink-0 text-[#0F6E56]" /> 作品仅存本地，不上传
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[#5F5E5A]">
              <Smartphone className="h-5 w-5 shrink-0 text-[#0F6E56]" /> 手机 / 平板 / 电脑都能用
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[#5F5E5A]">
              <Globe className="h-5 w-5 shrink-0 text-[#0F6E56]" /> 打开网页即用，零安装
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-[#F1EFE8] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <ErLingAvatar className="h-7 w-7" />
            <span className="font-medium text-[#04342C]">造物星球</span>
          </div>
          <p className="text-sm text-[#5F5E5A]">永久免费 · 无广告 · 保护儿童隐私</p>
        </div>
      </footer>
    </div>
  );
}
