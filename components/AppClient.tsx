"use client";

// ========================================
// ГЛАВНАЯ СТРАНИЦА BASE QUEST
// ========================================
// Объединяет все экраны и управляет стейтом

import { useState, useEffect, useCallback, Component, ReactNode } from "react";
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

// Error Boundary для перехвата ошибок MiniKit вне Farcaster
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Безопасный хук для MiniKit — не крашит приложение вне Farcaster
function useSafeMiniKit() {
  const [context, setContext] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    try {
      // Динамически импортируем MiniKit только в Farcaster-контексте
      import("@coinbase/onchainkit/minikit").then((mod) => {
        // MiniKit доступен — пробуем получить контекст
        if (mod && typeof mod.useMiniKit === "function") {
          // useMiniKit можно вызывать только внутри рендера,
          // поэтому используем sdk.context напрямую
        }
      }).catch(() => {});

      // Получаем контекст через Farcaster SDK напрямую
      sdk.context.then((ctx) => {
        if (ctx) setContext(ctx as unknown as Record<string, unknown>);
      }).catch(() => {});
    } catch {
      // Не в Farcaster — просто работаем без контекста
    }
  }, []);
  return { context };
}

export default function AppClient() {
  return (
    <ErrorBoundary fallback={<AppInner context={null} />}>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const { context } = useSafeMiniKit();
  return <AppInner context={context} />;
}

function AppInner({ context }: { context: Record<string, unknown> | null }) {
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
  const user = context?.user as Record<string, unknown> | undefined;
  const farcasterName = (user?.displayName || user?.username) as string | undefined;
  const walletAddress = user?.connectedAddress as string | undefined;

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
