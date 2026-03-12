// Конфигурация MiniKit для Base Quest
// Этот файл генерирует farcaster.json манифест

const ROOT_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const minikitConfig = {
  // Account Association — генерируется на base.dev после деплоя
  accountAssociation: {
    header: process.env.NEXT_PUBLIC_FARCASTER_HEADER || "",
    payload: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD || "",
    signature: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE || "",
  },
  // Конфигурация мини-аппа
  frame: {
    version: "1",
    name: "Base Quest",
    subtitle: "Learn Base. Earn Rewards.",
    description:
      "Interactive learn-to-earn mini app for the Base ecosystem. Complete quests, earn XP, collect NFT badges, and climb the leaderboard while mastering DeFi, Farcaster, AI Agents, and more on Base L2.",
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0a0a1e",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "education",
    tags: [
      "learn",
      "education",
      "base",
      "defi",
      "quests",
      "web3",
      "earn",
      "nft",
    ],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    ogTitle: "Base Quest — Learn Base. Earn Rewards.",
    ogDescription:
      "Complete quests, earn XP, collect NFT badges while learning the Base ecosystem.",
    ogImageUrl: `${ROOT_URL}/og.png`,
    imageUrl: `${ROOT_URL}/og.png`,
  },
};
