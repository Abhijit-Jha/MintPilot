import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MintState {
    mintAddress: string | null;
    txSignature: string | null;
    setMint: (mint: string, signature: string) => void;
    clearMint: () => void;
}

const useMintStore = create<MintState>()(
    persist(
        (set) => ({
            mintAddress: null,
            txSignature: null,
            setMint: (mint, signature) => set({ mintAddress: mint, txSignature: signature }),
            clearMint: () => set({ mintAddress: null, txSignature: null }),
        }),
        {
            name: "mint-storage", // 👈 key in sessionStorage
            storage: {
                getItem: (key) => {
                    const item = sessionStorage.getItem(key);
                    return item ? JSON.parse(item) : null;
                },
                setItem: (key, value) => {
                    sessionStorage.setItem(key, JSON.stringify(value));
                },
                removeItem: (key) => sessionStorage.removeItem(key),
            },
        }
    )
);

export default useMintStore;
