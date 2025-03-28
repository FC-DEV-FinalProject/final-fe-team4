import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Project } from '@/api/aIParkAPI.schemas';
import { deleteProject, fetchProjectByType, fetchProjects } from '@/api/workspaceAPI';
import { DeleteConfirm } from '@/components/custom/dialogs/ConfirmationDialog';
import MainContents from '@/components/section/contents/MainContents';
import Title from '@/components/section/contents/Title';
import PaginationFooter from '@/components/section/footer/PaginationFooter';
import MainHeader from '@/components/section/header/MainHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PageLayout from '@/layouts/PageLayout';
import { formatUpdatedAt } from '@/utils/dateUtils';

const ProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  const [selectedItems, setSelectedItems] = useState<number[]>([]); // 선택된 항목
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드 상태
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  // 프로젝트 클릭 핸들러
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

  // 페이지네이션 데이터를 가져오는 함수
  const loadProjects = useCallback(
    async (page: number) => {
      try {
        const { content, totalPages, totalElements } = await fetchProjects(page, 8, searchKeyword);
        console.log('로드된 프로젝트 데이터:', content);
        setProjects(content); // 프로젝트 데이터 설정
        setTotalPages(totalPages); // 총 페이지 수 설정
        setTotalItemsCount(totalElements); // 전체 항목 수 설정
      } catch (error) {
        console.error('프로젝트 데이터를 불러오는 중 오류 발생:', error);
      }
    },
    [searchKeyword] // 검색 키워드가 변경될 때 함수 갱신
  );

  useEffect(() => {
    loadProjects(0); // 새로운 키워드로 검색 시 0번째 페이지부터 다시 로드
  }, [loadProjects]);

  const handlePlay = (id: string) => {
    console.log(`${id} 재생 시작`);
  };

  const handlePause = (id: string) => {
    console.log(`${id} 재생 중지`);
  };

  const handleDelete = async () => {
    try {
      await deleteProject(selectedItems); // 선택된 항목 삭제
      setAlert({
        visible: true,
        message: '삭제가 완료되었습니다.',
        variant: 'default',
      });

      setSelectedItems([]);

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
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? projects.map((project) => project.projectId) : []);
  };

  const handleSelectionChange = (id: number, selected: boolean) => {
    setSelectedItems((prev) =>
      selected ? [...prev, id] : prev.filter((projectId) => projectId !== id)
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
        title="프로젝트 목록"
        description="내 프로젝트를 빠르게 조회하고 관리해 보세요."
      />
      <MainContents
        type="PROJECT"
        items={projects.map((project) => ({
          id: project.projectId.toString(),
          projectName: project.projectName,
          projectType: project.projectType as 'TTS' | 'VC' | 'Concat',
          script: project.script || '작성된 내용이 없습니다.',
          updatedAt: formatUpdatedAt(project.updatedAt),
          isSelected: selectedItems.includes(project.projectId),
          text: project.projectName,
          onClick: () =>
            handleProjectClick(project.projectId, project.projectType as 'TTS' | 'VC' | 'CONCAT'), // 클릭 시 상세 페이지로 이동
        }))}
        isAllSelected={selectedItems.length === projects.length}
        onSelectAll={(checked = false) => handleSelectAll(checked)}
        onSelectionChange={(id) =>
          handleSelectionChange(Number(id), !selectedItems.includes(Number(id)))
        }
        onDelete={() => setIsDialogOpen(true)}
        onAdd={() => console.log('프로젝트 추가')}
        onPlay={handlePlay}
        onPause={handlePause}
        itemCount={projects.length}
        selectedItemsCount={selectedItems.length}
        onSearch={handleSearch}
        totalItemsCount={totalItemsCount}
      />
      <DeleteConfirm open={isDialogOpen} onOpenChange={setIsDialogOpen} onConfirm={handleDelete} />
    </PageLayout>
  );
};

export default ProjectPage;
