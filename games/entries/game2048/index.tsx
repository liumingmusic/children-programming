"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { sfx, useMuted } from "@/games/hooks/useGameJuice";
import LevelBanner from "@/games/components/LevelBanner";
import SoundToggle from "@/games/components/SoundToggle";
import {
  canMove,
  comboMult2048,
  createInitial,
  hasWon,
  levelForMaxTile,
  maxTile,
  move,
  nextTarget,
  spawnTile,
  TILE_LEVELS,
  type Board,
  type Dir,
} from "./logic";

// 方块配色（经典 2048 调色板，文字色随底色深浅切换）。
const TILE_STYLE: Record<number, string> = {
  0: "bg-[#EAF3EF] text-transparent",
  2: "bg-[#EAF3EF] text-[#5F5E5A]",
  4: "bg-[#DCEFE6] text-[#5F5E5A]",
  8: "bg-[#FAC775] text-[#412402]",
  16: "bg-[#F6A94E] text-white",
  32: "bg-[#F2923C] text-white",
  64: "bg-[#EF7A2E] text-white",
  128: "bg-[#EBD36B] text-[#412402]",
  256: "bg-[#E9C84F] text-[#412402]",
  512: "bg-[#E7BE35] text-white",
  1024: "bg-[#E0B422] text-white",
  2048: "bg-[#0F6E56] text-white",
};
const TILE_BIG = "bg-[#0b5a47] text-white";

function tileStyle(v: number): string {
  if (v >= 4096) return TILE_BIG;
  return TILE_STYLE[v] ?? TILE_BIG;
}

// 键盘映射（方向键 + WASD，方便低龄儿童与触屏均可）。
const KEY_DIR: Record<string, Dir> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  a: "left",
  d: "right",
  w: "up",
  s: "down",
};

// 空棋盘（确定性，避免 SSR/客户端随机不一致导致 hydration 不匹配）。
const EMPTY_BOARD: Board = Array.from({ length: 4 }, () => Array(4).fill(0));

