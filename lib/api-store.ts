// ========================================
// API STORE — замена localStorage на бэкенд
// ========================================
// Стратегия:
// - Если пользователь в Farcaster (есть FID) → используем бэкенд API
// - Если нет FID (обычный браузер) → fallback на localStorage
// Это позволяет приложению работать и без Farcaster

import {
  UserStats,
  loadUserStats as loadLocal,
  saveUserStats as saveLocal,
  updateDailyStreak as updateLocalStreak,
  completeQuest as completeLocalQuest,
} from "./store";

// Тип ответа от API
interface ApiUserResponse {
  success: boolean;
  user: {
    fid: number;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    xp: number;
    streak: number;
    rank: number;
    completedQuests: number[];
    badges: number;
    correctAnswers: number;
    shares: number;
    lastLoginDate: string;
    streakDays: boolean[];
  };
}

// Конвертируем ответ API → UserStats (формат, который понимает UI)
function apiResponseToStats(data: ApiUserResponse["user"]): UserStats {
  return {
    xp: data.xp,
    streak: data.streak,
    rank: data.rank,
    completedQuests: data.completedQuests,
    badges: data.badges,
    correctAnswers: data.correctAnswers,
    shares: data.shares,
    lastLoginDate: data.lastLoginDate,
    streakDays: data.streakDays,
  };
}

// ==================
// ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ
// ==================

// Загрузить данные через API (с авто-обновлением стрика)
export async function loadUserFromApi(
  fid: number,
  username?: string,
  displayName?: string,
  avatarUrl?: string
): Promise<UserStats> {
  try {
    const params = new URLSearchParams({ fid: String(fid) });
    if (username) params.set("username", username);
    if (displayName) params.set("displayName", displayName);
    if (avatarUrl) params.set("avatarUrl", avatarUrl);

    const res = await fetch(`/api/user?${params.toString()}`);
    if (!res.ok) throw new Error("API error");

    const data: ApiUserResponse = await res.json();
    if (!data.success) throw new Error("API returned error");

    const stats = apiResponseToStats(data.user);
    // Сохраняем в localStorage как кэш
    saveLocal(stats);
    return stats;
  } catch (error) {
    console.error("Failed to load from API, using localStorage:", error);
    // Fallback на localStorage
    const stats = loadLocal();
    return updateLocalStreak(stats);
  }
}

// ==================
// ЗАВЕРШЕНИЕ КВЕСТА
// ==================

export async function completeQuestApi(
  fid: number | null,
  stats: UserStats,
  questId: number,
  xpReward: number,
  correctCount: number
): Promise<UserStats> {
  // Если есть FID — сохраняем на сервере
  if (fid) {
    try {
      const res = await fetch("/api/quest/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid, questId, xpReward, correctCount }),
      });

      if (!res.ok) throw new Error("API error");

      const data: ApiUserResponse = await res.json();
      if (!data.success) throw new Error("API returned error");

      const newStats = apiResponseToStats(data.user);
      saveLocal(newStats); // Кэш
      return newStats;
    } catch (error) {
      console.error("Failed to save quest to API:", error);
      // Fallback
    }
  }

  // Fallback на localStorage
  const newStats = completeLocalQuest(stats, questId, xpReward, correctCount);
  saveLocal(newStats);
  return newStats;
}

// ==================
// ШЕРИНГ
// ==================

export async function trackShare(fid: number | null): Promise<void> {
  if (!fid) return;
  try {
    await fetch("/api/user/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fid }),
    });
  } catch (error) {
    console.error("Failed to track share:", error);
  }
}

// ==================
// ЛИДЕРБОРД
// ==================

export interface LeaderboardEntry {
  rank: number;
  fid: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  badges: number;
  questsDone: number;
  isUser?: boolean;
}

export async function fetchLeaderboard(
  sortBy: "xp" | "streak" | "badges" = "xp",
  currentFid?: number | null
): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`/api/leaderboard?sort=${sortBy}&limit=20`);
    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    if (!data.success) throw new Error("API returned error");

    // Помечаем текущего пользователя
    return data.leaderboard.map((entry: LeaderboardEntry) => ({
      ...entry,
      isUser: currentFid ? entry.fid === currentFid : false,
    }));
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    // Возвращаем пустой лидерборд при ошибке
    return [];
  }
}
