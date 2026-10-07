import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Export } from '@/api/aIParkAPI.schemas';
import { deleteExportProject, fetchExports, fetchProjectByType } from '@/api/workspaceAPI';
import { DeleteConfirm } from '@/components/custom/dialogs/ConfirmationDialog';
import MainContents from '@/components/section/contents/MainContents';
import Title from '@/components/section/contents/Title';
import PaginationFooter from '@/components/section/footer/PaginationFooter';
import MainHeader from '@/components/section/header/MainHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PageLayout from '@/layouts/PageLayout';
import { formatUpdatedAt } from '@/utils/dateUtils';

const HistoryPage = () => {
  const [data, setData] = useState<Export[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  const [selectedMetaIds, setSelectedMetaIds] = useState<number[]>([]); // 선택된 metaId
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드 상태
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // 현재 재생 중인 오디오 객체
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    variant: 'default' | 'destructive';
  }>({
    visible: false,
    message: '',
    variant: 'default',
  });

  const navigate = useNavigate();

  const loadProjects = useCallback(
    async (page: number) => {
      try {
        if (page === 0) {
          setData([]); // 페이지 변경 시 데이터 초기화
        }
        const { content, totalPages, totalElements } = await fetchExports(page, 8, searchKeyword);
        console.log('로드된 프로젝트 데이터:', content);
        setData(content); // 새로운 데이터를 설정
        setTotalPages(totalPages);
        setTotalItemsCount(totalElements);
      } catch (error) {
        console.error('프로젝트 데이터를 불러오는 중 오류 발생:', error);
      }
    },
    [searchKeyword]
  );

  useEffect(() => {
    setCurrentPage(0); // 페이지 리셋
    setData([]); // 검색어 변경 시 데이터 초기화
    loadProjects(0);
  }, [loadProjects]);

  const handleProjectClick = async (projectId: number, projectType: 'TTS' | 'VC' | 'CONCAT') => {
    try {
      const response = await fetchProjectByType(projectId, projectType);
      console.log('프로젝트 데이터:', response.data);

      // 프로젝트 타입에 따른 경로 생성
      const path = `/${projectType.toLowerCase()}/${projectId}`;

      // 상세 페이지로 이동
      navigate(path, { state: response.data });
    } catch (error) {
      console.error('프로젝트 로드 중 오류 발생:', error);
      setAlert({
        visible: true,
        message: '프로젝트 로드 중 오류가 발생했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });

      setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
    }
  };

  const handlePlay = (id: string) => {
    const item = data.find((d) => d.metaId?.toString() === id);
    if (!item || !item.downloadLink) {
      console.error('Invalid downloadLink for item:', item);
      return;
    }

    // 같은 ID의 오디오를 다시 클릭하면 멈춤
    if (currentPlayingId === id) {
      handlePause();
      setCurrentPlayingId(null);
      return;
    }

    // 이전 오디오를 멈춤
    if (audio) {
      audio.pause();
    }

    // 새로운 오디오 생성 및 재생
    const newAudio = new Audio(item.downloadLink);
    newAudio.crossOrigin = 'anonymous';
    newAudio.play();

    // 상태를 즉시 업데이트
    setCurrentPlayingId(id);
    setAudio(newAudio);
  };

  const handlePause = () => {
    if (audio) {
      audio.pause(); // 오디오 재생 멈춤
      setAudio(null); // 상태 초기화
    }
    setCurrentPlayingId(null); // 재생 중인 ID 초기화
  };

  const handleDownload = (url: string, fileName: string) => {
    if (!url) {
      setAlert({
        visible: true,
        message: '다운로드할 파일이 없습니다.',
        variant: 'destructive',
      });

      setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
      return;
    }

    // Fetch API를 사용해 파일을 다운로드
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('파일을 다운로드할 수 없습니다.');
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
        setAlert({
          visible: true,
          message: `${fileName} 다운로드가 완료되었습니다.`,
          variant: 'default',
        });

        setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
      })
      .catch((error) => {
        console.error('다운로드 중 오류 발생:', error);
        setAlert({
          visible: true,
          message: '다운로드 중 문제가 발생했습니다.',
          variant: 'destructive',
        });

        // 알림 자동 제거
        setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
      });
  };

  const handleDelete = async () => {
    try {
      await deleteExportProject(selectedMetaIds); // 선택된 항목 삭제
      setAlert({
        visible: true,
        message: '삭제가 완료되었습니다.',
        variant: 'default',
      });

      setSelectedMetaIds([]);

      // 현재 페이지 데이터 재로드
      loadProjects(currentPage);
      setIsDialogOpen(false);
      setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
    } catch (error) {
      console.error('삭제 중 오류:', error);
      setAlert({
        visible: true,
        message: '삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });

      setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchKeyword(searchTerm); // 검색 키워드 업데이트
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
    loadProjects(0); // 새로운 키워드로 데이터 로드
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedMetaIds(checked ? data.map((project) => project.metaId ?? -1) : []);
  };

  const handleSelectionChange = (metaId: number, selected: boolean) => {
    setSelectedMetaIds((prev) =>
      selected ? [...prev, metaId] : prev.filter((id) => id !== metaId)
    );
  };

  return (
    <PageLayout
      variant="main"
      header={<MainHeader />}
      footer={
        <PaginationFooter
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page - 1);
            loadProjects(page - 1); // API에 맞는 페이지 번호 요청
          }}
        />
      }
    >
      {alert.visible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert variant={alert.variant}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <Title
        variant="recent"
        title="히스토리 내역"
        description="저장된 히스토리 기록을 조회하고 파일을 편리하게 다운로드할 수 있어요."
      />
      <MainContents
        type="RECENT"
        items={data
          .filter((item) => item.metaId !== undefined) // projectId가 있는 항목만 포함
          .map((item, index) => ({
            id: item.metaId!.toString(),
            projectName: item.projectName,
            projectType: item.projectType as 'TTS' | 'VC' | 'Concat',
            fileName: item.fileName,
            script: item.script || '작성된 내용이 없습니다.',
            unitStatus: item.unitStatus as 'SUCCESS' | 'FAILURE',
            updatedAt: formatUpdatedAt(item.createdAt || ''),
            isSelected: selectedMetaIds.includes(item.metaId!),
            text: item.projectName,
            key: `${item.projectId}-${index}`, // 고유 key 생성
            onPlay: () => handlePlay(item.metaId!.toString()),
            onPause: handlePause,
            onDownload: () => {
              if (item.downloadLink) {
                handleDownload(item.downloadLink, item.fileName || 'unknown.mp3');
              } else {
                console.error('Download link is undefined for item:', item);
              }
            },
            onClick: () => {
              if (item.projectId !== undefined) {
                handleProjectClick(item.projectId, item.projectType as 'TTS' | 'VC' | 'CONCAT');
              } else {
                console.error('projectId is undefined for item:', item);
                setAlert({
                  visible: true,
                  message: '잘못된 프로젝트 데이터입니다.',
                  variant: 'destructive',
                });

                setTimeout(
                  () => setAlert({ visible: false, message: '', variant: 'default' }),
                  2000
                );
              }
            },
          }))}
        isAllSelected={selectedMetaIds.length === data.length}
        onSelectAll={(checked = false) => handleSelectAll(checked)}
        onSelectionChange={(id) =>
          handleSelectionChange(Number(id), !selectedMetaIds.includes(Number(id)))
        }
        onDownloadItem={(id) => {
          console.log('Download triggered for ID:', id);
          const targetItem = data.find((item) => item.metaId?.toString() === id);
          if (targetItem?.downloadLink) {
            handleDownload(targetItem.downloadLink, targetItem.fileName || 'unknown.mp3');
          } else {
            console.error('No download link for ID:', id);
          }
        }}
        onDelete={() => setIsDialogOpen(true)}
        onAdd={() => {}}
        onPlay={handlePlay}
        onPause={handlePause}
        itemCount={data.length}
        selectedItemsCount={selectedMetaIds.length}
        onSearch={handleSearch}
        totalItemsCount={totalItemsCount}
        currentPlayingId={currentPlayingId ?? undefined}
      />
      <DeleteConfirm open={isDialogOpen} onOpenChange={setIsDialogOpen} onConfirm={handleDelete} />
    </PageLayout>
  );
};

export default HistoryPage;
