"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Save } from "lucide-react";
import BlocklyEditor from "@/components/BlocklyEditor";

function ErLingAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 ${className}`}
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

const steps = [
  { id: 1, title: "让二零移动", done: true },
  { id: 2, title: "让二零说话", done: false },
  { id: 3, title: "点击运行", done: false },
];

export default function LearnPageClient() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [logs, setLogs] = useState<string[]>(["[系统] 欢迎来到造物星球！"]);

  const handleRun = () => {
    setLogs((prev) => [...prev, `[运行] 程序开始执行`]);
    setTimeout(() => {
      setLogs((prev) => [...prev, `[运行] 二零说：你好！`]);
    }, 500);
  };

  const handleReset = () => {
    setLogs(["[系统] 已重置"]);
  };

  return (
    <div className="flex h-screen flex-col bg-[#fafbfc]">
      {/* 顶部栏 */}
      <header className="flex h-14 items-center justify-between border-b border-black/5 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium text-[#5F5E5A] hover:text-[#0F6E56]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回星球
          </Link>
          <h1 className="text-base font-medium text-[#04342C]">
            任务 1：二零，打个招呼！
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#04342C]">
            进度 1/3
          </span>
          <ErLingAvatar className="h-8 w-8" />
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex flex-1 gap-3 overflow-hidden p-3">
        {/* 左侧任务面板 */}
        <aside className="flex w-64 flex-col gap-3">
          <div className="flex-1 rounded-xl border border-black/10 bg-white p-4">
            <h2 className="mb-4 text-sm font-medium text-[#04342C]">任务步骤</h2>
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                    step.done
                      ? "border-[#5DCAA5] bg-[#E1F5EE] text-[#04342C]"
                      : "border-black/5 bg-[#F1EFE8] text-[#5F5E5A]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                      step.done
                        ? "bg-[#0F6E56] text-white"
                        : "bg-white text-[#5F5E5A]"
                    }`}
                  >
                    {step.done ? "✓" : step.id}
                  </span>
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#F0997B]/30 bg-[#FAECE7] p-4">
            <div className="mb-2 flex items-center gap-2">
              <ErLingAvatar className="h-8 w-8" />
              <span className="text-sm font-medium text-[#4A1B0C]">二零说</span>
            </div>
            <p className="text-sm leading-relaxed text-[#712B13]">
              把「移动」积木拖到工作区，再点「运行」，我就能动起来啦！
            </p>
          </div>
        </aside>

        {/* 中间积木编辑区 */}
        <section className="flex min-w-0 flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
          <h2 className="mb-2 text-sm font-medium text-[#04342C]">积木工作区</h2>
          <div className="min-h-0 flex-1">
            <BlocklyEditor onChange={setGeneratedCode} />
          </div>
        </section>

        {/* 右侧预览区 */}
        <aside className="flex w-80 flex-col gap-3">
          <div className="flex flex-1 flex-col rounded-xl border border-black/10 bg-white p-3">
            <h2 className="mb-2 text-sm font-medium text-[#04342C]">舞台预览</h2>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-[#E6F1FB]">
              <div className="text-center">
                <ErLingAvatar className="mx-auto h-20 w-20" />
                <p className="mt-3 text-xs text-[#0C447C]">二零会在这里动起来</p>
              </div>
            </div>
          </div>

          <div className="h-40 rounded-xl border border-black/10 bg-[#F1EFE8] p-3">
            <h3 className="mb-2 text-xs font-medium text-[#444441]">运行日志</h3>
            <div className="scrollbar-hide h-28 space-y-1 overflow-y-auto text-xs text-[#5F5E5A]">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* 底部操作栏 */}
      <footer className="flex h-14 items-center justify-between border-t border-black/5 bg-white px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#EF9F27]/30 bg-[#FAEEDA] px-4 text-sm font-medium text-[#412402] hover:bg-[#FAC775]"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#5DCAA5]/30 bg-[#E1F5EE] px-4 text-sm font-medium text-[#04342C] hover:bg-[#9FE1CB]">
            <Save className="h-4 w-4" />
            保存
          </button>
        </div>
        <button
          onClick={handleRun}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#0F6E56] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          <Play className="h-4 w-4" />
          运行
        </button>
      </footer>

      {/* 生成的代码预览（调试用，后续可隐藏） */}
      {generatedCode && (
        <div className="hidden border-t border-black/5 bg-white px-4 py-2 text-xs text-[#5F5E5A]">
          <pre className="font-mono">{generatedCode}</pre>
        </div>
      )}
    </div>
  );
}
