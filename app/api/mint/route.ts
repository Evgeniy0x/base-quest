// ========================================
// API: СЕРВЕРНЫЙ МИНТ NFT-БЕЙДЖА
// ========================================
// POST /api/mint
// Body: { fid: number, badgeId: number, walletAddress: string }
//
// Серверный кошелёк (MINTER_PRIVATE_KEY) минтит NFT
// на адрес пользователя. Пользователю не нужен газ!

import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, base } from "viem/chains";
import { BADGE_CONTRACT_ABI } from "@/lib/contracts/abi";
import { sql } from "@vercel/postgres";

// Выбираем сеть: Base mainnet по умолчанию, Sepolia только для тестов
const IS_MAINNET = process.env.NEXT_PUBLIC_CHAIN === "base-mainnet";
const chain = IS_MAINNET ? base : baseSepolia;
const rpcUrl = IS_MAINNET
  ? "https://mainnet.base.org"
  : "https://sepolia.base.org";

export async function POST(request: NextRequest) {
  try {
    const { fid, badgeId, walletAddress } = await request.json();

    // Валидация
    if (!fid || !badgeId || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields: fid, badgeId, walletAddress" },
        { status: 400 }
      );
    }

    // Проверяем наличие env variables
    const privateKey = process.env.MINTER_PRIVATE_KEY;
    const contractAddress = process.env.NEXT_PUBLIC_BADGE_CONTRACT;

    if (!privateKey || !contractAddress) {
      return NextResponse.json(
        { error: "Minting not configured. Contract not deployed yet." },
        { status: 503 }
      );
    }

    // Проверяем, что пользователь существует в базе
    const userResult = await sql`SELECT id FROM users WHERE fid = ${fid}`;
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found. Complete some quests first!" },
        { status: 404 }
      );
    }

    // Проверяем, не заминчен ли уже
    const mintedResult = await sql`
      SELECT id FROM minted_badges
      WHERE user_id = ${userResult.rows[0].id} AND badge_id = ${badgeId}
    `;
    if (mintedResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Badge already minted!", alreadyMinted: true },
        { status: 409 }
      );
    }

    // Создаём клиентов viem
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(rpcUrl),
    });

    const publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

    // Проверяем on-chain: уже заминчено?
    const alreadyMinted = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: BADGE_CONTRACT_ABI,
      functionName: "hasMinted",
      args: [getAddress(walletAddress), BigInt(badgeId)],
    });

    if (alreadyMinted) {
      // Сохраняем в БД если не было
      await sql`
        INSERT INTO minted_badges (user_id, badge_id, tx_hash)
        VALUES (${userResult.rows[0].id}, ${badgeId}, 'already-on-chain')
        ON CONFLICT (user_id, badge_id) DO NOTHING
      `;
      return NextResponse.json(
        { error: "Badge already minted on-chain!", alreadyMinted: true },
        { status: 409 }
      );
    }

    // Минтим NFT!
    const txHash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: BADGE_CONTRACT_ABI,
      functionName: "mint",
      args: [getAddress(walletAddress), BigInt(badgeId)],
    });

    // Ждём подтверждения транзакции
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    // Сохраняем в базу
    await sql`
      INSERT INTO minted_badges (user_id, badge_id, tx_hash)
      VALUES (${userResult.rows[0].id}, ${badgeId}, ${txHash})
      ON CONFLICT (user_id, badge_id) DO UPDATE SET tx_hash = ${txHash}
    `;

    return NextResponse.json({
      success: true,
      txHash,
      blockNumber: receipt.blockNumber.toString(),
      tokenId: badgeId,
      explorerUrl: IS_MAINNET
        ? `https://basescan.org/tx/${txHash}`
        : `https://sepolia.basescan.org/tx/${txHash}`,
    });
  } catch (error) {
    console.error("Mint error:", error);
    return NextResponse.json(
      { error: `Minting failed: ${String(error)}` },
      { status: 500 }
    );
  }
}
