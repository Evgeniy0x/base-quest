// ========================================
// API: МИГРАЦИЯ БАЗЫ ДАННЫХ
// ========================================
// GET /api/migrate — создаёт таблицы в БД
// Вызвать один раз после подключения Vercel Postgres

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Каждый запрос отдельно — без комментариев, чтобы не ломать парсинг
const MIGRATIONS = [
  // 1. Таблица пользователей
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fid INTEGER UNIQUE NOT NULL,
    username TEXT,
    display_name TEXT,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    last_login_date TEXT DEFAULT '',
    streak_days TEXT DEFAULT '[false,false,false,false,false,false,false]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  // 2. Таблица пройденных квестов
  `CREATE TABLE IF NOT EXISTS completed_quests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER NOT NULL,
    correct_count INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, quest_id)
  )`,
  // 3. Таблица заминченных NFT-бейджей
  `CREATE TABLE IF NOT EXISTS minted_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER NOT NULL,
    tx_hash TEXT,
    token_id INTEGER,
    minted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
  )`,
  // 4. Индексы
  `CREATE INDEX IF NOT EXISTS idx_users_fid ON users(fid)`,
  `CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_completed_quests_user ON completed_quests(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_minted_badges_user ON minted_badges(user_id)`,
];

export async function GET() {
  try {
    const results: string[] = [];

    for (let i = 0; i < MIGRATIONS.length; i++) {
      await sql.query(MIGRATIONS[i]);
      results.push(`✅ Migration ${i + 1}/${MIGRATIONS.length} OK`);
    }

    return NextResponse.json({
      success: true,
      message: "Все таблицы созданы!",
      details: results,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
