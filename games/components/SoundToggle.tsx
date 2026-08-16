"use client";

import { useMuted } from "@/games/hooks/useGameJuice";

/** 声音开关：跨游戏共享静音状态，整局会话生效。 */
export default function SoundToggle({ className = "" }: { className?: string }) {
  const [muted, toggle] = useMuted();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "开启声音" : "关闭声音"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-lg leading-none hover:bg-white ${className}`}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
