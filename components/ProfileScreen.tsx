"use client";

import { UserStats } from "@/lib/store";
import { QUESTS } from "@/lib/quests-data";

interface ProfileScreenProps {
  userStats: UserStats;
  farcasterName?: string;
  walletAddress?: string;
  onShare: () => void;
}

export default function ProfileScreen({
  userStats,
  farcasterName,
  walletAddress,
  onShare,
}: ProfileScreenProps) {
  const level = Math.floor(userStats.xp / 100) + 1;
  const xpInLevel = userStats.xp % 100;
  const displayName = farcasterName || "Explorer";
  const displayAddr = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Not connected";

  return (
    <div className="px-5 pb-24 animate-in">
      {/* Аватар и имя */}
      <div className="text-center mb-7">
        <div className="w-20 h-20 rounded-full bg-gradient-base mx-auto mb-3 flex items-center justify-center text-4xl border-[3px] border-base-blue/40">
          🎮
        </div>
        <h2 className="text-white text-[22px] font-extrabold">{displayName}</h2>
        <p className="text-gray-500 text-[13px] mt-1">{displayAddr}</p>
        <div className="inline-flex items-center gap-1.5 bg-base-blue/15 rounded-full px-3.5 py-1.5 mt-1.5">
          <span className="text-base-blue text-[13px] font-bold">
            Level {level}
          </span>
        </div>
      </div>

      {/* XP прогресс */}
      <div className="card p-4 mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-[13px]">Level {level}</span>
          <span className="text-gray-500 text-[13px]">Level {level + 1}</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full bg-gradient-to-r from-base-blue to-purple-500 rounded-full"
            style={{ width: `${xpInLevel}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs text-center">
          {xpInLevel}/100 XP to next level
        </p>
      </div>

      {/* Стат-грид */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {[
          { label: "Total XP", value: userStats.xp, icon: "⚡" },
          {
            label: "Quests",
            value: userStats.completedQuests.length,
            icon: "⚔️",
          },
          { label: "Streak", value: `${userStats.streak}d`, icon: "🔥" },
          { label: "Badges", value: userStats.badges, icon: "🏅" },
          { label: "Rank", value: `#${userStats.rank}`, icon: "🏆" },
          { label: "Correct", value: userStats.correctAnswers, icon: "✅" },
        ].map((s) => (
          <div key={s.label} className="card p-3.5 text-center">
            <span className="text-xl">{s.icon}</span>
            <p className="text-white text-lg font-extrabold mt-1 mb-0.5">
              {s.value}
            </p>
            <p className="text-gray-500 text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Действия */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={onShare}
          className="w-full bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-[14px] py-3.5 text-[15px] font-semibold cursor-pointer"
        >
          Share Profile on Farcaster 💬
        </button>
        <button className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-[14px] py-3.5 text-[15px] font-semibold cursor-pointer">
          Mint All Badges as NFTs 🏅
        </button>
      </div>
    </div>
  );
}
