import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

// Метаданные приложения — для SEO и Farcaster embed
export const metadata: Metadata = {
  title: "Base Quest — Learn Base. Earn Rewards.",
  description:
    "Interactive learn-to-earn mini app for the Base ecosystem. Complete quests, earn XP, collect NFT badges.",
  // Мета-тег для верификации на base.dev
  other: {
    "base:app_id": "69b2d9f55600c39dcfa4fe6c",
  },
  // Open Graph для красивых превью при шеринге
  openGraph: {
    title: "Base Quest — Learn Base. Earn Rewards.",
    description:
      "Complete quests, earn XP, collect NFT badges while learning the Base ecosystem.",
    images: ["/og.png"],
    type: "website",
  },
  // Farcaster Frame meta tags
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

// Viewport настройки для мобильного мини-аппа
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Поддержка Safe Area (вырезы на iPhone и т.д.)
  viewportFit: "cover",
  themeColor: "#0a0a1e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
