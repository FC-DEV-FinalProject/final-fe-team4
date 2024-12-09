import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  concatLoad,
  concatSave,
  convertMultipleAudios,
  deleteSelectedConcatItems,
} from '@/api/concatAPI';
import { FileProgressItem } from '@/components/custom/dropdowns/FileProgressDropdown';
import { AudioPlayer } from '@/components/custom/features/common/AudioPlayer';
import MainContents from '@/components/section/contents/MainContents';
import Title from '@/components/section/contents/Title';
import { FileProgressHeader } from '@/components/section/header/FileProgressHeader';
import ConcatSidebar from '@/components/section/sidebar/ConcatSidebar';
import { Spinner } from '@/components/ui/spinner';
import PageLayout from '@/layouts/PageLayout';
import { ConcatItem, useConcatStore } from '@/stores/concat.store';
const ConcatPage = () => {
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

  const { id } = useParams();
  const {
    items,
    setItems,
    deleteSelectedItems,
    toggleSelection,
    toggleSelectAll,
    handleAdd,
    handleTextChange,
    handlePlay,
  } = useConcatStore();

  const [projectName, setProjectName] = useState('새 프로젝트');
  const [isLoading, setIsLoading] = useState(false);
  const [globalFrontSilenceLength, setGlobalFrontSilenceLength] = useState(0);
  const [globalTotalSilenceLength, setGlobalTotalSilenceLength] = useState(0);
  const hasAudioFile = items.length > 0;
  const [concatAudioUrl, setConcatAudioUrl] = useState<string>('');

  useEffect(() => {
    const loadConcatProject = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await concatLoad(Number(id));
        console.log('API 전체 응답:', response);
        console.log('API 응답 데이터:', response.data);

        if (response.data.cnctProjectDto) {
          console.log('프로젝트 정보:', response.data.cnctProjectDto);
          setProjectName(response.data.cnctProjectDto.projectName);
          setGlobalFrontSilenceLength(
            Number(response.data.cnctProjectDto.globalFrontSilenceLength) || 0
          );
          setGlobalTotalSilenceLength(
            Number(response.data.cnctProjectDto.globalTotalSilenceLength) || 0
          );
        }

        if (response.data.cnctDetailDtos && Array.isArray(response.data.cnctDetailDtos)) {
          console.log('상세 정보:', response.data.cnctDetailDtos);
          const newItems: ConcatItem[] = response.data.cnctDetailDtos.map((detail) => ({
            id: detail.id.toString(),
            text: detail.unitScript,
            isSelected: detail.checked,
            fileName: detail.srcUrl.split('/').pop() || '',
            audioUrl: detail.srcUrl,
            file: undefined,
            status: '대기중' as const,
            endSilence: detail.endSilence,
          }));
          setItems(newItems);
        }
      } catch (error) {
        console.error('프로젝트 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConcatProject();
  }, [id, setItems]);

  // 프로젝트 이름 변경
  const handleProjectNameChange = useCallback((newName: string) => {
    console.log('프로젝트 이름 변경:', newName);
    setProjectName(newName);
  }, []);

  // 저장
  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);

      const concatSaveDto = {
        projectId: id ? parseInt(id) : null,
        projectName,
        globalFrontSilenceLength: Number(globalFrontSilenceLength) || 0,
        globalTotalSilenceLength: Number(globalTotalSilenceLength) || 0,
        concatDetails: items.map((item, index) => ({
          id: id && item.id ? parseInt(item.id) : null,
          localFileName: item.fileName || '',
          audioSeq: index + 1,
          isChecked: item.isSelected,
          unitScript: item.text || '',
          endSilence: item.endSilence || 0,
        })),
      };

      const files = items
        .filter((item) => item.file instanceof File && item.file.size > 0)
        .map((item) => item.file) as File[];

      console.log('저장 요청 데이터:', concatSaveDto);

      const response = await concatSave({
        concatSaveDto,
        file: files,
      });

      console.log('저장 성공:', response);
    } catch (error) {
      console.error('저장 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, projectName, globalFrontSilenceLength, globalTotalSilenceLength, items]);

  // 선택된 항목 삭제
  const handleDeleteSelectedItems = useCallback(async () => {
    try {
      setIsLoading(true);

      // 선택된 항목들의 ID 추출
      const selectedDetailIds = items
        .filter((item) => item.isSelected)
        .map((item) => parseInt(item.id));

      if (selectedDetailIds.length === 0) {
        console.log('선택된 항목이 없습니다.');
        return;
      }

      const deleteResponse = await deleteSelectedConcatItems({
        projectId: id ? parseInt(id) : 0,
        detailIds: selectedDetailIds,
      });

      if (deleteResponse.success) {
        deleteSelectedItems();
        const updatedItems = items.filter((item) => !item.isSelected);
        setItems(updatedItems);
      }
    } catch (error) {
      console.error('항목 삭제 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, items, setItems, deleteSelectedItems]);

  //con cat 오디오 생성
  const handleConcatGenerate = useCallback(async () => {
    try {
      setIsLoading(true);

      const selectedItems = items.filter((item) => item.isSelected);
      if (selectedItems.length === 0) {
        console.log('선택된 항목이 없습니다.');
        return;
      }
      console.log(
        'files',
        selectedItems.map((item) => item.file).filter((file) => file !== undefined)
      );

      const response = await convertMultipleAudios({
        concatRequestDto: {
          projectId: id ? parseInt(id) : null,
          projectName,
          globalFrontSilenceLength,
          globalTotalSilenceLength,
          concatRequestDetails: selectedItems.map((item, index) => ({
            id: id && item.id ? parseInt(item.id) : null,
            localFileName: item.fileName || null,
            audioSeq: index + 1,
            checked: item.isSelected,
            unitScript: item.text || '',
            endSilence: item.endSilence || 0,
          })),
        },
        files: selectedItems
          .map((item) => item.file)
          .filter((file) => file !== undefined) as File[],
      });

      if (response) {
        console.log('Concat 생성 성공:', response);
        setConcatAudioUrl(response.outputConcatAudios.at(-1));
      } else {
        console.error('Concat 생성 실패:', response);
        setConcatAudioUrl('');
      }
    } catch (error) {
      console.error('Concat 생성 실패:', error);
      setConcatAudioUrl('');
    } finally {
      setIsLoading(false);
    }
  }, [id, projectName, globalFrontSilenceLength, globalTotalSilenceLength, items]);
  // 순서 변경
  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      const newItems = [...items];
      const [removed] = newItems.splice(startIndex, 1);
      newItems.splice(endIndex, 0, removed);
      setItems(newItems);
    },
    [items, setItems]
  );

  return (
    <PageLayout
      variant="project"
      header={<FileProgressHeader files={progressFiles} />}
      sidebar={<ConcatSidebar />}
      footer={<AudioPlayer audioUrl={concatAudioUrl} />}
    >
      <Title
        type="Concat"
        projectTitle={projectName}
        onProjectNameChange={handleProjectNameChange}
        onSave={handleSave}
        onClose={() => console.log('닫기')}
      />
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Spinner size={50} />
        </div>
      ) : (
        <MainContents
          type="Concat"
          items={items.map((item) => ({
            ...item,
            frontSilence: item.frontSilence ?? 0,
            backSilence: item.backSilence ?? 0,
            endSilence: item.endSilence ?? 0,
          }))}
          onSelectionChange={toggleSelection}
          onTextChange={handleTextChange}
          onDelete={handleDeleteSelectedItems}
          onAdd={handleAdd}
          onPlay={handlePlay}
          onSelectAll={toggleSelectAll}
          isAllSelected={items.every((item) => item.isSelected)}
          hasAudioFile={hasAudioFile}
          onReorder={handleReorder}
          onGenerate={handleConcatGenerate}
          isGenerating={isLoading}
        />
      )}
    </PageLayout>
  );
};

export default ConcatPage;
