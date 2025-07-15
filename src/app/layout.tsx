import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Sticky } from "@/components/stickbanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MintPilot | Solana Token Manager",
  description:
    "MintPilot is a sleek Solana Devnet tool to create and manage wallets, request airdrops, mint tokens, and view balances—all in one simple UI.",
  keywords: [
    "Solana",
    "Devnet",
    "Token Minting",
    "Create Wallet",
    "Airdrop SOL",
    "Web3",
    "Crypto",
    "Solana Tokens",
    "MintPilot",
  ],
  authors: [{ name: "Abhijit Jha", url: "https://github.com/Abhijit-Jha" }],
  creator: "Abhijit Jha",
  metadataBase: new URL("https://mintpilot.abhijit.website"), 
  openGraph: {
    title: "MintPilot – Solana Devnet Wallet & Token Manager",
    description:
      "Use MintPilot to generate wallets, airdrop devnet SOL, mint custom SPL tokens, and manage balances in a sleek and developer-friendly interface.",
    url: "https://mintpilot.vercel.app",
    siteName: "MintPilot",
    images: [
      {
        url: "https://mintpilot.abhijit.app/og.png", 
        width: 1200,
        height: 630,
        alt: "MintPilot UI Screenshot",
      },
    ],
    type: "website",
  },
  twitter: {
    title: "MintPilot – Solana Devnet Wallet & Token Manager",
    description:
      "Create and manage Solana Devnet wallets, airdrop SOL, mint and track SPL tokens using MintPilot.",
    images: ["https://mintpilot.abhijit.website/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Sticky />
        {children}
      </body>
    </html>
  );
}
