// API route: /.well-known/farcaster.json
// Этот эндпоинт отдаёт манифест для Farcaster
// Farcaster-клиенты читают его, чтобы понять, что наше приложение — Mini App

import { NextResponse } from "next/server";
import { minikitConfig } from "@/minikit.config";

export async function GET() {
  return NextResponse.json(minikitConfig, {
    headers: {
      // Разрешаем кросс-доменные запросы (Farcaster клиент будет запрашивать)
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
