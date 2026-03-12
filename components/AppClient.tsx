"use client";

// ========================================
// ГЛАВНАЯ СТРАНИЦА BASE QUEST
// ========================================
// Объединяет все экраны и управляет стейтом

import { useState, useEffect, useCallback } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import sdk from "@farcaster/frame-sdk";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import HomeScreen from "@/components/HomeScreen";
import QuestsScreen from "@/components/QuestsScreen";
import QuestPlayer from "@/components/QuestPlayer";
import QuestComplete from "@/components/QuestComplete";
import BadgesScreen from "@/components/BadgesScreen";
import LeaderboardScreen from "@/components/LeaderboardScreen";
import ProfileScreen from "@/components/ProfileScreen";

import { QUESTS, Quest } from "@/lib/quests-data";
import {
  UserStats,
  loadUserStats,
  saveUserStats,
  updateDailyStreak,
  completeQuest,
} from "@/lib/store";

export default function AppClient() {
  // MiniKit — контекст Farcaster (пользователь, кошелёк и т.д.)
  const { context } = useMiniKit();
  // Farcaster SDK используем напрямую для шеринга

  // Стейт приложения
  const [currentTab, setCurrentTab] = useState("home");
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [questResult, setQuestResult] = useState<{
    quest: Quest;
    correctCount: number;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Загрузка данных при старте
  useEffect(() => {
    const stats = loadUserStats();
    const updated = updateDailyStreak(stats);
    setUserStats(updated);
    saveUserStats(updated);
    setIsReady(true);
  }, []);

  // Начать квест
  const handleStartQuest = useCallback((quest: Quest) => {
    setActiveQuest(quest);
    setQuestResult(null);
  }, []);

  // Завершить квест
  const handleCompleteQuest = useCallback(
    (questId: number, xpReward: number, correctCount: number) => {
      if (!userStats) return;
      const quest = QUESTS.find((q) => q.id === questId);
      if (!quest) return;

      const newStats = completeQuest(userStats, questId, xpReward, correctCount);
      setUserStats(newStats);
      saveUserStats(newStats);
      setQuestResult({ quest, correctCount });
      setActiveQuest(null);
    },
    [userStats]
  );

  // Шеринг в Farcaster через MiniKit
  const handleShare = useCallback(async () => {
    if (!userStats) return;

    try {
      const appUrl = process.env.NEXT_PUBLIC_URL || "https://base-quest.vercel.app";
      const text = `🎓 I just leveled up on Base Quest!\n\n⚡ ${userStats.xp} XP earned\n⚔️ ${userStats.completedQuests.length} quests completed\n🔥 ${userStats.streak}-day streak\n\nLearn about the Base ecosystem and earn rewards:`;

      // Используем Farcaster SDK для создания каста
      await sdk.actions.composeCast({
        text,
        embeds: [appUrl],
      });
    } catch (err) {
      console.log("Share not available outside Farcaster");
    }
  }, [userStats]);

  // Возврат из квеста
  const handleQuestBack = useCallback(() => {
    setActiveQuest(null);
  }, []);

  // Продолжить после завершения
  const handleQuestResultContinue = useCallback(() => {
    setQuestResult(null);
    setCurrentTab("quests");
  }, []);

  // Пока загружается
  if (!isReady || !userStats) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-base-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-blue mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white animate-pulse">
            B
          </div>
          <p className="text-gray-500 text-sm">Loading Base Quest...</p>
        </div>
      </div>
    );
  }

  // Farcaster имя и адрес (если доступны)
  const farcasterName = context?.user?.displayName || context?.user?.username;
  // @ts-expect-error — addresses may exist in runtime Farcaster context
  const walletAddress = context?.user?.connectedAddress as string | undefined;

  // === Экран прохождения квеста ===
  if (activeQuest) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-base-dark pt-5">
        <QuestPlayer
          quest={activeQuest}
          onComplete={handleCompleteQuest}
          onBack={handleQuestBack}
        />
      </div>
    );
  }

  // === Экран результата квеста ===
  if (questResult) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-base-dark">
        <QuestComplete
          quest={questResult.quest}
          correctCount={questResult.correctCount}
          onContinue={handleQuestResultContinue}
          onShare={handleShare}
        />
      </div>
    );
  }

  // === Основное приложение с навигацией ===
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-base-dark relative">
      <Header xp={userStats.xp} streak={userStats.streak} />

      {currentTab === "home" && (
        <HomeScreen
          userStats={userStats}
          quests={QUESTS}
          completedIds={userStats.completedQuests}
          onStartQuest={handleStartQuest}
        />
      )}
      {currentTab === "quests" && (
        <QuestsScreen
          quests={QUESTS}
          completedIds={userStats.completedQuests}
          onStartQuest={handleStartQuest}
        />
      )}
      {currentTab === "badges" && <BadgesScreen userStats={userStats} />}
      {currentTab === "leaderboard" && (
        <LeaderboardScreen userStats={userStats} />
      )}
      {currentTab === "profile" && (
        <ProfileScreen
          userStats={userStats}
          farcasterName={farcasterName}
          walletAddress={walletAddress}
          onShare={handleShare}
        />
      )}

      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}
