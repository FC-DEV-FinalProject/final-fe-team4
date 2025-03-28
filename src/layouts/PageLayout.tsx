import { ReactNode } from 'react';

import { NavSidebar } from '@/components/section/sidebar/NavSidebar';

interface PageLayoutProps {
  variant: 'auth' | 'main' | 'project';
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const PageLayout = ({ variant, header, sidebar, footer, children }: PageLayoutProps) => {
  // 로그인, 회원가입 페이지
  if (variant === 'auth') {
    return <div className="min-h-screen">{children}</div>;
  }

  // 홈, 마이페이지, 프로젝트 목록, 내보내기 내역 페이지
  if (variant === 'main') {
    return (
      <div className="flex justify-center bg-white min-h-screen">
        <div className="flex w-full">
          <NavSidebar />
          <main className="flex-1 max-w-full w-full h-screen overflow-y-auto">
            <div className="mx-auto flex flex-col min-h-screen">
              {header && <header className="h-[92px] ml-6 border-b">{header}</header>}
              <div className="flex flex-1 h-full ml-6">
                <div className="flex-col w-full flex">
                  <section className="flex-1 flex-col pr-6">{children}</section>
                  <div className="h-[92px] pr-6">{footer && <footer>{footer}</footer>}</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // TTS, VC, Concat 페이지
  return (
    <div className="flex justify-center bg-white min-h-screen">
      <div className="flex w-full">
        {/* 왼쪽 네비게이션 사이드바 */}
        <NavSidebar />

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 max-w-full w-full h-screen overflow-y-auto">
          <div className="mx-auto flex flex-col min-h-screen">
            {/* 헤더 영역 */}
            {header && <header className="h-[92px] ml-6 border-b">{header}</header>}

            {/* 작업 메인 컨텐츠 영역 */}
            <div className="flex flex-1 h-full ml-6 border-b">
              <div className="flex flex-col w-full">
                <section className="flex-1 py-6 pr-6 flex flex-col">{children}</section>
              </div>

              {/* 오른쪽 사이드바 (TTS, VC, Concat 옵션) */}
              {sidebar && <aside className="w-[276px] flex-shrink-0">{sidebar}</aside>}
            </div>

            {/* 푸터 영역 (오디오 플레이어) */}
            {footer && <section className="h-[92px] px-6">{footer}</section>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
