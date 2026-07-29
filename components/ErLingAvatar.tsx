export default function ErLingAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm ${className}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full p-2">
        <circle cx="50" cy="45" r="32" fill="#F5C4B3" />
        <circle cx="38" cy="40" r="4" fill="#1a1a2e" />
        <circle cx="62" cy="40" r="4" fill="#1a1a2e" />
        <path
          d="M38 58 Q50 68 62 58"
          fill="none"
          stroke="#D85A30"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M22 30 Q30 10 42 22"
          fill="none"
          stroke="#D85A30"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M78 30 Q70 10 58 22"
          fill="none"
          stroke="#D85A30"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