export default function Game2048() {
  const { high, submit } = useHighScore("game2048");
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(high);
  const [status, setStatus] = useState<"playing" | "won" | "over">("playing");
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [combo, setCombo] = useState(0);
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const comboRef = useRef(0);
  const levelRef = useRef(0);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setBest(high);
  }, [high]);

  // 客户端挂载后再随机布置初始方块（Math.random 不能在初次渲染阶段调用）。
  useEffect(() => {
    const b = createInitial();
    setBoard(b);
    const lv = levelForMaxTile(maxTile(b));
    levelRef.current = lv;
    setLevel(lv);
  }, []);

  const showBanner = (text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  };

  const restart = () => {
    const b = createInitial();
    setBoard(b);
    setScore(0);
    setStatus("playing");
    setKeepPlaying(false);
    comboRef.current = 0;
    setCombo(0);
    const lv = levelForMaxTile(maxTile(b));
    levelRef.current = lv;
    setLevel(lv);
    setBanner(null);
  };

  const doMove = (dir: Dir) => {
    if (status === "over") return;
    const { board: nb, gained, moved } = move(board, dir);
    if (!moved) return;
    const withTile = spawnTile(nb);

    // 连击：连续合并的步数越多，得分倍率越高
    const newCombo = gained > 0 ? comboRef.current + 1 : 0;
    comboRef.current = newCombo;
    setCombo(newCombo);
    const mult = comboMult2048(newCombo);
    const newScore = score + Math.round(gained * mult);

    setScore(newScore);
    submit(newScore);
    setBoard(withTile);

    // 反馈
    if (gained > 0) {
      sfx.merge(maxTile(withTile));
      if (comboMult2048(newCombo) > comboMult2048(newCombo - 1)) sfx.combo(newCombo);
    }

    // 关卡递进
    const lv = levelForMaxTile(maxTile(withTile));
    if (lv > levelRef.current) {
      levelRef.current = lv;
      setLevel(lv);
      const tgt = TILE_LEVELS[lv - 1];
      if (lv >= TILE_LEVELS.length) {
        showBanner("🏆 拼出 2048！通关！");
        sfx.win();
      } else {
        showBanner(`🎯 解锁第 ${lv + 1} 关：拼出 ${TILE_LEVELS[lv]}`);
        sfx.levelup();
      }
    }

    if (!keepPlaying && hasWon(withTile)) {
      setStatus("won");
    } else if (!canMove(withTile)) {
      setStatus("over");
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dir = KEY_DIR[e.key];
      if (dir) {
        e.preventDefault();
        doMove(dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const target = nextTarget(maxTile(board));
  const flat = board.flat();

  return (
    <div className="flex flex-col items-center">
      {/* 计分板 */}
      <div className="mb-3 flex w-full max-w-sm items-center justify-between gap-3">
        <div className="flex-1 rounded-xl bg-[#E1F5EE] px-4 py-2 text-center">
          <div className="text-xs text-[#0F6E56]">得分</div>
          <div className="text-xl font-semibold text-[#04342C]">{score}</div>
        </div>
        <div className="flex-1 rounded-xl bg-[#FAEEDA] px-4 py-2 text-center">
          <div className="text-xs text-[#412402]">最高</div>
          <div className="text-xl font-semibold text-[#04342C]">{best}</div>
        </div>
        <button
          onClick={restart}
          className="inline-flex h-12 items-center gap-1.5 rounded-xl border border-[#EF9F27]/30 bg-white px-3 text-sm font-medium text-[#412402] hover:bg-[#FAC775]"
        >
          <RotateCcw className="h-4 w-4" />
          重开
        </button>
      </div>

      {/* 关卡 / 连击条 */}
      <div className="mb-2 flex w-full max-w-sm items-center justify-between rounded-xl bg-[#EEEDFE] px-4 py-1.5 text-sm text-[#7F77DD]">
        <span>
          关卡 {level}/{TILE_LEVELS.length}
          {target ? ` ｜ 目标拼出 ${target}` : " ｜ 🏆已通关"}
        </span>
        <span className="flex items-center gap-2">
          <span>连击 {combo}{comboMult2048(combo) > 1 ? ` ×${comboMult2048(combo).toFixed(1)}` : ""}</span>
          <SoundToggle />
        </span>
      </div>

      {/* 棋盘 */}
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0F6E56] p-3 shadow-md">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {flat.map((v, idx) => (
            <div
              key={idx}
              className={`flex aspect-square items-center justify-center rounded-lg text-2xl font-bold transition-colors sm:text-3xl ${tileStyle(
                v
              )}`}
            >
              {v > 0 ? (
                <span key={v} className="animate-pop">
                  {v}
                </span>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>

        {/* 通关 / 结束浮层 */}
        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 backdrop-blur-sm">
            <p className="text-2xl font-semibold text-[#04342C]">
              {status === "won" ? "🎉 拼出 2048！" : "游戏结束"}
            </p>
            <p className="text-sm text-[#5F5E5A]">本局得分 {score} · 最高 {best}</p>
            <div className="flex gap-2">
              {status === "won" && !keepPlaying && (
                <button
                  onClick={() => setKeepPlaying(true)}
                  className="rounded-full bg-[#EF9F27] px-4 py-2 text-sm font-medium text-white hover:bg-[#d98e1f]"
                >
                  继续挑战
                </button>
              )}
              <button
                onClick={restart}
                className="rounded-full bg-[#0F6E56] px-4 py-2 text-sm font-medium text-white hover:bg-[#085041]"
              >
                再来一局
              </button>
            </div>
          </div>
        )}

        {banner && <LevelBanner key={banner.key} text={banner.text} tone="#7F77DD" />}
      </div>

      {/* 触屏方向键（低龄儿童友好） */}
      <div className="mt-5 grid w-40 grid-cols-3 gap-1.5 select-none">
        <span />
        <button
          onClick={() => doMove("up")}
          className="rounded-lg bg-[#E1F5EE] py-3 text-lg text-[#0F6E56] active:bg-[#CDE9DF]"
          aria-label="上"
        >
          ↑
        </button>
        <span />
        <button
          onClick={() => doMove("left")}
          className="rounded-lg bg-[#E1F5EE] py-3 text-lg text-[#0F6E56] active:bg-[#CDE9DF]"
          aria-label="左"
        >
          ←
        </button>
        <button
          onClick={() => doMove("down")}
          className="rounded-lg bg-[#E1F5EE] py-3 text-lg text-[#0F6E56] active:bg-[#CDE9DF]"
          aria-label="下"
        >
          ↓
        </button>
        <button
          onClick={() => doMove("right")}
          className="rounded-lg bg-[#E1F5EE] py-3 text-lg text-[#0F6E56] active:bg-[#CDE9DF]"
          aria-label="右"
        >
          →
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-[#5F5E5A]">
        用方向键 / WASD，或点上面的方向键移动。相同数字碰到一起就会合并翻倍，连续合并还有连击加成！
      </p>
    </div>
  );
}
