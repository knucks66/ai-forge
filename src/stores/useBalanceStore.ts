import { create } from 'zustand';

interface PollinationsAccount {
  balance: number;
  tier?: string;
}

interface HuggingFaceAccount {
  username: string;
  plan: string;
}

interface BalanceState {
  pollinations: PollinationsAccount | null;
  huggingface: HuggingFaceAccount | null;
  isLoadingPollinations: boolean;
  isLoadingHuggingface: boolean;
  setPollinationsAccount: (account: PollinationsAccount | null) => void;
  setHuggingfaceAccount: (account: HuggingFaceAccount | null) => void;
  setIsLoadingPollinations: (loading: boolean) => void;
  setIsLoadingHuggingface: (loading: boolean) => void;
  clearAll: () => void;
}

export const useBalanceStore = create<BalanceState>()((set) => ({
  pollinations: null,
  huggingface: null,
  isLoadingPollinations: false,
  isLoadingHuggingface: false,
  setPollinationsAccount: (account) => set({ pollinations: account }),
  setHuggingfaceAccount: (account) => set({ huggingface: account }),
  setIsLoadingPollinations: (loading) => set({ isLoadingPollinations: loading }),
  setIsLoadingHuggingface: (loading) => set({ isLoadingHuggingface: loading }),
  clearAll: () => set({ pollinations: null, huggingface: null }),
}));
