import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { vcLoad } from '@/api/vcAPI';
import MainContents from '@/components/section/contents/MainContents';
import Title from '@/components/section/contents/Title';
import AudioFooter from '@/components/section/footer/AudioFooter';
import VCSidebar, { TargetVoice } from '@/components/section/sidebar/VCSidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAudioDownload } from '@/hooks/useAudioDownload';
import { useVoiceConversion } from '@/hooks/useVoiceConversion';
import PageLayout from '@/layouts/PageLayout';
import { useVCStore } from '@/stores/vc.store';

const VCPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    items,
    deleteSelectedItems,
    toggleSelection,
    toggleSelectAll,
    selectedVoice,
    setSelectedVoice,
    alert,
    projectData,
    updateProjectName,
    handleAdd,
    handleFileUpload,
    handleTextChange,
    handlePlay,
    cleanupAllAudioUrls,
    memberId,
    setItems,
    showAlert,
    resetStore,
    setProjectData,
    handleSave,
  } = useVCStore();

  const [customVoices, setCustomVoices] = useState<TargetVoice[]>([
    {
      id: 'rico.mp3',
      name: 'rico.mp3',
      description: '',
      avatarUrl: '',
      type: 'custom',
    },
  ]);

  // 새 프로젝트인 경우 스토어 초기화
  useEffect(() => {
    if (!id) {
      resetStore();
    }
  }, [id, resetStore]);

  // 첫 번째 보이스를 기본값으로 설정
  useEffect(() => {
    if (customVoices.length > 0 && !selectedVoice) {
      setSelectedVoice(customVoices[0].name);
    }
  }, [customVoices, selectedVoice, setSelectedVoice]);

  // 클린업 이펙트
  useEffect(() => cleanupAllAudioUrls, [cleanupAllAudioUrls]);

  // 음성 변환 핸들러
  const { handleVoiceConversion, isGenerating } = useVoiceConversion({
    items,
    selectedVoice,
    projectData,
    memberId,
    setItems,
    showAlert,
  });

  // 다운로드 핸들러
  const handleDownload = useAudioDownload({ items, showAlert });

  // 메인 컨텐츠 아이템 변환
  const mainContentItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        text: item.text,
        isSelected: item.isSelected,
        status: item.status,
        fileName: item.fileName,
        audioUrl: item.originalAudioUrl,
        convertedAudioUrl: item.convertedAudioUrl,
        targetVoice: item.targetVoice,
      })),
    [items]
  );

  // 현재 재생중 오디오 URL (AudioFooter용)
  const currentAudioUrl = useMemo(() => {
    const selectedItem = items.find(
      (item) => item.isSelected && item.status === '완료' && item.convertedAudioUrl
    );
    return selectedItem?.convertedAudioUrl || '';
  }, [items]);

  // 현재 선택된 아이템의 파일명 가져오기
  const currentFileName = useMemo(() => {
    const selectedItem = items.find(
      (item) => item.isSelected && item.status === '완료' && item.convertedAudioUrl
    );
    return selectedItem?.fileName || '';
  }, [items]);

  const handleReorder = (startIndex: number, endIndex: number) => {
    const newItems = [...items];
    const [removed] = newItems.splice(startIndex, 1);
    newItems.splice(endIndex, 0, removed);
    setItems(newItems);
  };

  // 프로젝트 로드 로직 추가
  useEffect(() => {
    const loadVCProject = async () => {
      if (!id) {
        resetStore();
        return;
      }

      try {
        const response = await vcLoad(Number(id));
        if (!response.data) return;

        const { vcProject, vcDetails } = response.data;

        if (vcProject) {
          setProjectData({
            projectId: vcProject.id,
            projectName: vcProject.projectName || '새 프로젝트',
          });
        }

        if (Array.isArray(vcDetails)) {
          setItems(
            vcDetails.map((detail) => ({
              id: String(detail.id),
              detailId: detail.id,
              fileName: detail.fileName || '',
              text: detail.unitScript || '',
              isSelected: detail.isChecked || false,
              status: '대기중',
              file: undefined,
            }))
          );
        }
      } catch (error) {
        console.error('VC 프로젝트 로드 실패:', error);
        showAlert('프로젝트 로드에 실패했습니다.', 'destructive');
      }
    };

    loadVCProject();
  }, [id, resetStore, setProjectData, setItems, showAlert]);

  return (
    <PageLayout
      variant="project"
      header={<></>}
      sidebar={
        <VCSidebar
          selectedVoice={selectedVoice}
          onVoiceSelect={setSelectedVoice}
          onApplyConversion={handleVoiceConversion}
          customVoices={customVoices}
          onVoiceUpload={setCustomVoices}
        />
      }
      footer={<AudioFooter audioUrl={currentAudioUrl} type="VC" label={currentFileName} />}
    >
      {alert.show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-6">
          <Alert variant={alert.variant} className="w-[360px] bg-white">
            <AlertDescription className="text-sm">{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <Title
        type="VC"
        projectTitle={projectData.projectName}
        onProjectNameChange={updateProjectName}
        onSave={handleSave}
        onClose={() => console.log('닫기')}
      />
      <MainContents
        type="VC"
        items={mainContentItems}
        onSelectionChange={toggleSelection}
        onTextChange={handleTextChange}
        onDelete={deleteSelectedItems}
        onAdd={handleAdd}
        onPlay={handlePlay}
        onSelectAll={toggleSelectAll}
        isAllSelected={items.every((item) => item.isSelected)}
        onFileUpload={handleFileUpload}
        hasAudioFile={items.length > 0}
        onGenerate={handleVoiceConversion}
        isGenerating={isGenerating}
        onDownloadItem={handleDownload}
        onReorder={handleReorder}
      />
    </PageLayout>
  );
};

export default VCPage;
