import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WalletState {
  publicKey: string | null;
  privateKey: string | null;
  setWallet: (pub: string, priv: string) => void;
  clearWallet: () => void;
}

const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      publicKey: null,
      privateKey: null,
      setWallet: (pub, priv) => set({ publicKey: pub, privateKey: priv }),
      clearWallet: () => set({ publicKey: null, privateKey: null }),
    }),
    {
      name: "wallet-storage",
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

export default useWalletStore;
