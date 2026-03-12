"use client";

import { Quest } from "@/lib/quests-data";
import { UserStats } from "@/lib/store";

interface HomeScreenProps {
  userStats: UserStats;
  quests: Quest[];
  completedIds: number[];
  onStartQuest: (quest: Quest) => void;
}

export default function HomeScreen({
  userStats,
  quests,
  completedIds,
  onStartQuest,
}: HomeScreenProps) {
  const nextQuest = quests.find((q) => !completedIds.includes(q.id));
  const level = Math.floor(userStats.xp / 100) + 1;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIdx =
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div className="px-5 pb-24 animate-in">
      {/* Hero Card */}
      <div className="bg-gradient-base rounded-3xl p-7 mb-6 relative overflow-hidden">
        <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 right-10 w-20 h-20 rounded-full bg-white/5" />
        <p className="text-white/80 text-sm">Welcome back,</p>
        <h2 className="text-white text-2xl font-extrabold mt-1 mb-4">
          Explorer 👋
        </h2>
        <div className="flex gap-5">
          <div>
            <p className="text-white/70 text-[11px]">Total XP</p>
            <p className="text-white text-xl font-extrabold">{userStats.xp}</p>
          </div>
          <div>
            <p className="text-white/70 text-[11px]">Streak</p>
            <p className="text-white text-xl font-extrabold">
              🔥 {userStats.streak}d
            </p>
          </div>
          <div>
            <p className="text-white/70 text-[11px]">Rank</p>
            <p className="text-white text-xl font-extrabold">
              #{userStats.rank}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Streak */}
      <div className="card p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white text-[15px] font-bold">Daily Streak</span>
          <span className="text-base-blue text-[13px] font-semibold">
            +10 XP/day
          </span>
        </div>
        <div className="flex gap-2 justify-between">
          {days.map((day, i) => (
            <div key={day} className="text-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-base mb-1 ${
                  userStats.streakDays[i]
                    ? "bg-gradient-blue"
                    : "bg-white/[0.08]"
                } ${i === todayIdx ? "ring-2 ring-base-blue shadow-[0_0_12px_rgba(0,82,255,0.4)]" : ""}`}
              >
                {userStats.streakDays[i] ? "✓" : ""}
              </div>
              <span
                className={`text-[10px] ${
                  userStats.streakDays[i]
                    ? "text-base-blue"
                    : "text-gray-600"
                } ${i === todayIdx ? "font-bold" : ""}`}
              >
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Quest */}
      {nextQuest && (
        <>
          <h3 className="text-white text-[17px] font-bold mb-3">
            Continue Learning
          </h3>
          <button
            onClick={() => onStartQuest(nextQuest)}
            className="card-active rounded-2xl p-5 mb-6 w-full text-left cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 rounded-xl bg-base-blue/20 flex items-center justify-center text-2xl">
                {nextQuest.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-white text-base font-bold">
                  {nextQuest.title}
                </h4>
                <p className="text-gray-500 text-[13px] mt-0.5">
                  {nextQuest.subtitle}
                </p>
              </div>
              <span className="text-base-blue text-2xl font-light">→</span>
            </div>
            <div className="flex gap-4">
              <span className="text-base-blue text-xs font-semibold">
                +{nextQuest.xp} XP
              </span>
              <span className="text-gray-500 text-xs">
                ⏱ {nextQuest.duration}
              </span>
              <span className="text-gray-500 text-xs">
                📊 {nextQuest.difficulty}
              </span>
            </div>
          </button>
        </>
      )}

      {/* Stats Grid */}
      <h3 className="text-white text-[17px] font-bold mb-3">Your Progress</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Quests Done",
            value: `${completedIds.length}/${quests.length}`,
            color: "text-base-blue",
            icon: "⚔️",
          },
          {
            label: "Badges Earned",
            value: userStats.badges,
            color: "text-purple-400",
            icon: "🏅",
          },
          {
            label: "Correct Answers",
            value: userStats.correctAnswers,
            color: "text-emerald-400",
            icon: "✅",
          },
          {
            label: "Level",
            value: `Lv.${level}`,
            color: "text-amber-400",
            icon: "⭐",
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <span className="text-2xl">{stat.icon}</span>
            <p className={`${stat.color} text-2xl font-extrabold mt-1.5 mb-0.5`}>
              {stat.value}
            </p>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
