// API route: /api/verify
// On-chain верификация квестов — проверяем реальные действия на Base

import { NextRequest, NextResponse } from "next/server";
import { verifyQuest } from "@/lib/onchain-verify";
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  try {
    const { questId, walletAddress, fid } = await req.json();

    // Валидация
    if (!questId || !walletAddress) {
      return NextResponse.json(
        { error: "questId and walletAddress are required" },
        { status: 400 }
      );
    }

    // Проверяем on-chain
    const result = await verifyQuest(
      questId,
      walletAddress as `0x${string}`,
      fid
    );

    // Если верифицировано — записываем в базу
    if (result.verified && fid) {
      try {
        // Обновляем квест как завершённый + начисляем XP
        await sql`
          UPDATE users
          SET completed_quests = array_append(
            CASE WHEN NOT (${questId}::text = ANY(completed_quests))
              THEN completed_quests
              ELSE completed_quests
            END,
            ${questId}::text
          ),
          xp = xp + ${getQuestXP(questId)},
          correct_answers = correct_answers + 1
          WHERE fid = ${fid}
          AND NOT (${questId}::text = ANY(completed_quests))
        `;
      } catch (dbError) {
        console.error("[Verify] DB update error:", dbError);
        // Не ломаем ответ — верификация прошла
      }
    }

    return NextResponse.json({
      success: true,
      questId,
      ...result,
    });
  } catch (error) {
    console.error("[Verify] Error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}

// XP за каждый квест
function getQuestXP(questId: number): number {
  const xpMap: Record<number, number> = {
    1: 50, 2: 80, 3: 60, 4: 70, 5: 80,
    6: 50, 7: 90, 8: 70, 9: 100, 10: 75,
    11: 85, 12: 65,
  };
  return xpMap[questId] || 50;
}
