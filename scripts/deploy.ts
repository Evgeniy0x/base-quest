// ========================================
// СКРИПТ ДЕПЛОЯ BaseQuestBadges на Base Sepolia
// ========================================
// Запуск: npx ts-node scripts/deploy.ts
//
// Требования:
// 1. DEPLOYER_PRIVATE_KEY — приватный ключ для деплоя
// 2. Тестовый ETH на Base Sepolia (https://www.base.dev/faucet)
//
// Этот скрипт деплоит контракт и выводит адрес.
// Скопируй адрес в NEXT_PUBLIC_BADGE_CONTRACT в Vercel env variables.

import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

// Bytecode будет получен после компиляции контракта
// Для начала используем упрощённый ERC-1155 контракт
// который деплоим через Remix IDE (проще и надёжнее)

console.log(`
========================================
  ДЕПЛОЙ BaseQuestBadges на Base Sepolia
========================================

Лучший способ — через Remix IDE:

1. Открой https://remix.ethereum.org
2. Создай файл BaseQuestBadges.sol
3. Скопируй контракт из contracts/BaseQuestBadges.sol
4. Компилятор: 0.8.20+
5. Deploy & Run → Injected Provider (MetaMask)
6. Сеть: Base Sepolia (Chain ID: 84532)
7. Constructor arg: "https://base-quest-peach.vercel.app/api/metadata/"
8. Deploy!

Или через Thirdweb:
1. https://thirdweb.com/explore/erc-1155
2. Deploy → Base Sepolia
3. Done!

После деплоя:
- Скопируй адрес контракта
- Добавь в Vercel: NEXT_PUBLIC_BADGE_CONTRACT = 0x...
- Добавь MINTER_PRIVATE_KEY = 0x... (приватный ключ owner)
========================================
`);
