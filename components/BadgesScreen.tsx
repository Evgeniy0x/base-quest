"use client";

import { BADGES } from "@/lib/quests-data";
import { UserStats } from "@/lib/store";

interface BadgesScreenProps {
  userStats: UserStats;
}

export default function BadgesScreen({ userStats }: BadgesScreenProps) {
  const getProgress = (badge: (typeof BADGES)[0]): number => {
    switch (badge.type) {
      case "quests":
        return Math.min(userStats.completedQuests.length / badge.requirement, 1);
      case "correct":
        return Math.min(userStats.correctAnswers / badge.requirement, 1);
      case "streak":
        return Math.min(userStats.streak / badge.requirement, 1);
      case "shares":
        return Math.min(userStats.shares / badge.requirement, 1);
      default:
        return 0;
    }
  };

  return (
    <div className="px-5 pb-24 animate-in">
      <h2 className="text-white text-2xl font-extrabold mb-1">Badges</h2>
      <p className="text-gray-500 text-sm mb-6">
        Earn badges and mint them as on-chain achievements
      </p>

      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((badge) => {
          const progress = getProgress(badge);
          const unlocked = progress >= 1;
          return (
            <div
              key={badge.id}
              className={`rounded-[18px] p-5 text-center ${
                unlocked
                  ? "bg-gradient-to-br from-base-blue/15 to-purple-500/15 border border-base-blue/30"
                  : "bg-white/[0.04] border border-white/[0.06] opacity-60"
              }`}
            >
              <div
                className={`text-[40px] mb-2 ${
                  unlocked ? "" : "grayscale"
                }`}
              >
                {badge.icon}
              </div>
              <h4 className="text-white text-sm font-bold mb-1">
                {badge.name}
              </h4>
              <p className="text-gray-500 text-[11px] mb-2.5">
                {badge.description}
              </p>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mb-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    unlocked
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                      : "bg-gradient-blue"
                  }`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              {unlocked ? (
                <button className="bg-gradient-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[11px] font-bold cursor-pointer mt-1">
                  Mint NFT
                </button>
              ) : (
                <span className="text-gray-600 text-[11px]">
                  {Math.round(progress * 100)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
