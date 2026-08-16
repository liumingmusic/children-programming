"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";
import { useGameLoop } from "@/games/hooks/useGameLoop";
import {
  generateNotes,
  judge,
  lastNoteTime,
  levelConfig,
  MAX_LEVEL,
  scoreFor,
  type BeatNote,
} from "./logic";
import { sfx, playTone, useMuted } from "@/games/hooks/useGameJuice";
import LevelBanner from "@/games/components/LevelBanner";
import SoundToggle from "@/games/components/SoundToggle";

const LANES = 4;
const LANE_KEYS = ["D", "F", "J", "K"];
const KEY_LANE: Record<string, number> = { d: 0, f: 1, j: 2, k: 3 };
const LEAD = 2.2; // 音符提前出现的秒数
const MISS_GRACE = 0.2;

type NoteState = BeatNote & { judged: boolean; sounded: boolean };
type Phase = "idle" | "playing" | "result";

interface Stats {
  score: number;
  combo: number;
  maxCombo: number;
  perfect: number;
  good: number;
  miss: number;
}
interface Popup {
  id: number;
  lane: number;
  text: string;
  tone: string;
}

export default function BeatTap() {
  const { high, submit } = useHighScore("beat-tap");
  const [phase, setPhase] = useState<Phase>("idle");
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<Stats | null>(null);
  const [level, setLevel] = useState(1);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  const notesRef = useRef<NoteState[]>([]);
  const startRef = useRef(0);
  const statsRef = useRef<Stats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfect: 0,
    good: 0,
    miss: 0,
  });
  const levelRef = useRef(1);
  const popupId = useRef(0);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  }, []);

  const pushPopup = useCallback((lane: number, text: string, tone: string) => {
    const id = ++popupId.current;
    setPopups((p) => [...p, { id, lane, text, tone }]);
    setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 800);
  }, []);

  const finish = useCallback(() => {
    const s = statsRef.current;
    if (levelRef.current < MAX_LEVEL) {
      levelRef.current += 1;
      setLevel(levelRef.current);
      const cfg = levelConfig(levelRef.current);
      notesRef.current = generateNotes({
        bpm: cfg.bpm,
        count: cfg.count,
        start: LEAD,
        lanes: LANES,
      }).map((n) => ({ ...n, judged: false, sounded: false }));
      startRef.current = performance.now() / 1000;
      setNow(0);
      showBanner(`第 ${levelRef.current} 关`);
      sfx.levelup();
    } else {
      setResult({ ...s });
      submit(s.score);
      setPhase("result");
      sfx.win();
    }
  }, [submit, showBanner]);

  const start = useCallback(() => {
    levelRef.current = 1;
    setLevel(1);
    const cfg = levelConfig(1);
    notesRef.current = generateNotes({
      bpm: cfg.bpm,
      count: cfg.count,
      start: LEAD,
      lanes: LANES,
    }).map((n) => ({ ...n, judged: false, sounded: false }));
    statsRef.current = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      perfect: 0,
      good: 0,
      miss: 0,
    };
    startRef.current = performance.now() / 1000;
    setNow(0);
    setResult(null);
    setPopups([]);
    setBanner(null);
    setPhase("playing");
  }, []);

  // 主循环：推进时间、背景节拍音、漏判、结束判定
  useGameLoop(() => {
    const t = performance.now() / 1000 - startRef.current;
    setNow(t);
    const notes = notesRef.current;
    const stats = statsRef.current;
    for (const n of notes) {
      if (!n.sounded && t >= n.time) {
        n.sounded = true;
        playTone(440, 0.05, "triangle", 0.07); // 背景节拍轻击
      }
      if (!n.judged && t > n.time + MISS_GRACE) {
        n.judged = true;
        stats.miss += 1;
        stats.combo = 0;
        pushPopup(n.lane, "MISS", "#D85A30");
      }
    }
    if (t > lastNoteTime(notes) + 1.5) finish();
  }, phase === "playing");

  const hit = useCallback(
    (lane: number) => {
      if (phase !== "playing") return;
      const t = performance.now() / 1000 - startRef.current;
      const stats = statsRef.current;
      let best: NoteState | null = null;
      let bestDelta = Infinity;
      for (const n of notesRef.current) {
        if (n.lane !== lane || n.judged) continue;
        const delta = t - n.time;
        if (Math.abs(delta) <= 0.2 && Math.abs(delta) < bestDelta) {
          best = n;
          bestDelta = Math.abs(delta);
        }
      }
      if (!best) return; // 空敲不罚分（儿童友好）
      best.judged = true;
      const j = judge(bestDelta)!;
      if (j === "perfect") {
        stats.perfect += 1;
        sfx.catch();
        pushPopup(lane, "PERFECT!", "#0F6E56");
      } else {
        stats.good += 1;
        playTone(660, 0.1, "sine", 0.16);
        pushPopup(lane, "GOOD", "#EF9F27");
      }
      stats.combo += 1;
      stats.maxCombo = Math.max(stats.maxCombo, stats.combo);
      stats.score += scoreFor(j, stats.combo);
    },
    [phase, pushPopup]
  );

  // 键盘：D F J K 对应四条轨道
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in KEY_LANE) {
        e.preventDefault();
        hit(KEY_LANE[k]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hit]);

  const best = result ? Math.max(high, result.score) : high;

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🎵🪐</div>
        <p className="max-w-sm text-[#5F5E5A]">
          音符会从上方落下来，在它碰到<span className="font-medium text-[#7F77DD]">虚线</span>的瞬间，
          敲对应的键 <span className="font-mono font-medium">D F J K</span>，或者直接点对应的轨道！越准分越高。
        </p>
        <p className="text-sm text-[#5F5E5A]">
          共 {MAX_LEVEL} 关，每关节奏更快、谱面更长，连续命中还有连击加成！
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={start}
            className="rounded-full bg-[#7F77DD] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#6a61cf]"
          >
            开始游戏
          </button>
          <SoundToggle />
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    const total = result.perfect + result.good + result.miss;
    const acc = total > 0 ? Math.round(((result.perfect + result.good) / total) * 100) : 0;
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="text-4xl">🌟 全部通关！</div>
        <div className="grid w-full max-w-sm grid-cols-2 gap-3">
          <Stat label="总得分" value={result.score} />
          <Stat label="最高分" value={best} />
          <Stat label="最大连击" value={result.maxCombo} />
          <Stat label="准确率" value={`${acc}%`} />
          <Stat label="完美" value={result.perfect} />
          <Stat label="良好" value={result.good} />
          <Stat label="错过" value={result.miss} />
          <Stat label="总音符" value={total} />
        </div>
        <button
          onClick={start}
          className="mt-2 rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          再来一次
        </button>
      </div>
    );
  }

  // playing
  const stats = statsRef.current;
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex w-full max-w-md items-center justify-between">
        <div className="rounded-xl bg-[#E1F5EE] px-4 py-1.5 text-center">
          <div className="text-xs text-[#0F6E56]">得分</div>
          <div className="text-lg font-semibold text-[#04342C]">{stats.score}</div>
        </div>
        <div className="rounded-xl bg-[#EEEDFE] px-4 py-1.5 text-center">
          <div className="text-xs text-[#7F77DD]">连击</div>
          <div className="text-lg font-semibold text-[#04342C]">{stats.combo}</div>
        </div>
        <div className="rounded-xl bg-[#FAEEDA] px-4 py-1.5 text-center">
          <div className="text-xs text-[#412402]">关卡</div>
          <div className="text-lg font-semibold text-[#04342C]">
            {level}/{MAX_LEVEL}
          </div>
        </div>
        <SoundToggle />
      </div>

      {/* 轨道 */}
      <div className="flex w-full max-w-md gap-2" style={{ height: 420 }}>
        {Array.from({ length: LANES }).map((_, lane) => (
          <div
            key={lane}
            onClick={() => hit(lane)}
            className="relative flex-1 cursor-pointer overflow-hidden rounded-xl bg-[#EEEDFE] active:bg-[#E0DEFB]"
          >
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-[#7F77DD]"
              style={{ top: `${0.82 * 100}%` }}
            />
            <div className="absolute bottom-1 left-0 right-0 text-center text-xs font-medium text-[#7F77DD]">
              {LANE_KEYS[lane]}
            </div>
            {/* 判定浮字 */}
            {popups
              .filter((p) => p.lane === lane)
              .map((p) => (
                <div
                  key={p.id}
                  className="animate-float pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm font-bold"
                  style={{ top: "70%", color: p.tone }}
                >
                  {p.text}
                </div>
              ))}
            {/* 下落音符 */}
            {notesRef.current
              .filter(
                (n) =>
                  n.lane === lane &&
                  !n.judged &&
                  1 - (n.time - now) / LEAD > -0.05
              )
              .map((n) => {
                const progress = 1 - (n.time - now) / LEAD;
                return (
                  <div
                    key={n.id}
                    className="absolute left-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7F77DD] shadow-md"
                    style={{ top: `${progress * 0.82 * 100}%` }}
                  />
                );
              })}
          </div>
        ))}
      </div>

      {banner && <LevelBanner text={banner.text} tone="#7F77DD" />}

      <p className="mt-4 text-center text-sm text-[#5F5E5A]">
        用 <span className="font-mono font-medium">D F J K</span> 或点轨道，在虚线处命中下落的圆点！
      </p>
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
