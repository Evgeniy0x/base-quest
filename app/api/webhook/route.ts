// API route: /api/webhook
// Farcaster отправляет сюда события (добавление/удаление мини-аппа, нотификации)

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Логируем входящие события для отладки
    console.log("[Webhook] Received event:", JSON.stringify(body, null, 2));

    // Обработка разных типов событий
    const { event, fid } = body;

    switch (event) {
      case "frame_added":
        // Пользователь добавил наш мини-апп
        console.log(`[Webhook] User ${fid} added Base Quest`);
        // TODO: Отправить приветственное уведомление
        break;

      case "frame_removed":
        // Пользователь удалил наш мини-апп
        console.log(`[Webhook] User ${fid} removed Base Quest`);
        break;

      case "notifications_enabled":
        // Пользователь включил уведомления
        console.log(`[Webhook] User ${fid} enabled notifications`);
        break;

      case "notifications_disabled":
        console.log(`[Webhook] User ${fid} disabled notifications`);
        break;

      default:
        console.log(`[Webhook] Unknown event: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
