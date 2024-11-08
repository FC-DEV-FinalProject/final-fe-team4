import React, { useCallback, useState } from 'react';

import { TTSTable } from '@/components/tts/TTSTable';
import { Button } from '@/components/ui/CommonButton';
import { SaveButton, UploadButton } from '@/components/ui/IconButton';

const TTSMainContent: React.FC = () => {
  const [items, setItems] = useState([
    {
      id: '1',
      text: '안녕하세요',
      isSelected: false,
      speed: 1.0,
      volume: 60,
      pitch: 4.0,
    },
    {
      id: '2',
      text: '반갑습니다',
      isSelected: false,
      speed: 1.0,
      volume: 60,
      pitch: 4.0,
    },
  ]);

  const isAllSelected = items.every((item) => item.isSelected);

  const handleSelectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isSelected: !isAllSelected })));
  };

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

  return (
    <div className="p-6 flex flex-col">
      <h4 className="text-sm font-normal">텍스트 파일을 나만의 음성 파일로</h4>
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">TTS · 프로젝트 1</h2>
        <div className="flex gap-6">
          <UploadButton />
          <SaveButton />
        </div>
      </header>

      <div className="w-[872px] h-[580px] border rounded-md mt-8 overflow-hidden">
        <TTSTable
          items={items}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          onSelectionChange={handleSelectionChange}
          onTextChange={handleTextChange}
          onDelete={handleDelete}
          onAdd={() => {
            setItems((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                text: '',
                isSelected: false,
                speed: 1.0,
                volume: 60,
                pitch: 4.0,
              },
            ]);
          }}
          onRegenerate={() => console.log('재생성')}
          onDownload={() => console.log('다운로드')}
          onPlay={(id) => console.log('재생:', id)}
        />
      </div>

      <div className="mt-6 text-center">
        <Button>TTS 생성</Button>
      </div>
    </div>
  );
};

export default TTSMainContent;
