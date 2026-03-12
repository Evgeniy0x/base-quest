"use client";

// Верхний хедер приложения — логотип, XP, стрик

interface HeaderProps {
  xp: number;
  streak: number;
}

export default function Header({ xp, streak }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-5 py-4 sticky top-0 glass-strong z-50 border-b border-base-border">
      {/* Логотип */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-blue flex items-center justify-center text-white text-base font-black">
          B
        </div>
        <span className="text-white text-lg font-extrabold">Base Quest</span>
      </div>

      {/* XP и стрик */}
      <div className="flex items-center gap-3">
        <span className="text-base-blue text-sm font-bold bg-base-blue/10 px-2.5 py-1 rounded-lg">
          ⚡ {xp} XP
        </span>
        <span className="text-amber-400 text-sm font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg">
          🔥 {streak}
        </span>
      </div>
    </header>
  );
}
