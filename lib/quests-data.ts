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
  // ====== НОВЫЕ КВЕСТЫ (7-12) ======
  {
    id: 7,
    category: "security",
    title: "Staying Safe On-Chain",
    subtitle: "Protect your wallet and assets",
    xp: 90,
    duration: "5 min",
    difficulty: "Beginner",
    icon: "🛡️",
    steps: [
      {
        type: "learn",
        title: "Главные угрозы в Web3",
        content:
          "Фишинг, вредоносные аппрувы и поддельные сайты — топ-3 угрозы. Никогда не подписывайте транзакции, которых не понимаете. Один неверный approve может стоить всех ваших активов.",
      },
      {
        type: "learn",
        title: "Правило 3-х кошельков",
        content:
          "Hot wallet — для повседневных транзакций (малые суммы). Cold wallet (Ledger/Trezor) — для хранения. Burner wallet — для минтов и незнакомых dApps. Разделяйте риски!",
      },
      {
        type: "learn",
        title: "Revoke опасные разрешения",
        content:
          "Каждый раз, взаимодействуя с dApp, вы даёте approve на токены. Проверяйте и отзывайте ненужные разрешения через revoke.cash. На Base комиссия отзыва < $0.01.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Какой кошелёк лучше использовать для минтов на незнакомых сайтах?",
        options: ["Hot wallet с основными средствами", "Cold wallet", "Burner wallet", "Любой"],
        correct: 2,
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Через какой сервис можно отозвать опасные разрешения?",
        options: ["OpenSea", "revoke.cash", "Etherscan только", "Нельзя отозвать"],
        correct: 1,
      },
    ],
  },
  {
    id: 8,
    category: "bridge",
    title: "Bridging to Base",
    subtitle: "Move assets from Ethereum to Base",
    xp: 70,
    duration: "4 min",
    difficulty: "Beginner",
    icon: "🌉",
    steps: [
      {
        type: "learn",
        title: "Зачем нужен Bridge?",
        content:
          "Bridge (мост) переносит активы между сетями. Чтобы использовать Base, нужно перевести ETH или токены из Ethereum L1 на Base L2. Это как перевод между банками, но on-chain.",
      },
      {
        type: "learn",
        title: "Official Base Bridge",
        content:
          "bridge.base.org — официальный мост. L1→L2 занимает ~1 минуту. L2→L1 (вывод) — ~7 дней из-за challenge period. Для быстрого вывода используйте Across, Stargate или Relay.",
      },
      {
        type: "learn",
        title: "Coinbase — самый простой путь",
        content:
          "Самый лёгкий способ получить ETH на Base — вывести напрямую с Coinbase. Выберите сеть Base при выводе — мгновенно и дёшево. Это path of least resistance.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Сколько длится вывод через официальный Base Bridge (L2→L1)?",
        options: ["1 минута", "1 час", "1 день", "~7 дней"],
        correct: 3,
      },
    ],
  },
  {
    id: 9,
    category: "dev",
    title: "Building on Base",
    subtitle: "Start your dev journey",
    xp: 100,
    duration: "6 min",
    difficulty: "Intermediate",
    icon: "⚒️",
    steps: [
      {
        type: "learn",
        title: "Base = EVM-совместимый",
        content:
          "Base полностью совместим с EVM (Ethereum Virtual Machine). Если вы умеете писать Solidity — вы уже умеете строить на Base. Все инструменты Ethereum работают: Hardhat, Foundry, Remix.",
      },
      {
        type: "learn",
        title: "OnchainKit — быстрый старт",
        content:
          "OnchainKit от Coinbase — React-библиотека для on-chain приложений. Wallet connection, транзакции, Identity — всё из коробки. Base Quest построен на OnchainKit!",
      },
      {
        type: "learn",
        title: "Base.dev — Submit & Build",
        content:
          "base.dev — платформа для разработчиков Base. Подавайте свои проекты, получайте гранты и фидбек от команды Base. Hackathons, Buildathons и rewards для лучших билдеров.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Какая React-библиотека от Coinbase упрощает on-chain разработку?",
        options: ["web3.js", "ethers.js", "OnchainKit", "Wagmi"],
        correct: 2,
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Base совместим с...",
        options: ["Только Solana", "EVM (Ethereum Virtual Machine)", "Cosmos SDK", "Polkadot"],
        correct: 1,
      },
    ],
  },
  {
    id: 10,
    category: "stablecoin",
    title: "USDC on Base",
    subtitle: "The dollar on-chain",
    xp: 75,
    duration: "4 min",
    difficulty: "Beginner",
    icon: "💵",
    steps: [
      {
        type: "learn",
        title: "USDC — доллар на блокчейне",
        content:
          "USDC — стейблкоин от Circle, привязанный 1:1 к доллару США. На Base это нативный USDC (не bridged), что означает прямую поддержку от Circle с мгновенным выпуском и погашением.",
      },
      {
        type: "learn",
        title: "Зачем нужен USDC на Base?",
        content:
          "Переводы USDC на Base стоят < $0.01 и занимают < 1 секунды. Сравните: банковский перевод — $25-50 и 1-3 дня. USDC на Base — это будущее платежей.",
      },
      {
        type: "learn",
        title: "Заработок на USDC",
        content:
          "Через Morpho, Aave или Compound на Base можно получать 3-8% годовых на USDC. Это значительно больше, чем на банковском вкладе, и с полным контролем ваших средств.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "USDC на Base — это...",
        options: ["Bridged USDC", "Нативный USDC от Circle", "Wrapped USDC", "USDT"],
        correct: 1,
      },
    ],
  },
  {
    id: 11,
    category: "governance",
    title: "Base Governance & OP Stack",
    subtitle: "How Base is governed",
    xp: 85,
    duration: "5 min",
    difficulty: "Intermediate",
    icon: "⚖️",
    steps: [
      {
        type: "learn",
        title: "OP Stack — движок Base",
        content:
          "Base построен на OP Stack — open-source фреймворке от Optimism. Это делает Base частью Superchain — сети совместимых L2. Interop между Base, Optimism, Zora, Mode и другими.",
      },
      {
        type: "learn",
        title: "Revenue Sharing",
        content:
          "Base делит доход с Optimism Collective. Часть прибыли от секвенсера идёт на развитие общего блага (public goods). Это модель sustainable Web3 — рост экосистемы, а не только прибыль.",
      },
      {
        type: "learn",
        title: "Superchain Vision",
        content:
          "Цель Superchain — сотни L2 на OP Stack, работающих как одна сеть. Общая безопасность, shared sequencing, native bridging. Base — якорный участник этой vision.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "На каком фреймворке построен Base?",
        options: ["ZK Stack", "OP Stack", "Cosmos SDK", "Собственный"],
        correct: 1,
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Superchain — это...",
        options: [
          "Отдельный блокчейн",
          "Биржа",
          "Сеть совместимых L2 на OP Stack",
          "NFT-коллекция",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 12,
    category: "meme",
    title: "Memecoins & Culture",
    subtitle: "The fun side of Base",
    xp: 65,
    duration: "4 min",
    difficulty: "Beginner",
    icon: "🐸",
    steps: [
      {
        type: "learn",
        title: "Мемкоины на Base",
        content:
          "Base стал домом для мемкоинов: BRETT, TOSHI, DEGEN и других. Мемкоины — это cultural tokens, отражающие настроение и юмор комьюнити. Высокий risk, но огромная энергия.",
      },
      {
        type: "learn",
        title: "DEGEN — валюта Farcaster",
        content:
          "DEGEN родился как tipping-токен в Farcaster. Пользователи награждали друг друга за хорошие посты. Из шутки вырос в серьёзный проект с собственным L3 (Degen Chain).",
      },
      {
        type: "learn",
        title: "Осторожность с мемкоинами",
        content:
          "99% мемкоинов теряют стоимость. Правила: никогда не вкладывайте больше, чем готовы потерять. DYOR (Do Your Own Research). Проверяйте ликвидность и lock-up токенов.",
      },
      {
        type: "quiz",
        title: "Проверь себя",
        content: "",
        question: "Откуда появился токен DEGEN?",
        options: ["Binance Launchpad", "Farcaster tipping", "Coinbase листинг", "Airdrop"],
        correct: 1,
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
  { id: "security", label: "Security", icon: "🛡️" },
  { id: "bridge", label: "Bridge", icon: "🌉" },
  { id: "dev", label: "Dev", icon: "⚒️" },
  { id: "stablecoin", label: "USDC", icon: "💵" },
  { id: "governance", label: "Gov", icon: "⚖️" },
  { id: "meme", label: "Meme", icon: "🐸" },
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
    description: "Complete all 12 quests",
    requirement: 12,
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
