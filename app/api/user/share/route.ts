// ========================================
// API: ТРЕКИНГ ШЕРИНГА
// ========================================
// POST /api/user/share — увеличить счётчик шерингов
// Body: { fid }

import { NextRequest, NextResponse } from "next/server";
import { incrementShares } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { fid } = await request.json();
    if (!fid) {
      return NextResponse.json({ error: "fid is required" }, { status: 400 });
    }

    const user = await incrementShares(fid);

    return NextResponse.json({
      success: true,
      shares: user.shares,
    });
  } catch (error) {
    console.error("Share API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
