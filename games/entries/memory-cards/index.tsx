"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { buildDeck, PAIR_EMOJIS, type Card } from "./logic";

type Phase = "playing" | "result";

// 确定性初始牌组（未洗牌、确定性 id），避免 SSR/客户端随机不一致导致 hydration 不匹配。
const INITIAL_CARDS: Card[] = (() => {
  const chosen = PAIR_EMOJIS.slice(0, 6);
  const deck: Card[] = [];
  let id = 0;
  for (const emoji of chosen) {
    deck.push({ id: id++, emoji, flipped: false, matched: false });
    deck.push({ id: id++, emoji, flipped: false, matched: false });
  }
  return deck;
})();

export default function MemoryCards() {
  const { high, submit } = useHighScore("memory-cards");
  // 初始用确定性牌组（与 SSR 一致），挂载后再洗牌，避免 hydration 不匹配。
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [firstIdx, setFirstIdx] = useState<number | null>(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const timer = useRef<number | null>(null);

  const total = cards.length;

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // 客户端挂载后再洗牌（buildDeck 使用 Math.random，不能在初次渲染阶段调用）。
  useEffect(() => {
    setCards(buildDeck());
  }, []);

  const restart = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setCards(buildDeck());
    setFirstIdx(null);
    setLock(false);
    setMoves(0);
    setMatched(0);
    setPhase("playing");
  }, []);

  const onFlip = useCallback(
    (idx: number) => {
      if (phase !== "playing" || lock) return;
      const card = cards[idx];
      if (card.flipped || card.matched) return;

      const next = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
      setCards(next);

      if (firstIdx === null) {
        setFirstIdx(idx);
        return;
      }

      // 第二张：比较
      setMoves((m) => m + 1);
      const a = cards[firstIdx];
      const b = next[idx];
      if (a.emoji === b.emoji) {
        // 配对成功
        const matchedNext = next.map((c, i) =>
          i === firstIdx || i === idx ? { ...c, matched: true } : c
        );
        setCards(matchedNext);
        const newMatched = matched + 1;
        setMatched(newMatched);
        setFirstIdx(null);
        if (newMatched * 2 === total) {
          setPhase("result");
          submit(newMatched);
        }
      } else {
        // 不匹配：短暂展示后翻回
        setLock(true);
        const f = firstIdx;
        timer.current = window.setTimeout(() => {
          setCards((cs) =>
            cs.map((c, i) => (i === f || i === idx ? { ...c, flipped: false } : c))
          );
          setFirstIdx(null);
          setLock(false);
        }, 750);
      }
    },
    [cards, firstIdx, lock, matched, phase, total, submit]
  );

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex w-full max-w-md items-center justify-between rounded-xl bg-[#E1F5EE] px-4 py-2 text-sm text-[#0F6E56]">
        <span>已配对 {matched} / {total / 2}</span>
        <span>翻牌 {moves} 次</span>
        <button onClick={restart} className="rounded-lg bg-white px-3 py-1 text-[#0F6E56] hover:bg-[#9FE1CB]">
          重开
        </button>
      </div>

      <div className="grid w-full max-w-md grid-cols-4 gap-2 sm:gap-3">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onFlip(i)}
            disabled={phase !== "playing"}
            className={`relative aspect-square rounded-xl border text-2xl transition-colors sm:text-3xl ${
              c.flipped || c.matched
                ? "border-[#5DCAA5] bg-white"
                : "border-black/10 bg-[#EEEDFE] hover:bg-[#E1E0FB]"
            }`}
            aria-label={c.flipped || c.matched ? c.emoji : "未翻开的卡片"}
          >
            {c.flipped || c.matched ? (
              <span>{c.emoji}</span>
            ) : (
              <span className="text-[#A9A4E6]">？</span>
            )}
          </button>
        ))}
      </div>

      {phase === "result" && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-[#F4FBF8] px-8 py-6 text-center">
          <div className="text-3xl">🎉 全部配对成功！</div>
          <p className="text-sm text-[#5F5E5A]">
            用了 {moves} 次翻牌 ｜ 历史最好 {Math.max(high, matched)} 对
          </p>
          <button
            onClick={restart}
            className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
          >
            再来一局
          </button>
        </div>
      )}
    </div>
  );
}
