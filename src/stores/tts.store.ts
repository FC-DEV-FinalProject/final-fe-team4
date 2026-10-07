import { create } from 'zustand';

import { TTSDetailDto, TTSSaveDto } from '@/api/aIParkAPI.schemas';
import { GOOGLE_TTS_CONFIG } from '@/constants/googleTTSConfig';
import { TableItem } from '@/types/table';

export interface TTSItem {
  id: string;
  enitityId: number | null;
  text: string;
  isSelected: boolean;
  speed?: number;
  volume: number;
  pitch: number;
  language?: string;
  voice?: string;
  style?: string;
  fileName?: string;
}

type showAlert = (message: string, variant: 'default' | 'destructive') => void;
interface TTSConfig {
  speed: number;
  volume: number;
  pitch: number;
  language: string;
  style: string;
}

interface TTSStore {
  // 사이드바 설정
  speed: number;
  volume: number;
  pitch: number;
  language: string;
  style: string;
  isModified: boolean;
  isAllConfigured: boolean;

  // 테이블 아이템 관련
  items: TTSItem[];

  // 사이드바 액션
  setField: (field: keyof TTSConfig, value: string | number) => void;
  cleanUpAllItems: () => void;

  // 테이블 액션
  setItems: (items: TTSItem[]) => void;
  addItems: (newItems?: TableItem[]) => void;
  updateItem: (id: string, updates: Partial<TTSItem>) => void;
  deleteSelectedItems: () => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  reorderItems: (newItems: TTSItem[]) => void;

  // 프로젝트 데이터
  projectData: TTSSaveDto;

  // 프로젝트 관련 액션
  setProjectData: (data: {
    projectId: number | null;
    projectName: string;
    fullScript?: string;
    globalVoiceStyleId?: number;
    globalSpeed?: number;
    globalPitch?: number;
    globalVolume?: number;
    ttsDetails?: TTSDetailDto[];
  }) => void;
  updateProjectName: (name: string) => void;

  // TTS 설정 적용 액션
  applyToSelected: (showAlert?: showAlert) => void;

  handleReorder: (items: TableItem[]) => void;
}

export const initialProjectData = {
  projectId: null,
  projectName: '새 프로젝트',
  globalVoiceStyleId: 9,
  fullScript: '',
  globalSpeed: GOOGLE_TTS_CONFIG.SPEED.DEFAULT,
  globalPitch: GOOGLE_TTS_CONFIG.PITCH.DEFAULT,
  globalVolume: GOOGLE_TTS_CONFIG.VOLUME.DEFAULT,
  ttsDetails: [],
};

export const ttsInitialSettings = {
  // 사이드바 초기값
  speed: initialProjectData.globalSpeed,
  volume: initialProjectData.globalVolume,
  pitch: initialProjectData.globalPitch,
  language: '',
  voice: '',
  style: '',
  isModified: false,
  isAllConfigured: false,

  // 테이블 초기값
  items: [],
  projectId: null,
  projectName: '새 프로젝트',

  // 프로젝트 초기값
  projectData: initialProjectData,
};

export const useTTSStore = create<TTSStore>((set, get) => ({
  ...ttsInitialSettings,

  setField: (field, value) =>
    set((state) => {
      const newState = { ...state, [field]: value };
      const isModified = Object.keys(ttsInitialSettings).some(
        (key) => newState[key as keyof TTSConfig] !== ttsInitialSettings[key as keyof TTSConfig]
      );

      const isAllConfigured = ['language', 'style'].every(
        (key) => newState[key as keyof TTSConfig] !== ttsInitialSettings[key as keyof TTSConfig]
      );

      return {
        ...newState,
        isModified,
        isAllConfigured,
      };
    }),

  cleanUpAllItems: () => {
    const updatedItems = get().items.map((item) => ({
      ...item,
      speed: ttsInitialSettings.speed,
      volume: ttsInitialSettings.volume,
      pitch: ttsInitialSettings.pitch,
    }));
    set({ ...ttsInitialSettings, items: updatedItems });
  },

  setItems: (items) =>
    set((state) => {
      return { ...state, items };
    }),

  addItems: (newItems) =>
    set((state) => {
      if (newItems && newItems.length > 0) {
        const mappedItems = newItems.map((item) => ({
          id: crypto.randomUUID(),
          enitityId: null,
          text: item.text ?? '',
          isSelected: false,
          speed: state.speed ?? ttsInitialSettings.speed,
          volume: state.volume ?? ttsInitialSettings.volume,
          pitch: state.pitch ?? ttsInitialSettings.pitch,
          language: state.language ?? ttsInitialSettings.language,
          style: state.style ?? ttsInitialSettings.style,
        }));
        return { items: [...state.items, ...mappedItems] };
      } else {
        const newItem: TTSItem = {
          id: crypto.randomUUID(),
          enitityId: null,
          text: '',
          isSelected: false,
          speed: state.speed,
          volume: state.volume,
          pitch: state.pitch,
          language: state.language,
          style: state.style,
        };
        return { items: [...state.items, newItem] };
      }
    }),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),

  deleteSelectedItems: () =>
    set((state) => ({
      items: state.items.filter((item) => !item.isSelected),
    })),

  toggleSelection: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      ),
    })),

  toggleSelectAll: () =>
    set((state) => {
      const isAllSelected = state.items.every((item) => item.isSelected);
      return {
        items: state.items.map((item) => ({ ...item, isSelected: !isAllSelected })),
      };
    }),

  reorderItems: (newItems) => set({ items: newItems }),

  setProjectData: (data) =>
    set((state) => {
      return { ...state, projectData: { ...state.projectData, ...data } };
    }),

  updateProjectName: (name: string) =>
    set((state) => ({
      projectData: {
        ...state.projectData,
        projectName: name,
      },
    })),

  applyToSelected: (showAlert) => {
    const { items, speed, volume, pitch, language, style } = get();
    if (!items.some((item) => item.isSelected)) {
      if (showAlert) {
        showAlert('선택된 항목이 없습니다.', 'destructive');
      }
      return;
    }
    set({
      items: items.map((item) =>
        item.isSelected
          ? {
              ...item,
              speed,
              volume,
              pitch,
              language,
              style,
            }
          : item
      ),
    });
    if (showAlert) {
      //!TODO: 더나은 alert message를 만들어야 함
      showAlert('TTS 옵션 설정이 적용되었습니다.', 'default');
    }
  },

  handleReorder: (newItems: TableItem[]) => {
    const convertedItems: TTSItem[] = newItems.map((item) => ({
      id: item.id,
      enitityId: null,
      text: item.text,
      isSelected: false,
      speed: item.speed ?? ttsInitialSettings.speed,
      volume: item.volume ?? ttsInitialSettings.volume,
      pitch: item.pitch ?? ttsInitialSettings.pitch,
      language: ttsInitialSettings.language,
    }));
    set({ items: convertedItems });
  },
}));
