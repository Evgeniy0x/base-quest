// ========================================
// ДЕПЛОЙ BaseQuestBadges на Base Mainnet
// ========================================
// Запуск: npx tsx scripts/deploy-mainnet.ts
//
// Требования:
// 1. MINTER_PRIVATE_KEY в .env.local
// 2. ETH на Base Mainnet для газа (~0.001 ETH)

import { createWalletClient, createPublicClient, http, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import * as fs from "fs";

// Загружаем .env.local
const envFile = fs.readFileSync(".env.local", "utf8");
const envVars: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) envVars[key.trim()] = rest.join("=").trim();
});

const PRIVATE_KEY = envVars.MINTER_PRIVATE_KEY || process.env.MINTER_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ MINTER_PRIVATE_KEY не найден в .env.local!");
  process.exit(1);
}

// Загружаем скомпилированный bytecode
const compiled = JSON.parse(fs.readFileSync("contracts/bytecode.json", "utf8"));
const BYTECODE = compiled.bytecode as `0x${string}`;

// Метаданные URI
const METADATA_BASE_URI = "https://base-quest-peach.vercel.app/api/metadata/";

async function deploy() {
  console.log("========================================");
  console.log("  ДЕПЛОЙ BaseQuestBadges на Base Mainnet");
  console.log("========================================\n");

  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
  console.log(`📍 Deployer: ${account.address}`);

  const publicClient = createPublicClient({
    chain: base,
    transport: http("https://mainnet.base.org"),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http("https://mainnet.base.org"),
  });

  // Проверяем баланс
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`💰 Баланс: ${formatEther(balance)} ETH`);

  if (balance === 0n) {
    console.error("\n❌ Нет ETH для газа! Отправь ~0.001 ETH на адрес выше.");
    process.exit(1);
  }

  // Оценка газа для деплоя
  console.log("\n⏳ Оцениваем газ...");

  // Кодируем constructor argument (string baseURI)
  const { encodeAbiParameters, parseAbiParameters } = await import("viem");
  const constructorArgs = encodeAbiParameters(
    parseAbiParameters("string"),
    [METADATA_BASE_URI]
  );

  // Полный bytecode с аргументами конструктора
  const deployData = `${BYTECODE}${constructorArgs.slice(2)}` as `0x${string}`;

  try {
    const gasEstimate = await publicClient.estimateGas({
      account: account.address,
      data: deployData,
    });
    const gasPrice = await publicClient.getGasPrice();
    const estimatedCost = gasEstimate * gasPrice;
    console.log(`⛽ Примерная стоимость: ${formatEther(estimatedCost)} ETH`);

    if (balance < estimatedCost) {
      console.error(`\n❌ Недостаточно ETH! Нужно минимум ${formatEther(estimatedCost)} ETH`);
      process.exit(1);
    }
  } catch (e) {
    console.log("⚠️  Не удалось оценить газ, пробуем деплоить напрямую...");
  }

  // Деплоим!
  console.log("\n🚀 Деплоим контракт...");

  const txHash = await walletClient.sendTransaction({
    data: deployData,
  });

  console.log(`📝 TX: https://basescan.org/tx/${txHash}`);
  console.log("⏳ Ждём подтверждения...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

  if (receipt.status === "success" && receipt.contractAddress) {
    console.log("\n========================================");
    console.log("  ✅ КОНТРАКТ ЗАДЕПЛОЕН!");
    console.log("========================================");
    console.log(`📍 Адрес: ${receipt.contractAddress}`);
    console.log(`🔗 BaseScan: https://basescan.org/address/${receipt.contractAddress}`);
    console.log(`⛽ Газ: ${receipt.gasUsed.toString()}`);
    console.log(`📦 Блок: ${receipt.blockNumber.toString()}`);
    console.log("\n📋 Следующие шаги:");
    console.log(`1. Обнови NEXT_PUBLIC_BADGE_CONTRACT=${receipt.contractAddress} в Vercel`);
    console.log("2. Установи NEXT_PUBLIC_CHAIN=base-mainnet в Vercel");
    console.log("3. Передеплой Vercel");

    // Сохраняем адрес в файл
    fs.writeFileSync(
      "contracts/mainnet-deployment.json",
      JSON.stringify({
        address: receipt.contractAddress,
        txHash,
        blockNumber: receipt.blockNumber.toString(),
        network: "base-mainnet",
        deployedAt: new Date().toISOString(),
      }, null, 2)
    );
    console.log("\n💾 Адрес сохранён в contracts/mainnet-deployment.json");
  } else {
    console.error("\n❌ Деплой неудачен:", receipt.status);
    process.exit(1);
  }
}

deploy().catch((error) => {
  console.error("❌ Ошибка:", error);
  process.exit(1);
});
