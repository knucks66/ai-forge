import { create } from 'zustand';

interface PollinationsAccount {
  balance: number;
  tier?: string;
}

interface HuggingFaceAccount {
  username: string;
  plan: string;
}

interface GoogleAccount {
  tier: string;
}

interface BalanceState {
  pollinations: PollinationsAccount | null;
  huggingface: HuggingFaceAccount | null;
  google: GoogleAccount | null;
  isLoadingPollinations: boolean;
  isLoadingHuggingface: boolean;
  setPollinationsAccount: (account: PollinationsAccount | null) => void;
  setHuggingfaceAccount: (account: HuggingFaceAccount | null) => void;
  setGoogleAccount: (account: GoogleAccount | null) => void;
  setIsLoadingPollinations: (loading: boolean) => void;
  setIsLoadingHuggingface: (loading: boolean) => void;
  clearAll: () => void;
}

export const useBalanceStore = create<BalanceState>()((set) => ({
  pollinations: null,
  huggingface: null,
  google: null,
  isLoadingPollinations: false,
  isLoadingHuggingface: false,
  setPollinationsAccount: (account) => set({ pollinations: account }),
  setHuggingfaceAccount: (account) => set({ huggingface: account }),
  setGoogleAccount: (account) => set({ google: account }),
  setIsLoadingPollinations: (loading) => set({ isLoadingPollinations: loading }),
  setIsLoadingHuggingface: (loading) => set({ isLoadingHuggingface: loading }),
  clearAll: () => set({ pollinations: null, huggingface: null, google: null }),
}));
