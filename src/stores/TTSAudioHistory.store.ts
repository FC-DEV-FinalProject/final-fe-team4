import { create } from 'zustand';

import { TTSDetailDto } from '@/api/aIParkAPI.schemas';

export interface InterfaceHistoryItem {
  audioUrl: string;
  audioId: number;
}

interface PlaybackStore {
  historyItems: Record<string, InterfaceHistoryItem[]>;
  setHistoryItems: (ttsDetails: TTSDetailDto[]) => void;
  deleteHistoryItem: (unitId: string) => (audioId: number) => void;
  getHistoryItem: (unitId: string) => InterfaceHistoryItem[];
}

export const useTTSAudioHistoryStore = create<PlaybackStore>((set, get) => ({
  historyItems: {},
  setHistoryItems: (ttsDetails: TTSDetailDto[]) => {
    const history = ttsDetails.reduce<Record<string, InterfaceHistoryItem[]>>((acc, item) => {
      if (item.genAudios?.length && item.id) {
        acc[item.id] = item.genAudios.map((audio) => ({
          audioUrl: audio.audioUrl,
          audioId: audio.id,
        }));
      }
      return acc;
    }, {});
    set({ historyItems: history });
  },
  deleteHistoryItem: (unitId: string) => (audioId: number) => {
    set((state) => {
      const history = { ...state.historyItems };
      if (history[unitId]) {
        history[unitId] = history[unitId].filter((item) => item.audioId !== audioId);
      }
      return { historyItems: history };
    });
  },
  getHistoryItem: (unitId: string) => {
    return get().historyItems[unitId] || [];
  },
}));
