import { getMint } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export async function getTokenTotalSupply(mintAddress: string): Promise<number> {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const mintPublicKey = new PublicKey(mintAddress);

  const mintInfo = await getMint(connection, mintPublicKey);
  
  // Convert supply from BigInt to human-readable number
  const supply = Number(mintInfo.supply) / 10 ** mintInfo.decimals;

  return supply;
}
