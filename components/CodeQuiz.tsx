"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import type { CodeQuizQuestion } from "@/courses";

interface CodeQuizProps {
  /** 题库（来自 CourseProject.quiz，题目数与 steps 一致，一步一题）。 */
  quiz: CodeQuizQuestion[];
  /** 全部答对时触发（父组件据此标记项目完成）。幂等调用即可。 */
  onPass: () => void;
  /** 已答对题数变化时通知父组件，用于点亮左侧步骤（第 n 步 = 答对 n 题）。 */
  onProgress?: (solved: number) => void;
}

/**
 * 「读代码」练习组件（9-12 阶段末尾）。
 *
 * 设计意图：这是从「看代码」走向「写代码」的**最低台阶**——
 * 只要求孩子**读懂**一段真正的 JavaScript 并预测结果，完全不要求动手写。
 * 9-12 的孩子刚在积木页看到过「自己搭的积木变成了这段代码」，
 * 13-16 就要亲手写下它们；这一关把中间的阅读能力补齐。
 *
 * 交互取舍：答错不惩罚、给解析并可重试，但**必须真的答对才能进入下一题**，
 * 避免连蒙带猜混过关（与全站「空程序 / 乱搭积木不算完成」的把关原则一致）。
 */
export default function CodeQuiz({ quiz, onPass, onProgress }: CodeQuizProps) {
  // 每题当前选中的选项下标；null = 未作答
  const [picked, setPicked] = useState<(number | null)[]>(() => quiz.map(() => null));
  const [current, setCurrent] = useState(0);

  const solved = useMemo(
    () => quiz.reduce((n, q, i) => (picked[i] !== null && picked[i] === q.answer ? n + 1 : n), 0),
    [picked, quiz]
  );

  useEffect(() => {
    onProgress?.(solved);
  }, [solved, onProgress]);

  const allDone = quiz.length > 0 && solved === quiz.length;

  useEffect(() => {
    if (allDone) onPass();
  }, [allDone, onPass]);

  // 题库变化时（切换项目）重置作答状态
  useEffect(() => {
    setPicked(quiz.map(() => null));
    setCurrent(0);
  }, [quiz]);

  const q = quiz[current];
  const pickedIdx = picked[current];
  const answered = pickedIdx !== null;
  const correct = answered && pickedIdx === q?.answer;

  const choose = useCallback(
    (idx: number) => {
      setPicked((prev) => {
        const next = prev.slice();
        next[current] = idx;
        return next;
      });
    },
    [current]
  );

  const retry = useCallback(() => {
    setPicked((prev) => {
      const next = prev.slice();
      next[current] = null;
      return next;
    });
  }, [current]);

  const goNext = useCallback(() => {
    setCurrent((c) => (c < quiz.length - 1 ? c + 1 : c));
  }, [quiz.length]);

  const reset = useCallback(() => {
    setPicked(quiz.map(() => null));
    setCurrent(0);
  }, [quiz]);

  if (!q) return null;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#5F5E5A]">
          第 <span className="font-medium text-[#04342C]">{current + 1}</span> / {quiz.length} 题
          {" · "}已答对 <span className="font-medium text-[#0F6E56]">{solved}</span> 题
        </p>
        <button
          onClick={reset}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#EF9F27]/30 bg-[#FAEEDA] px-3 text-sm font-medium text-[#412402] hover:bg-[#FAC775]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          重做
        </button>
      </div>

      {/* 题目进度点（可点击跳题，方便回看） */}
      <div className="flex gap-1.5" role="tablist" aria-label="题目进度">
        {quiz.map((item, i) => {
          const isSolved = picked[i] !== null && picked[i] === item.answer;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`第 ${i + 1} 题${isSolved ? "（已答对）" : ""}`}
              onClick={() => setCurrent(i)}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i === current
                  ? "bg-[#04342C]"
                  : isSolved
                    ? "bg-[#5DCAA5]"
                    : "bg-[#CFE0F5]"
              }`}
            />
          );
        })}
      </div>

      {allDone ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-[#5DCAA5] bg-[#E1F5EE] p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-[#0F6E56]" />
          <p className="text-base font-medium text-[#04342C]">全部答对，你读懂代码啦！</p>
          <p className="max-w-md text-sm leading-relaxed text-[#0F6E56]">
            这些就是真正的 JavaScript。到 13-16 岁，你就要亲手写下它们，
            让二零照着你的代码动起来。
          </p>
        </div>
      ) : (
        <>
          {/* 只读代码区：用深色底 + 等宽字体，强化「这是真正的代码」的实感 */}
          <pre className="overflow-auto rounded-xl bg-[#0F172A] p-4 font-mono text-[13px] leading-relaxed text-[#E2E8F0]">
            <code>{q.code}</code>
          </pre>

          <p className="text-sm font-medium text-[#04342C]">{q.question}</p>

          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              const isPicked = pickedIdx === i;
              const isAnswer = i === q.answer;
              const showCorrect = answered && isAnswer;
              const showWrong = answered && isPicked && !isAnswer;
              return (
                <button
                  key={i}
                  onClick={() => !answered && choose(i)}
                  disabled={answered}
                  aria-label={`选项 ${i + 1}：${opt}`}
                  className={`rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    showCorrect
                      ? "border-[#5DCAA5] bg-[#E1F5EE] text-[#04342C]"
                      : showWrong
                        ? "border-[#E24C4B]/50 bg-[#FCE8E6] text-[#501313]"
                        : answered
                          ? "border-black/10 bg-white text-[#5F5E5A] opacity-60"
                          : "border-[#CFE0F5] bg-white text-[#04342C] hover:bg-[#F1EFE8]"
                  }`}
                >
                  <span className="mr-2 font-medium text-[#5F5E5A]">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={`rounded-xl border p-3 ${
                correct ? "border-[#5DCAA5] bg-[#E1F5EE]" : "border-[#EF9F27]/40 bg-[#FAEEDA]"
              }`}
            >
              <p
                className={`mb-1 flex items-center gap-1.5 text-sm font-medium ${
                  correct ? "text-[#0F6E56]" : "text-[#412402]"
                }`}
              >
                <Lightbulb className="h-4 w-4" />
                {correct ? "答对了！" : "再看看这段解析～"}
              </p>
              <p
                className={`text-xs leading-relaxed ${
                  correct ? "text-[#0F6E56]" : "text-[#412402]"
                }`}
              >
                {q.explain}
              </p>
            </div>
          )}

          {answered && (
            <div className="flex justify-end">
              {correct ? (
                current < quiz.length - 1 ? (
                  <button
                    onClick={goNext}
                    className="rounded-lg bg-[#0F6E56] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A5544]"
                  >
                    下一题 →
                  </button>
                ) : null
              ) : (
                <button
                  onClick={retry}
                  className="rounded-lg border border-[#EF9F27]/40 bg-white px-4 py-2 text-sm font-medium text-[#412402] hover:bg-[#FAEEDA]"
                >
                  再试一次
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
