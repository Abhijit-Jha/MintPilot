import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

async function getAirDrop(publicKey: string): Promise<string> {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const signature = await connection.requestAirdrop(
            new PublicKey(publicKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(signature, "confirmed");
        return signature;
    } catch (error: unknown) {
        let errorMessage = "Unknown error";

        if (typeof error === "object" && error !== null && "message" in error) {
            errorMessage = String((error as { message: string }).message);
        } else if (typeof error === "string") {
            errorMessage = error;
        } else {
            errorMessage = String(error);
        }

        if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate limit")) {
            console.error("Airdrop limit exceeded for this wallet");
            throw new Error("Airdrop limit exceeded. Try another wallet or wait.");
        }

        console.error("Airdrop failed:", errorMessage);
        throw new Error("Airdrop failed. Please try again.");
    }
}

export default getAirDrop;
