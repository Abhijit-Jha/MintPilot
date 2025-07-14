'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/hooks/use-toast";
import { createSupply } from "@/lib/createSupply";
import { createToken } from "@/lib/createToken";
import getAirDrop from "@/lib/getAirdrop";
import getSolanaBalance from "@/lib/getSolanaBalance";
import { getTokenTotalSupply } from "@/lib/getTokenSupply";
import useAtaStore from "@/lib/store/associateToken";
import useMintStore from "@/lib/store/mint";
import useWalletStore from "@/lib/store/wallet";
import { Keypair } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { ExternalLink, Wallet, Coins, RefreshCw, Plus, Send } from "lucide-react";
import { toast } from "sonner"
export default function Home() {
  const { publicKey, privateKey, setWallet, clearWallet } = useWalletStore();
  const [inputPrivateKey, setInputPrivateKey] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [refreshBalance, setRefreshBalance] = useState(false);
  const { mintAddress, setMint, clearMint } = useMintStore();
  const [totalTokenSupply, setTotalTokenSupply] = useState<number>(0);
  const [tokenSupply, setTokenSupply] = useState<number>(0);
  const { ataAddress, setAtaData, clearAtaData } = useAtaStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchTokenSupply() {
      if (!mintAddress) return;
      try {
        const tokenSupply = await getTokenTotalSupply(mintAddress);
        setTotalTokenSupply(tokenSupply);
      } catch (error) {
        console.error("Error fetching token supply:", error);
      }
    }
    fetchTokenSupply();
  }, [refreshBalance, mintAddress, setTotalTokenSupply, setAtaData]);

  useEffect(() => {
    async function fetchBalance() {
      if (!publicKey) return;
      try {
        const balance = await getSolanaBalance(publicKey);
        setBalance(balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast.success("Failed to fetch balance. Please check your wallet connection.");
      }
    }
    fetchBalance();
  }, [refreshBalance, publicKey]);

  async function createWallet() {
    clearWallet();
    clearAtaData();
    clearMint();
    setIsLoading(true);
    try {
      if (inputPrivateKey.trim()) {
        // Parse string to array of numbers
        const parsed = JSON.parse(inputPrivateKey);
        if (!Array.isArray(parsed)) throw new Error("Invalid array format");
        const secretKey = Uint8Array.from(parsed);

        const keypair = Keypair.fromSecretKey(secretKey);
        const pub = keypair.publicKey.toBase58();
        const priv = Buffer.from(keypair.secretKey).toString("hex");

        setWallet(pub, priv);
        toast("Wallet Imported")
      } else {
        // Generate new wallet
        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();
        const privateKey = Buffer.from(keypair.secretKey).toString('hex');

        setWallet(publicKey, privateKey);
        toast.success("New wallet created successfully!");
      }
    } catch (error) {
      console.error("Error creating/importing wallet:", error);
      toast.error("Failed to create or import wallet. Please check your input and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function get2Solana() {
    if (!publicKey) return;
    setIsLoading(true);
    try {
      await getAirDrop(publicKey);
      toast.success("2 SOL airdropped to your wallet");
      setRefreshBalance(!refreshBalance);
    } catch (error: unknown) {
      let errorMessage = "Airdrop failed";
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String((error as { message: string }).message);
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = String(error);
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }


  async function handleCreateToken() {
    if (!publicKey || !privateKey) return;
    setIsLoading(true);
    try {
      await createToken(publicKey, privateKey, setMint);
      toast.success("Token created successfully!");
    } catch (error) {
      console.error("Error creating token:", error);
      toast.error("Failed to create token. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateSupply() {
    if (!publicKey || !privateKey || !tokenSupply || !mintAddress) return;
    setIsLoading(true);
    try {
      const { associatedTokenAccount } = await createSupply(
        tokenSupply,
        mintAddress,
        Keypair.fromSecretKey(Uint8Array.from(Buffer.from(privateKey, 'hex'))),
        publicKey,
        setTotalTokenSupply,
        ataAddress
      );

      setAtaData({
        ataAddress: associatedTokenAccount,
        tokenBalance: tokenSupply,
      });

      setTotalTokenSupply((prev) => prev + tokenSupply);
      toast.success("Tokens minted successfully!");
    } catch (error) {
      console.error("Error minting tokens:", error);
      toast.error("Failed to mint tokens. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Solana Token Manager</h1>
          <p className="text-muted-foreground">Create and manage Solana tokens on Devnet</p>
        </div>

        {/* Wallet Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Management
            </CardTitle>
            <CardDescription>
              Create a new wallet or import an existing one using a private key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privateKey">Private Key (Optional)</Label>
              <Input
                id="privateKey"
                placeholder="Enter private key as JSON stringified Uint8Array..."
                value={inputPrivateKey}
                onChange={(e) => setInputPrivateKey(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to generate a new wallet
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={createWallet}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {inputPrivateKey.trim() ? 'Import Wallet' : 'Create Wallet'}
              </Button>

              {publicKey && (
                <>
                  <Button
                    variant="outline"
                    onClick={get2Solana}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Get 2 SOL
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRefreshBalance(!refreshBalance)}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Balance
                  </Button>
                </>
              )}
            </div>

            {publicKey && privateKey && (
              <div className="space-y-4 pt-4">
                <Separator />
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Public Key</Label>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm flex-1 break-all">
                        {publicKey}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={`https://explorer.solana.com/address/${publicKey}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Explorer
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Private Key</Label>
                    <code className="bg-muted px-2 py-1 rounded text-sm block break-all">
                      {privateKey}
                    </code>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Balance</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-sm">
                        {balance?.toPrecision(8)} SOL
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Section */}
        {publicKey && privateKey && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Token Management
              </CardTitle>
              <CardDescription>
                Create new tokens and mint supply to your wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleCreateToken}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Token
              </Button>

              {mintAddress && (
                <div className="space-y-4 pt-4">
                  <Separator />
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Mint Address</Label>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm flex-1 break-all">
                          {mintAddress}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Explorer
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Current Token Supply</Label>
                      <Badge variant="secondary" className="text-sm">
                        {totalTokenSupply.toLocaleString()} tokens
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tokenSupply">Tokens to Mint</Label>
                      <Input
                        id="tokenSupply"
                        type="number"
                        placeholder="Enter number of tokens to mint..."
                        value={tokenSupply}
                        onChange={(e) => setTokenSupply(Number(e.target.value))}
                        min="1"
                      />
                    </div>

                    <Button
                      onClick={handleCreateSupply}
                      disabled={isLoading || !tokenSupply}
                      className="flex items-center gap-2"
                    >
                      <Coins className="h-4 w-4" />
                      Mint Tokens
                    </Button>

                    {ataAddress && (
                      <div className="space-y-3 pt-4">
                        <Separator />
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Associated Token Account</Label>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm flex-1 break-all">
                              {ataAddress}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a
                                href={`https://explorer.solana.com/address/${ataAddress}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Explorer
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
