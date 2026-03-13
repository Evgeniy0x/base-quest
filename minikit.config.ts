// Конфигурация MiniKit для Base Quest
// Этот файл генерирует farcaster.json манифест

const ROOT_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const minikitConfig = {
  // Account Association — подпись сгенерирована через Farcaster Developer Tools
  accountAssociation: {
    header:
      "eyJmaWQiOjk0Mzg5NSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJmODlmZjY3RjE3OTNkYURDOWVhYzhDM2FFMDYwMDA5MmI3QUU0OWEifQ",
    payload: "eyJkb21haW4iOiJiYXNlLXF1ZXN0LXBlYWNoLnZlcmNlbC5hcHAifQ",
    signature:
      "4jUW8X1xas2RIlx+LzSI1n4hDWJYg9M83Zvj1pa0oJlV1IVnmSUHivf7syitMV2ssQ4ZAXOD1cMCod0U8Xx//hs=",
  },
  // Конфигурация мини-аппа
  frame: {
    version: "1",
    name: "Base Quest",
    subtitle: "Learn Base. Earn Rewards.",
    description:
      "Learn-to-earn mini app for Base. Complete quests, earn XP, collect NFT badges, and climb the leaderboard while mastering Base L2.",
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0a0a1e",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "education",
    tags: ["learn", "base", "defi", "quests", "web3"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    ogTitle: "Base Quest",
    ogDescription:
      "Complete quests, earn XP, collect NFT badges while learning the Base ecosystem.",
    ogImageUrl: `${ROOT_URL}/og.png`,
    imageUrl: `${ROOT_URL}/og.png`,
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
  },
};
