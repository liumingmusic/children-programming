"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PIANO_KEYS,
  WHITE_KEYS,
  BLACK_KEYS,
  blackKeyFraction,
  MAX_LEVELS,
  comboMult,
  levelTargetFor,
  challengePool,
  pickTarget,
  type PianoKey,
} from "./logic";
import { useHighScore } from "@/games/hooks/useHighScore";
import {
  sfx,
  useBurst,
  useMuted,
  type Burst,
} from "@/games/hooks/useGameJuice";
import LevelBanner from "@/games/components/LevelBanner";
import SoundToggle from "@/games/components/SoundToggle";

interface NoteEvent {
  freq: number;
  t: number; // ms，相对录音起点
}
interface SavedSong {
  id: string;
  name: string;
  events: NoteEvent[];
}

const SONGS_KEY = "gp:songs";

function loadSongs(): SavedSong[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(SONGS_KEY);
    return raw ? (JSON.parse(raw) as SavedSong[]) : [];
  } catch {
    return [];
  }
}

const KEY_TO_NOTE: Record<string, PianoKey> = Object.fromEntries(
  PIANO_KEYS.map((k) => [k.key, k])
);

type Mode = "play" | "challenge";

export default function StarPiano() {
  const [mode, setMode] = useState<Mode>("play");
  const { bursts, pop } = useBurst();
  const [muted, toggleMute] = useMuted();

  // ---------------- 自由弹奏（录音） ----------------
  const audioRef = useRef<AudioContext | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [songs, setSongs] = useState<SavedSong[]>([]);
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);

  const recEventsRef = useRef<NoteEvent[]>([]);
  const recStartRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    setSongs(loadSongs());
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const ensureAudio = useCallback((): AudioContext | null => {
    if (audioRef.current) {
      void audioRef.current.resume();
      return audioRef.current;
    }
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      void ctx.resume();
      audioRef.current = ctx;
      return ctx;
    } catch {
      return null;
    }
  }, []);

  const playFreq = useCallback(
    (freq: number, when = 0) => {
      const ctx = ensureAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + when;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.28, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.75);
    },
    [ensureAudio]
  );

  const press = useCallback(
    (k: PianoKey) => {
      if (!muted) {
        ensureAudio();
        playFreq(k.freq);
      }
      setPressed((prev) => {
        const n = new Set(prev);
        n.add(k.note);
        return n;
      });
      if (recording) {
        recEventsRef.current.push({
          freq: k.freq,
          t: performance.now() - recStartRef.current,
        });
      }
    },
    [muted, ensureAudio, playFreq, recording]
  );

  const release = useCallback((note: string) => {
    setPressed((prev) => {
      if (!prev.has(note)) return prev;
      const n = new Set(prev);
      n.delete(note);
      return n;
    });
  }, []);

  const toggleRecord = useCallback(() => {
    if (recording) {
      setRecording(false);
      const events = recEventsRef.current;
      if (events.length > 0) {
        const song: SavedSong = {
          id: String(Date.now()),
          name: `🌟 小曲 ${songs.length + 1}`,
          events,
        };
        const next = [song, ...songs].slice(0, 6);
        setSongs(next);
        try {
          window.localStorage.setItem(SONGS_KEY, JSON.stringify(next));
        } catch {
          /* 忽略 */
        }
      }
    } else {
      recEventsRef.current = [];
      recStartRef.current = performance.now();
      setRecording(true);
    }
  }, [recording, songs]);

  const playSong = useCallback(
    (song: SavedSong) => {
      if (playing) return;
      ensureAudio();
      setPlaying(true);
      const timers: number[] = [];
      const last = song.events[song.events.length - 1]?.t ?? 0;
      for (const ev of song.events) {
        timers.push(window.setTimeout(() => playFreq(ev.freq), ev.t));
      }
      timers.push(
        window.setTimeout(() => {
          setPlaying(false);
          timersRef.current = [];
        }, last + 800)
      );
      timersRef.current = timers;
    },
    [ensureAudio, playFreq, playing]
  );

  const deleteSong = useCallback(
    (id: string) => {
      const next = songs.filter((s) => s.id !== id);
      setSongs(next);
      try {
        window.localStorage.setItem(SONGS_KEY, JSON.stringify(next));
      } catch {
        /* 忽略 */
      }
    },
    [songs]
  );

  // ---------------- 星星挑战（关卡 + 连击） ----------------
  const { high: chHigh, submit: chSubmit } = useHighScore("star-piano-challenge");
  const [cPhase, setCPhase] = useState<"idle" | "playing" | "result">("idle");
  const [cLevel, setCLevel] = useState(1);
  const [cProgress, setCProgress] = useState(0);
  const [cCombo, setCCombo] = useState(0);
  const [cComboBest, setCComboBest] = useState(0);
  const [cScore, setCScore] = useState(0);
  const [cTarget, setCTarget] = useState<PianoKey | null>(null);
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1400);
  }, []);

  useEffect(() => {
    return () => {
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const startChallenge = useCallback(() => {
    setCLevel(1);
    setCProgress(0);
    setCCombo(0);
    setCComboBest(0);
    setCScore(0);
    setCTarget(pickTarget(challengePool(1)));
    setCPhase("playing");
  }, []);

  const handleChallengeKey = useCallback(
    (k: PianoKey) => {
      if (mode !== "challenge" || cPhase !== "playing" || !cTarget) return;
      if (!muted) {
        ensureAudio();
        playFreq(k.freq);
      }
      if (k.note === cTarget.note) {
        const nc = cCombo + 1;
        setCCombo(nc);
        setCComboBest((best) => Math.max(best, nc));
        const gain = Math.round(10 * comboMult(nc));
        setCScore((s) => s + gain);
        const np = cProgress + 1;
        setCProgress(np);
        if (!muted) {
          if (nc >= 3) sfx.combo(nc);
          else sfx.catch();
        }
        pop(6);
        const target = levelTargetFor(cLevel);
        if (np >= target) {
          if (cLevel < MAX_LEVELS) {
            const nl = cLevel + 1;
            setCLevel(nl);
            setCProgress(0);
            setCCombo(0);
            setCTarget(pickTarget(challengePool(nl)));
            if (!muted) sfx.levelup();
            showBanner(`第 ${cLevel} 关完成！进入第 ${nl} 关`);
          } else {
            if (!muted) sfx.win();
            pop(10);
            chSubmit(cScore + gain);
            setCPhase("result");
          }
        } else {
          const pool = challengePool(cLevel);
          let nt = pickTarget(pool);
          let g = 0;
          while (pool.length > 1 && nt.note === cTarget.note && g++ < 8) {
            nt = pickTarget(pool);
          }
          setCTarget(nt);
        }
      } else {
        setCCombo(0);
        if (!muted) sfx.miss();
      }
    },
    [mode, cPhase, cTarget, muted, ensureAudio, playFreq, cCombo, cProgress, cLevel, pop, showBanner, chSubmit, cScore]
  );

  const handleKey = useCallback(
    (k: PianoKey) => {
      if (mode === "challenge") handleChallengeKey(k);
      else press(k);
    },
    [mode, handleChallengeKey, press]
  );

  // 键盘演奏（handleKey 在声明后绑定，避免 TDZ）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const k = KEY_TO_NOTE[e.key.toLowerCase()];
      if (k) {
        e.preventDefault();
        handleKey(k);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = KEY_TO_NOTE[e.key.toLowerCase()];
      if (k) release(k.note);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [handleKey, release]);

  const chBest = Math.max(chHigh, cScore);

  // ---------------- 键盘渲染 ----------------
  const renderKeyboard = () => (
    <div className="relative w-full select-none" style={{ height: 220, touchAction: "none" }}>
      <div className="flex h-full w-full gap-1">
        {WHITE_KEYS.map((k) => {
          const on = pressed.has(k.note);
          const isTarget =
            mode === "challenge" && cPhase === "playing" && cTarget?.note === k.note;
          return (
            <button
              key={k.note}
              onPointerDown={(e) => {
                e.preventDefault();
                handleKey(k);
              }}
              onPointerUp={() => release(k.note)}
              onPointerLeave={() => release(k.note)}
              className={`flex flex-1 flex-col justify-end rounded-b-lg border border-black/10 pb-2 text-center text-xs font-medium transition-colors ${
                isTarget
                  ? "bg-[#FDE9C8] ring-4 ring-[#EF9F27]"
                  : on
                    ? "bg-[#9FE3CC]"
                    : "bg-white"
              }`}
            >
              <span className="text-[#0F6E56]">{k.key.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
      {BLACK_KEYS.map((k) => {
        const on = pressed.has(k.note);
        const isTarget =
          mode === "challenge" && cPhase === "playing" && cTarget?.note === k.note;
        const leftPct = blackKeyFraction(k.note) * 100;
        const wPct = (100 / WHITE_KEYS.length) * 0.62;
        return (
          <button
            key={k.note}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleKey(k);
            }}
            onPointerUp={() => release(k.note)}
            onPointerLeave={() => release(k.note)}
            className={`absolute top-0 z-10 flex h-[62%] flex-col justify-end rounded-b-md pb-1 text-center text-[10px] font-medium text-white/90 transition-colors ${
              isTarget
                ? "bg-[#F2B85C] ring-4 ring-[#EF9F27]"
                : on
                  ? "bg-[#3a8f78]"
                  : "bg-[#04342C]"
            }`}
            style={{
              left: `${leftPct}%`,
              width: `${wPct}%`,
              transform: "translateX(-50%)",
            }}
          >
            {k.key.toUpperCase()}
          </button>
        );
      })}
    </div>
  );

  // ---------------- 模式切换 ----------------
  const ModeSwitch = (
    <div className="mb-5 flex w-full max-w-md gap-2">
      <button
        onClick={() => setMode("play")}
        className={`flex-1 rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
          mode === "play"
            ? "bg-[#7F77DD] text-white hover:bg-[#6a61cf]"
            : "bg-white text-[#5F5E5A] hover:bg-[#f3f2fd]"
        }`}
      >
        🎹 自由弹
      </button>
      <button
        onClick={() => setMode("challenge")}
        className={`flex-1 rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
          mode === "challenge"
            ? "bg-[#EF9F27] text-white hover:bg-[#d98c12]"
            : "bg-white text-[#5F5E5A] hover:bg-[#fdf0db]"
        }`}
      >
        🌟 星星挑战
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      {ModeSwitch}
      <SoundToggle />

      {mode === "play" ? (
        <>
          <p className="max-w-md text-center text-[#5F5E5A]">
            点琴键或按键盘 <span className="font-mono">A S D F G H J K</span>（黑键
            <span className="font-mono"> W E T Y U</span>）弹奏，录下你的小曲随时回放！
          </p>

          <div className="flex w-full max-w-md gap-3">
            <button
              onClick={toggleRecord}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-sm ${
                recording
                  ? "bg-[#E0533D] hover:bg-[#c8452f]"
                  : "bg-[#7F77DD] hover:bg-[#6a61cf]"
              }`}
            >
              {recording ? "■ 停止并保存" : "● 录制"}
            </button>
            {recording && (
              <span className="flex items-center text-sm text-[#E0533D]">
                录制中… {recEventsRef.current.length}
              </span>
            )}
          </div>

          {renderKeyboard()}

          <div className="w-full max-w-md">
            <div className="mb-2 text-sm font-medium text-[#04342C]">
              我的小曲 {songs.length > 0 && `（${songs.length}）`}
            </div>
            {songs.length === 0 ? (
              <p className="rounded-xl bg-white p-4 text-center text-sm text-[#5F5E5A] shadow-sm">
                还没有录音，点「录制」弹一段保存吧～
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {songs.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
                  >
                    <span className="truncate text-sm text-[#04342C]">{s.name}</span>
                    <span className="flex items-center gap-2">
                      <button
                        onClick={() => playSong(s)}
                        disabled={playing}
                        className="rounded-full bg-[#0F6E56] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                      >
                        ▶ 播放
                      </button>
                      <button
                        onClick={() => deleteSong(s.id)}
                        className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-[#5F5E5A] hover:bg-black/10"
                      >
                        删除
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        // 星星挑战
        <div className="flex w-full flex-col items-center">
          {cPhase === "idle" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="text-5xl">🌟🎯</div>
              <p className="max-w-sm text-[#5F5E5A]">
                跟着星星提示，弹出<span className="font-medium text-[#EF9F27]">指定音名</span>！
                连续弹对积累<span className="font-medium text-[#B7791F]">连击加分</span>，共 {MAX_LEVELS} 关，
                越往后音越多、还加入黑键，挑战你的反应力！
              </p>
              <button
                onClick={startChallenge}
                className="rounded-full bg-[#EF9F27] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#d98c12]"
              >
                开始挑战
              </button>
              {chHigh > 0 && <p className="text-sm text-[#5F5E5A]">历史最高分：{chHigh}</p>}
            </div>
          )}

          {cPhase === "playing" && cTarget && (
            <>
              <div className="relative mb-3 w-full max-w-md">
                <div className="flex items-center justify-between rounded-xl bg-[#FDF0DB] px-4 py-2 text-sm text-[#B7791F]">
                  <span>第 {cLevel}/{MAX_LEVELS} 关</span>
                  <span>进度 {cProgress}/{levelTargetFor(cLevel)}</span>
                  <span>分数 {cScore}</span>
                </div>
              </div>

              <div className="mb-3 text-center">
                <div className="text-lg text-[#5F5E5A]">🌟 弹出这个音：</div>
                <div className="text-3xl font-extrabold text-[#EF9F27]">
                  {cTarget.note}
                  {cTarget.key && (
                    <span className="ml-1 text-base font-medium text-[#5F5E5A]">
                      （按 {cTarget.key.toUpperCase()}）
                    </span>
                  )}
                </div>
                <div
                  className={`mt-1 text-sm ${
                    cCombo > 1 ? "font-semibold text-[#B7791F]" : "text-[#5F5E5A]"
                  }`}
                >
                  {cCombo > 1 ? `连击 ×${cCombo}` : "连击 —"}
                </div>
              </div>

              <div className="relative w-full max-w-md">
                {renderKeyboard()}

                {bursts.map((b: Burst) => (
                  <span
                    key={b.id}
                    className="pointer-events-none absolute animate-float text-2xl"
                    style={{ left: `calc(50% + ${b.dx}px)`, top: `calc(50% + ${b.dy}px)` }}
                  >
                    {b.emoji}
                  </span>
                ))}

                {banner && <LevelBanner key={banner.key} text={banner.text} tone="#EF9F27" />}
              </div>
            </>
          )}

          {cPhase === "result" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="text-4xl">🏆 全部 {MAX_LEVELS} 关通关！</div>
              <div className="grid w-full max-w-xs grid-cols-2 gap-3">
                <Stat label="本次得分" value={cScore} />
                <Stat label="历史最高" value={chBest} />
                <Stat label="到达关卡" value={`第 ${MAX_LEVELS} 关`} />
                <Stat label="最高连击" value={cComboBest} />
              </div>
              <button
                onClick={startChallenge}
                className="mt-2 rounded-full bg-[#EF9F27] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#d98c12]"
              >
                再玩一次
              </button>
            </div>
          )}
        </div>
      )}
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
