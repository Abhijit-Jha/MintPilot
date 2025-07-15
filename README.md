# 🚀 MintPilot

**MintPilot** is a simple and intuitive web interface built with Next.js and ShadCN UI for managing Solana wallets and tokens on the **Solana Devnet**. It allows developers and Web3 enthusiasts to create wallets, airdrop SOL, create token mints, and mint token supply—all from a single lightweight UI.

---

## 🌟 Features

- 🔐 **Create or Import Wallet**  
  Generate a new Solana wallet or import an existing one using your private key (Uint8Array).

- 💸 **Request Airdrop**  
  Instantly get 2 SOL on the Devnet for development/testing purposes.

- 🪙 **Create Token Mint**  
  Create a custom SPL token using your wallet as the mint authority.

- 🏦 **Mint Token Supply**  
  Mint tokens to your associated token account (ATA) and track total supply.

- 🔗 **Solana Explorer Links**  
  View wallet, mint, or ATA addresses directly on the Solana Devnet explorer.

- ✅ **Real-time Feedback**  
  Clean toast notifications using `sonner` (ShadCN) for every action (wallet created, tokens minted, airdrop completed, etc).

---

## ⚙️ Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **ShadCN/UI** – clean and minimal UI components
- **Sonner** – toast notifications
- **@solana/web3.js** – Solana wallet and token operations
- **@solana/spl-token** – minting and ATA handling
- **Zustand** – global store for wallet, mint, and ATA state

---

## 🔄 How It Works (Flow)

1. **Create/Import Wallet**  
   You can either generate a new wallet or paste a private key (Uint8Array JSON format) to import an existing one.

2. **Get Airdrop**  
   Click "Get 2 SOL" to request devnet funds for deploying and interacting with tokens.

3. **Create Token**  
   Creates a new token mint using your wallet's public key as the mint authority.

4. **Mint Token Supply**  
   - Automatically checks and creates an associated token account (ATA) if not already created.
   - Mints the specified amount of tokens to your ATA.
   - Displays updated token supply.

5. **View on Solana Explorer**  
   All major addresses (wallet, mint, ATA) include links to view on [explorer.solana.com](https://explorer.solana.com/?cluster=devnet).

