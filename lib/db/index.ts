// ========================================
// ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ
// ========================================
// Используем @vercel/postgres — интегрирован с Vercel
// Env-переменные подтягиваются автоматически

import { sql } from "@vercel/postgres";
import { DbUser } from "./schema";

// ==================
// ПОЛЬЗОВАТЕЛИ
// ==================

// Получить пользователя по Farcaster ID или создать нового
export async function getOrCreateUser(
  fid: number,
  username?: string,
  displayName?: string,
  avatarUrl?: string
): Promise<DbUser> {
  // Пробуем найти существующего
  const { rows } = await sql<DbUser>`
    SELECT * FROM users WHERE fid = ${fid}
  `;

  if (rows.length > 0) {
    // Обновляем профильные данные (имя, аватар могут меняться)
    if (username || displayName || avatarUrl) {
      await sql`
        UPDATE users SET
          username = COALESCE(${username || null}, username),
          display_name = COALESCE(${displayName || null}, display_name),
          avatar_url = COALESCE(${avatarUrl || null}, avatar_url),
          updated_at = NOW()
        WHERE fid = ${fid}
      `;
    }
    return rows[0];
  }

  // Создаём нового пользователя
  const { rows: newRows } = await sql<DbUser>`
    INSERT INTO users (fid, username, display_name, avatar_url)
    VALUES (${fid}, ${username || null}, ${displayName || null}, ${avatarUrl || null})
    RETURNING *
  `;

  return newRows[0];
}

// Получить пользователя по FID
export async function getUserByFid(fid: number): Promise<DbUser | null> {
  const { rows } = await sql<DbUser>`
    SELECT * FROM users WHERE fid = ${fid}
  `;
  return rows[0] || null;
}

// ==================
// СТРИК (серия дней)
// ==================

// Обновить ежедневный стрик
export async function updateStreak(fid: number): Promise<DbUser> {
  const user = await getUserByFid(fid);
  if (!user) throw new Error("User not found");

  const today = new Date().toDateString();
  if (user.last_login_date === today) return user; // Уже заходил сегодня

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak = user.streak;
  let streakDays: boolean[] = JSON.parse(user.streak_days || "[]");

  // Проверяем — заходил ли вчера?
  if (user.last_login_date && user.last_login_date !== yesterday.toDateString()) {
    // Стрик сбросился
    newStreak = 0;
    streakDays = [false, false, false, false, false, false, false];
  }

  // +1 к стрику
  newStreak++;
  const dayOfWeek = new Date().getDay();
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0=Mon, 6=Sun
  streakDays[adjustedDay] = true;

  // +10 XP за ежедневный вход
  const { rows } = await sql<DbUser>`
    UPDATE users SET
      streak = ${newStreak},
      xp = xp + 10,
      streak_days = ${JSON.stringify(streakDays)},
      last_login_date = ${today},
      updated_at = NOW()
    WHERE fid = ${fid}
    RETURNING *
  `;

  return rows[0];
}

// ==================
// КВЕСТЫ
// ==================

// Получить список ID пройденных квестов
export async function getCompletedQuests(userId: number): Promise<number[]> {
  const { rows } = await sql<{ quest_id: number }>`
    SELECT quest_id FROM completed_quests WHERE user_id = ${userId}
  `;
  return rows.map((r) => r.quest_id);
}

// Завершить квест
export async function completeQuestDb(
  fid: number,
  questId: number,
  xpReward: number,
  correctCount: number
): Promise<{ user: DbUser; completedQuests: number[] }> {
  const user = await getUserByFid(fid);
  if (!user) throw new Error("User not found");

  // Проверяем — не пройден ли уже
  const existing = await sql`
    SELECT id FROM completed_quests
    WHERE user_id = ${user.id} AND quest_id = ${questId}
  `;
  if (existing.rows.length > 0) {
    const completedQuests = await getCompletedQuests(user.id);
    return { user, completedQuests };
  }

  // Записываем в completed_quests
  await sql`
    INSERT INTO completed_quests (user_id, quest_id, correct_count, xp_earned)
    VALUES (${user.id}, ${questId}, ${correctCount}, ${xpReward})
  `;

  // Обновляем XP и correct_answers у пользователя
  const { rows } = await sql<DbUser>`
    UPDATE users SET
      xp = xp + ${xpReward},
      correct_answers = correct_answers + ${correctCount},
      updated_at = NOW()
    WHERE id = ${user.id}
    RETURNING *
  `;

  const completedQuests = await getCompletedQuests(user.id);
  return { user: rows[0], completedQuests };
}

// ==================
// ЛИДЕРБОРД
// ==================

// Получить топ-20 по XP
export async function getLeaderboard(
  sortBy: "xp" | "streak" | "badges" = "xp",
  limit: number = 20
): Promise<
  Array<{
    fid: number;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    xp: number;
    streak: number;
    badges: number;
    quests_done: number;
  }>
> {
  // badges = количество заминченных бейджей
  // quests_done = количество пройденных квестов
  // Vercel Postgres не поддерживает динамический ORDER BY через шаблоны
  // Поэтому делаем отдельные запросы для каждого типа сортировки
  const baseQuery = `
    SELECT
      u.fid,
      u.username,
      u.display_name,
      u.avatar_url,
      u.xp,
      u.streak,
      COUNT(DISTINCT cq.quest_id)::int AS quests_done,
      COUNT(DISTINCT mb.badge_id)::int AS badges
    FROM users u
    LEFT JOIN completed_quests cq ON cq.user_id = u.id
    LEFT JOIN minted_badges mb ON mb.user_id = u.id
    WHERE u.xp > 0
    GROUP BY u.id
  `;

  const orderClause =
    sortBy === "streak"
      ? "ORDER BY u.streak DESC"
      : sortBy === "badges"
      ? "ORDER BY COUNT(DISTINCT mb.badge_id) DESC"
      : "ORDER BY u.xp DESC";

  const { rows } = await sql.query(
    `${baseQuery} ${orderClause} LIMIT $1`,
    [limit]
  );

  return rows as Array<{
    fid: number;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    xp: number;
    streak: number;
    badges: number;
    quests_done: number;
  }>;
}

// Получить ранг пользователя по XP
export async function getUserRank(fid: number): Promise<number> {
  const { rows } = await sql<{ rank: number }>`
    SELECT COUNT(*)::int + 1 AS rank
    FROM users
    WHERE xp > (SELECT xp FROM users WHERE fid = ${fid})
  `;
  return rows[0]?.rank || 99;
}

// ==================
// ШЕРИНГ
// ==================

export async function incrementShares(fid: number): Promise<DbUser> {
  const { rows } = await sql<DbUser>`
    UPDATE users SET shares = shares + 1, updated_at = NOW()
    WHERE fid = ${fid}
    RETURNING *
  `;
  return rows[0];
}
