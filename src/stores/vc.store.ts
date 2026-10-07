import { create } from 'zustand';

import { saveVCProject } from '@/api/vcAPI';
import { VCItem } from '@/types/table';

interface Alert {
  show: boolean;
  message: string;
  variant: 'default' | 'destructive';
}

interface AudioPlayer {
  audioElement: HTMLAudioElement | null;
  currentPlayingId: string | null;
}

interface VCStore {
  // 상태
  saving: boolean;
  items: VCItem[];
  selectedVoice: string;
  projectData: {
    projectId: number | null;
    projectName: string;
  };
  alert: Alert;
  audioPlayer: AudioPlayer;
  memberId: number;

  // 기본 액션
  setItems: (items: VCItem[] | ((prev: VCItem[]) => VCItem[])) => void;
  addItems: (newItems: VCItem[]) => void;
  updateItem: (id: string, updates: Partial<VCItem>) => void;
  deleteSelectedItems: () => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  setSelectedVoice: (voice: string) => void;
  showAlert: (message: string, variant?: 'default' | 'destructive') => void;
  hideAlert: () => void;
  setProjectData: (data: { projectId: number | null; projectName: string }) => void;
  updateProjectName: (name: string) => void;
  setCurrentPlayingId: (id: string | null) => void;

  // 파일 핸들러
  handleAdd: () => void;
  handleFileUpload: (files: FileList | null) => void;
  handleTextChange: (id: string, newText: string) => void;
  handlePlay: (id: string) => void;
  handlePause: () => void;

  // URL 정리를 위한 메서드 추가
  cleanupAudioUrl: (id: string) => void;
  cleanupAllAudioUrls: () => void;

  // 적용 액션 추가
  applyToSelected: () => void;

  handleSave: () => Promise<void>;

  resetStore: () => void;
}

// useFileUpload hooks의 로직을 store에 맞게 재구현
const handleAudioUpload = (
  onSuccess: (items: VCItem[]) => void,
  onError: (error: string) => void
) => {
  const validateAudioFile = (file: File) => {
    const allowedTypes = ['audio/wav', 'audio/mpeg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('WAV, MP3 파일만 업로드할 수 있습니다.');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    const { type, accept, multiple } = {
      type: 'file',
      accept: 'audio/*',
      multiple: true,
    };

    Object.assign(input, { type, accept, multiple });

    input.onchange = async ({ target }) => {
      const { files } = target as HTMLInputElement;

      if (!files?.length) {
        return;
      }

      try {
        // 파일 타입 검증
        Array.from(files).forEach(validateAudioFile);

        const newItems: VCItem[] = Array.from(files).map((file) => {
          const { name } = file;
          return {
            id: crypto.randomUUID(),
            fileName: name,
            file,
            text: '',
            isSelected: false,
            status: '대기중' as const,
            originalAudioUrl: URL.createObjectURL(file),
          };
        });

        onSuccess(newItems);
      } catch (error) {
        onError(error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.');
      }
    };

    input.click();
  };

  return { openFileDialog };
};

const handleTextUpload = (onSuccess: (texts: string[]) => void) => {
  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    try {
      const texts = await Promise.all(Array.from(files).map((file) => file.text()));
      onSuccess(texts);
    } catch (error) {
      console.error('텍스트 파일 처리 중 오류:', error);
    }
  };

  return { handleFiles };
};

