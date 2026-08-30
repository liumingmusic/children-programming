import Link from "next/link";
import {
  Sparkles,
  Gamepad2,
  Code2,
  Trophy,
  Shield,
  Leaf,
  BookOpen,
  Blocks,
  Palette,
  HeartHandshake,
  ChevronRight,
  Star,
  Eye,
  ListOrdered,
  RefreshCw,
  MousePointerClick,
  GitBranch,
  Boxes,
  Variable,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import ErLingAvatar from "@/components/ErLingAvatar";
import SanQiAvatar from "@/components/SanQiAvatar";
import SiteHeader from "@/components/SiteHeader";
import { getProject, getStageProjects } from "@/courses";

/* 真实项目数量（按阶段统计），用于模块全览徽标 */
const COUNT_68 = getStageProjects("stage-6-8").length;
const COUNT_912 = getStageProjects("stage-9-12").length;

/* 平台六大模块全览（含真实徽标） */
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

export default function Home() {
  const featuredSlugs = [
    "hello",
    "rainbow",
    "snowflake",
    "chorus",
    "relay_race",
    "two_actor_chat",
    "star5",
    "house",
    "animal_queue",
  ];
  const featured = featuredSlugs
    .map((s) => getProject(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const steps = [
    { icon: <BookOpen className="h-6 w-6 text-[#0F6E56]" />, title: "选一个任务", desc: "从「画一个正方形」到「给家人做电子贺卡」，每个任务都是一个小目标。" },
    { icon: <Blocks className="h-6 w-6 text-[#7F77DD]" />, title: "拖一拖积木", desc: "像拼图一样把彩色积木拼起来，让二零动起来、画图案、做小游戏。" },
    { icon: <Palette className="h-6 w-6 text-[#D85A30]" />, title: "看到作品", desc: "点一下运行，立刻看到自己做出来的东西——这才是最开心的时刻。" },
  ];

  const faqs = [
    { q: "需要会打字吗？", a: "6-8 岁阶段全程用彩色积木，拖一拖就能编程，不需要键盘打字。" },
    { q: "大一点的孩子（9-12 岁）学什么？", a: "9-12 岁从积木过渡到 JavaScript——拖积木的同时能看到它生成的代码，自然学会函数、变量，做出工具和小游戏。" },
    { q: "要花钱吗？", a: "完全免费、没有会员、没有广告，所有功能对孩子开放。" },
    { q: "孩子不会做怎么办？", a: "每个任务都有「看示范」参考答案，可以照着学，关掉就回到自己的画布继续探索。" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero 区（双鹦鹉：多角色平台） */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#E1F5EE] via-white to-[#FAECE7] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#5DCAA5]/30 bg-white/70 px-4 py-1.5 text-sm text-[#0F6E56]">
                  <Sparkles className="h-4 w-4" />
                  免费 · 无广告 · 多角色创作
                </div>
                <h1 className="text-4xl font-medium leading-tight tracking-tight text-[#04342C] sm:text-5xl">
                  和二零、三七一起，
                  <br />
                  把想法种成作品
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-[#5F5E5A]">
                  造物星球是一个安静的少儿编程工作室。没有充值、没有广告——二零和三七，
                  <span className="font-medium text-[#0F6E56]">两只会编程的小鹦鹉</span>
                  ，陪孩子从画一条线，到做一张节日贺卡，再到写出第一段代码。
                </p>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link
                    href="/learn/hello"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0F6E56] px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#085041]"
                  >
                    开始第一个任务
                  </Link>
                  <Link
                    href="/missions"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0F6E56]/20 bg-white px-8 text-base font-medium text-[#0F6E56] transition-colors hover:bg-[#E1F5EE]"
                  >
                    看看有哪些任务
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
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

        {/* 三步上手 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">三步，就能做出第一个作品</h2>
              <p className="mt-2 text-[#5F5E5A]">不需要基础，打开就能开始</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="relative rounded-2xl border border-black/5 bg-white p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1EFE8]">
                    {s.icon}
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F6E56] text-xs font-medium text-white">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-medium text-[#04342C]">{s.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#5F5E5A]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 精选作品 */}
        <section className="border-y border-black/5 bg-[#FBFCFD] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-medium text-[#04342C]">已经能做的小作品</h2>
                <p className="mt-2 text-[#5F5E5A]">这些都是孩子一步步搭出来的，点开就能试</p>
              </div>
              <Link href="/missions" className="hidden items-center gap-1 text-sm font-medium text-[#0F6E56] hover:text-[#085041] sm:flex">
                看全部任务 <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <Link
                  key={p.slug}
                  href={`/learn/${p.slug}`}
                  className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#0F6E56]">
                      {p.ageGroup}
                    </span>
                    <Star className="h-4 w-4 text-[#EF9F27]" />
                  </div>
                  <h3 className="mb-1 text-base font-medium text-[#04342C]">{p.title}</h3>
                  <p className="mb-4 flex-1 text-sm text-[#5F5E5A]">{p.description}</p>
                  <span className="inline-flex items-center text-sm font-medium text-[#0F6E56]">
                    去挑战
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 平台六大模块全览 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">一个平台，六种玩法</h2>
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

        {/* 毕业项目引导 */}
        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#EF9F27]/30 bg-gradient-to-br from-[#FAEEDA] to-[#FDF6E8] px-6 py-8 sm:px-10">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎓</span>
                <div>
                  <h3 className="text-lg font-medium text-[#412402]">学完课程，来挑战「毕业项目」！</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#7A5A12]">
                    把前面学到的序列、循环、绘图、音乐……都组合起来，做出属于孩子自己的毕业作品。
                  </p>
                </div>
              </div>
              <Link
                href="/missions/stage-6-8"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#0F6E56] px-6 text-sm font-medium text-white transition-colors hover:bg-[#085041]"
              >
                看看毕业项目
              </Link>
            </div>
          </div>
        </section>

        {/* 年龄入口 */}
        <section id="missions" className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">选择你的探险起点</h2>
              <p className="mt-2 text-[#5F5E5A]">每个年龄段都有适合的创作方式</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <AgeCard
                age="6-8 岁"
                title="图形化积木"
                desc="拖拽积木，让角色动起来、画图案、做小游戏。"
                icon={<Gamepad2 className="h-6 w-6 text-[#7F77DD]" />}
                href="/missions/stage-6-8"
                color="purple"
              />
              <AgeCard
                age="9-12 岁"
                title="代码初探"
                desc="搭积木时同步看到生成的 JavaScript，用函数、变量与列表做更聪明的作品。"
                icon={<Code2 className="h-6 w-6 text-[#378ADD]" />}
                href="/missions/stage-9-12"
                color="blue"
              />
              <AgeCard
                age="13-16 岁"
                title="进阶工坊"
                desc="离开积木、手写 JavaScript：做工具、模拟、算法与创意作品。"
                icon={<Trophy className="h-6 w-6 text-[#0F6E56]" />}
                href="/missions/stage-13-16"
                color="teal"
              />
            </div>
          </div>
        </section>

        {/* 学习阶梯：孩子一步步能收获什么 */}
        <section className="border-y border-black/5 bg-[#FBFCFD] px-4 py-16 sm:px-6 sm:py-20">
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
                    <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-white px-3 py-2 ring-1 ring-black/5">
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

        {/* 家长放心 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">为什么家长放心</h2>
              <p className="mt-2 text-[#5F5E5A]">我们把「对孩子好」放在「好看」前面</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Shield className="h-6 w-6 text-[#D85A30]" />}
                title="完全免费，无套路"
                desc="没有会员等级，没有隐藏付费。"
                bg="coral"
              />
              <FeatureCard
                icon={<Leaf className="h-6 w-6 text-[#EF9F27]" />}
                title="无广告，沉浸式"
                desc="打开就是创作，没有弹窗和推销。"
                bg="amber"
              />
              <FeatureCard
                icon={<Sparkles className="h-6 w-6 text-[#0F6E56]" />}
                title="每个项目都有作品"
                desc="学完不是结束，而是产出可分享的小作品。"
                bg="teal"
              />
              <FeatureCard
                icon={<HeartHandshake className="h-6 w-6 text-[#378ADD]" />}
                title="成长看得见"
                desc="家长入口记录作品、时长与足迹，没有分数排名。"
                bg="blue"
              />
            </div>
          </div>
        </section>

        {/* 和培训班不一样 */}
        <section className="px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#EF9F27]/30 bg-gradient-to-br from-[#FAEEDA] to-[#FDF6E8] px-6 py-8 sm:px-10">
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
        </section>

        {/* 常见问题 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">常见问题</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-black/5 bg-white p-5">
                  <h3 className="mb-1.5 text-base font-medium text-[#04342C]">{f.q}</h3>
                  <p className="text-sm leading-relaxed text-[#5F5E5A]">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 行动号召 */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F6E56] to-[#085041] px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-medium text-white sm:text-3xl">现在就和二零、三七一起，种下第一个作品</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#D7EFE7]">
              第一个任务只要几分钟，画一条线、让二零走两步——成就感马上就来。
            </p>
            <Link
              href="/learn/hello"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-medium text-[#0F6E56] shadow-sm transition-colors hover:bg-[#E1F5EE]"
            >
              开始第一个任务
            </Link>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-black/5 bg-[#F1EFE8] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <ErLingAvatar className="h-7 w-7" />
            <span className="font-medium text-[#04342C]">造物星球</span>
          </div>
          <p className="text-sm text-[#5F5E5A]">
            永久免费 · 无广告 · 保护儿童隐私
          </p>
        </div>
      </footer>
    </div>
  );
}

function AgeCard({
  age,
  title,
  desc,
  icon,
  href,
  color,
}: {
  age: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  href: string;
  color: "purple" | "blue" | "teal";
}) {
  const colorMap = {
    purple: "border-[#7F77DD]/30 bg-[#EEEDFE]/50 hover:bg-[#EEEDFE]",
    blue: "border-[#378ADD]/30 bg-[#E6F1FB]/50 hover:bg-[#E6F1FB]",
    teal: "border-[#0F6E56]/30 bg-[#E1F5EE]/50 hover:bg-[#E1F5EE]",
  };

  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl border p-6 transition-colors ${colorMap[color]}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
        {icon}
      </div>
      <span className="text-sm font-medium text-[#5F5E5A]">{age}</span>
      <h3 className="mt-1 text-xl font-medium text-[#04342C]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5F5E5A]">{desc}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-[#0F6E56]">
        开始探险
        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bg: "coral" | "amber" | "teal" | "blue";
}) {
  const bgMap = {
    coral: "bg-[#FAECE7]",
    amber: "bg-[#FAEEDA]",
    teal: "bg-[#E1F5EE]",
    blue: "bg-[#E6F1FB]",
  };

  return (
    <div className={`rounded-2xl ${bgMap[bg]} p-6`}>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/80">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-[#04342C]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5F5E5A]">{desc}</p>
    </div>
  );
}
