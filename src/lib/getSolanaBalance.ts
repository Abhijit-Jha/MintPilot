import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

// const DEVNET_URL = "https://api.devnet.solana.com/"


async function getSolanaBalance(publicKey: string) {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const balance = await connection.getBalance(
        new PublicKey(publicKey)
    );
    return balance / 1e9; 
}

export default getSolanaBalance;