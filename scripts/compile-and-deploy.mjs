// ========================================
// КОМПИЛЯЦИЯ + ДЕПЛОЙ BaseQuestBadges
// ========================================
// node scripts/compile-and-deploy.mjs

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createWalletClient, createPublicClient, http, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import solc from "solc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// ---- 1. КОМПИЛЯЦИЯ ----
console.log("🔧 Компиляция контракта...");

const contractSource = readFileSync(
  resolve(projectRoot, "contracts/BaseQuestBadges.sol"),
  "utf8"
);

// Функция для резолва импортов OpenZeppelin
function findImports(importPath) {
  try {
    const fullPath = resolve(projectRoot, "node_modules", importPath);
    const content = readFileSync(fullPath, "utf8");
    return { contents: content };
  } catch (e) {
    return { error: `File not found: ${importPath}` };
  }
}

const input = {
  language: "Solidity",
  sources: {
    "BaseQuestBadges.sol": { content: contractSource },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      "*": { "*": ["abi", "evm.bytecode.object"] },
    },
  },
};

const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

// Проверяем ошибки
if (output.errors) {
  const serious = output.errors.filter((e) => e.severity === "error");
  if (serious.length > 0) {
    console.error("❌ Ошибки компиляции:");
    serious.forEach((e) => console.error(e.formattedMessage));
    process.exit(1);
  }
  // Warnings — ок
  output.errors
    .filter((e) => e.severity === "warning")
    .forEach((e) => console.warn("⚠️", e.message));
}

const contract = output.contracts["BaseQuestBadges.sol"]["BaseQuestBadges"];
const abi = contract.abi;
const bytecode = `0x${contract.evm.bytecode.object}`;

console.log("✅ Контракт скомпилирован!");
console.log(`   ABI: ${abi.length} функций`);
console.log(`   Bytecode: ${bytecode.length} символов`);

// Сохраняем compiled ABI + bytecode
writeFileSync(
  resolve(projectRoot, "lib/contracts/compiled.json"),
  JSON.stringify({ abi, bytecode }, null, 2)
);
console.log("📄 Сохранено в lib/contracts/compiled.json");

// ---- 2. ДЕПЛОЙ ----
const PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.log("\n⚠️ MINTER_PRIVATE_KEY не задан.");
  console.log("Для деплоя:");
  console.log("  MINTER_PRIVATE_KEY=0x... node scripts/compile-and-deploy.mjs");
  console.log("\nБайткод сохранён — можно деплоить через Remix.");
  process.exit(0);
}

console.log("\n🚀 Деплой на Base Sepolia...");

const account = privateKeyToAccount(PRIVATE_KEY);
console.log(`   Deployer: ${account.address}`);

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http("https://sepolia.base.org"),
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http("https://sepolia.base.org"),
});

// Проверяем баланс
const balance = await publicClient.getBalance({ address: account.address });
console.log(`   Balance: ${Number(balance) / 1e18} ETH`);

if (balance === 0n) {
  console.log("\n❌ Нет ETH на Base Sepolia!");
  console.log("Получите тестовый ETH:");
  console.log("  https://www.base.dev/faucet");
  console.log(`  Адрес: ${account.address}`);
  process.exit(1);
}

// Constructor arg: baseURI для метаданных
const baseURI = "https://base-quest-peach.vercel.app/api/metadata/";

// Деплоим
const hash = await walletClient.deployContract({
  abi,
  bytecode,
  args: [baseURI],
});

console.log(`   TX: ${hash}`);
console.log("   Ожидаю подтверждения...");

const receipt = await publicClient.waitForTransactionReceipt({ hash });
const contractAddress = receipt.contractAddress;

console.log(`\n✅ КОНТРАКТ ЗАДЕПЛОЕН!`);
console.log(`   Address: ${contractAddress}`);
console.log(`   TX: https://sepolia.basescan.org/tx/${hash}`);
console.log(`   Contract: https://sepolia.basescan.org/address/${contractAddress}`);
console.log(`\n📋 Добавь в Vercel env variables:`);
console.log(`   NEXT_PUBLIC_BADGE_CONTRACT=${contractAddress}`);
console.log(`   MINTER_PRIVATE_KEY=${PRIVATE_KEY}`);

// Сохраняем адрес
writeFileSync(
  resolve(projectRoot, "lib/contracts/deployment.json"),
  JSON.stringify(
    {
      network: "base-sepolia",
      address: contractAddress,
      txHash: hash,
      deployer: account.address,
      deployedAt: new Date().toISOString(),
    },
    null,
    2
  )
);
