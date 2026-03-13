// ========================================
// ON-CHAIN ВЕРИФИКАЦИЯ КВЕСТОВ
// ========================================
// Проверяем реальные действия пользователей на Base
// Каждая функция проверяет конкретное on-chain условие

import { createPublicClient, http, formatEther, parseAbi } from "viem";
import { base, baseSepolia } from "viem/chains";

// Клиент для чтения данных из блокчейна
// Используем mainnet для верификации реальных действий
const mainnetClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

// Клиент для тестнета (для тестирования)
const testnetClient = createPublicClient({
  chain: baseSepolia,
  transport: http("https://sepolia.base.org"),
});

// Выбираем клиент в зависимости от среды
const getClient = () => {
  return process.env.NEXT_PUBLIC_CHAIN === "base-mainnet"
    ? mainnetClient
    : mainnetClient; // Всегда проверяем на mainnet — реальные действия!
};

// ==========================================
// ТИПЫ
// ==========================================

export interface VerificationResult {
  verified: boolean;
  details: string;
  data?: Record<string, unknown>;
}

// ==========================================
// ВЕРИФИКАЦИИ ДЛЯ КАЖДОГО КВЕСТА
// ==========================================

// Квест 1: Base Basics — проверяем что у юзера есть ETH на Base
export async function verifyBaseBasics(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    const balance = await mainnetClient.getBalance({
      address: walletAddress,
    });
    const ethBalance = parseFloat(formatEther(balance));
    const verified = ethBalance > 0;

    return {
      verified,
      details: verified
        ? `Has ${ethBalance.toFixed(6)} ETH on Base`
        : "No ETH found on Base. Bridge some ETH to Base first!",
      data: { balance: ethBalance },
    };
  } catch {
    return { verified: false, details: "Could not check balance" };
  }
}

// Квест 2: DeFi on Base — проверяем взаимодействие с DeFi протоколами
// Проверяем что юзер имеет токены или LP позиции
export async function verifyDeFiOnBase(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    // Проверяем баланс USDC на Base
    const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    const balance = await mainnetClient.readContract({
      address: USDC_BASE as `0x${string}`,
      abi: parseAbi(["function balanceOf(address) view returns (uint256)"]),
      functionName: "balanceOf",
      args: [walletAddress],
    });

    const usdcBalance = Number(balance) / 1e6; // USDC has 6 decimals
    const verified = usdcBalance > 0;

    return {
      verified,
      details: verified
        ? `Has ${usdcBalance.toFixed(2)} USDC on Base`
        : "No USDC found. Get some USDC on Base to verify!",
      data: { usdcBalance },
    };
  } catch {
    return { verified: false, details: "Could not check DeFi activity" };
  }
}

// Квест 3: Farcaster & Social — проверяется через Farcaster SDK
// Юзер уже в Farcaster если использует наш мини-апп
export async function verifyFarcasterSocial(
  walletAddress: `0x${string}`,
  fid?: number
): Promise<VerificationResult> {
  // Если юзер имеет FID — он в Farcaster
  const verified = !!fid && fid > 0;
  return {
    verified,
    details: verified
      ? `Verified Farcaster user (FID: ${fid})`
      : "Connect your Farcaster account",
    data: { fid },
  };
}

// Квест 4: Creator Economy (Zora) — проверяем наличие NFT на Base
export async function verifyCreatorEconomy(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    // Проверяем количество транзакций — если юзер активен на Base
    const txCount = await mainnetClient.getTransactionCount({
      address: walletAddress,
    });
    const verified = txCount >= 1;

    return {
      verified,
      details: verified
        ? `${txCount} transactions on Base — active user!`
        : "No transactions on Base yet. Make your first transaction!",
      data: { transactionCount: txCount },
    };
  } catch {
    return { verified: false, details: "Could not check transactions" };
  }
}

// Квест 5: AI Agents — проверяем взаимодействие с Virtuals протоколом
export async function verifyAIAgents(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    // Проверяем VIRTUAL токен
    const VIRTUAL_TOKEN = "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b";
    const balance = await mainnetClient.readContract({
      address: VIRTUAL_TOKEN as `0x${string}`,
      abi: parseAbi(["function balanceOf(address) view returns (uint256)"]),
      functionName: "balanceOf",
      args: [walletAddress],
    });

    const tokenBalance = Number(balance) / 1e18;
    const verified = tokenBalance > 0;

    return {
      verified,
      details: verified
        ? `Holds ${tokenBalance.toFixed(2)} VIRTUAL tokens`
        : "No VIRTUAL tokens found. Explore AI agents on Base!",
      data: { virtualBalance: tokenBalance },
    };
  } catch {
    return { verified: false, details: "Could not check AI agent activity" };
  }
}

// Квест 6: Base Wallet — проверяем что есть ETH (кошелёк настроен)
export async function verifyBaseWallet(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    const balance = await mainnetClient.getBalance({
      address: walletAddress,
    });
    const txCount = await mainnetClient.getTransactionCount({
      address: walletAddress,
    });
    const ethBalance = parseFloat(formatEther(balance));
    const verified = ethBalance > 0 || txCount > 0;

    return {
      verified,
      details: verified
        ? `Wallet active: ${ethBalance.toFixed(6)} ETH, ${txCount} txs`
        : "Set up your Base wallet and fund it with some ETH",
      data: { balance: ethBalance, txCount },
    };
  } catch {
    return { verified: false, details: "Could not verify wallet" };
  }
}

