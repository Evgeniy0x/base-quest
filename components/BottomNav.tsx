"use client";

// Нижняя навигация — фиксирована внизу экрана
// 5 вкладок: Home, Quests, Badges, Rank, Profile

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "quests", icon: "⚔️", label: "Quests" },
  { id: "badges", icon: "🏅", label: "Badges" },
  { id: "leaderboard", icon: "🏆", label: "Rank" },
  { id: "profile", icon: "👤", label: "Profile" },
];

export default function BottomNav({ currentTab, setCurrentTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] glass-strong border-t border-base-border flex justify-around py-2 pb-3 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={`flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer transition-all duration-200 ${
            currentTab === tab.id
              ? "opacity-100 scale-110"
              : "opacity-50 scale-100"
          }`}
        >
          <span className="text-[22px]">{tab.icon}</span>
          <span
            className={`text-[10px] ${
              currentTab === tab.id
                ? "text-base-blue font-bold"
                : "text-gray-500 font-normal"
            }`}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
