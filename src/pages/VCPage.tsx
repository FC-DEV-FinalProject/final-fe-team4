import { useCallback, useState } from 'react';

import { AudioPlayer } from '@/components/custom/feature/AudioPlayer';
import MainContents, { MainContentsItem } from '@/components/section/contents/MainContents';
import Title from '@/components/section/contents/Title';
import VCSidebar from '@/components/section/sidebar/VCSidebar';
import PageLayout from '@/layouts/PageLayout';

interface VCItem {
  id: string;
  text: string;
  isSelected: boolean;
  speed: number;
  volume: number;
  pitch: number;
  fileName: string;
}

const VCPage = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [items, setItems] = useState<VCItem[]>([]);

  const handleSelectionChange = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSelected: !item.isSelected } : item))
    );
  };

  const handleTextChange = (id: string, newText: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, text: newText } : item)));
  };

  const handleDelete = useCallback(() => {
    setItems((prevItems) => prevItems.filter((item) => !item.isSelected));
  }, []);

  const handleAdd = useCallback(() => {
    const newItem: VCItem = {
      id: `${items.length + 1}`,
      text: '',
      isSelected: false,
      speed: 1.0,
      volume: 1.0,
      pitch: 1.0,
      fileName: `new_file_${items.length + 1}.wav`,
    };
    setItems((prev) => [...prev, newItem]);
  }, [items.length]);

  const handlePlay = useCallback((id: string) => {
    console.log('Play item:', id);
  }, []);

  const handleSelectAll = useCallback(() => {
    const isAllSelected = items.every((item) => item.isSelected);
    setItems((prev) => prev.map((item) => ({ ...item, isSelected: !isAllSelected })));
  }, [items]);

  const handleReorder = useCallback((newItems: MainContentsItem[]) => {
    setItems(newItems as VCItem[]);
  }, []);

  return (
    <PageLayout
      variant="project"
      header={<></>} // FileProgressDropDown
      sidebar={<VCSidebar />}
      footer={<AudioPlayer audioUrl={''} />}
    >
      <Title
        type="VC"
        projectTitle="프로젝트 1"
        onSave={() => console.log('저장')}
        onClose={() => console.log('닫기')}
      />
      <MainContents
        type="VC"
        items={items}
        showAlert={showAlert}
        onCloseAlert={() => setShowAlert(false)}
        onSelectionChange={handleSelectionChange}
        onTextChange={handleTextChange}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onPlay={handlePlay}
        onSelectAll={handleSelectAll}
        isAllSelected={items.every((item) => item.isSelected)}
        onReorder={handleReorder}
      />
    </PageLayout>
  );
};

export default VCPage;
