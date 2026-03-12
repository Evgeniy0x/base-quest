"use client";

import { useState } from "react";
import { LEADERBOARD } from "@/lib/quests-data";
import { UserStats } from "@/lib/store";

interface LeaderboardScreenProps {
  userStats: UserStats;
}

export default function LeaderboardScreen({ userStats }: LeaderboardScreenProps) {
  const [tab, setTab] = useState<"xp" | "streak" | "badges">("xp");

  // Обновляем данные "you" в лидерборде
  const board = LEADERBOARD.map((u) =>
    u.isUser
      ? {
          ...u,
          xp: userStats.xp,
          badges: userStats.badges,
          streak: userStats.streak,
          rank: userStats.rank,
        }
      : u
  ).sort((a, b) => {
    if (tab === "xp") return b.xp - a.xp;
    if (tab === "streak") return b.streak - a.streak;
    return b.badges - a.badges;
  }).map((u, i) => ({ ...u, rank: i + 1 }));

  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  const getValue = (user: (typeof board)[0]) => {
    if (tab === "xp") return `${user.xp} XP`;
    if (tab === "streak") return `🔥 ${user.streak}d`;
    return `🏅 ${user.badges}`;
  };

  return (
    <div className="px-5 pb-24 animate-in">
      <h2 className="text-white text-2xl font-extrabold mb-1">Leaderboard</h2>
      <p className="text-gray-500 text-sm mb-5">Top learners this week</p>

      {/* Табы */}
      <div className="flex gap-1 bg-white/[0.06] rounded-xl p-1 mb-6">
        {(["xp", "streak", "badges"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold border-none cursor-pointer ${
              tab === t
                ? "bg-gradient-blue text-white"
                : "bg-transparent text-gray-500"
            }`}
          >
            {t === "xp" ? "🏆 XP" : t === "streak" ? "🔥 Streak" : "🏅 Badges"}
          </button>
        ))}
      </div>

      {/* Подиум Топ-3 */}
      <div className="flex justify-center items-end gap-3 mb-7">
        {[1, 0, 2].map((idx) => {
          const user = top3[idx];
          if (!user) return null;
          const isFirst = idx === 0;
          return (
            <div key={idx} className="text-center flex-1">
              <div
                className={`mx-auto mb-2 rounded-full flex items-center justify-center ${
                  isFirst
                    ? "w-16 h-16 text-[28px] bg-gradient-to-br from-amber-400 to-red-500 border-[3px] border-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
                    : "w-[52px] h-[52px] text-[22px] bg-white/10 border-2 border-gray-700"
                }`}
              >
                {user.avatar}
              </div>
              <p className="text-white text-xs font-bold truncate">
                {user.name}
              </p>
              <p className="text-base-blue text-sm font-extrabold mt-0.5">
                {getValue(user)}
              </p>
              <div
                className={`mt-2 rounded-t-lg flex items-center justify-center text-white font-extrabold text-lg ${
                  idx === 0
                    ? "h-[60px] bg-gradient-to-b from-amber-400 to-amber-600"
                    : idx === 1
                    ? "h-10 bg-gradient-to-b from-slate-400 to-slate-600"
                    : "h-10 bg-gradient-to-b from-amber-700 to-amber-900"
                }`}
              >
                #{user.rank}
              </div>
            </div>
          );
        })}
      </div>

      {/* Остальные */}
      <div className="flex flex-col gap-2">
        {rest.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 rounded-[14px] px-4 py-3.5 ${
              user.isUser ? "card-active" : "card"
            }`}
          >
            <span className="text-gray-500 text-[15px] font-bold w-7">
              #{user.rank}
            </span>
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">
              {user.avatar}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-bold ${
                  user.isUser ? "text-base-blue" : "text-white"
                }`}
              >
                {user.name} {user.isUser && "(You)"}
              </p>
            </div>
            <span className="text-base-blue text-sm font-bold">
              {getValue(user)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
