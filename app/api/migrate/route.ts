// ========================================
// API: МИГРАЦИЯ БАЗЫ ДАННЫХ
// ========================================
// GET /api/migrate — создаёт таблицы в БД
// Вызвать один раз после подключения Vercel Postgres

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { CREATE_TABLES_SQL } from "@/lib/db/schema";

export async function GET() {
  try {
    // Выполняем каждый SQL-запрос отдельно
    // (sql`` не поддерживает несколько команд за раз)
    const statements = CREATE_TABLES_SQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      await sql.query(statement);
    }

    return NextResponse.json({
      success: true,
      message: "Таблицы созданы успешно! users, completed_quests, minted_badges",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
