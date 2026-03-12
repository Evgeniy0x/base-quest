"use client";

import { useState } from "react";
import { Quest, CATEGORIES } from "@/lib/quests-data";

interface QuestsScreenProps {
  quests: Quest[];
  completedIds: number[];
  onStartQuest: (quest: Quest) => void;
}

export default function QuestsScreen({
  quests,
  completedIds,
  onStartQuest,
}: QuestsScreenProps) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? quests : quests.filter((q) => q.category === filter);

  return (
    <div className="px-5 pb-24 animate-in">
      <h2 className="text-white text-2xl font-extrabold mb-1">Quests</h2>
      <p className="text-gray-500 text-sm mb-5">
        Learn & earn XP to climb the leaderboard
      </p>

      {/* Фильтр по категориям */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-1 hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold border-none cursor-pointer transition-all ${
              filter === cat.id
                ? "bg-gradient-blue text-white"
                : "bg-white/[0.08] text-gray-500"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Карточки квестов */}
      <div className="flex flex-col gap-3">
        {filtered.map((quest) => {
          const done = completedIds.includes(quest.id);
          return (
            <button
              key={quest.id}
              onClick={() => !done && onStartQuest(quest)}
              disabled={done}
              className={`${
                done ? "card-success opacity-70" : "card"
              } rounded-2xl p-[18px] text-left transition-all ${
                !done ? "cursor-pointer hover:scale-[1.01]" : "cursor-default"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-[50px] h-[50px] rounded-[14px] flex items-center justify-center text-2xl ${
                    done ? "bg-emerald-500/20" : "bg-base-blue/15"
                  }`}
                >
                  {done ? "✅" : quest.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-[15px] font-bold">
                    {quest.title}
                  </h4>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {quest.subtitle}
                  </p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-base-blue text-[11px] font-semibold">
                      +{quest.xp} XP
                    </span>
                    <span className="text-gray-600 text-[11px]">
                      ⏱ {quest.duration}
                    </span>
                    <span className="text-gray-600 text-[11px]">
                      📊 {quest.difficulty}
                    </span>
                  </div>
                </div>
                {!done && (
                  <span className="text-base-blue text-[22px]">→</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
