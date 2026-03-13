// ========================================
// МЕТАДАННЫЕ NFT-БЕЙДЖЕЙ
// ========================================
// ERC-1155 metadata format (стандарт OpenSea)
// Каждый бейдж имеет tokenId от 1 до 6

export interface BadgeMetadata {
  name: string;
  description: string;
  image: string; // URL к изображению
  external_url: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

// Базовый URL приложения
const APP_URL = "https://base-quest-peach.vercel.app";

// Метаданные для каждого бейджа
// tokenId соответствует badge.id из quests-data.ts
export const BADGE_METADATA: Record<number, BadgeMetadata> = {
  1: {
    name: "Base Newbie",
    description:
      "Completed the first quest on Base Quest. The journey of a thousand miles begins with a single step.",
    image: `${APP_URL}/badges/1.svg`,
    external_url: APP_URL,
    attributes: [
      { trait_type: "Category", value: "Achievement" },
      { trait_type: "Tier", value: "Bronze" },
      { trait_type: "Requirement", value: "Complete 1 quest" },
      { trait_type: "Rarity", value: "Common" },
    ],
  },
  2: {
    name: "Knowledge Seeker",
    description:
      "Completed 3 quests on Base Quest. Curiosity is the engine of achievement.",
    image: `${APP_URL}/badges/2.svg`,
    external_url: APP_URL,
    attributes: [
      { trait_type: "Category", value: "Achievement" },
      { trait_type: "Tier", value: "Silver" },
      { trait_type: "Requirement", value: "Complete 3 quests" },
      { trait_type: "Rarity", value: "Uncommon" },
    ],
  },
  3: {
    name: "Base Explorer",
    description:
      "Completed all quests on Base Quest. A true explorer of the Base ecosystem.",
    image: `${APP_URL}/badges/3.svg`,
    external_url: APP_URL,
    attributes: [
      { trait_type: "Category", value: "Achievement" },
      { trait_type: "Tier", value: "Gold" },
      { trait_type: "Requirement", value: "Complete all quests" },
      { trait_type: "Rarity", value: "Rare" },
    ],
  },
  4: {
    name: "Quiz Master",
    description:
      "Answered 10 questions correctly. Knowledge is the true currency on-chain.",
    image: `${APP_URL}/badges/4.svg`,
    external_url: APP_URL,
    attributes: [
      { trait_type: "Category", value: "Skill" },
      { trait_type: "Tier", value: "Gold" },
      { trait_type: "Requirement", value: "10 correct answers" },
      { trait_type: "Rarity", value: "Rare" },
    ],
  },
  5: {
    name: "Streak King",
    description:
      "Maintained a 7-day login streak. Consistency builds empires on-chain.",
    image: `${APP_URL}/badges/5.svg`,
    external_url: APP_URL,
    attributes: [
      { trait_type: "Category", value: "Dedication" },
      { trait_type: "Tier", value: "Platinum" },
      { trait_type: "Requirement", value: "7-day streak" },
      { trait_type: "Rarity", value: "Epic" },
    ],
  },
  6: {
    name: "Social Butterfly",
    description:
      "Shared 3 achievements on Farcaster. Building the Base community, one cast at a time.",
    image: `${APP_URL}/badges/6.svg`,
    external_url: APP_URL,
    attributes: [
      { trait_type: "Category", value: "Social" },
      { trait_type: "Tier", value: "Silver" },
      { trait_type: "Requirement", value: "Share 3 times" },
      { trait_type: "Rarity", value: "Uncommon" },
    ],
  },
};
