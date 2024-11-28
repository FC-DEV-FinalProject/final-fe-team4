import { useRef, useState } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import RecentProjectCard from '@/components/custom/cards/RecentProjectCard';
//더미 데이터
const projects = [
  {
    id: 1,
    title: '프로젝트1 발표자료',
    description: '안녕하세요. 프로젝트1에 대한 발표를 시작해 보겠습니다.',
    date: '금요일 오후 7:24',
    type: 'TTS',
    language: 'KR',
    voice: 'Voice 1',
    hasPlayback: true,
  },
  {
    id: 2,
    title: '프로젝트2 발표자료',
    description: '안녕하세요. 프로젝트2에 대한 발표를 시작해 보겠습니다.',
    date: '화요일 오후 3:15',
    type: 'VC',
    language: 'EN',
    voice: 'Voice 2',
    hasPlayback: false,
  },
  {
    id: 3,
    title: '프로젝트3 발표자료',
    description: '안녕하세요. 프로젝트3에 대한 발표를 시작해 보겠습니다.',
    date: '수요일 오전 11:05',
    type: 'Concat',
    language: 'JP',
    voice: 'Voice 3',
    hasPlayback: true,
  },
  {
    id: 4,
    title: '프로젝트4 발표자료',
    description: '안녕하세요. 프로젝트4에 대한 발표를 시작해 보겠습니다.',
    date: '목요일 오후 5:00',
    type: 'TTS',
    language: 'FR',
    voice: 'Voice 4',
    hasPlayback: false,
  },
  {
    id: 5,
    title: '프로젝트5 발표자료',
    description: '안녕하세요. 프로젝트5에 대한 발표를 시작해 보겠습니다.',
    date: '금요일 오후 1:30',
    type: 'VC',
    language: 'EN',
    voice: 'Voice 5',
    hasPlayback: true,
  },
];

const RecentProject = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const [isScrolledRight, setIsScrolledRight] = useState(projects.length > 4);

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

  return (
    <div className="pt-8 h-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h3 className="text-h3">최근 프로젝트</h3>
        <p
          onClick={() => navigate('/projects')}
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
          {projects.map((project, _index) => (
            <div key={project.id} className="snap-start">
              <RecentProjectCard
                title={project.title}
                description={project.description}
                date={project.date}
                type={project.type}
                language={project.language}
                voice={project.voice}
                hasPlayback={project.hasPlayback}
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
