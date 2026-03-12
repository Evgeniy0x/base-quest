"use client";

import { useEffect, useState } from "react";
import { Quest } from "@/lib/quests-data";

interface QuestCompleteProps {
  quest: Quest;
  correctCount: number;
  onContinue: () => void;
  onShare: () => void;
}

export default function QuestComplete({
  quest,
  correctCount,
  onContinue,
  onShare,
}: QuestCompleteProps) {
  const [showGlow, setShowGlow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowGlow(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-5 py-16 text-center min-h-screen flex flex-col items-center justify-center animate-in">
      {/* Свечение фона */}
      {showGlow && (
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,82,255,0.15)_0%,transparent_70%)] z-10" />
      )}

      {/* Иконка */}
      <div className="w-24 h-24 rounded-[28px] bg-gradient-success flex items-center justify-center text-5xl mb-6 shadow-[0_8px_32px_rgba(16,185,129,0.4)] relative z-20">
        🎉
      </div>

      <h2 className="text-white text-[28px] font-extrabold mb-2 relative z-20">
        Quest Complete!
      </h2>
      <p className="text-gray-500 text-[15px] mb-8 relative z-20">
        {quest.title}
      </p>

      {/* Статистика */}
      <div className="flex gap-6 mb-10 relative z-20">
        <div className="text-center">
          <p className="text-base-blue text-[32px] font-extrabold">
            +{quest.xp}
          </p>
          <p className="text-gray-500 text-[13px]">XP Earned</p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="text-emerald-400 text-[32px] font-extrabold">
            {correctCount}
          </p>
          <p className="text-gray-500 text-[13px]">Correct</p>
        </div>
      </div>

      {/* Кнопки */}
      <button
        onClick={onShare}
        className="w-full bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-[14px] py-3.5 text-[15px] font-bold cursor-pointer mb-3 relative z-20"
      >
        Share on Farcaster 💬
      </button>
      <button
        onClick={onContinue}
        className="btn-primary w-full relative z-20"
      >
        Continue →
      </button>
    </div>
  );
}