export const useVCStore = create<VCStore>((set, get) => ({
  // 초기 상태 설정
  saving: false,
  items: [], // 빈 배열로 초기화
  selectedVoice: '',
  projectData: {
    projectId: null,
    projectName: '새 프로젝트',
  },
  alert: {
    show: false,
    message: '',
    variant: 'default',
  },
  audioPlayer: {
    audioElement: null,
    currentPlayingId: null,
  },
  memberId: 0,

  // 기존 액션들
  setItems: (items) => set({ items: typeof items === 'function' ? items(get().items) : items }),
  addItems: (newItems) => set((state) => ({ items: [...state.items, ...newItems] })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),
  deleteSelectedItems: () => {
    const { items } = get();
    // 삭제되는 아이템들의 URL 정리
    items.forEach((item) => {
      if (item.isSelected && item.originalAudioUrl) {
        URL.revokeObjectURL(item.originalAudioUrl);
      }
    });
    set((state) => ({
      items: state.items.filter((item) => !item.isSelected),
    }));
  },
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
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  showAlert: (message, variant = 'destructive') => {
    set({ alert: { show: true, message, variant } });
    setTimeout(() => {
      set(() => ({
        alert: {
          show: false,
          message: '',
          variant: 'default',
        },
      }));
    }, 1500);
  },
  hideAlert: () => set((state) => ({ alert: { ...state.alert, show: false } })),
  setProjectData: (data) => set({ projectData: data }),
  updateProjectName: (name) =>
    set((state) => ({ projectData: { ...state.projectData, projectName: name } })),
  setCurrentPlayingId: (id) =>
    set((state) => ({
      audioPlayer: {
        ...state.audioPlayer,
        currentPlayingId: id,
      },
    })),

  // 파일 핸들러
  handleAdd: () => {
    const { openFileDialog } = handleAudioUpload(
      (newItems) => get().addItems(newItems),
      (error) => get().showAlert(error, 'destructive')
    );
    openFileDialog();
  },
  handleFileUpload: (files) => {
    const { handleFiles } = handleTextUpload((texts) => {
      const { items, updateItem } = get();
      const selectedItems = items.filter((item) => item.isSelected);

      selectedItems.forEach((item, index) => {
        if (index < texts.length) {
          updateItem(item.id, {
            text: texts[index],
            unitScript: texts[index],
          });
        }
      });
    });
    handleFiles(files);
  },
  handleTextChange: (id, newText) =>
    get().updateItem(id, {
      text: newText,
      unitScript: newText,
    }),
  handlePlay: (id: string) => {
    const state = get();
    const item = state.items.find((item) => item.id === id);
    const audioUrl = item?.originalAudioUrl;
    if (!audioUrl) return;

    // 이전에 재생하던 오디오가 있으면 재사용
    if (state.audioPlayer.audioElement?.src === audioUrl) {
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
    const audio = new Audio(audioUrl);
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
        ...state.audioPlayer, // 존 audioElement 유지
        currentPlayingId: null,
      },
    });
  },

  // URL 정리를 위한 메서드 추가
  cleanupAudioUrl: (id: string) => {
    const item = get().items.find((item) => item.id === id);
    if (item?.originalAudioUrl) {
      URL.revokeObjectURL(item.originalAudioUrl);
    }
  },

  // 모든 URL 정리
  cleanupAllAudioUrls: () => {
    get().items.forEach((item) => {
      if (item.originalAudioUrl) {
        URL.revokeObjectURL(item.originalAudioUrl);
      }
    });
  },

  // 적용 액션 구현
  applyToSelected: () => {
    const { items, selectedVoice } = get();
    if (!selectedVoice) return;

    set({
      items: items.map((item) =>
        item.isSelected
          ? {
              ...item,
              targetVoice: selectedVoice,
              status: '대기중',
            }
          : item
      ),
    });
  },

  handleSave: async () => {
    const { items, projectData } = get();

    if (get().saving) return;
    set({ saving: true });

    try {
      const saveData = {
        projectId: projectData.projectId,
        projectName: projectData.projectName,
        srcFiles: items
          .filter((item) => item.isSelected)
          .map((item) => ({
            detailId: item.detailId || null,
            localFileName: item.file ? item.fileName : null,
            unitScript: item.unitScript || item.text || '',
            isChecked: true,
          })),
        trgFiles: [],
      };

      const files = items
        .filter((item) => item.isSelected && item.file)
        .map((item) => item.file as File);

      const response = await saveVCProject(saveData, files);

      if (response?.data?.vcProjectRes) {
        if (!projectData.projectId && response.data.vcProjectRes.id) {
          window.history.replaceState(null, '', `/vc/${response.data.vcProjectRes.id}`);
        }
        // 프로젝트 ID 업데이트
        set({
          projectData: {
            ...projectData,
            projectId: response.data.vcProjectRes.id,
          },
        });

        // 저장된 아이템 상태 업데이트
        if (response.data?.vcDetailsRes) {
          const updatedItems = items.map((item) => {
            const matchingDetail = response.data!.vcDetailsRes.find(
              (detail) => detail.unitScript === (item.unitScript || item.text)
            );
            if (matchingDetail) {
              return {
                ...item,
                detailId: matchingDetail.id,
                file: null,
                srcAudio: matchingDetail.srcAudio,
              };
            }
            return item;
          });
          set({ items: updatedItems });
        }

        get().showAlert('프로젝트가 저장되었습니다.', 'default');
      }
    } catch (error) {
      console.error('프로젝트 저장 실패:', error);
      get().showAlert('프로젝트 저장에 실패했습니다.', 'destructive');
    } finally {
      set({ saving: false });
    }
  },

  // 스토어 초기화 메서드 추가
  resetStore: () => {
    set({
      items: [],
      saving: false,
      selectedVoice: '',
      projectData: {
        projectId: null,
        projectName: '새 프로젝트',
      },
      alert: {
        show: false,
        message: '',
        variant: 'default',
      },
      audioPlayer: {
        audioElement: null,
        currentPlayingId: null,
      },
    });
  },
}));
