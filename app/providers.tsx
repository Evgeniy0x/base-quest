"use client";

// Провайдеры — оборачивают всё приложение
// MiniKit, Wagmi (кошельки), React Query (кэш данных)

import { ReactNode, Component } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

// Безопасная обёртка — если MiniKitProvider крашится (вне Farcaster), просто показываем children
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

// Конфигурация Wagmi — подключение к сети Base
const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Base Quest",
      preference: "smartWalletOnly", // Используем Smart Wallet от Coinbase
    }),
  ],
  transports: {
    [base.id]: http(), // RPC для Base сети
  },
});

// React Query для кэширования данных
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
              mode: "dark", // Тёмная тема
            },
          }}
        >
          <SafeMiniKit>{children}</SafeMiniKit>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
