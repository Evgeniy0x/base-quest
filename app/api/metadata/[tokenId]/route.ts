// ========================================
// API: МЕТАДАННЫЕ NFT (ERC-1155 стандарт)
// ========================================
// GET /api/metadata/1.json → метаданные бейджа #1
// Вызывается контрактом через uri(tokenId)

import { NextRequest, NextResponse } from "next/server";
import { BADGE_METADATA } from "@/lib/contracts/badge-metadata";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId: rawTokenId } = await params;
  // Убираем .json если есть
  const tokenId = parseInt(rawTokenId.replace(".json", ""), 10);

  if (isNaN(tokenId) || !BADGE_METADATA[tokenId]) {
    return NextResponse.json(
      { error: "Badge not found" },
      { status: 404 }
    );
  }

  const metadata = BADGE_METADATA[tokenId];

  // Возвращаем в стандартном формате ERC-1155 metadata
  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, max-age=86400", // Кеш на 24 часа
      "Access-Control-Allow-Origin": "*",
    },
  });
}
