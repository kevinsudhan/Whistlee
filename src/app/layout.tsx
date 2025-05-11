import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import dynamic from "next/dynamic";
import { WagmiProviderWrapper } from "@/providers/wagmi-provider";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whistle Finance - Decentralized Microfinance",
  description: "A decentralized microfinance platform for communities, powered by trust and blockchain technology",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Whistle",
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/app-icon.svg" />
      </head>
      <body>
        <WagmiProviderWrapper>
          
            {children}
        
        </WagmiProviderWrapper>
        <Script src="/register-sw.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
