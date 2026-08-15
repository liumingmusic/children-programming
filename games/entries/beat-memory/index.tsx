"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHighScore } from "@/games/hooks/useHighScore";

const PADS = [
  { freq: 329.63, color: "#7F77DD", glow: "#CECBF6" },
  { freq: 261.63, color: "#378ADD", glow: "#B5D4F4" },
  { freq: 392.0, color: "#0F6E56", glow: "#5DCAA5" },
  { freq: 440.0, color: "#EF9F27", glow: "#FAC775" },
];

type Phase = "idle" | "show" | "input" | "result";

export default function BeatMemory() {
  const { high, submit } = useHighScore("beat-memory");
  const [phase, setPhase] = useState<Phase>("idle");
  const [activePad, setActivePad] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [resultRounds, setResultRounds] = useState(0);

  const audioRef = useRef<AudioContext | null>(null);
  const seqRef = useRef<number[]>([]);
  const inputRef = useRef(0);
  const timeoutsRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const playTone = useCallback((freq: number) => {
    const ctx = audioRef.current;
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.36);
  }, []);

  const flashPad = useCallback(
    (i: number, dur: number) => {
      setActivePad(i);
      playTone(PADS[i].freq);
      timeoutsRef.current.push(
        window.setTimeout(() => setActivePad((p) => (p === i ? null : p)), dur)
      );
    },
    [playTone]
  );

  const playSequence = useCallback(
    (seq: number[]) => {
      setPhase("show");
      setActivePad(null);
      let i = 0;
      const step = () => {
        if (i >= seq.length) {
          inputRef.current = 0;
          setPhase("input");
          return;
        }
        flashPad(seq[i], 360);
        i += 1;
        timeoutsRef.current.push(window.setTimeout(step, 620));
      };
      timeoutsRef.current.push(window.setTimeout(step, 550));
    },
    [flashPad]
  );

  const start = useCallback(() => {
    clearTimers();
    if (!audioRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AC) audioRef.current = new AC();
    }
    audioRef.current?.resume().catch(() => {});
    const first = [Math.floor(Math.random() * PADS.length)];
    seqRef.current = first;
    setRound(1);
    setResultRounds(0);
    playSequence(first);
  }, [clearTimers, playSequence]);

  const onPad = useCallback(
    (i: number) => {
      if (phase !== "input") return;
      flashPad(i, 240);
      const seq = seqRef.current;
      const pos = inputRef.current;
      if (seq[pos] !== i) {
        // 错：结束
        setResultRounds(seq.length - 1);
        submit(seq.length - 1);
        setPhase("result");
        return;
      }
      const next = pos + 1;
      if (next === seq.length) {
        // 本串完成，加长再来
        const longer = [...seq, Math.floor(Math.random() * PADS.length)];
        seqRef.current = longer;
        setRound((r) => r + 1);
        timeoutsRef.current.push(window.setTimeout(() => playSequence(longer), 700));
      } else {
        inputRef.current = next;
      }
    },
    [phase, flashPad, submit, playSequence]
  );

  const best = Math.max(high, resultRounds);

  if (phase === "idle" || phase === "result") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-5xl">🎵🧠</div>
        <p className="max-w-sm text-[#5F5E5A]">
          记住星星亮起和声音的<span className="font-medium text-[#0F6E56]">顺序</span>，
          再照样点出来。每过一关就多一颗，看你能记多长！
        </p>
        {phase === "result" && (
          <p className="text-sm text-[#5F5E5A]">
            本轮记住了 <span className="font-medium text-[#04342C]">{resultRounds}</span> 串 ｜ 历史最好 {best} 串
          </p>
        )}
        <button
          onClick={start}
          className="rounded-full bg-[#0F6E56] px-8 py-3 text-lg font-medium text-white shadow-sm hover:bg-[#085041]"
        >
          {phase === "idle" ? "开始挑战" : "再来一次"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-full max-w-md rounded-xl bg-[#E1F5EE] px-4 py-2 text-center text-sm text-[#0F6E56]">
        {phase === "show" ? "看好顺序…" : `第 ${round} 关 · 照着点出来`}
      </div>
      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {PADS.map((p, i) => (
          <button
            key={i}
            onClick={() => onPad(i)}
            disabled={phase !== "input"}
            className="aspect-square rounded-2xl border-2 transition-all"
            style={{
              background: activePad === i ? p.glow : "#F1EFE8",
              borderColor: p.color,
              transform: activePad === i ? "scale(0.94)" : "scale(1)",
              boxShadow: activePad === i ? `0 0 18px ${p.glow}` : "none",
            }}
            aria-label={`音符 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
