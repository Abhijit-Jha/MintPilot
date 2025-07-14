import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AtaState {
  ataAddress: string | null;
  tokenBalance: number | null;
  setAtaData: (data: { ataAddress: string; tokenBalance: number }) => void;
  clearAtaData: () => void;
}

const useAtaStore = create<AtaState>()(
  persist(
    (set) => ({
      ataAddress: null,
      tokenBalance: null,

      setAtaData: ({ ataAddress, tokenBalance }) =>
        set({ ataAddress, tokenBalance }),

      clearAtaData: () => set({ ataAddress: null, tokenBalance: null }),
    }),
    {
      name: "ata-storage",
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

export default useAtaStore;
