"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PIANO_KEYS,
  WHITE_KEYS,
  BLACK_KEYS,
  blackKeyFraction,
  type PianoKey,
} from "./logic";

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

export default function StarPiano() {
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
      ensureAudio();
      playFreq(k.freq);
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
    [ensureAudio, playFreq, recording]
  );

  const release = useCallback((note: string) => {
    setPressed((prev) => {
      if (!prev.has(note)) return prev;
      const n = new Set(prev);
      n.delete(note);
      return n;
    });
  }, []);

  // 键盘演奏
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const k = KEY_TO_NOTE[e.key.toLowerCase()];
      if (k) {
        e.preventDefault();
        press(k);
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
  }, [press, release]);

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
        timers.push(
          window.setTimeout(() => playFreq(ev.freq), ev.t)
        );
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

  return (
    <div className="flex flex-col items-center gap-5 py-6">
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

      {/* 钢琴键盘（撑满内容宽度，上限由 GameShell 的 max-w-3xl 控制） */}
      <div
        className="relative w-full select-none"
        style={{ height: 220, touchAction: "none" }}
      >
        {/* 白键 */}
        <div className="flex h-full w-full gap-1">
          {WHITE_KEYS.map((k) => {
            const on = pressed.has(k.note);
            return (
              <button
                key={k.note}
                onPointerDown={(e) => {
                  e.preventDefault();
                  press(k);
                }}
                onPointerUp={() => release(k.note)}
                onPointerLeave={() => release(k.note)}
                className={`flex flex-1 flex-col justify-end rounded-b-lg border border-black/10 pb-2 text-center text-xs font-medium transition-colors ${
                  on ? "bg-[#9FE3CC]" : "bg-white"
                }`}
              >
                <span className="text-[#0F6E56]">{k.key.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
        {/* 黑键 */}
        {BLACK_KEYS.map((k) => {
          const on = pressed.has(k.note);
          const leftPct = blackKeyFraction(k.note) * 100;
          const wPct = (100 / WHITE_KEYS.length) * 0.62;
          return (
            <button
              key={k.note}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                press(k);
              }}
              onPointerUp={() => release(k.note)}
              onPointerLeave={() => release(k.note)}
              className={`absolute top-0 z-10 flex h-[62%] flex-col justify-end rounded-b-md pb-1 text-center text-[10px] font-medium text-white/90 transition-colors ${
                on ? "bg-[#3a8f78]" : "bg-[#04342C]"
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

      {/* 已保存的小曲 */}
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
    </div>
  );
}
