import { useCallback, useEffect, useMemo, useState } from 'react';

import { ttsLoad } from '@/api/aIParkAPI';
import { saveTTSProject } from '@/api/ttsApi';
import { FileProgressItem } from '@/components/custom/dropdowns/FileProgressDropdown';
import MainContents from '@/components/section/contents/MainContents';
import Title from '@/components/section/contents/Title';
import AudioFooter from '@/components/section/footer/AudioFooter';
import { FileProgressHeader } from '@/components/section/header/FileProgressHeader';
import TTSOptionsSidebar from '@/components/section/sidebar/TTSSidebar';
import jisuImage from '@/images/avatar/jisu.jpg';
import PageLayout from '@/layouts/PageLayout';
import { ttsInitialSettings, useTTSStore } from '@/stores/tts.store';
import { TableItem } from '@/types/table';

const fileProgressDummy: FileProgressItem[] = [
  {
    id: 1,
    name: 'text_001.txt',
    status: '진행',
    progress: 75,
    createdAt: new Date().toISOString(), // 오늘
  },
  {
    id: 2,
    name: 'text_002.txt',
    status: '진행',
    progress: 82,
    createdAt: new Date().toISOString(), // 오늘
  },
  {
    id: 3,
    name: 'text_003.txt',
    status: '대기',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 어제
  },
  {
    id: 4,
    name: 'text_004.txt',
    status: '대기',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 어제
  },
  {
    id: 5,
    name: 'text_005.txt',
    status: '실패',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 그저께
  },
  {
    id: 6,
    name: 'text_006.txt',
    status: '완료',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 일주일 전
  },
  {
    id: 7,
    name: 'text_007.txt',
    status: '완료',
    createdAt: new Date(Date.now() - 86400000 * 31).toISOString(), // 한달 전
  },
];

const TTSPage = () => {
  const {
    items,
    projectData,
    setItems,
    setProjectData,
    toggleSelection,
    toggleSelectAll,
    updateItem,
    deleteSelectedItems,
    addItems,
    handleReorder,
    updateProjectName,
  } = useTTSStore();

  const [progressFiles, setProgressFiles] = useState<FileProgressItem[]>(fileProgressDummy);

  // TTS 상태 로드
  const fetchTTSState = useCallback(
    async (id: number) => {
      try {
        const response = await ttsLoad(id);
        if (response.data?.success && response.data.data) {
          const { ttsProject, ttsDetails } = response.data.data;

          setProjectData({
            projectId: ttsProject.id,
            projectName: ttsProject.projectName,
          });

          const loadedItems = ttsDetails.map((detail) => ({
            id: detail.id ? String(detail.id) : '',
            text: detail.unitScript || '',
            isSelected: false,
            speed: detail.unitSpeed || ttsInitialSettings.speed,
            volume: detail.unitVolume || ttsInitialSettings.volume,
            pitch: detail.unitPitch || ttsInitialSettings.pitch,
          }));
          setItems(loadedItems);
        }
      } catch (error) {
        console.error('TTS 프로젝트 로드 실패', error);
      }
    },
    [setProjectData, setItems]
  );

  useEffect(() => {
    if (projectData.projectId) {
      fetchTTSState(projectData.projectId);
    }
  }, [projectData.projectId, fetchTTSState]);

  // 프로젝트 저장
  const handleSaveProject = useCallback(async () => {
    try {
      const response = await saveTTSProject({
        ...projectData,
        ttsDetails: items.map((item) => ({
          id: item.id ? Number(item.id) : null,
          unitScript: item.text,
          unitSpeed: item.speed,
          unitVolume: item.volume,
          unitPitch: item.pitch,
        })),
      });

      if (response) {
        setProjectData({
          projectId: response.ttsProject.id,
          projectName: response.ttsProject.projectName,
          // !TODO다른 업데이트할 프로젝트 데이터들이 들어가면 좋을듯
        });
      }
    } catch (error) {
      console.error('프로젝트 저장 오류:', error);
    }
  }, [projectData, items, setProjectData]);

  const handleDeleteCompleted = () => {
    setProgressFiles((prev) => prev.filter((file) => file.status !== '완료'));
  };

  const handleRetryFailed = useCallback(() => {
    setProgressFiles((prev) =>
      prev.map((file) => (file.status === '실패' ? { ...file, status: '대기' } : file))
    );
  }, []);

  const isAllSelected = useMemo(() => items.every((item) => item.isSelected), [items]);

  return (
    <PageLayout
      variant="project"
      header={
        <FileProgressHeader
          name="김바타"
          email="aipark@aipark.ai"
          imageUrl={jisuImage}
          files={progressFiles}
          onDeleteCompleted={handleDeleteCompleted}
          onRetryFailed={handleRetryFailed}
          onMyPage={() => console.log('마이페이지')}
          onSignout={() => console.log('로그아웃')}
        />
      }
      sidebar={<TTSOptionsSidebar />}
      footer={<AudioFooter audioUrl="/sample.mp3" />}
      children={
        <>
          <Title
            type="TTS"
            projectTitle={projectData.projectName ?? '새 프로젝트'}
            onProjectNameChange={updateProjectName} // 이름 변경 핸들러 추가
            onSave={handleSaveProject}
          />
          <MainContents
            type="TTS"
            items={items}
            isAllSelected={isAllSelected}
            onSelectAll={toggleSelectAll}
            onSelectionChange={toggleSelection}
            onTextChange={(id, text) => updateItem(id, { text })}
            onDelete={deleteSelectedItems}
            onAdd={(newItems?: TableItem[]) => {
              // TableItem[] -> TTSItem[]
              if (!newItems) return;
              const mappedItems = newItems.map((item) => ({
                id: '',
                text: item.text,
                isSelected: false,
                speed: ttsInitialSettings.speed,
                volume: ttsInitialSettings.volume,
                pitch: ttsInitialSettings.pitch,
              }));
              addItems(mappedItems);
            }}
            onRegenerateItem={(id) => console.log('재생성 항목:', id)}
            onDownloadItem={(id) => console.log('다운로드 항목:', id)}
            onPlay={(id) => console.log('재생:', id)}
            onReorder={(newItems) => {
              // MainContentsItem[] -> TTSItem[]
              const mappedItems = newItems.map((item) => ({
                id: item.id,
                text: item.text,
                isSelected: item.isSelected,
                speed: item.speed ?? ttsInitialSettings.speed,
                volume: item.volume ?? ttsInitialSettings.volume,
                pitch: item.pitch ?? ttsInitialSettings.pitch,
              }));
              handleReorder(mappedItems);
            }}
          />
        </>
      }
    />
  );
};

export default TTSPage;
