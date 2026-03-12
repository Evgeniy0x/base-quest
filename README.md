# Base Quest — Learn Base. Earn Rewards.

Interactive learn-to-earn mini app for the Base ecosystem. Built with Next.js + MiniKit for Farcaster & Base App.

## Quick Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → "New Project" → Import your repo
3. Set environment variable: `NEXT_PUBLIC_URL` = your Vercel URL (e.g., `https://base-quest.vercel.app`)
4. Deploy!

## Register on Base

1. Go to [base.dev](https://www.base.dev/)
2. Add your deployed URL
3. The `base:app_id` meta tag is already included in the code
4. Generate Account Association credentials and add them to env vars
5. Click "Verify & Add"

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_URL` — Your app URL
- `NEXT_PUBLIC_FARCASTER_HEADER` — From base.dev account association
- `NEXT_PUBLIC_FARCASTER_PAYLOAD` — From base.dev account association
- `NEXT_PUBLIC_FARCASTER_SIGNATURE` — From base.dev account association

## Tech Stack

- **Next.js 15** — React framework
- **Base MiniKit** — Farcaster Mini App SDK
- **OnchainKit** — On-chain components
- **Tailwind CSS** — Styling
- **Wagmi + Viem** — Wallet connection

## Features

- 6 educational quests about Base ecosystem
- Quiz system with XP rewards
- Achievement badges (mintable as NFTs)
- Leaderboard with weekly rankings
- Daily streak tracking
- Farcaster sharing integration
- Wallet connection via Smart Wallet
