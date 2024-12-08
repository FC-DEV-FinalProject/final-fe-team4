import { create } from 'zustand';

interface VCAudioHistoryItem {
  id: number;
  audioId: number;
  audioUrl: string;
  unitScript?: string;
  fileName: string;
  createdAt: string;
}

interface VCHistoryState {
  historyItems: VCAudioHistoryItem[];
  setHistoryItems: (items: VCAudioHistoryItem[]) => void;
  addHistoryItem: (item: VCAudioHistoryItem) => void;
  clearHistory: () => void;
}

export const useVCHistoryStore = create<VCHistoryState>((set) => ({
  historyItems: [],
  setHistoryItems: (items) => set({ historyItems: items }),
  addHistoryItem: (item) =>
    set((state) => ({
      historyItems: [...state.historyItems, item],
    })),
  clearHistory: () => set({ historyItems: [] }),
}));
