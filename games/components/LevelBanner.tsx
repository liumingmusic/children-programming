"use client";

/**
 * 关卡横幅：过关时短暂弹出的「第 N 关」提示。
 * 父组件用变化的 key 重挂本来重新触发动画，并在约 1.4s 后卸载。
 */
export default function LevelBanner({
  text,
  tone = "#0F6E56",
}: {
  text: string;
  tone?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div
        className="animate-banner rounded-2xl bg-white/95 px-6 py-3 text-center text-2xl font-extrabold shadow-xl"
        style={{ color: tone }}
      >
        {text}
      </div>
    </div>
  );
}
