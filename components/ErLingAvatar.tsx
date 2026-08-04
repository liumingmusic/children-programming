export default function ErLingAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm ${className}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full p-1.5">
        {/* 绿色翅羽（与 logo 同款小太阳鹦鹉） */}
        <ellipse cx="16" cy="42" rx="6.5" ry="12" fill="#22C55E" transform="rotate(-22 16 42)" />
        <ellipse cx="84" cy="42" rx="6.5" ry="12" fill="#22C55E" transform="rotate(22 84 42)" />
        {/* 头部/脸（琥珀橙，与 logo 同色） */}
        <circle cx="50" cy="48" r="30" fill="#F59E0B" />
        {/* 浅金胸腹 */}
        <ellipse cx="50" cy="56" rx="20" ry="17" fill="#FBBF24" />
        {/* 头顶羽冠（橙，与 logo 同款） */}
        <path d="M40 22 L37 9 L45 19 L50 7 L55 19 L63 9 L60 22 Z" fill="#FB923C" />
        {/* 橙色脸颊 */}
        <circle cx="35" cy="51" r="6" fill="#F97316" />
        <circle cx="65" cy="51" r="6" fill="#F97316" />
        {/* 白色眼圈 */}
        <circle cx="39" cy="42" r="7.5" fill="#FFFFFF" />
        <circle cx="61" cy="42" r="7.5" fill="#FFFFFF" />
        {/* 眼睛 */}
        <circle cx="39" cy="42" r="3.8" fill="#1F2937" />
        <circle cx="61" cy="42" r="3.8" fill="#1F2937" />
        <circle cx="40.6" cy="40.4" r="1.4" fill="#FFFFFF" />
        <circle cx="62.6" cy="40.4" r="1.4" fill="#FFFFFF" />
        {/* 钩状喙（与 logo 同款） */}
        <path d="M41 50 Q50 46 59 50 Q57 58 50 61 Q43 58 41 50 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1.2" />
        <path d="M46 59 Q50 63 54 59 Q52 62 50 63 Q48 62 46 59 Z" fill="#B45309" />
        {/* 微笑 */}
        <path d="M43 65 Q50 70 57 65" fill="none" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}
