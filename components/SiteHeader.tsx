"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/nav";
import { BASE_PATH } from "@/lib/basePath";

/** 全站统一导航栏。新增模块只需改 lib/nav.ts 的 NAV_ITEMS，所有页面自动同步。 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          <img
            src={`${BASE_PATH}/sun-parrot.svg`}
            alt="造物星球"
            className="h-9 w-9 rounded-full"
          />
          <span className="text-lg font-medium text-[#04342C]">造物星球</span>
        </Link>

        {/* 桌面端导航 */}
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

        <div className="flex items-center gap-2">
          <Link
            href="/missions"
            className="hidden rounded-full bg-[#0F6E56] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#085041] sm:inline-flex"
          >
            开始探索
          </Link>

          {/* 移动端汉堡按钮（< sm 显示） */}
          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#085041] hover:bg-black/5 sm:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {open && (
        <nav className="border-t border-black/5 bg-white px-4 py-2 sm:hidden">
          <div className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-[#EAF6F1] text-[#0F6E56]"
                    : "text-[#085041] hover:bg-black/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/missions"
              onClick={close}
              className="mt-1 rounded-full bg-[#0F6E56] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[#085041]"
            >
              开始探索
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
