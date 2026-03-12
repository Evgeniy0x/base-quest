// ========================================
// СТЕЙТ-МЕНЕДЖМЕНТ (локальное хранилище)
// ========================================
// Сохраняем прогресс пользователя в localStorage
// В будущем — переносим на on-chain хранение

export interface UserStats {
  xp: number;
  streak: number;
  rank: number;
  completedQuests: number[];
  badges: number;
  correctAnswers: number;
  shares: number;
  lastLoginDate: string;
  streakDays: boolean[]; // 7 дней
}

const STORAGE_KEY = "base-quest-user";

// Стартовые данные нового пользователя
const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 0,
  rank: 99,
  completedQuests: [],
  badges: 0,
  correctAnswers: 0,
  shares: 0,
  lastLoginDate: "",
  streakDays: [false, false, false, false, false, false, false],
};

// Загрузить данные
export function loadUserStats(): UserStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Проверяем стрик — если последний вход был не вчера, сбрасываем
      const today = new Date().toDateString();
      const lastLogin = parsed.lastLoginDate;
      if (lastLogin && lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastLogin !== yesterday.toDateString()) {
          // Стрик сбросился
          parsed.streak = 0;
          parsed.streakDays = [false, false, false, false, false, false, false];
        }
      }
      return { ...DEFAULT_STATS, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load user stats:", e);
  }
  return DEFAULT_STATS;
}

// Сохранить данные
export function saveUserStats(stats: UserStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save user stats:", e);
  }
}

// Обновить стрик при входе
export function updateDailyStreak(stats: UserStats): UserStats {
  const today = new Date().toDateString();
  if (stats.lastLoginDate === today) return stats; // Уже заходил сегодня

  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0=Mon, 6=Sun

  const newStreakDays = [...stats.streakDays];
  newStreakDays[adjustedDay] = true;

  return {
    ...stats,
    streak: stats.streak + 1,
    xp: stats.xp + 10, // +10 XP за ежедневный вход
    streakDays: newStreakDays,
    lastLoginDate: today,
  };
}

// Завершить квест
export function completeQuest(
  stats: UserStats,
  questId: number,
  xpReward: number,
  correctCount: number
): UserStats {
  if (stats.completedQuests.includes(questId)) return stats;

  const newCompleted = [...stats.completedQuests, questId];
  const newCorrect = stats.correctAnswers + correctCount;

  // Подсчитываем бейджи
  let badges = 0;
  if (newCompleted.length >= 1) badges++;
  if (newCompleted.length >= 3) badges++;
  if (newCompleted.length >= 6) badges++;
  if (newCorrect >= 10) badges++;
  if (stats.streak >= 7) badges++;

  return {
    ...stats,
    xp: stats.xp + xpReward,
    completedQuests: newCompleted,
    correctAnswers: newCorrect,
    badges,
    rank: Math.max(1, stats.rank - Math.floor(Math.random() * 5 + 1)),
  };
}
