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
  buildTiles,
  MAX_LEVELS,
  levelTargetFor,
  type Tile,
} from "./logic";

type Phase = "idle" | "playing" | "result";

// 确定性初始排列（未洗牌），避免 SSR/客户端随机不一致导致 hydration 不匹配。
const INITIAL_TILES: Tile[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  value: Math.floor(i / 2) + 1,
  cleared: false,
}));

export default function NumberMatch() {
  const { high, submit } = useHighScore("number-match");
  const [muted, toggleMute] = useMuted();
  const { bursts, pop } = useBurst();

  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [target, setTarget] = useState(levelTargetFor(1));
  // 初始用确定性排列（与 SSR 一致），挂载后再洗牌，避免 hydration 不匹配。
  const [tiles, setTiles] = useState<Tile[]>(INITIAL_TILES);
  const [selected, setSelected] = useState<number[]>([]);
  const [lock, setLock] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);
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
    const t = levelTargetFor(1);
    setTarget(t);
    setTiles(buildTiles(t));
    setSelected([]);
    setLock(false);
    setClearedCount(0);
    setCombo(0);
    setComboBest(0);
    setScore(0);
    setPhase("playing");
  }, []);

  const advanceLevel = useCallback(() => {
    const next = level + 1;
    const t = levelTargetFor(next);
    setLevel(next);
    setTarget(t);
    setTiles(buildTiles(t));
    setSelected([]);
    setLock(false);
    setClearedCount(0);
    setCombo(0);
    showBanner(`第 ${level} 关完成！进入第 ${next} 关`);
  }, [level, showBanner]);

  const onPick = useCallback(
    (idx: number) => {
      if (phase !== "playing" || lock) return;
      const t = tiles[idx];
      if (t.cleared || selected.includes(idx)) return;

      const nextSel = [...selected, idx];
      setSelected(nextSel);

      if (nextSel.length < 2) return;

      // 两张：比较
      const [a, b] = nextSel;
      if (tiles[a].value === tiles[b].value) {
        const clearedNext = tiles.map((c, i) =>
          i === a || i === b ? { ...c, cleared: true } : c
        );
        const nc = clearedCount + 2;
        setTiles(clearedNext);
        setClearedCount(nc);
        setSelected([]);

        const ncombo = combo + 1;
        setCombo(ncombo);
        setComboBest((best) => Math.max(best, ncombo));
        const gain = Math.round(100 * comboMult(ncombo));
        setScore((s) => s + gain);
        if (!muted) {
          if (ncombo >= 3) sfx.combo(ncombo);
          else sfx.catch();
        }
        pop(6);

        if (nc === tiles.length) {
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
        setCombo(0);
        if (!muted) sfx.miss();
        setLock(true);
        timer.current = window.setTimeout(() => {
          setSelected([]);
          setLock(false);
        }, 600);
      }
    },
    [phase, lock, tiles, selected, clearedCount, combo, level, muted, pop, advanceLevel, submit, score]
  );

  const best = Math.max(high, score);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🔢🌟</div>
        <p className="max-w-sm text-[#5F5E5A]">
          点两个<span className="font-medium text-[#0F6E56]">相同数字</span>把它们消除！共 {MAX_LEVELS} 关，
          <span className="font-medium text-[#0F6E56]">连续消对不失误</span>积累连击加分，每过一关数字更多～
        </p>
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          开始消除
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
          <span>已消除 {clearedCount}/{target}</span>
          <span>分数 {score}</span>
        </div>
        <div className="absolute -right-1 top-1/2 -translate-y-1/2">
          <SoundToggle />
        </div>
      </div>

      <div className="mb-2 flex w-full max-w-md items-center justify-between text-sm text-[#5F5E5A]">
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
          {tiles.map((t, i) => {
            const isSel = selected.includes(i);
            return (
              <button
                key={t.id}
                onClick={() => onPick(i)}
                disabled={phase !== "playing" || t.cleared}
                className={`relative aspect-square rounded-xl border text-2xl font-semibold transition-colors sm:text-3xl ${
                  t.cleared
                    ? "border-transparent bg-transparent text-transparent"
                    : isSel
                      ? "border-[#0F6E56] bg-[#0F6E56] text-white"
                      : "border-black/10 bg-white text-[#04342C] hover:bg-[#E1F5EE]"
                }`}
                aria-label={t.cleared ? "已消除" : `数字 ${t.value}`}
              >
                {t.cleared ? "" : t.value}
              </button>
            );
          })}
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
