import { create } from 'zustand';

export interface ConcatItem {
  id: string;
  text: string;
  isSelected: boolean;
  fileName: string;
  audioUrl: string;
  file?: File;
  status: '대기중' | '완료' | '실패' | '진행';
  frontSilence?: number;
  backSilence?: number;
  endSilence?: number;
}

interface ConcatStore {
  // 상태
  items: ConcatItem[];
  audioPlayer: {
    audioElement: HTMLAudioElement | null;
    currentPlayingId: string | null;
  };
  silenceSettings: {
    fileSilence: number; // 오디오 파일 간 무음
    frontSilence: number; // 맨 앞 무음
    backSilence: number; // 맨 뒤 무음
  };
  isModified: boolean;

  // 액션
  setItems: (items: ConcatItem[] | ((prev: ConcatItem[]) => ConcatItem[])) => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  deleteSelectedItems: () => void;
  handleAdd: () => void;
  handleTextChange: (id: string, text: string) => void;
  handlePlay: (id: string) => void;
  handlePause: () => void;
  setCurrentPlayingId: (id: string | null) => void;
  showAlert: (message: string, variant: 'default' | 'destructive') => void;
  setSilenceSettings: (settings: {
    fileSilence?: number;
    frontSilence?: number;
    backSilence?: number;
  }) => void;
  applySilenceToSelected: () => void;
  reset: () => void;
}

export const useConcatStore = create<ConcatStore>((set, get) => ({
  // 초기 상태
  items: [],
  audioPlayer: {
    audioElement: null,
    currentPlayingId: null,
  },
  silenceSettings: {
    fileSilence: 0,
    frontSilence: 0,
    backSilence: 0,
  },
  isModified: false,

  // 액션
  // setItems: (items) => set({ items }),
  setItems: (items) => {
    if (typeof items === 'function') {
      set((state) => ({ items: items(state.items) }));
    } else {
      set({ items });
    }
  },

  toggleSelection: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      ),
    })),

  toggleSelectAll: () =>
    set((state) => {
      const allSelected = state.items.every((item) => item.isSelected);
      return {
        items: state.items.map((item) => ({ ...item, isSelected: !allSelected })),
      };
    }),

  deleteSelectedItems: () =>
    set((state) => ({
      items: state.items.filter((item) => !item.isSelected),
    })),

  handleAdd: () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      const audioFiles = Array.from(files).filter((file) => file.type.startsWith('audio/'));
      const newItems = audioFiles.map((file) => ({
        id: crypto.randomUUID(),
        text: '',
        isSelected: false,
        fileName: file.name,
        audioUrl: URL.createObjectURL(file),
        file,
        status: '대기중' as const,
        frontSilence: 0,
        backSilence: 0,
        endSilence: 0,
      }));

      set((state) => ({
        items: [...state.items, ...newItems],
      }));
    };
    input.click();
  },

  handleTextChange: (id, text) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, text } : item)),
    })),

  handlePlay: (id) => {
    const state = get();
    const item = state.items.find((item) => item.id === id);
    if (!item?.audioUrl) return;

    // 이전에 재생하던 오디오가 있으면 재사용
    if (state.audioPlayer.audioElement?.src === item.audioUrl) {
      state.audioPlayer.audioElement.play();
      set({
        audioPlayer: {
          ...state.audioPlayer,
          currentPlayingId: id,
        },
      });
      return;
    }

    // 다른 오디오 재생 시도시
    if (state.audioPlayer.audioElement) {
      state.audioPlayer.audioElement.pause();
    }

    // 새로운 오디오 생성
    const audio = new Audio(item.audioUrl);
    audio.onended = () => {
      get().setCurrentPlayingId(null);
      set({
        audioPlayer: {
          audioElement: null,
          currentPlayingId: null,
        },
      });
    };

    audio.play();
    set({
      audioPlayer: {
        audioElement: audio,
        currentPlayingId: id,
      },
    });
  },

  handlePause: () => {
    const state = get();
    state.audioPlayer.audioElement?.pause();
    set({
      audioPlayer: {
        ...state.audioPlayer, // 기존 audioElement 유지
        currentPlayingId: null,
      },
    });
  },

  setCurrentPlayingId: (id) =>
    set((state) => ({
      audioPlayer: {
        ...state.audioPlayer,
        currentPlayingId: id,
      },
    })),

  showAlert: (message, variant) => {
    console.log(`${variant}: ${message}`);
  },

  setSilenceSettings: (settings) =>
    set((state) => ({
      silenceSettings: { ...state.silenceSettings, ...settings },
      isModified: true,
    })),

  applySilenceToSelected: () => {
    const { items, silenceSettings, isModified } = get();
    if (!isModified) return;

    set({
      items: items.map((item) =>
        item.isSelected
          ? {
              ...item,
              frontSilence: silenceSettings.frontSilence,
              backSilence: silenceSettings.backSilence,
              endSilence: silenceSettings.fileSilence,
              status: '대기중',
            }
          : item
      ),
      isModified: false,
    });
  },

  reset: () => {
    set((state) => ({
      silenceSettings: {
        fileSilence: 0,
        frontSilence: 0,
        backSilence: 0,
      },
      items: state.items.map((item) =>
        item.isSelected
          ? {
              ...item,
              frontSilence: 0,
              backSilence: 0,
              endSilence: 0,
              status: '대기중',
            }
          : item
      ),
      isModified: false,
    }));
  },
}));
