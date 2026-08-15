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
} from "lucide-react";
import ErLingAvatar from "@/components/ErLingAvatar";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "平台指南 - 造物星球",
  description:
    "造物星球是什么、怎么分龄、有哪些模块、如何开始，以及家长如何陪伴与隐私保护，一篇讲清。",
};

const STAGES = [
  {
    age: "6-8 岁",
    title: "图形化积木",
    tech: "彩色积木（不打字）",
    icon: <Gamepad2 className="h-6 w-6 text-[#7F77DD]" />,
    color: "purple" as const,
    desc: "拖一拖彩色积木，让二零动起来、画图案、讲小故事。全程不用键盘打字，培养顺序、循环、条件的直觉。",
  },
  {
    age: "9-12 岁",
    title: "代码初探",
    tech: "积木 → JavaScript",
    icon: <Code2 className="h-6 w-6 text-[#378ADD]" />,
    color: "blue" as const,
    desc: "从积木平滑过渡到写代码：拖积木的同时能看到它生成的 JavaScript，自然学会函数、变量，做出工具和小游戏。",
  },
  {
    age: "13-16 岁",
    title: "进阶工坊",
    tech: "Python / 网页技术",
    icon: <Trophy className="h-6 w-6 text-[#0F6E56]" />,
    color: "teal" as const,
    desc: "用更接近真实世界的语言与网页技术，独立完成完整的项目，为更长远的创造打底。",
  },
];

const MODULES = [
  {
    icon: <BookOpen className="h-6 w-6 text-[#0F6E56]" />,
    title: "星球任务",
    desc: "按年龄挑选能跑起来的小项目，像闯关一样一步步解锁，每个任务都有「看示范」参考答案。",
    href: "/missions",
  },
  {
    icon: <Gamepad2 className="h-6 w-6 text-[#7F77DD]" />,
    title: "星球游乐场",
    desc: "学累了来放松的小游戏：2048、打节拍、星球赛车、星星钢琴……还有更多正在加入。和编程无关，纯粹好玩。",
    href: "/playground",
  },
  {
    icon: <Palette className="h-6 w-6 text-[#D85A30]" />,
    title: "造物工坊",
    desc: "没有题目的自由创作空间：拖积木让二零和三七动起来、画画、做音乐、讲故事，作品存在本地随时回看。",
    href: "/studio",
  },
  {
    icon: <Blocks className="h-6 w-6 text-[#378ADD]" />,
    title: "组件库",
    desc: "把平台用到的每一块积木都摊开讲解：它长什么样、能做什么、怎么拼。想知道某个积木就查这里。",
    href: "/toolbox",
  },
  {
    icon: <Eye className="h-6 w-6 text-[#EF9F27]" />,
    title: "作品花园",
    desc: "孩子们做出的小作品集合，看看同龄人用同样的积木能创造出什么，给自己的灵感加点料。",
    href: "/gallery",
  },
  {
    icon: <HeartHandshake className="h-6 w-6 text-[#0F6E56]" />,
    title: "家长入口",
    desc: "记录孩子的作品、投入的时间与探索足迹。没有分数排名，只让成长看得见。",
    href: "/parent",
  },
];

const STEPS = [
  { n: 1, title: "选一个任务", desc: "从「画一条线」到「做一张贺卡」，每个都是一个小目标。" },
  { n: 2, title: "拖一拖积木", desc: "像拼图一样把彩色积木拼起来，让二零动起来。" },
  { n: 3, title: "看到作品", desc: "点一下运行，立刻看到自己做出来的东西。" },
];

const colorMap = {
  purple: "border-[#7F77DD]/30 bg-[#EEEDFE]/50",
  blue: "border-[#378ADD]/30 bg-[#E6F1FB]/50",
  teal: "border-[#0F6E56]/30 bg-[#E1F5EE]/50",
};

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#E1F5EE] via-white to-[#FAECE7] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Sparkles className="h-8 w-8 text-[#0F6E56]" />
            </div>
            <h1 className="text-4xl font-medium leading-tight tracking-tight text-[#04342C] sm:text-5xl">
              造物星球，是什么？
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#5F5E5A]">
              一个安静的少儿编程工作室。没有充值、没有广告，只有一个个
              <span className="font-medium text-[#0F6E56]">能跑起来的小项目</span>
              ——从画一条线，到做一张节日贺卡，再到写出第一段代码。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
        </section>

        {/* 理念 */}
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
                  没有会员等级，没有隐藏付费，所有功能对孩子开放。
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAEEDA]">
                  <Sparkles className="h-6 w-6 text-[#EF9F27]" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-[#04342C]">无广告，沉浸式</h3>
                <p className="text-sm leading-relaxed text-[#5F5E5A]">
                  打开就是创作，没有弹窗和推销，孩子能专注在自己的作品上。
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE]">
                  <HeartHandshake className="h-6 w-6 text-[#0F6E56]" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-[#04342C]">保护儿童隐私</h3>
                <p className="text-sm leading-relaxed text-[#5F5E5A]">
                  作品只保存在你自己的设备本地，不上传到任何服务器，更不会拿去打广告。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 三阶段 */}
        <section className="border-y border-black/5 bg-[#FBFCFD] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">按年龄，分三个阶段</h2>
              <p className="mt-2 text-[#5F5E5A]">难度和能力阶梯自然递进，前一阶段是后一阶段的基础</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {STAGES.map((s) => (
                <div key={s.age} className={`rounded-2xl border p-6 ${colorMap[s.color]}`}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    {s.icon}
                  </div>
                  <span className="text-sm font-medium text-[#5F5E5A]">{s.age}</span>
                  <h3 className="mt-1 text-xl font-medium text-[#04342C]">{s.title}</h3>
                  <p className="mt-1 text-xs font-medium text-[#0F6E56]">{s.tech}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#5F5E5A]">{s.desc}</p>
                </div>
              ))}
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
                  <h3 className="mb-1 flex items-center gap-1 text-base font-medium text-[#04342C]">
                    {m.title}
                  </h3>
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

        {/* 怎么开始 */}
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

        {/* 家长 */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F6E56] to-[#085041] px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-medium text-white sm:text-3xl">给家长的话</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#D7EFE7]">
              这里没有排行榜、没有「别人家孩子」。我们记录孩子做了什么、探索了多久，
              只为让你看见成长，而不是焦虑。所有作品都存在本地设备，安心陪伴就好。
            </p>
            <Link
              href="/parent"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-medium text-[#0F6E56] shadow-sm transition-colors hover:bg-[#E1F5EE]"
            >
              进入家长入口
            </Link>
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
