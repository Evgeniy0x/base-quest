"use client";

// ========================================
// ЭКРАН БЕЙДЖЕЙ с NFT-минтингом
// ========================================
// Показывает прогресс, разблокированные бейджи
// и кнопку Mint NFT для отправки on-chain

import { useState } from "react";
import { BADGES } from "@/lib/quests-data";
import { UserStats } from "@/lib/store";

interface BadgesScreenProps {
  userStats: UserStats;
  walletAddress?: string;
  fid?: number | null;
}

// Статусы минта для каждого бейджа
type MintStatus = "idle" | "minting" | "minted" | "error";

export default function BadgesScreen({
  userStats,
  walletAddress,
  fid,
}: BadgesScreenProps) {
  // Стейт минтинга для каждого бейджа
  const [mintStatuses, setMintStatuses] = useState<Record<number, MintStatus>>(
    {}
  );
  const [mintTxHashes, setMintTxHashes] = useState<Record<number, string>>({});
  const [mintErrors, setMintErrors] = useState<Record<number, string>>({});

  // Прогресс бейджа (0-1)
  const getProgress = (badge: (typeof BADGES)[0]): number => {
    switch (badge.type) {
      case "quests":
        return Math.min(
          userStats.completedQuests.length / badge.requirement,
          1
        );
      case "correct":
        return Math.min(userStats.correctAnswers / badge.requirement, 1);
      case "streak":
        return Math.min(userStats.streak / badge.requirement, 1);
      case "shares":
        return Math.min(userStats.shares / badge.requirement, 1);
      default:
        return 0;
    }
  };

  // Минтинг NFT через серверный API
  const handleMint = async (badgeId: number) => {
    if (!walletAddress) {
      setMintErrors((prev) => ({
        ...prev,
        [badgeId]: "Connect wallet first",
      }));
      return;
    }

    setMintStatuses((prev) => ({ ...prev, [badgeId]: "minting" }));
    setMintErrors((prev) => ({ ...prev, [badgeId]: "" }));

    try {
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: fid || 0,
          badgeId,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMintStatuses((prev) => ({ ...prev, [badgeId]: "minted" }));
        setMintTxHashes((prev) => ({ ...prev, [badgeId]: data.txHash }));
      } else if (data.alreadyMinted) {
        setMintStatuses((prev) => ({ ...prev, [badgeId]: "minted" }));
      } else {
        setMintStatuses((prev) => ({ ...prev, [badgeId]: "error" }));
        setMintErrors((prev) => ({
          ...prev,
          [badgeId]: data.error || "Mint failed",
        }));
      }
    } catch {
      setMintStatuses((prev) => ({ ...prev, [badgeId]: "error" }));
      setMintErrors((prev) => ({
        ...prev,
        [badgeId]: "Network error",
      }));
    }
  };

  // Статистика
  const unlockedCount = BADGES.filter((b) => getProgress(b) >= 1).length;

  return (
    <div className="px-5 pb-24 animate-in">
      <h2 className="text-white text-2xl font-extrabold mb-1">NFT Badges</h2>
      <p className="text-gray-500 text-sm mb-2">
        Earn badges and mint them as on-chain achievements on Base
      </p>

      {/* Статистика */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-white/[0.04] rounded-xl px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-base-blue text-sm font-bold">
            {unlockedCount}
          </span>
          <span className="text-gray-500 text-xs">/ {BADGES.length} unlocked</span>
        </div>
        {!walletAddress && (
          <div className="bg-yellow-500/10 rounded-xl px-3 py-1.5">
            <span className="text-yellow-500 text-xs">
              🔗 Connect wallet to mint
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((badge) => {
          const progress = getProgress(badge);
          const unlocked = progress >= 1;
          const mintStatus = mintStatuses[badge.id] || "idle";
          const txHash = mintTxHashes[badge.id];
          const error = mintErrors[badge.id];

          return (
            <div
              key={badge.id}
              className={`rounded-[18px] p-5 text-center transition-all ${
                unlocked
                  ? "bg-gradient-to-br from-base-blue/15 to-purple-500/15 border border-base-blue/30"
                  : "bg-white/[0.04] border border-white/[0.06] opacity-60"
              }`}
            >
              {/* Иконка бейджа */}
              <div
                className={`text-[40px] mb-2 ${unlocked ? "" : "grayscale"}`}
              >
                {badge.icon}
              </div>

              {/* Название */}
              <h4 className="text-white text-sm font-bold mb-1">
                {badge.name}
              </h4>

              {/* Описание */}
              <p className="text-gray-500 text-[11px] mb-2.5">
                {badge.description}
              </p>

              {/* Прогресс */}
              <div className="w-full h-1 bg-white/10 rounded-full mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    unlocked
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                      : "bg-gradient-blue"
                  }`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              {/* Кнопки / статус */}
              {unlocked ? (
                <div>
                  {mintStatus === "idle" && (
                    <button
                      onClick={() => handleMint(badge.id)}
                      className="bg-gradient-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[11px] font-bold cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      ⬡ Mint NFT
                    </button>
                  )}

                  {mintStatus === "minting" && (
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-3 h-3 border-2 border-base-blue border-t-transparent rounded-full animate-spin" />
                      <span className="text-base-blue text-[11px] font-bold">
                        Minting...
                      </span>
                    </div>
                  )}

                  {mintStatus === "minted" && (
                    <div>
                      <span className="text-emerald-400 text-[11px] font-bold">
                        ✓ Minted!
                      </span>
                      {txHash && (
                        <a
                          href={`https://sepolia.basescan.org/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-base-blue text-[10px] mt-1 underline"
                        >
                          View on BaseScan ↗
                        </a>
                      )}
                    </div>
                  )}

                  {mintStatus === "error" && (
                    <div>
                      <span className="text-red-400 text-[10px]">
                        {error || "Error"}
                      </span>
                      <button
                        onClick={() => handleMint(badge.id)}
                        className="block mx-auto mt-1 text-base-blue text-[10px] underline"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-600 text-[11px]">
                  {Math.round(progress * 100)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