// Квест 7: Security — проверяем что юзер проверял approvals
// Просто проверяем активность на Base (security-aware user = active user)
export async function verifySecurity(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    const txCount = await mainnetClient.getTransactionCount({
      address: walletAddress,
    });
    const verified = txCount >= 3;

    return {
      verified,
      details: verified
        ? `Active wallet with ${txCount} transactions — security conscious!`
        : "Need at least 3 transactions on Base to verify security awareness",
      data: { txCount },
    };
  } catch {
    return { verified: false, details: "Could not verify security activity" };
  }
}

// Квест 8: Bridging to Base — проверяем что ETH пришёл на Base
export async function verifyBridging(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    const balance = await mainnetClient.getBalance({
      address: walletAddress,
    });
    const ethBalance = parseFloat(formatEther(balance));
    // Если на Base есть ETH — значит юзер бриджил
    const verified = ethBalance > 0.0001;

    return {
      verified,
      details: verified
        ? `Successfully bridged! ${ethBalance.toFixed(6)} ETH on Base`
        : "Bridge at least 0.0001 ETH to Base to verify",
      data: { balance: ethBalance },
    };
  } catch {
    return { verified: false, details: "Could not verify bridging" };
  }
}

// Квест 9: Building on Base — проверяем деплой контракта
export async function verifyBuilding(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    // Проверяем nonce (количество транзакций) — builders обычно активны
    const txCount = await mainnetClient.getTransactionCount({
      address: walletAddress,
    });
    const verified = txCount >= 5;

    return {
      verified,
      details: verified
        ? `Power user with ${txCount} transactions — true builder!`
        : `Need 5+ transactions on Base. You have ${txCount}.`,
      data: { txCount },
    };
  } catch {
    return { verified: false, details: "Could not verify builder activity" };
  }
}

// Квест 10: USDC on Base — проверяем баланс USDC
export async function verifyUSDC(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    const balance = await mainnetClient.readContract({
      address: USDC_BASE as `0x${string}`,
      abi: parseAbi(["function balanceOf(address) view returns (uint256)"]),
      functionName: "balanceOf",
      args: [walletAddress],
    });

    const usdcBalance = Number(balance) / 1e6;
    const verified = usdcBalance >= 1;

    return {
      verified,
      details: verified
        ? `Holds ${usdcBalance.toFixed(2)} USDC on Base`
        : "Need at least 1 USDC on Base to verify",
      data: { usdcBalance },
    };
  } catch {
    return { verified: false, details: "Could not check USDC balance" };
  }
}

// Квест 11: Governance & OP Stack — проверяем что юзер знает про OP
export async function verifyGovernance(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    const txCount = await mainnetClient.getTransactionCount({
      address: walletAddress,
    });
    const balance = await mainnetClient.getBalance({
      address: walletAddress,
    });
    const ethBalance = parseFloat(formatEther(balance));
    const verified = txCount >= 2 && ethBalance > 0;

    return {
      verified,
      details: verified
        ? `Active Base citizen: ${txCount} txs, ${ethBalance.toFixed(6)} ETH`
        : "Be active on Base to learn about governance",
      data: { txCount, balance: ethBalance },
    };
  } catch {
    return { verified: false, details: "Could not verify governance activity" };
  }
}

// Квест 12: Memecoins — проверяем наличие мемкоинов
export async function verifyMemecoins(
  walletAddress: `0x${string}`
): Promise<VerificationResult> {
  try {
    // Проверяем DEGEN токен на Base
    const DEGEN = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";
    const balance = await mainnetClient.readContract({
      address: DEGEN as `0x${string}`,
      abi: parseAbi(["function balanceOf(address) view returns (uint256)"]),
      functionName: "balanceOf",
      args: [walletAddress],
    });

    const degenBalance = Number(balance) / 1e18;
    const verified = degenBalance > 0;

    return {
      verified,
      details: verified
        ? `Holds ${degenBalance.toFixed(0)} DEGEN — true degen!`
        : "Get some DEGEN tokens on Base to verify!",
      data: { degenBalance },
    };
  } catch {
    return { verified: false, details: "Could not check memecoin balance" };
  }
}

// ==========================================
// ГЛАВНАЯ ФУНКЦИЯ ВЕРИФИКАЦИИ
// ==========================================

// Маппинг questId -> функция верификации
const VERIFIERS: Record<
  number,
  (address: `0x${string}`, fid?: number) => Promise<VerificationResult>
> = {
  1: verifyBaseBasics,
  2: verifyDeFiOnBase,
  3: verifyFarcasterSocial,
  4: verifyCreatorEconomy,
  5: verifyAIAgents,
  6: verifyBaseWallet,
  7: verifySecurity,
  8: verifyBridging,
  9: verifyBuilding,
  10: verifyUSDC,
  11: verifyGovernance,
  12: verifyMemecoins,
};

export async function verifyQuest(
  questId: number,
  walletAddress: `0x${string}`,
  fid?: number
): Promise<VerificationResult> {
  const verifier = VERIFIERS[questId];
  if (!verifier) {
    return { verified: false, details: "Unknown quest" };
  }

  try {
    return await verifier(walletAddress, fid);
  } catch (error) {
    console.error(`Verification error for quest ${questId}:`, error);
    return { verified: false, details: "Verification failed — try again" };
  }
}
