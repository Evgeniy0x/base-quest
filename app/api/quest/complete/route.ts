// ========================================
// API: ЗАВЕРШЕНИЕ КВЕСТА
// ========================================
// POST /api/quest/complete
// Body: { fid, questId, xpReward, correctCount }
// Возвращает: обновлённый userStats

import { NextRequest, NextResponse } from "next/server";
import { completeQuestDb, getUserRank } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, questId, xpReward, correctCount } = body;

    // Валидация
    if (!fid || !questId || xpReward === undefined || correctCount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: fid, questId, xpReward, correctCount" },
        { status: 400 }
      );
    }

    // Завершаем квест в БД
    const { user, completedQuests } = await completeQuestDb(
      fid,
      questId,
      xpReward,
      correctCount
    );

    // Получаем новый ранг
    const rank = await getUserRank(fid);

    // Подсчитать бейджи
    let badges = 0;
    if (completedQuests.length >= 1) badges++;
    if (completedQuests.length >= 3) badges++;
    if (completedQuests.length >= 6) badges++;
    if (user.correct_answers >= 10) badges++;
    if (user.streak >= 7) badges++;
    if (user.shares >= 3) badges++;

    return NextResponse.json({
      success: true,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        xp: user.xp,
        streak: user.streak,
        rank,
        completedQuests,
        badges,
        correctAnswers: user.correct_answers,
        shares: user.shares,
        lastLoginDate: user.last_login_date,
        streakDays: JSON.parse(user.streak_days || "[]"),
      },
    });
  } catch (error) {
    console.error("Quest complete API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
