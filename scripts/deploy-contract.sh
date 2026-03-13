#!/bin/bash
# ========================================
# ДЕПЛОЙ КОНТРАКТА BaseQuestBadges на Base Sepolia
# ========================================
#
# Шаг 1: Получить тестовый ETH
#   Открой https://www.base.dev/faucet
#   Введи адрес: 0x42683d3F42B07ff232b6d50D79A3C35F326d628F
#
# Шаг 2: Запусти этот скрипт
#   cd ~/Desktop/base-quest
#   chmod +x scripts/deploy-contract.sh
#   ./scripts/deploy-contract.sh
#

set -e

export MINTER_PRIVATE_KEY="0x393e4bd70bd6c346b4f2410b89f208b6c5f1768f64bdc371ac214ee7f617d8ff"

echo "🚀 Деплой BaseQuestBadges на Base Sepolia..."
node scripts/compile-and-deploy.mjs

echo ""
echo "📋 Если деплой прошёл успешно, добавь в Vercel:"
echo "   Settings → Environment Variables:"
echo "   NEXT_PUBLIC_BADGE_CONTRACT = <адрес из вывода выше>"
echo "   MINTER_PRIVATE_KEY = $MINTER_PRIVATE_KEY"
