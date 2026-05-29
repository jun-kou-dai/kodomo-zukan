import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://jun-kou-dai.github.io/kodomo-zukan"),
  title: "こども動物図鑑",
  description:
    "動物を 見る・聞く・知る・くらべる。子どもが楽しく学べる動物図鑑アプリ",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "どうぶつ図鑑",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4A7C28",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-dvh">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
