"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ["🍎", "🍌", "🐱", "🐶", "⭐", "🌈"];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const deck = EMOJIS.flatMap((emoji, i) => [
    { id: i * 2, emoji, flipped: false, matched: false },
    { id: i * 2 + 1, emoji, flipped: false, matched: false },
  ]);
  return shuffle(deck);
}

export default function MemoryGame({ onWin }: { onWin: () => void }) {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [moves, setMoves] = useState(0);
  const firstIdx = useRef<number | null>(null);
  const secondIdx = useRef<number | null>(null);
  const busy = useRef(false);

  const matchedCount = cards.filter((c) => c.matched).length;

  useEffect(() => {
    if (matchedCount === cards.length && cards.length > 0) {
      onWin();
    }
  }, [matchedCount, cards.length, onWin]);

  const restart = useCallback(() => {
    setCards(buildDeck());
    setMoves(0);
    firstIdx.current = null;
    secondIdx.current = null;
    busy.current = false;
  }, []);

  const handleClick = useCallback(
    (idx: number) => {
      if (busy.current) return;
      const card = cards[idx];
      if (!card || card.flipped || card.matched) return;

      const next = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));

      if (firstIdx.current === null) {
        firstIdx.current = idx;
        setCards(next);
        return;
      }

      // 翻开第二张
      secondIdx.current = idx;
      setCards(next);
      setMoves((m) => m + 1);
      busy.current = true;

      const first = firstIdx.current;
      const second = idx;
      const isMatch = next[first].emoji === next[second].emoji;

      window.setTimeout(() => {
        if (isMatch) {
          setCards((prev) =>
            prev.map((c, i) =>
              i === first || i === second ? { ...c, matched: true } : c
            )
          );
        } else {
          setCards((prev) =>
            prev.map((c, i) =>
              i === first || i === second ? { ...c, flipped: false } : c
            )
          );
        }
        firstIdx.current = null;
        secondIdx.current = null;
        busy.current = false;
      }, 800);
    },
    [cards]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-[#5F5E5A]">
          找出相同的两张卡片，全部配对成功就通关！已配对{" "}
          <span className="font-medium text-[#0F6E56]">{matchedCount / 2}</span> / {EMOJIS.length}
          {" · "}翻牌 {moves} 次
        </p>
        <button
          onClick={restart}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#EF9F27]/30 bg-[#FAEEDA] px-3 text-sm font-medium text-[#412402] hover:bg-[#FAC775]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          重开
        </button>
      </div>

      <div className="grid flex-1 grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, idx) => {
          const faceUp = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleClick(idx)}
              className={`flex aspect-square items-center justify-center rounded-xl border-2 text-3xl transition-all duration-200 sm:text-4xl ${
                card.matched
                  ? "border-[#5DCAA5] bg-[#E1F5EE]"
                  : faceUp
                    ? "border-[#0F6E56] bg-white"
                    : "border-[#9DB6D9] bg-[#CFE0F5] hover:bg-[#BFD6F2]"
              }`}
              aria-label={faceUp ? `卡片 ${card.emoji}` : "未翻开的卡片"}
            >
              {faceUp ? (
                card.emoji
              ) : (
                <span className="text-[#5B7DB0]">❓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
