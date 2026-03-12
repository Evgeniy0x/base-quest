"use client";

// Клиентская обёртка — загружаем AppClient без SSR
// (MiniKit работает только на клиенте)

import dynamic from "next/dynamic";

const AppClient = dynamic(() => import("@/components/AppClient"), {
  ssr: false,
  loading: () => (
    <div className="max-w-[430px] mx-auto min-h-screen bg-base-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-blue mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white animate-pulse">
          B
        </div>
        <p className="text-gray-500 text-sm">Loading Base Quest...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <AppClient />;
}
