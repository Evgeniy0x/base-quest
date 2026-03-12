"use client";

// ========================================
// ГЛАВНАЯ СТРАНИЦА BASE QUEST
// ========================================
// Объединяет все экраны и управляет стейтом
// Использует бэкенд API для хранения данных (fallback на localStorage)

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
import { UserStats, loadUserStats, saveUserStats, updateDailyStreak } from "@/lib/store";
import { loadUserFromApi, completeQuestApi, trackShare } from "@/lib/api-store";

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

// Данные из Farcaster SDK
interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

// Безопасный хук для MiniKit — не крашит приложение вне Farcaster
function useSafeMiniKit() {
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);

  useEffect(() => {
    try {
      // Динамически импортируем MiniKit
      import("@coinbase/onchainkit/minikit").then(() => {}).catch(() => {});

      // Получаем контекст через Farcaster SDK
      sdk.context
        .then((ctx) => {
          if (ctx) {
            // Извлекаем данные пользователя из контекста Farcaster
            const user = (ctx as Record<string, unknown>).user as Record<string, unknown> | undefined;
            if (user && user.fid) {
              setFarcasterUser({
                fid: user.fid as number,
                username: user.username as string | undefined,
                displayName: user.displayName as string | undefined,
                pfpUrl: user.pfpUrl as string | undefined,
              });
            }
          }
          // Сообщаем Farcaster что приложение загрузилось
          sdk.actions.ready().catch(() => {});
        })
        .catch(() => {
          sdk.actions.ready().catch(() => {});
        });
    } catch {
      // Не в Farcaster
    }
  }, []);

  return { farcasterUser };
}

export default function AppClient() {
  return (
    <ErrorBoundary fallback={<AppInner farcasterUser={null} />}>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const { farcasterUser } = useSafeMiniKit();
  return <AppInner farcasterUser={farcasterUser} />;
}

function AppInner({ farcasterUser }: { farcasterUser: FarcasterUser | null }) {
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
    async function init() {
      let stats: UserStats;

      if (farcasterUser?.fid) {
        // В Farcaster — загружаем из бэкенда API
        stats = await loadUserFromApi(
          farcasterUser.fid,
          farcasterUser.username,
          farcasterUser.displayName,
          farcasterUser.pfpUrl
        );
      } else {
        // Обычный браузер — localStorage
        stats = loadUserStats();
        stats = updateDailyStreak(stats);
        saveUserStats(stats);
      }

      setUserStats(stats);
      setIsReady(true);
    }

    init();
  }, [farcasterUser]);

  // Начать квест
  const handleStartQuest = useCallback((quest: Quest) => {
    setActiveQuest(quest);
    setQuestResult(null);
  }, []);

  // Завершить квест
  const handleCompleteQuest = useCallback(
    async (questId: number, xpReward: number, correctCount: number) => {
      if (!userStats) return;
      const quest = QUESTS.find((q) => q.id === questId);
      if (!quest) return;

      // Сохраняем через API (или localStorage как fallback)
      const newStats = await completeQuestApi(
        farcasterUser?.fid || null,
        userStats,
        questId,
        xpReward,
        correctCount
      );

      setUserStats(newStats);
      setQuestResult({ quest, correctCount });
      setActiveQuest(null);
    },
    [userStats, farcasterUser]
  );

  // Шеринг в Farcaster
  const handleShare = useCallback(async () => {
    if (!userStats) return;

    try {
      // Трекаем шеринг в бэкенде
      await trackShare(farcasterUser?.fid || null);

      const appUrl = process.env.NEXT_PUBLIC_URL || "https://base-quest-peach.vercel.app";
      const text = `🎓 I just leveled up on Base Quest!\n\n⚡ ${userStats.xp} XP earned\n⚔️ ${userStats.completedQuests.length} quests completed\n🔥 ${userStats.streak}-day streak\n\nLearn about the Base ecosystem and earn rewards:`;

      await sdk.actions.composeCast({
        text,
        embeds: [appUrl],
      });
    } catch {
      console.log("Share not available outside Farcaster");
    }
  }, [userStats, farcasterUser]);

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

  // Farcaster имя и адрес
  const farcasterName = farcasterUser?.displayName || farcasterUser?.username;
  const walletAddress = undefined; // TODO: получить через MiniKit wallet

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
        <LeaderboardScreen
          userStats={userStats}
          currentFid={farcasterUser?.fid || null}
        />
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
