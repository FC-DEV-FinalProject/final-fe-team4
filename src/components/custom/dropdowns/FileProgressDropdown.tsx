import React, { useMemo, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { TbChevronDown, TbChevronUp, TbCircleFilled, TbRotate } from 'react-icons/tb';

import { DeleteCompletedButton, RetryFailedButton } from '@/components/custom/buttons/IconButton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FileProgressItem {
  id: number;
  name: string;
  status: '진행' | '대기' | '실패' | '완료';
  progress?: number;
  createdAt: string;
}

export interface FileProgressDropdownProps {
  items: FileProgressItem[];
  onDeleteCompleted?: () => void;
  onRetryFailed?: () => void;
}

const statusColorMap = {
  진행: 'text-green-500',
  대기: 'text-yellow-500',
  실패: 'text-red-500',
  완료: 'text-blue-500',
} as const;

const formatDateCategory = (date: Date): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘';
  }
  if (diffDays === 1) {
    return '어제';
  }
  if (diffDays === 2) {
    return '그저께';
  }
  if (diffDays <= 7) {
    return '일주일 전';
  }
  return '한달 전';
};

const FileProgressDropdown: React.FC<FileProgressDropdownProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const categorizedFiles = useMemo(() => {
    const grouped = items.reduce(
      (acc, file) => {
        const date = new Date(file.createdAt);
        const category = formatDateCategory(date);

        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(file);
        return acc;
      },
      {} as Record<string, FileProgressItem[]>
    );

    const categoryOrder = ['오늘', '어제', '그저께', '일주일 전', '한달 전'];

    return categoryOrder.reduce(
      (acc, category) => {
        if (grouped[category]) {
          acc[category] = grouped[category];
        }
        return acc;
      },
      {} as Record<string, FileProgressItem[]>
    );
  }, [items]);

  const fileStats = useMemo(() => {
    return items.reduce(
      (acc, file) => {
        acc[file.status] = (acc[file.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [items]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  return (
    <div>
      {/* 메인 드롭다운 버튼 */}
      <div className="w-[504px] h-10 bg-background rounded-lg border border-gray-300 px-4 flex items-center justify-between">
        <div className="flex gap-4">
          {/* 진행 상태 */}
          <Badge variant="progress">
            <TbCircleFilled className="w-2 h-2 mr-2" />
            <span className="text-foreground text-sm font-medium">진행</span>
            <div className="ml-2 bg-secondary rounded px-2 h-[18px] flex items-center">
              <span className="text-[#512A91] text-xs font-medium">{fileStats['진행'] || 0}</span>
            </div>
          </Badge>
          {/* 대기 상태 */}
          <Badge variant="waiting">
            <TbCircleFilled className="w-2 h-2 mr-2" />
            <span className="text-foreground text-sm font-medium">대기</span>
            <div className="ml-2 bg-secondary rounded px-2 h-[18px] flex items-center">
              <span className="text-[#512A91] text-xs font-medium">{fileStats['대기'] || 0}</span>
            </div>
          </Badge>
          {/* 실패 상태 */}
          <Badge variant="failed">
            <TbCircleFilled className="w-2 h-2 mr-2" />
            <span className="text-foreground text-sm font-medium">실패</span>
            <div className="ml-2 bg-secondary rounded px-2 h-[18px] flex items-center">
              <span className="text-[#512A91] text-xs font-medium">{fileStats['실패'] || 0}</span>
            </div>
          </Badge>
          {/* 완료 상태 */}
          <Badge variant="completed">
            <TbCircleFilled className="w-2 h-2 mr-2" />
            <span className="text-foreground text-sm font-medium">완료</span>
            <div className="ml-2 bg-secondary rounded px-2 h-[18px] flex items-center">
              <span className="text-[#512A91] text-xs font-medium">{fileStats['완료'] || 0}</span>
            </div>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground hover:bg-gray-100 p-1 rounded transition-colors"
          >
            {isOpen ? <TbChevronUp size={20} /> : <TbChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-[504px] bg-background rounded-lg border border-gray-300 mt-2 z-50 shadow-md">
          {/* 필터 버튼 영역 */}
          <div className="h-10 border-b border-gray-300 flex items-center px-4">
            <div className="flex gap-2">
              {['진행', '대기', '실패', '완료'].map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`h-6 px-2 rounded text-sm font-medium transition-colors ${
                    selectedStatuses.includes(status)
                      ? 'bg-[#E2E8F0] text-[#512A91]'
                      : 'bg-secondary text-[#512A91]'
                  }`}
                >
                  {status}
                </button>
              ))}
              {/* 리셋 버튼 */}
              {selectedStatuses.length > 0 && (
                <button
                  onClick={() => setSelectedStatuses([])}
                  className="text-gray-500 ml-2"
                  title="필터 초기화"
                >
                  <TbRotate size={16} />
                </button>
              )}
            </div>
          </div>
          {/* 파일 목록 영역 */}
          <div className="p-4">
            {Object.entries(categorizedFiles).map(([category, categoryItems]) => {
              const filteredItems = categoryItems.filter(
                (item) => selectedStatuses.length === 0 || selectedStatuses.includes(item.status)
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-medium text-foreground mb-2">{category}</h3>
                  <div className="relative">
                    {filteredItems.length > 1 && (
                      <div
                        className="absolute left-1 top-3 bottom-3 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    {filteredItems.map((item) => (
                      <div key={item.id} className="flex items-center mb-3 last:mb-0 relative">
                        <TbCircleFilled
                          className={cn(`w-2 h-2 mr-3 z-10 `, statusColorMap[item.status])}
                        />
                        <div className="flex items-center flex-1">
                          <span className="text-sm font-medium text-foreground mr-2">
                            {item.name}
                          </span>
                          {item.status === '진행' ? (
                            <>
                              <span className="text-sm text-gray-500 mr-2">• TTS 변환 중</span>
                              <AiOutlineLoading3Quarters className="animate-spin text-green-500 mr-2" />
                              <span className="text-sm text-gray-500">{item.progress}%</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {item.status === '대기' && '• TTS 대기 중'}
                              {item.status === '실패' && '• TTS 실패'}
                              {item.status === '완료' && '• TTS 변환 완료'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {/* 하단 버튼 영역 */}
          <div className="flex items-center justify-center gap-6 border-t border-gray-300 px-3 py-4">
            <DeleteCompletedButton />
            <RetryFailedButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileProgressDropdown;
