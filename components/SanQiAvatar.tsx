export default function SanQiAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-slate-400 shadow-sm ${className}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full p-1.5">
        {/* 长尾（灰蓝，玄凤标志之一） */}
        <path d="M50 70 L44 92 L50 84 L56 92 Z" fill="#64748B" />
        {/* 头部/脸（灰蓝，区别于二零的琥珀橙） */}
        <circle cx="50" cy="48" r="30" fill="#64748B" />
        {/* 浅灰胸腹 */}
        <ellipse cx="50" cy="56" rx="19" ry="16" fill="#CBD5E1" />
        {/* 头顶尖冠（奶黄，向后上方翘） */}
        <path d="M44 24 Q50 8 56 24 Q52 20 50 16 Q48 20 44 24 Z" fill="#FBBF24" />
        {/* 橙色脸颊点（玄凤标志） */}
        <circle cx="35" cy="52" r="5.5" fill="#F97316" />
        <circle cx="65" cy="52" r="5.5" fill="#F97316" />
        {/* 白色眼圈 */}
        <circle cx="39" cy="43" r="7" fill="#FFFFFF" />
        <circle cx="61" cy="43" r="7" fill="#FFFFFF" />
        {/* 眼睛 */}
        <circle cx="39" cy="43" r="3.6" fill="#1F2937" />
        <circle cx="61" cy="43" r="3.6" fill="#1F2937" />
        <circle cx="40.4" cy="41.6" r="1.3" fill="#FFFFFF" />
        <circle cx="62.4" cy="41.6" r="1.3" fill="#FFFFFF" />
        {/* 小喙（灰色，勾状较柔和） */}
        <path d="M44 51 Q50 49 56 51 Q54 57 50 59 Q46 57 44 51 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
        {/* 微笑 */}
        <path d="M44 64 Q50 68 56 64" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
