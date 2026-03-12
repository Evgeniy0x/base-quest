// ========================================
// СХЕМА БАЗЫ ДАННЫХ — Vercel Postgres
// ========================================
// Три таблицы: users, completed_quests, minted_badges
// Связь: users.id → completed_quests.user_id, minted_badges.user_id

// SQL для создания таблиц (выполняется через /api/migrate)
export const CREATE_TABLES_SQL = `
-- Таблица пользователей
-- fid = Farcaster ID (уникальный идентификатор в Farcaster)
CREATE TABLE IF NOT EXISTS users (
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
);

-- Таблица пройденных квестов
-- Связь many-to-many: один пользователь может пройти много квестов
CREATE TABLE IF NOT EXISTS completed_quests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quest_id INTEGER NOT NULL,
  correct_count INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- Таблица заминченных NFT-бейджей
-- Хранит tx_hash транзакции минта на Base
CREATE TABLE IF NOT EXISTS minted_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL,
  tx_hash TEXT,
  token_id INTEGER,
  minted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Индексы для быстрых запросов
CREATE INDEX IF NOT EXISTS idx_users_fid ON users(fid);
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp DESC);
CREATE INDEX IF NOT EXISTS idx_completed_quests_user ON completed_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_minted_badges_user ON minted_badges(user_id);
`;

// Типы для TypeScript
export interface DbUser {
  id: number;
  fid: number;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  streak: number;
  correct_answers: number;
  shares: number;
  last_login_date: string;
  streak_days: string; // JSON массив boolean[]
  created_at: Date;
  updated_at: Date;
}

export interface DbCompletedQuest {
  id: number;
  user_id: number;
  quest_id: number;
  correct_count: number;
  xp_earned: number;
  completed_at: Date;
}

export interface DbMintedBadge {
  id: number;
  user_id: number;
  badge_id: number;
  tx_hash: string | null;
  token_id: number | null;
  minted_at: Date;
}
