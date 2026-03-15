"use client";

// ÐÑÐ¾Ð²Ð°Ð¹Ð´ÐµÑÑ â Ð¾Ð±Ð¾ÑÐ°ÑÐ¸Ð²Ð°ÑÑ Ð²ÑÑ Ð¿ÑÐ¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ
// MiniKit, Wagmi (ÐºÐ¾ÑÐµÐ»ÑÐºÐ¸), React Query (ÐºÑÑ Ð´Ð°Ð½Ð½ÑÑ)
// Builder Code (ERC-8021) â Ð¿ÑÐ¸Ð²ÑÐ·ÑÐ²Ð°ÐµÑ ÑÑÐ°Ð½Ð·Ð°ÐºÑÐ¸Ð¸ Ðº Ð½Ð°ÑÐµÐ¼Ñ Ð¿ÑÐ¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð´Ð»Ñ Builder Rewards

import { ReactNode, Component } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
// Builder Code DATA_SUFFIX pre-computed to avoid ox/erc8021 dependency

// Builder Code ERC-8021 â ÐºÐ°Ð¶Ð´Ð°Ñ ÑÑÐ°Ð½Ð·Ð°ÐºÑÐ¸Ñ ÑÐµÑÐµÐ· Ð½Ð°ÑÐµ Ð¿ÑÐ¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ
// Ð±ÑÐ´ÐµÑ ÑÐ¾Ð´ÐµÑÐ¶Ð°ÑÑ ÑÑÑÑÐ¸ÐºÑ, Ð¿ÑÐ¸Ð²ÑÐ·ÑÐ²Ð°ÑÑÐ¸Ð¹ ÐµÑ Ðº Ð½Ð°ÑÐµÐ¼Ñ builder code
// Ð­ÑÐ¾ Ð¿Ð¾Ð·Ð²Ð¾Ð»ÑÐµÑ Base Ð¾ÑÑÐ»ÐµÐ¶Ð¸Ð²Ð°ÑÑ Ð°ÐºÑÐ¸Ð²Ð½Ð¾ÑÑÑ Ð¸ Ð½Ð°ÑÐ¸ÑÐ»ÑÑÑ Builder Rewards
const DATA_SUFFIX = "0x0b62635f3171373235306a62018021" as `0x${string}`; // bc_1q7250jb pre-computed

// ÐÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð°Ñ Ð¾Ð±ÑÑÑÐºÐ° â ÐµÑÐ»Ð¸ MiniKitProvider ÐºÑÐ°ÑÐ¸ÑÑÑ (Ð²Ð½Ðµ Farcaster), Ð¿ÑÐ¾ÑÑÐ¾ Ð¿Ð¾ÐºÐ°Ð·ÑÐ²Ð°ÐµÐ¼ children
class SafeMiniKit extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.children;
    return <MiniKitProvider>{this.props.children}</MiniKitProvider>;
  }
}

// ÐÐ¾Ð½ÑÐ¸Ð³ÑÑÐ°ÑÐ¸Ñ Wagmi â Ð¿Ð¾Ð´ÐºÐ»ÑÑÐµÐ½Ð¸Ðµ Ðº ÑÐµÑÐ¸ Base
// dataSuffix Ð°Ð²ÑÐ¾Ð¼Ð°ÑÐ¸ÑÐµÑÐºÐ¸ Ð´Ð¾Ð±Ð°Ð²Ð»ÑÐµÑ Builder Code ÐºÐ¾ Ð²ÑÐµÐ¼ ÑÑÐ°Ð½Ð·Ð°ÐºÑÐ¸ÑÐ¼
const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Base Quest",
      preference: "smartWalletOnly", // ÐÑÐ¿Ð¾Ð»ÑÐ·ÑÐµÐ¼ Smart Wallet Ð¾Ñ Coinbase
    }),
  ],
  transports: {
    [base.id]: http(), // RPC Ð´Ð»Ñ Base ÑÐµÑÐ¸
  },
  dataSuffix: DATA_SUFFIX, // ERC-8021: Builder Code Ð´Ð»Ñ Ð¾ÑÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ð½Ð¸Ñ ÑÑÐ°Ð½Ð·Ð°ÐºÑÐ¸Ð¹
});

// React Query Ð´Ð»Ñ ÐºÑÑÐ¸ÑÐ¾Ð²Ð°Ð½Ð¸Ñ Ð´Ð°Ð½Ð½ÑÑ
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: "dark", // Ð¢ÑÐ¼Ð½Ð°Ñ ÑÐµÐ¼Ð°
            },
          }}
        >
          <SafeMiniKit>{children}</SafeMiniKit>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
