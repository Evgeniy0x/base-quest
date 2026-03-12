// ========================================
// API: ЛИДЕРБОРД
// ========================================
// GET /api/leaderboard?sort=xp|streak|badges&limit=20
// Возвращает: массив игроков с рангами

import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const sortBy = (request.nextUrl.searchParams.get("sort") || "xp") as
      | "xp"
      | "streak"
      | "badges";
    const limit = parseInt(
      request.nextUrl.searchParams.get("limit") || "20",
      10
    );

    const leaderboard = await getLeaderboard(sortBy, Math.min(limit, 100));

    // Добавляем ранги
    const ranked = leaderboard.map((entry, index) => ({
      rank: index + 1,
      fid: entry.fid,
      name: entry.display_name || entry.username || `user_${entry.fid}`,
      avatar: entry.avatar_url || "",
      xp: entry.xp,
      streak: entry.streak,
      badges: entry.badges,
      questsDone: entry.quests_done,
    }));

    return NextResponse.json({
      success: true,
      leaderboard: ranked,
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
