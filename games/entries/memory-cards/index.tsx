"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import {
  sfx,
  useBurst,
  useMuted,
  type Burst,
} from "@/games/hooks/useGameJuice";
import LevelBanner from "@/games/components/LevelBanner";
import SoundToggle from "@/games/components/SoundToggle";
import { comboMult } from "@/games/lib/enhance";
import {
  buildDeck,
  PAIR_EMOJIS,
  MAX_LEVELS,
  levelTargetFor,
  type Card,
} from "./logic";

type Phase = "idle" | "playing" | "result";

// 确定性初始牌组（未洗牌、确定性 id），避免 SSR/客户端随机不一致导致 hydration 不匹配。
const INITIAL_CARDS: Card[] = (() => {
  const chosen = PAIR_EMOJIS.slice(0, 4);
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
  const [muted, toggleMute] = useMuted();
  const { bursts, pop } = useBurst();

  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [pairs, setPairs] = useState(levelTargetFor(1));
  // 初始用确定性牌组（与 SSR 一致），挂载后再洗牌，避免 hydration 不匹配。
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [firstIdx, setFirstIdx] = useState<number | null>(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboBest, setComboBest] = useState(0);
  const [score, setScore] = useState(0);
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);
  const timer = useRef<number | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const showBanner = useCallback((text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  }, []);

  const start = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setLevel(1);
    const p = levelTargetFor(1);
    setPairs(p);
    setCards(buildDeck(p));
    setFirstIdx(null);
    setLock(false);
    setMoves(0);
    setMatched(0);
    setCombo(0);
    setComboBest(0);
    setScore(0);
    setPhase("playing");
  }, []);

  const advanceLevel = useCallback(() => {
    const next = level + 1;
    const p = levelTargetFor(next);
    setLevel(next);
    setPairs(p);
    setCards(buildDeck(p));
    setFirstIdx(null);
    setLock(false);
    setMoves(0);
    setMatched(0);
    setCombo(0);
    showBanner(`第 ${level} 关完成！进入第 ${next} 关`);
  }, [level, showBanner]);

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

        const nc = combo + 1;
        setCombo(nc);
        setComboBest((best) => Math.max(best, nc));
        const gain = Math.round(100 * comboMult(nc));
        setScore((s) => s + gain);
        if (!muted) {
          if (nc >= 3) sfx.combo(nc);
          else sfx.catch();
        }
        pop(6);

        setFirstIdx(null);

        if (newMatched === pairs) {
          if (level < MAX_LEVELS) {
            if (!muted) sfx.levelup();
            advanceLevel();
          } else {
            if (timer.current) clearTimeout(timer.current);
            if (!muted) sfx.win();
            submit(score + gain);
            setPhase("result");
          }
        }
      } else {
        // 不匹配：连击清零，短暂展示后翻回
        setCombo(0);
        if (!muted) sfx.miss();
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
    [phase, lock, cards, firstIdx, matched, combo, pairs, level, muted, pop, advanceLevel, submit, score]
  );

  const best = Math.max(high, score);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🃏🌟</div>
        <p className="max-w-sm text-[#5F5E5A]">
          翻开两张一样的牌就配对成功！共 {MAX_LEVELS} 关，
          <span className="font-medium text-[#0F6E56]">连续配对不失误</span>会积累连击加分，
          每过一关牌更多更好玩～
        </p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始翻牌
        </button>
        {high > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{high}</p>}
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl">🏆 全部 {MAX_LEVELS} 关通关！</div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="本次得分" value={score} />
          <Stat label="历史最高" value={best} />
          <Stat label="到达关卡" value={`第 ${MAX_LEVELS} 关`} />
          <Stat label="最高连击" value={comboBest} />
        </div>
        <button
          onClick={start}
          className="mt-2 rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          再玩一次
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative mb-3 w-full max-w-md">
        <div className="flex items-center justify-between rounded-xl bg-[#E1F5EE] px-4 py-2 text-sm text-[#0F6E56]">
          <span>第 {level}/{MAX_LEVELS} 关</span>
          <span>已配对 {matched}/{pairs}</span>
          <span>分数 {score}</span>
        </div>
        <div className="absolute -right-1 top-1/2 -translate-y-1/2">
          <SoundToggle />
        </div>
      </div>

      <div className="mb-2 flex w-full max-w-md items-center justify-between text-sm text-[#5F5E5A]">
        <span>翻牌 {moves} 次</span>
        <span className={combo > 1 ? "font-semibold text-[#B7791F]" : ""}>
          {combo > 1 ? `连击 ×${combo}` : "连击 —"}
        </span>
        <button
          onClick={start}
          className="rounded-lg bg-white px-3 py-1 text-[#0F6E56] hover:bg-[#9FE1CB]"
        >
          重开
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
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

        {bursts.map((b: Burst) => (
          <span
            key={b.id}
            className="pointer-events-none absolute animate-float text-2xl"
            style={{ left: `calc(50% + ${b.dx}px)`, top: `calc(50% + ${b.dy}px)` }}
          >
            {b.emoji}
          </span>
        ))}

        {banner && <LevelBanner key={banner.key} text={banner.text} />}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <div className="text-xs text-[#5F5E5A]">{label}</div>
      <div className="text-xl font-semibold text-[#04342C]">{value}</div>
    </div>
  );
}
