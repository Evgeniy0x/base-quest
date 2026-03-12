/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем загрузку изображений с внешних источников
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Фиксим ошибки с pino/WalletConnect/MetaMask при сборке
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      encoding: false,
    };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
  // Важно для MiniKit — разрешаем iframe-встраивание
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
