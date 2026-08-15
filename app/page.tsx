import Link from "next/link";
import { Sparkles, Gamepad2, Code2, Shield, Leaf, Trophy, BookOpen, Blocks, Palette, HeartHandshake, ChevronRight, Star } from "lucide-react";
import ErLingAvatar from "@/components/ErLingAvatar";
import SiteHeader from "@/components/SiteHeader";
import { getProject } from "@/courses";

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
        {/* Hero 区 */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#E1F5EE] via-white to-[#FAECE7] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#5DCAA5]/30 bg-white/70 px-4 py-1.5 text-sm text-[#0F6E56]">
                  <Sparkles className="h-4 w-4" />
                  免费 · 无广告 · 沉浸式学习
                </div>
                <h1 className="text-4xl font-medium leading-tight tracking-tight text-[#04342C] sm:text-5xl">
                  和二零一起，
                  <br />
                  把想法种成作品
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-[#5F5E5A]">
                  造物星球是一个安静的少儿编程工作室。没有充值、没有广告，只有一个个能跑起来的小项目——从画一条线，到做一张节日贺卡。
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
                  <div className="absolute -inset-4 rounded-full bg-[#F5C4B3]/30 blur-2xl" />
                  <ErLingAvatar className="relative h-64 w-64 sm:h-80 sm:w-80" />
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

        {/* 更多玩法：游乐场 + 工坊 露出 */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-medium text-[#04342C]">除了做任务，还有更多玩法</h2>
              <p className="mt-2 text-[#5F5E5A]">学累了去游乐场放松，或者到工坊自由创作</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Link
                href="/playground"
                className="group flex items-center gap-5 rounded-2xl border border-black/5 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEEDFE]">
                  <Gamepad2 className="h-7 w-7 text-[#7F77DD]" />
                </div>
                <div className="flex-1">
                  <h3 className="flex items-center gap-1 text-lg font-medium text-[#04342C]">
                    星球游乐场
                    <ChevronRight className="h-4 w-4 text-[#7F77DD] transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5F5E5A]">
                    2048、打节拍、星球赛车、星星钢琴……编程学累了，来这儿纯放松。
                  </p>
                </div>
              </Link>
              <Link
                href="/studio"
                className="group flex items-center gap-5 rounded-2xl border border-black/5 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FAECE7]">
                  <Palette className="h-7 w-7 text-[#D85A30]" />
                </div>
                <div className="flex-1">
                  <h3 className="flex items-center gap-1 text-lg font-medium text-[#04342C]">
                    造物工坊
                    <ChevronRight className="h-4 w-4 text-[#D85A30] transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5F5E5A]">
                    没有题目的自由创作：让二零和三七动起来、画画、做音乐、讲故事，存本地随时回看。
                  </p>
                </div>
              </Link>
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
                desc="从积木过渡到 JavaScript，做工具和小游戏。"
                icon={<Code2 className="h-6 w-6 text-[#378ADD]" />}
                href="/missions/stage-9-12"
                color="blue"
              />
              <AgeCard
                age="13-16 岁"
                title="进阶工坊"
                desc="用 Python 和网页技术做完整的独立项目。"
                icon={<Trophy className="h-6 w-6 text-[#0F6E56]" />}
                href="/missions/stage-13-16"
                color="teal"
              />
            </div>
          </div>
        </section>

        {/* 家长放心 */}
        <section className="border-t border-black/5 bg-white px-4 py-16 sm:px-6 sm:py-20">
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
            <h2 className="text-2xl font-medium text-white sm:text-3xl">现在就和二零一起，种下第一个作品</h2>
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
