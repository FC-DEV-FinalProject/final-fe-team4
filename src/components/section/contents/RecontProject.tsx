import { useEffect, useRef, useState } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { Project } from '@/api/aIParkAPI.schemas';
import { fetchProjectByType, fetchRecentProjects } from '@/api/workspaceAPI';
import RecentProjectCard from '@/components/custom/cards/RecentProjectCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatUpdatedAt } from '@/utils/dateUtils';

const RecentProject = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const [isScrolledRight, setIsScrolledRight] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    variant: 'default' | 'destructive';
  }>({
    visible: false,
    message: '',
    variant: 'default',
  });

  useEffect(() => {
    const loadRecentProjects = async () => {
      try {
        const data = await fetchRecentProjects();
        setProjects(data);
        setIsScrolledRight(data.length > 4);
      } catch (error) {
        console.error('최근 프로젝트 데이터를 불러오는 중 오류 발생:', error);
        setAlert({
          visible: true,
          message: '최근 프로젝트 데이터를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });

        setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
      }
    };

    loadRecentProjects();
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsScrolledLeft(scrollLeft > 0);
      setIsScrolledRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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

  return (
    <div className="pt-8 h-auto">
      {alert.visible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert variant={alert.variant}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h3 className="text-h3">최근 프로젝트</h3>
        <p
          onClick={() => navigate('/project')}
          className="text-black text-body2 flex items-center gap-1 cursor-pointer"
        >
          전체보기
          <TbChevronRight className="w-6 h-6" />
        </p>
      </div>

      <div className="relative flex items-center">
        {/* 왼쪽 화살표 버튼 */}
        {projects.length > 4 && isScrolledLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 w-[54px] h-[54px] rounded-xl bg-white flex items-center justify-center z-20"
          >
            <TbChevronLeft className="text-black w-8 h-8" />
          </button>
        )}

        {/* 스크롤 가능한 컨테이너 */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-hidden snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {projects.map((project) => (
            <div
              key={project.projectId}
              className="snap-start"
              onClick={() =>
                handleProjectClick(
                  project.projectId,
                  project.projectType as 'TTS' | 'VC' | 'CONCAT'
                )
              }
            >
              <RecentProjectCard
                title={project.projectName}
                description={project.script}
                date={formatUpdatedAt(project.updatedAt)}
                type={project.projectType}
              />
            </div>
          ))}
        </div>

        {/* 오른쪽 화살표 버튼 */}
        {projects.length > 4 && isScrolledRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 w-[54px] h-[54px] rounded-xl bg-white flex items-center justify-center z-20"
          >
            <TbChevronRight className="text-black w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentProject;
