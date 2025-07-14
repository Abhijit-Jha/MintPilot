import {
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    PublicKey
} from "@solana/web3.js";
import {
    createInitializeMintInstruction,
    MINT_SIZE,
    getMinimumBalanceForRentExemptMint,
    TOKEN_PROGRAM_ID
} from "@solana/spl-token";


export async function createToken(publicKey: string, privateKey: string,setMint: (mint: string, signature: string) => void) {
    if (!publicKey || !privateKey) {
        console.error("No wallet found. Please connect your wallet first.");
        return;
    }
    // const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    //I think it is not needed for local development, but it is good to have it in case you want to use devnet or testnet
    // const recentBlockhash = await connection.getLatestBlockhash();

    // Comes from zustand
    const secretKeyBuffer = Buffer.from(privateKey, 'hex');
    const feePayer = Keypair.fromSecretKey(new Uint8Array(secretKeyBuffer));
    //Owner account i.e the one who will pay for the transaction fees


    //AirDrop kar chuka hu uske baad he ye step hoga so commented 
    // const airdropSignature = await connection.requestAirdrop(
    //     feePayer.publicKey,
    //     LAMPORTS_PER_SOL
    // );
    // await connection.confirmTransaction({
    //     blockhash: recentBlockhash.blockhash,
    //     lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
    //     signature: airdropSignature
    // });


    // Generate a new mint account for the token
    const mint = Keypair.generate(); //ATA - Associated Token Account, this is the mint account for the token


    // Create a ATA // This is the mint account for the token, it will be used to create tokens
    const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: new PublicKey(feePayer.publicKey), // The fee payer's public key
        newAccountPubkey: mint.publicKey, // The new mint account's public key
        space: MINT_SIZE, // The space required for the mint account (82 bytes)
        lamports: await getMinimumBalanceForRentExemptMint(connection), // For rent exemption
        programId: TOKEN_PROGRAM_ID //Not using Token 2022 for now
    });

    const initializeMintInstruction = createInitializeMintInstruction(
        mint.publicKey,
        9,
        new PublicKey(feePayer.publicKey),
        new PublicKey(feePayer.publicKey),
        TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(
        createAccountInstruction,
        initializeMintInstruction
    );

    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [feePayer, mint]
    );

    setMint(mint.publicKey.toBase58(), transactionSignature);
}