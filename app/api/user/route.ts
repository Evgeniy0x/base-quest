// ========================================
// API: ПОЛЬЗОВАТЕЛЬ
// ========================================
// GET /api/user?fid=123 — получить или создать пользователя
// Возвращает: userStats + completedQuests + rank

import { NextRequest, NextResponse } from "next/server";
import {
  getOrCreateUser,
  getCompletedQuests,
  getUserRank,
  updateStreak,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const fid = request.nextUrl.searchParams.get("fid");
    if (!fid) {
      return NextResponse.json({ error: "fid is required" }, { status: 400 });
    }

    const fidNum = parseInt(fid, 10);
    if (isNaN(fidNum)) {
      return NextResponse.json({ error: "Invalid fid" }, { status: 400 });
    }

    // Получаем доп. данные из query params (передаются из Farcaster SDK)
    const username = request.nextUrl.searchParams.get("username") || undefined;
    const displayName = request.nextUrl.searchParams.get("displayName") || undefined;
    const avatarUrl = request.nextUrl.searchParams.get("avatarUrl") || undefined;

    // Получить или создать пользователя
    const user = await getOrCreateUser(fidNum, username, displayName, avatarUrl);

    // Обновить стрик (если первый вход за сегодня)
    const updatedUser = await updateStreak(fidNum);

    // Получить пройденные квесты
    const completedQuests = await getCompletedQuests(updatedUser.id);

    // Получить ранг
    const rank = await getUserRank(fidNum);

    // Подсчитать бейджи (по достижениям)
    let badges = 0;
    if (completedQuests.length >= 1) badges++;
    if (completedQuests.length >= 3) badges++;
    if (completedQuests.length >= 6) badges++;
    if (updatedUser.correct_answers >= 10) badges++;
    if (updatedUser.streak >= 7) badges++;
    if (updatedUser.shares >= 3) badges++;

    return NextResponse.json({
      success: true,
      user: {
        fid: updatedUser.fid,
        username: updatedUser.username,
        displayName: updatedUser.display_name,
        avatarUrl: updatedUser.avatar_url,
        xp: updatedUser.xp,
        streak: updatedUser.streak,
        rank,
        completedQuests,
        badges,
        correctAnswers: updatedUser.correct_answers,
        shares: updatedUser.shares,
        lastLoginDate: updatedUser.last_login_date,
        streakDays: JSON.parse(updatedUser.streak_days || "[]"),
      },
    });
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
