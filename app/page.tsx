import Link from "next/link";
import { Sparkles, Gamepad2, Code2, Shield, Leaf, Trophy } from "lucide-react";

function ErLingAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm ${className}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full p-2">
        <circle cx="50" cy="45" r="32" fill="#F5C4B3" />
        <circle cx="38" cy="40" r="4" fill="#1a1a2e" />
        <circle cx="62" cy="40" r="4" fill="#1a1a2e" />
        <path
          d="M38 58 Q50 68 62 58"
          fill="none"
          stroke="#D85A30"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M22 30 Q30 10 42 22"
          fill="none"
          stroke="#D85A30"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M78 30 Q70 10 58 22"
          fill="none"
          stroke="#D85A30"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <ErLingAvatar className="h-9 w-9" />
            <span className="text-lg font-medium text-[#04342C]">造物星球</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#085041] sm:flex">
            <Link href="#missions" className="hover:text-[#0F6E56]">星球任务</Link>
            <Link href="/gallery" className="hover:text-[#0F6E56]">作品花园</Link>
            <Link href="/parent" className="hover:text-[#0F6E56]">家长入口</Link>
          </nav>
        </div>
      </header>

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
                  造物星球是一个安静的少儿编程工作室。没有充值、没有广告，只有一个个能跑起来的小项目。
                </p>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link
                    href="/learn/hello"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0F6E56] px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#085041]"
                  >
                    开始第一个任务
                  </Link>
                  <Link
                    href="#missions"
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
                href="/learn/hello"
                color="purple"
              />
              <AgeCard
                age="9-12 岁"
                title="代码初探"
                desc="从积木过渡到 JavaScript，做工具和小游戏。"
                icon={<Code2 className="h-6 w-6 text-[#378ADD]" />}
                href="#"
                color="blue"
              />
              <AgeCard
                age="13-16 岁"
                title="进阶工坊"
                desc="用 Python 和网页技术做完整的独立项目。"
                icon={<Trophy className="h-6 w-6 text-[#0F6E56]" />}
                href="#"
                color="teal"
              />
            </div>
          </div>
        </section>

        {/* 特色介绍 */}
        <section className="border-t border-black/5 bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<Shield className="h-6 w-6 text-[#D85A30]" />}
                title="完全免费，无套路"
                desc="没有会员等级，没有隐藏付费。所有功能对每个孩子开放。"
                bg="coral"
              />
              <FeatureCard
                icon={<Leaf className="h-6 w-6 text-[#EF9F27]" />}
                title="无广告，沉浸式学习"
                desc="打开就是创作。没有弹窗、没有游戏广告、没有推销。"
                bg="amber"
              />
              <FeatureCard
                icon={<Sparkles className="h-6 w-6 text-[#0F6E56]" />}
                title="每个项目都有作品"
                desc="学完不是结束，而是产出一个可以运行、可以分享的小作品。"
                bg="teal"
              />
            </div>
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
  bg: "coral" | "amber" | "teal";
}) {
  const bgMap = {
    coral: "bg-[#FAECE7]",
    amber: "bg-[#FAEEDA]",
    teal: "bg-[#E1F5EE]",
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
