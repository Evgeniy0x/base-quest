import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

// ÐÐµÑÐ°Ð´Ð°Ð½Ð½ÑÐµ Ð¿ÑÐ¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ â Ð´Ð»Ñ SEO Ð¸ Farcaster embed
export const metadata: Metadata = {
  title: "Base Quest â Learn Base. Earn Rewards.",
  description:
    "Interactive learn-to-earn mini app for the Base ecosystem. Complete quests, earn XP, collect NFT badges.",
  // ÐÐµÑÐ°-ÑÐµÐ³ Ð´Ð»Ñ Ð²ÐµÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¸Ð¸ Ð½Ð° base.dev
  other: {
    "base:app_id": "69b2d9f55600c39dcfa4fe6c",
    // Talent Protocol website verification
    "talentapp:project_verification":
      "433d1893d3002020e7a5ff4515256aa2077cfe9ba703d3eb04fb6cbab2fe028a3415a06f1d04baf9fa43614943280377770e356f7af15855cd4f90c6f24f1693",
  },
  // Open Graph Ð´Ð»Ñ ÐºÑÐ°ÑÐ¸Ð²ÑÑ Ð¿ÑÐµÐ²ÑÑ Ð¿ÑÐ¸ ÑÐµÑÐ¸Ð½Ð³Ðµ
  openGraph: {
    title: "Base Quest â Learn Base. Earn Rewards.",
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

// Viewport Ð½Ð°ÑÑÑÐ¾Ð¹ÐºÐ¸ Ð´Ð»Ñ Ð¼Ð¾Ð±Ð¸Ð»ÑÐ½Ð¾Ð³Ð¾ Ð¼Ð¸Ð½Ð¸-Ð°Ð¿Ð¿Ð°
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // ÐÐ¾Ð´Ð´ÐµÑÐ¶ÐºÐ° Safe Area (Ð²ÑÑÐµÐ·Ñ Ð½Ð° iPhone Ð¸ Ñ.Ð´.)
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
