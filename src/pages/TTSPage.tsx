import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { convertBatchTexts, TTSConvertRequestDto, ttsLoad } from '@/api/ttsAPI';
import { uploadTTSProjectData } from '@/api/uploadTTSProjectData';
import { FileProgressItem } from '@/components/custom/dropdowns/FileProgressDropdown';
import { TableContents } from '@/components/custom/tables/project/common/TableContents';
import Title from '@/components/section/contents/Title';
import AudioFooter from '@/components/section/footer/AudioFooter';
import { FileProgressHeader } from '@/components/section/header/FileProgressHeader';
import TTSOptionsSidebar from '@/components/section/sidebar/TTSSidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import PageLayout from '@/layouts/PageLayout';
import { initialProjectData, ttsInitialSettings, TTSItem, useTTSStore } from '@/stores/tts.store';
import { useTTSAudioHistoryStore } from '@/stores/TTSAudioHistory.store.ts';

const TTSPage = () => {
  const [progressFiles] = useState<FileProgressItem[]>([
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
  ]);

  const { id } = useParams<{ id: string }>();
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
    updateProjectName,
  } = useTTSStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const setHistoryItems = useTTSAudioHistoryStore((state) => state.setHistoryItems);

  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    variant: 'default' | 'destructive';
  }>({
    visible: false,
    message: '',
    variant: 'default',
  });
  const showAlert = useCallback((message: string, variant: 'default' | 'destructive') => {
    setAlert({ visible: true, message, variant });
    setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  // TTS 프로젝트 데이터 로드
  useEffect(() => {
    console.log('test log', id);
    const loadTTSProject = async () => {
      if (!id) {
        console.warn('ID가 없습니다.');
        showAlert('저장을 누르면 새 프로젝트가 저장됩니다.', 'default');
        setProjectData(initialProjectData);
        setItems([]);
        setHistoryItems([]);
        return;
      }

      setIsLoading(true); // 로딩 상태 업데이트
      try {
        console.log('loadTTSProject 호출:', id);
        const response = await ttsLoad(Number(id));
        const { ttsProject, ttsDetails } = response.data;

        // 상태 업데이트
        if (ttsProject) {
          setProjectData({
            projectId: ttsProject.id,
            projectName: ttsProject.projectName || '새 프로젝트',
          });
          console.log('setProjectData 호출 완료:', ttsProject);
        } else {
          console.warn('ttsProject 데이터가 없습니다.');
        }

        if (Array.isArray(ttsDetails)) {
          const loadedItems: TTSItem[] = ttsDetails.map((detail) => ({
            id: String(detail.id),
            enitityId: detail.id,
            text: detail.unitScript || '',
            isSelected: false,
            volume: detail.unitVolume || ttsInitialSettings.volume,
            speed: detail.unitSpeed || ttsInitialSettings.speed,
            pitch: detail.unitPitch || ttsInitialSettings.pitch,
            style: detail.unitVoiceStyleId || null,
          }));

          setItems(loadedItems);
          setHistoryItems(ttsDetails);

          showAlert('프로젝트를 성공적으로 로드했습니다.', 'default');
        } else {
          console.warn('ttsDetails 데이터가 유효하지 않습니다.');
        }
      } catch (error) {
        console.error('TTS 프로젝트 로드 오류:', error);
        showAlert('프로젝트 로드에 실패했습니다.', 'destructive');
      } finally {
        setIsLoading(false);
      }
    };

    loadTTSProject();
  }, [id, setProjectData, setItems, setHistoryItems, showAlert]);

  const isAllSelected = useMemo(() => items.every((item) => item.isSelected), [items]);

  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      const newItems = [...items];
      const [removed] = newItems.splice(startIndex, 1);
      newItems.splice(endIndex, 0, removed);
      setItems(newItems);
    },
    [items, setItems]
  );

  const checkIsValidToGenerate = useCallback(() => {
    const isNotNullOrUndefined = (value: string | number | undefined) =>
      value !== null && value !== undefined;

    const validations = [
      { condition: !projectData.projectId, message: '프로젝트를 먼저 저장을 해주세요' },
      {
        condition: !projectData.projectName || !items.length,
        message: '프로젝트 이름 또는 항목이 없습니다.',
      },
      {
        condition: !items.every((item) => item.text),
        message: '텍스트가 없는 항목이 있습니다.',
      },
      {
        condition: !items.every((item) => isNotNullOrUndefined(item.speed)),
        message: '속도가 없는 항목이 있습니다.',
      },
      {
        condition: !items.every((item) => isNotNullOrUndefined(item.volume)),
        message: '볼륨이 없는 항목이 있습니다.',
      },
      {
        condition: !items.every((item) => isNotNullOrUndefined(item.pitch)),
        message: '피치가 없는 항목이 있습니다.',
      },
      {
        condition: !items.every((item) => isNotNullOrUndefined(item.style)),
        message: '음성 스타일이 없는 항목이 있습니다.',
      },
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        console.warn(message);
        showAlert(message, 'destructive');
        return false;
      }
    }
    return true;
  }, [projectData, items, showAlert]);

  // TTS 오디오 데이터 생성
  const generateTTSAudioData = useCallback(async () => {
    setIsGenerating(true);
    if (!checkIsValidToGenerate()) {
      setIsGenerating(false);
      return;
    }
    if (!projectData.projectId) {
      setIsGenerating(false);
      return;
    }

    try {
      await uploadTTSProjectData(projectData, items, setProjectData, setItems);
    } catch (error) {
      console.error('프로젝트 저장 오류:', error);
      showAlert('프로젝트 저장 중 오류가 발생했습니다.', 'destructive');
    }
    const request = {
      ...projectData,
      projectId: projectData.projectId,
      projectName: projectData.projectName || initialProjectData.projectName,
      fullScript: projectData.fullScript || initialProjectData.fullScript,
      globalSpeed: projectData.globalSpeed || initialProjectData.globalSpeed,
      globalVoiceStyleId: 1,
      ttsDetails: items.map((item, index) => ({
        id: item.enitityId,
        unitScript: item.text,
        unitSpeed: item.speed,
        unitVolume: item.volume,
        unitPitch: item.pitch,
        unitSequence: index + 1,
        unitVoiceStyleId: item.style ? Number(item.style) : null,
        isDeleted: false,
      })),
    } as TTSConvertRequestDto;
    console.log('convertBatchTexts reqest 보낸 데이터:', request);

    try {
      const response = await convertBatchTexts(request);
      if (response.data?.ttsProject?.apiStatus !== 'SUCCESS' || !response.data?.ttsDetails.length) {
        console.error('TTS 오디오 데이터 생성 오류:', response.data);
        throw new Error('TTS 오디오 데이터 생성 오류');
      }
      setHistoryItems(response.data.ttsDetails);
      showAlert('TTS 오디오 데이터 생성이 완료되었습니다.', 'default');
    } catch (error) {
      console.error('TTS 오디오 데이터 생성 오류:', error);
      showAlert('각 항목에 언어를 다시 적용해주세요.', 'destructive');
    } finally {
      setIsGenerating(false);
    }
  }, [
    projectData,
    items,
    setHistoryItems,
    setProjectData,
    checkIsValidToGenerate,
    showAlert,
    setItems,
  ]);

  const historyItems = useTTSAudioHistoryStore((state) => state.historyItems);
  const lastAudioUrl =
    Object.values(historyItems)
      .flat()
      .reverse()
      .find((historyItem) => historyItem.audioUrl)?.audioUrl || '';

  const handleSave = useCallback(async () => {
    try {
      const response = await uploadTTSProjectData(projectData, items, setProjectData, setItems);
      // 새 프로젝트인 경우 URL 업데이트
      if (!projectData.projectId && response?.ttsProject?.id) {
        window.history.replaceState(null, '', `/tts/${response.ttsProject.id}`);
      }
      showAlert('프로젝트가 저장되었습니다.', 'default');
    } catch (error) {
      console.error('프로젝트 저장 오류:', error);
      showAlert('프로젝트 저장에 실패했습니다.', 'destructive');
    }
  }, [projectData, items, setProjectData, showAlert, setItems]);
  console.log('items', items);

  return (
    <PageLayout
      variant="project"
      header={<FileProgressHeader files={progressFiles} />}
      sidebar={<TTSOptionsSidebar />}
      footer={<AudioFooter audioUrl={lastAudioUrl} />}
      children={
        <>
          <Title
            type="TTS"
            projectTitle={projectData.projectName ?? '새 프로젝트'}
            onProjectNameChange={updateProjectName} // 이름 변경 핸들러 추가
            onSave={handleSave} // 저장 핸들러 추가
          />
          {isLoading ? (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <div>Loading...</div>
            </div>
          ) : (
            <>
              {alert.visible && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                  <Alert variant={alert.variant}>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Alert>
                </div>
              )}
              <div className={`h-[580px] mt-6 overflow-hidden`}>
                <TableContents
                  items={items}
                  isAllSelected={isAllSelected}
                  onSelectAll={toggleSelectAll}
                  onSelectionChange={toggleSelection}
                  onTextChange={(id, text) => updateItem(id, { text })}
                  onDelete={deleteSelectedItems}
                  onAdd={addItems}
                  onRegenerateItem={(id) => console.log('재생성 항목:', id)}
                  onDownloadItem={(id) => console.log('다운로드 항목:', id)}
                  onPlay={(id) => console.log('재생:', id)}
                  onReorder={handleReorder}
                  type={'TTS'}
                />
              </div>
              <div className={`TTS mt-12 text-center`}>
                <Button onClick={generateTTSAudioData} disabled={isGenerating}>
                  {isGenerating ? '생성 중...' : 'TTS 생성'}
                </Button>
              </div>
            </>
          )}
        </>
      }
    />
  );
};

export default TTSPage;
