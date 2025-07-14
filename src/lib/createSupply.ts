import { createAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey, Signer } from "@solana/web3.js";

type CreateSupplyResult = {
    associatedTokenAccount: string;
    transactionSignature: string;
    tokenAmount: number; // in base units (like lamports)
};

// owner and payer is same in my case
export async function createSupply(tokenAmount: number, tokenMintAddress: string, payer: Signer, owner: string, setTokenSupply: (supply: number) => void, ataAddress: string | null): Promise<CreateSupplyResult> {
    const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
    //Create an ATA only if user does not have an existing ATA for the token mint
    let ata;
    if (ataAddress == null) {
        ata = await createAssociatedTokenAccount(
            connection,
            payer,
            new PublicKey(tokenMintAddress),
            new PublicKey(owner),
        );
    }


    const associatedTokenAccount = ata || new PublicKey(ataAddress || "");
    //After creating the ATA, we can mint tokens to it(supply)
    const transactionSignature = await mintTo(
        connection,
        payer,
        new PublicKey(tokenMintAddress),
        associatedTokenAccount, // Use the existing ATA if provided
        new PublicKey(owner),
        tokenAmount * 10 ** 9,
    );
    console.log("Minted tokens to ATA:", associatedTokenAccount.toBase58());
    console.log("Transaction Signature:", transactionSignature);

    setTokenSupply(tokenAmount);
    console.log("Token Supply Set:", tokenAmount);
    console.log("Associated Token Account:", associatedTokenAccount.toBase58());
    return {
        associatedTokenAccount: associatedTokenAccount.toBase58(),
        transactionSignature,
        tokenAmount: tokenAmount * 10 ** 9,
    };
}