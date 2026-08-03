"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

/** 全站统一导航栏。新增模块只需改 lib/nav.ts 的 NAV_ITEMS，所有页面自动同步。 */
export default function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/sun-parrot.svg"
            alt="造物星球"
            className="h-9 w-9 rounded-full"
          />
          <span className="text-lg font-medium text-[#04342C]">造物星球</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#085041] sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "text-[#0F6E56]" : "hover:text-[#0F6E56]"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/missions"
          className="hidden rounded-full bg-[#0F6E56] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#085041] sm:inline-flex"
        >
          开始探索
        </Link>
      </div>
    </header>
  );
}
