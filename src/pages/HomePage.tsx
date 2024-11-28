import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HomePopup from '@/components/custom/guide/HomePopup';
import { RecentExportTable } from '@/components/custom/tables/history/RecentExportTable';
import RecentProject from '@/components/section/contents/RecontProject';
import MainHeader from '@/components/section/header/MainHeader';
import jisuImage from '@/images/avatar/jisu.jpg';
import PageLayout from '@/layouts/PageLayout';
const HomePage = () => {
  const [currentPlayingId, setCurrentPlayingId] = useState<string>();
  const navigate = useNavigate();
  const historyItems = [
    {
      id: '1',
      order: '01',
      projectName: '프로젝트1 발표자료',
      fileName: '오디오11.wav',
      content: 'Lorem ipsum dolor sit amet consectetur.',
      type: 'VC' as const,
      status: '완료' as const,
      createdAt: '2024. 11. 12',
    },
    {
      id: '2',
      order: '02',
      projectName: '프로젝트1 발표자료',
      fileName: '오디오12.wav',
      content: 'Lorem ipsum dolor sit amet consectetur.',
      type: 'TTS' as const,
      status: '대기중' as const,
      createdAt: '2024. 11. 12',
    },
    {
      id: '3',
      order: '03',
      projectName: '프로젝트1 발표자료',
      fileName: '오디오13.wav',
      content: 'Lorem ipsum dolor sit amet consectetur.',
      type: 'CONCAT' as const,
      status: '실패' as const,
      createdAt: '2024. 11. 12',
    },
    {
      id: '4',
      order: '04',
      projectName: '프로젝트1 발표자료',
      fileName: '오디오14.wav',
      content: 'Lorem ipsum dolor sit amet consectetur.',
      type: 'VC' as const,
      status: '진행' as const,
      createdAt: '2024. 11. 13',
    },
    {
      id: '5',
      order: '05',
      projectName: '프로젝트1 발표자료',
      fileName: '오디오15.wav',
      content: 'Lorem ipsum dolor sit amet consectetur.',
      type: 'TTS' as const,
      status: '완료' as const,
      createdAt: '2024. 11. 13',
    },
  ];

  const handlePlay = (id: string) => setCurrentPlayingId(id);
  const handlePause = () => setCurrentPlayingId(undefined);

  return (
    <PageLayout
      variant="main"
      header={
        <MainHeader
          name="김바타"
          email="aipark@aipark.ai"
          imageUrl={jisuImage}
          onMyPage={() => navigate('/mypage')}
          onSignout={() => console.log('로그아웃')}
        />
      }
    >
      {/* 팝업 창 */}
      <HomePopup />
      {/* 최근 프로젝트 영역 */}
      <RecentProject />
      {/* 최근 내보내기 영역 */}
      <RecentExportTable
        items={historyItems}
        onPlay={handlePlay}
        onPause={handlePause}
        currentPlayingId={currentPlayingId}
      />
    </PageLayout>
  );
};

export default HomePage;
