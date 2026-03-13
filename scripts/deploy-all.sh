#!/bin/bash
# ========================================
# BASE QUEST — ПОЛНЫЙ ДЕПЛОЙ (ОДНА КОМАНДА)
# ========================================
# cd ~/Desktop/base-quest && chmod +x scripts/deploy-all.sh && ./scripts/deploy-all.sh

set -e

MINTER_PK="0x393e4bd70bd6c346b4f2410b89f208b6c5f1768f64bdc371ac214ee7f617d8ff"
MINTER_ADDR="0x42683d3F42B07ff232b6d50D79A3C35F326d628F"

echo "🔵 =================================="
echo "   BASE QUEST — ПОЛНЫЙ ДЕПЛОЙ"
echo "🔵 =================================="
echo ""

# ---- ШАГ 1: Git Push ----
echo "📦 Шаг 1/4: Push на GitHub..."
if git push origin main 2>/dev/null; then
  echo "   ✅ Запушено!"
else
  echo "   ⚠️ Push не удался (возможно, уже up to date)"
fi
echo ""

# ---- ШАГ 2: Faucet ----
echo "💧 Шаг 2/4: Тестовый ETH на Base Sepolia"
echo "   Адрес минтера: $MINTER_ADDR"

# Проверяем баланс
BALANCE=$(node -e "
const { createPublicClient, http } = require('viem');
const { baseSepolia } = require('viem/chains');
const c = createPublicClient({ chain: baseSepolia, transport: http('https://sepolia.base.org') });
c.getBalance({ address: '$MINTER_ADDR' }).then(b => console.log(Number(b)));
" 2>/dev/null)

if [ "$BALANCE" = "0" ]; then
  echo "   ❌ Баланс: 0 ETH"
  echo ""
  echo "   Открываю faucet в браузере..."
  open "https://www.base.dev/faucet" 2>/dev/null || xdg-open "https://www.base.dev/faucet" 2>/dev/null || true
  echo ""
  echo "   📋 Скопируй и вставь адрес в faucet:"
  echo "   $MINTER_ADDR"
  echo ""
  echo "   Нажми Enter когда получишь ETH..."
  read -r

  # Проверяем ещё раз
  BALANCE=$(node -e "
  const { createPublicClient, http } = require('viem');
  const { baseSepolia } = require('viem/chains');
  const c = createPublicClient({ chain: baseSepolia, transport: http('https://sepolia.base.org') });
  c.getBalance({ address: '$MINTER_ADDR' }).then(b => console.log(Number(b)));
  " 2>/dev/null)

  if [ "$BALANCE" = "0" ]; then
    echo "   ❌ Всё ещё 0 ETH. Попробуй другой faucet:"
    echo "   https://faucet.quicknode.com/base/sepolia"
    echo "   https://www.alchemy.com/faucets/base-sepolia"
    echo ""
    echo "   Нажми Enter когда получишь ETH..."
    read -r
  fi
fi

echo "   ✅ Баланс: $(node -e "
const { createPublicClient, http } = require('viem');
const { baseSepolia } = require('viem/chains');
const c = createPublicClient({ chain: baseSepolia, transport: http('https://sepolia.base.org') });
c.getBalance({ address: '$MINTER_ADDR' }).then(b => console.log((Number(b)/1e18).toFixed(6)));
" 2>/dev/null) ETH"
echo ""

# ---- ШАГ 3: Деплой контракта ----
echo "🚀 Шаг 3/4: Деплой контракта на Base Sepolia..."
export MINTER_PRIVATE_KEY="$MINTER_PK"
node scripts/compile-and-deploy.mjs

# Считываем адрес контракта
if [ -f lib/contracts/deployment.json ]; then
  CONTRACT_ADDR=$(node -e "console.log(require('./lib/contracts/deployment.json').address)")
  echo ""
  echo "   ✅ Контракт: $CONTRACT_ADDR"
else
  echo "   ❌ Деплой не удался. Проверьте баланс и попробуйте снова."
  exit 1
fi
echo ""

# ---- ШАГ 4: Настройка Vercel env ----
echo "⚙️ Шаг 4/4: Настройка Vercel..."
echo ""
echo "   Добавь эти переменные в Vercel Dashboard:"
echo "   Settings → Environment Variables"
echo ""
echo "   NEXT_PUBLIC_BADGE_CONTRACT = $CONTRACT_ADDR"
echo "   MINTER_PRIVATE_KEY = $MINTER_PK"
echo "   NEXT_PUBLIC_CHAIN = testnet"
echo ""

# Пробуем через Vercel CLI
if command -v vercel &> /dev/null; then
  echo "   Vercel CLI найден! Пробую добавить автоматически..."
  echo "$CONTRACT_ADDR" | vercel env add NEXT_PUBLIC_BADGE_CONTRACT production 2>/dev/null && echo "   ✅ NEXT_PUBLIC_BADGE_CONTRACT добавлен" || echo "   ⚠️ Добавь вручную"
  echo "$MINTER_PK" | vercel env add MINTER_PRIVATE_KEY production 2>/dev/null && echo "   ✅ MINTER_PRIVATE_KEY добавлен" || echo "   ⚠️ Добавь вручную"
  echo "testnet" | vercel env add NEXT_PUBLIC_CHAIN production 2>/dev/null && echo "   ✅ NEXT_PUBLIC_CHAIN добавлен" || echo "   ⚠️ Добавь вручную"
fi

echo ""
echo "🔵 =================================="
echo "   ✅ ДЕПЛОЙ ЗАВЕРШЁН!"
echo "🔵 =================================="
echo ""
echo "   App: https://base-quest-peach.vercel.app"
echo "   Contract: https://sepolia.basescan.org/address/$CONTRACT_ADDR"
echo ""
echo "   Redeploy Vercel если добавлял env вручную"
echo "🔵 =================================="
