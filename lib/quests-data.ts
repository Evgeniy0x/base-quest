// ========================================
// ДАННЫЕ КВЕСТОВ — контент приложения
// ========================================

export type StepType = "learn" | "quiz" | "action";

export interface QuestStep {
  type: StepType;
  title: string;
  content: string;
  // Для квизов
  question?: string;
  options?: string[];
  correct?: number;
  // Для действий
  actionLabel?: string;
}

export interface Quest {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  xp: number;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
  steps: QuestStep[];
}

export const QUESTS: Quest[] = [
  {
    id: 1,
    category: "basics",
    title: "What is Base?",
    subtitle: "Learn the fundamentals of Base L2",
    xp: 50,
    duration: "3 min",
    difficulty: "Beginner",
    icon: "🔵",
    steps: [
      {
        type: "learn",
        title: "Base — это Layer 2",
        content:
          "Base — это Ethereum Layer 2, созданный Coinbase. Он делает транзакции быстрыми (<1 сек) и дешёвыми (<$0.01), сохраняя безопасность Ethereum. Построен на технологии OP Stack.",
      },
      {
        type: "learn",
        title: "Зачем нужен Base?",
        content:
          "Ethereum обрабатывает ~15 транзакций в секунду с комиссиями $5-50. Base — до 2000+ TPS с комиссиями менее $0.01. Это делает on-chain приложения доступными для миллионов людей.",
      },
      {
        type: "learn",
        title: "Base в цифрах",
        content:
          "В 2025 году Base сгенерировал $369.9M выручки для приложений экосистемы. Это самый быстрорастущий L2 по количеству пользователей, транзакций и TVL.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Кто создал Base?",
        options: ["Binance", "Coinbase", "OpenAI", "Ethereum Foundation"],
        correct: 1,
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Base — это...",
        options: [
          "Отдельный блокчейн Layer 1",
          "Ethereum Layer 2",
          "Sidechain",
          "Централизованная биржа",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 2,
    category: "defi",
    title: "DeFi on Base",
    subtitle: "Discover decentralized finance",
    xp: 75,
    duration: "5 min",
    difficulty: "Beginner",
    icon: "💰",
    steps: [
      {
        type: "learn",
        title: "Что такое DeFi?",
        content:
          "DeFi (Decentralized Finance) — финансовые сервисы без банков. Кредитование, обмен, сбережения — всё через смарт-контракты. Код заменяет посредника.",
      },
      {
        type: "learn",
        title: "Aerodrome — главный DEX",
        content:
          "Aerodrome Finance — крупнейшая биржа на Base. TVL: $424M+. Здесь можно обменять токены с минимальными комиссиями и предоставлять ликвидность для заработка.",
      },
      {
        type: "learn",
        title: "Morpho — умные вклады",
        content:
          "Morpho позволяет вносить ETH или USDC в курируемые хранилища (vaults) и получать доход. TVL вырос с $354M до $2 млрд+. Интегрирован прямо в Coinbase App.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Какой DEX является крупнейшим на Base по TVL?",
        options: ["Uniswap", "Aerodrome", "PancakeSwap", "SushiSwap"],
        correct: 1,
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "TVL Morpho на Base превышает...",
        options: ["$100M", "$500M", "$2 млрд", "$10 млрд"],
        correct: 2,
      },
    ],
  },
  {
    id: 3,
    category: "social",
    title: "Farcaster & Social",
    subtitle: "The social layer of Base",
    xp: 60,
    duration: "4 min",
    difficulty: "Beginner",
    icon: "💬",
    steps: [
      {
        type: "learn",
        title: "Farcaster — соцсеть on-chain",
        content:
          "Farcaster — децентрализованный протокол для соцсетей. Ваши данные принадлежат вам, а не корпорации. 350K+ платных подписчиков с высокой долей крипто-китов.",
      },
      {
        type: "learn",
        title: "Mini Apps — приложения в ленте",
        content:
          "Mini Apps работают прямо внутри ленты Farcaster. Это как мини-приложения в Telegram — но с доступом к кошельку и on-chain данным. Base Quest — тоже мини-апп!",
      },
      {
        type: "learn",
        title: "Warpcast — клиент №1",
        content:
          "Warpcast — самый популярный клиент для Farcaster. Здесь общаются разработчики, основатели проектов и активные участники крипто-комьюнити.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Farcaster — это...",
        options: [
          "Блокчейн",
          "DEX-биржа",
          "Децентрализованный соцсеть-протокол",
          "NFT-маркетплейс",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 4,
    category: "nft",
    title: "Zora & Creator Economy",
    subtitle: "Create and monetize on Base",
    xp: 80,
    duration: "5 min",
    difficulty: "Intermediate",
    icon: "🎨",
    steps: [
      {
        type: "learn",
        title: "Zora — каждый пост = токен",
        content:
          "На Zora каждый пост автоматически становится ERC-20 токеном с supply 1 млрд. Когда другие торгуют вашим контентом, вы получаете 50% комиссий с торговли + 50% LP-комиссий.",
      },
      {
        type: "learn",
        title: "Creator Economy на Base",
        content:
          "Base делает ставку на Creator Economy — экономику создателей. Артисты, музыканты, блогеры могут монетизировать аудиторию напрямую, без YouTube, Spotify или Instagram как посредников.",
      },
      {
        type: "learn",
        title: "Почему это революция",
        content:
          "На YouTube создатель получает ~$3-5 за 1000 просмотров. На Zora один вирусный пост может принести $1000+ в комиссиях. Это переворачивает экономику контента.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "На Zora пост автоматически становится...",
        options: [
          "NFT (ERC-721)",
          "ERC-20 токеном",
          "Стейблкоином",
          "Governance токеном",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 5,
    category: "ai",
    title: "AI Agents on Base",
    subtitle: "The future of autonomous finance",
    xp: 100,
    duration: "6 min",
    difficulty: "Intermediate",
    icon: "🤖",
    steps: [
      {
        type: "learn",
        title: "AI + Crypto = Agents",
        content:
          "AI-агенты — автономные программы, управляющие on-chain активами. Они анализируют рынок, находят лучшие yield-стратегии и выполняют транзакции 24/7 без вашего участия.",
      },
      {
        type: "learn",
        title: "Virtuals Protocol",
        content:
          "Virtuals — платформа для запуска AI-агентов на Base. Выручка: $43.2M — это 12% от всей экосистемы Base. Самый быстрорастущий сектор.",
      },
      {
        type: "learn",
        title: "Giza & Arma",
        content:
          "Arma от Giza — AI yield-оптимизатор. $2 млрд+ в объёме транзакций, TVL ~$30M. Интегрирован в Base App — можно включить одной кнопкой.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Какой % от выручки экосистемы Base приходится на Virtuals?",
        options: ["2%", "5%", "12%", "25%"],
        correct: 2,
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Что делает Arma от Giza?",
        options: [
          "Торгует мемкоинами",
          "Оптимизирует доходность (yield)",
          "Создаёт NFT",
          "Пишет код",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 6,
    category: "wallet",
    title: "Your Base Wallet",
    subtitle: "Get set up and ready to go",
    xp: 120,
    duration: "7 min",
    difficulty: "Beginner",
    icon: "👛",
    steps: [
      {
        type: "learn",
        title: "Base App (ex-Coinbase Wallet)",
        content:
          "Base App — ваш вход в экосистему. Это суперприложение: кошелёк + соцсеть + мини-аппы + DeFi + AI-агенты. Всё в одном, построено на Farcaster.",
      },
      {
        type: "learn",
        title: "Smart Wallet — без seed-фразы",
        content:
          "Coinbase Smart Wallet создаётся за 1 клик через Face ID или отпечаток пальца. Никакой seed-фразы! Account Abstraction делает кошелёк таким же простым, как приложение банка.",
      },
      {
        type: "learn",
        title: "Газ на Base",
        content:
          "Для транзакций нужен ETH на сети Base. Средняя комиссия: <$0.01. Многие приложения (включая Base Quest) спонсируют газ за вас через Paymaster — транзакции бесплатны!",
      },
      {
        type: "action",
        title: "Подключи кошелёк",
        content:
          "Подключи свой кошелёк к Base Quest, чтобы сохранять прогресс on-chain и получать NFT-бейджи за достижения!",
        actionLabel: "Connect Wallet",
      },
    ],
  },
];

// Категории для фильтрации
export const CATEGORIES = [
  { id: "all", label: "All", icon: "🌐" },
  { id: "basics", label: "Basics", icon: "🔵" },
  { id: "defi", label: "DeFi", icon: "💰" },
  { id: "social", label: "Social", icon: "💬" },
  { id: "nft", label: "NFT", icon: "🎨" },
  { id: "ai", label: "AI", icon: "🤖" },
  { id: "wallet", label: "Wallet", icon: "👛" },
];

// Бейджи
export interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  requirement: number;
  type: "quests" | "correct" | "streak" | "shares";
}

export const BADGES: Badge[] = [
  {
    id: 1,
    name: "Base Newbie",
    icon: "🌱",
    description: "Complete your first quest",
    requirement: 1,
    type: "quests",
  },
  {
    id: 2,
    name: "Knowledge Seeker",
    icon: "📚",
    description: "Complete 3 quests",
    requirement: 3,
    type: "quests",
  },
  {
    id: 3,
    name: "Base Explorer",
    icon: "🧭",
    description: "Complete all quests",
    requirement: 6,
    type: "quests",
  },
  {
    id: 4,
    name: "Quiz Master",
    icon: "🧠",
    description: "Answer 10 questions correctly",
    requirement: 10,
    type: "correct",
  },
  {
    id: 5,
    name: "Streak King",
    icon: "🔥",
    description: "7-day login streak",
    requirement: 7,
    type: "streak",
  },
  {
    id: 6,
    name: "Social Butterfly",
    icon: "🦋",
    description: "Share 3 achievements",
    requirement: 3,
    type: "shares",
  },
];

// Демо-данные лидерборда
export const LEADERBOARD = [
  { rank: 1, name: "vitalik.eth", avatar: "🧙", xp: 2450, badges: 6, streak: 14 },
  { rank: 2, name: "jesse.base", avatar: "🔵", xp: 2100, badges: 5, streak: 12 },
  { rank: 3, name: "dwr.eth", avatar: "🟣", xp: 1890, badges: 5, streak: 9 },
  { rank: 4, name: "you", avatar: "🎮", xp: 0, badges: 0, streak: 0, isUser: true },
  { rank: 5, name: "alice.base", avatar: "🌸", xp: 1420, badges: 4, streak: 5 },
  { rank: 6, name: "bob.fc", avatar: "⚡", xp: 1200, badges: 3, streak: 4 },
  { rank: 7, name: "crypto_nina", avatar: "🦄", xp: 980, badges: 3, streak: 3 },
  { rank: 8, name: "onchain.eth", avatar: "🌐", xp: 750, badges: 2, streak: 2 },
];
