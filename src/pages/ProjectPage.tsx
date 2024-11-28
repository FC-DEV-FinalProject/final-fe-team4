import MainContents from '@/components/section/contents/MainContents';
import Title from '@/components/section/contents/Title';
import PaginationFooter from '@/components/section/footer/PaginationFooter';
import MainHeader from '@/components/section/header/MainHeader';
import { dummyData } from '@/constants/dummy';
import { usePagination } from '@/hooks/usePagination';
import { useTableSelection } from '@/hooks/useTableSelection';
import jisuImage from '@/images/avatar/jisu.jpg';
import PageLayout from '@/layouts/PageLayout';

const ProjectPage = () => {
  const { currentPage, setCurrentPage, getCurrentPageItems, totalPages } = usePagination({
    data: dummyData,
    itemsPerPage: 8,
  });

  const { selectedItems, isAllSelected, handleSelectAll, handleSelectionChange } =
    useTableSelection({
      getCurrentPageItems,
      onPageChange: currentPage,
    });

  const handlePlay = (id: string) => {
    console.log(`${id} 재생 시작`);
  };

  const handlePause = (id: string) => {
    console.log(`${id} 재생 중지`);
  };

  const handleDelete = () => {
    console.log('삭제:', selectedItems);
  };

  const handleSearch = (searchTerm: string) => {
    console.log('검색어:', searchTerm);
  };

  const handleFilter = () => {
    console.log('필터 버튼 클릭');
  };

  return (
    <PageLayout
      variant="main"
      header={
        <MainHeader
          name="김바타"
          email="aipark@aipark.ai"
          imageUrl={jisuImage}
          onMyPage={() => console.log('마이페이지 이동')}
          onSignout={() => console.log('로그아웃')}
        />
      }
      footer={
        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      }
    >
      <Title
        variant="recent"
        title="프로젝트 목록"
        description="내 프로젝트를 빠르게 조회하고 관리해 보세요."
      />
      <MainContents
        type="PROJECT"
        items={getCurrentPageItems().map((item) => ({
          ...item,
          text: item.content,
          isSelected: selectedItems.includes(item.id),
        }))}
        isAllSelected={isAllSelected}
        onSelectAll={(checked = false) => handleSelectAll(checked)}
        onSelectionChange={(id) => handleSelectionChange(id, !selectedItems.includes(id))}
        onDelete={handleDelete}
        onAdd={() => {}}
        onPlay={handlePlay}
        onPause={handlePause}
        itemCount={getCurrentPageItems().length}
        selectedItemsCount={selectedItems.length}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
    </PageLayout>
  );
};

export default ProjectPage;
