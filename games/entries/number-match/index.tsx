"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { buildTiles, type Tile } from "./logic";

type Phase = "playing" | "result";

// 确定性初始排列（未洗牌），避免 SSR/客户端随机不一致导致 hydration 不匹配。
const INITIAL_TILES: Tile[] = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  value: Math.floor(i / 2) + 1,
  cleared: false,
}));

export default function NumberMatch() {
  const { high, submit } = useHighScore("number-match");
  // 初始用确定性排列（与 SSR 一致），挂载后再洗牌，避免 hydration 不匹配。
  const [tiles, setTiles] = useState<Tile[]>(INITIAL_TILES);
  const [selected, setSelected] = useState<number[]>([]);
  const [lock, setLock] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // 客户端挂载后再洗牌（buildTiles 使用 Math.random，不能在初次渲染阶段调用）。
  useEffect(() => {
    setTiles(buildTiles());
  }, []);

  const restart = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setTiles(buildTiles());
    setSelected([]);
    setLock(false);
    setClearedCount(0);
    setPhase("playing");
  }, []);

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
        if (nc === tiles.length) {
          setPhase("result");
          submit(nc);
        }
      } else {
        setLock(true);
        timer.current = window.setTimeout(() => {
          setSelected([]);
          setLock(false);
        }, 600);
      }
    },
    [tiles, selected, lock, clearedCount, phase, submit]
  );

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex w-full max-w-md items-center justify-between rounded-xl bg-[#E1F5EE] px-4 py-2 text-sm text-[#0F6E56]">
        <span>已消除 {clearedCount} / {tiles.length}</span>
        <button onClick={restart} className="rounded-lg bg-white px-3 py-1 text-[#0F6E56] hover:bg-[#9FE1CB]">
          重开
        </button>
      </div>

      <div className="grid w-full max-w-md grid-cols-4 gap-2 sm:gap-3">
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

      {phase === "result" && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-[#F4FBF8] px-8 py-6 text-center">
          <div className="text-3xl">🎉 全部清空！</div>
          <p className="text-sm text-[#5F5E5A]">历史最好消除 {Math.max(high, clearedCount)} 张</p>
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
