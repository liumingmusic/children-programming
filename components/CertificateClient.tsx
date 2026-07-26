"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import type { Project, Progress } from "@/lib/db";
import { getAllProjects, getAllProgress } from "@/lib/db";
import { getProject } from "@/courses";

function ErLingAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full p-2">
        <circle cx="50" cy="45" r="32" fill="#F5C4B3" />
        <circle cx="38" cy="40" r="4" fill="#1a1a2e" />
        <circle cx="62" cy="40" r="4" fill="#1a1a2e" />
        <path d="M38 58 Q50 68 62 58" fill="none" stroke="#D85A30" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 30 Q30 10 42 22" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" />
        <path d="M78 30 Q70 10 58 22" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

interface CertificateClientProps {
  slug: string;
}

export default function CertificateClient({ slug }: CertificateClientProps) {
  const [title, setTitle] = useState<string>("");
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const [notFound, setNotFound] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const course = getProject(slug);
      if (!course) {
        setNotFound(true);
        return;
      }
      const progress = await getAllProgress();
      const prog = progress.find((p) => p.slug === slug && p.completed);
      if (!prog) {
        setNotFound(true);
        return;
      }
      setTitle(course.title);
      setCompletedAt(prog.completedAt || new Date());
    }
    load();
  }, [slug]);

  const handleDownload = () => {
    const card = cardRef.current;
    if (!card) return;
    // Use simple window.print area selection via a temporary class is complex;
    // Instead, copy the card as an image-like screenshot using html2canvas is not available.
    // Fallback: print the page which will show the certificate card nicely.
    window.print();
  };

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafbfc] px-4 text-center">
        <ErLingAvatar className="mx-auto mb-4 h-16 w-16" />
        <h1 className="mb-2 text-xl font-medium text-[#04342C]">证书未找到</h1>
        <p className="mb-6 text-[#5F5E5A]">你需要先完成这个项目才能获得创作证书。</p>
        <Link href={`/learn/${slug}`} className="rounded-xl bg-[#0F6E56] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#085041]">
          去完成任务
        </Link>
      </div>
    );
  }

  if (!completedAt) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafbfc] text-[#5F5E5A]">
        正在加载证书...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafbfc]">
      <header className="border-b border-black/5 bg-white px-4 py-4 shadow-sm print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/gallery" className="flex items-center gap-1 text-sm font-medium text-[#5F5E5A] hover:text-[#0F6E56]">
            <ArrowLeft className="h-4 w-4" />
            返回作品花园
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0F6E56] px-4 text-sm font-medium text-white hover:bg-[#085041]"
            >
              <Download className="h-4 w-4" />
              保存/打印
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div
          ref={cardRef}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-10 text-center shadow-xl print:shadow-none print:border print:border-[#0F6E56]/20"
        >
          {/* Decorative background */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E1F5EE]/50 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#FAEEDA]/50 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#FAEEDA]">
              <ErLingAvatar className="h-16 w-16" />
            </div>
            <h2 className="mb-2 text-sm font-medium tracking-widest text-[#0F6E56] uppercase">造物星球 · 创作证书</h2>
            <h1 className="mb-4 text-3xl font-medium text-[#04342C] sm:text-4xl">{title}</h1>
            <p className="mx-auto mb-8 max-w-md text-[#5F5E5A]">
              恭喜小小创作者！你成功完成了这个项目，和二零一起把想法变成了作品。
            </p>

            <div className="mb-8 flex items-center justify-center gap-2 text-sm text-[#5F5E5A]">
              <span>完成时间：</span>
              <span className="font-medium text-[#04342C]">
                {completedAt ? formatDate(completedAt) : ""}
              </span>
            </div>

            <div className="mx-auto mb-8 h-px w-32 bg-[#0F6E56]/20" />

            <div className="flex items-center justify-center gap-2 text-[#0F6E56]">
              <span className="text-2xl">🌟</span>
              <span className="font-medium">获得一颗创意种子</span>
              <span className="text-2xl">🌟</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return String(date);
  }
}
