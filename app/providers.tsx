"use client";

// Провайдеры — оборачивают всё приложение
// MiniKit, Wagmi (кошельки), React Query (кэш данных)
// Builder Code (ERC-8021) — привязывает транзакции к нашему приложению для Builder Rewards

import { ReactNode, Component } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { Attribution } from "ox/erc8021";

// Builder Code ERC-8021 — каждая транзакция через наше приложение
// будет содержать суффикс, привязывающий её к нашему builder code
// Это позволяет Base отслеживать активность и начислять Builder Rewards
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_1q7250jb"], // Builder Code из base.dev
});

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
// dataSuffix автоматически добавляет Builder Code ко всем транзакциям
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
  dataSuffix: DATA_SUFFIX, // ERC-8021: Builder Code для отслеживания транзакций
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
