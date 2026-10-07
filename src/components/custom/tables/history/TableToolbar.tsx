import React from 'react';
import { TbSearch, TbTrash } from 'react-icons/tb';

import { Input } from '@/components/ui/input';

interface TableToolbarProps {
  title: string;
  totalItemsCount: number;
  selectedItemsCount: number;
  onDelete: () => void;
  onSearch: (searchTerm: string) => void;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  title,
  totalItemsCount,
  selectedItemsCount,
  onDelete,
  onSearch,
}) => {
  const isDeleteDisabled = selectedItemsCount === 0;

  return (
    <div className="flex items-center justify-between px-6 py-[18px] border-b">
      {/* Left Section: Title and Delete Button */}
      <div className="flex items-center gap-2">
        <span className="text-body1 text-black">{title}</span>
        <span className="text-body1 text-gray-700">{totalItemsCount}</span>
        <button
          onClick={onDelete}
          disabled={isDeleteDisabled}
          className={`ml-8 flex items-center gap-1 px-[10px] py-2 border rounded-md ${
            isDeleteDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <TbTrash className="w-6 h-6 text-gray-700" />
          <span className="text-body4 text-gray-800">삭제</span>
        </button>
      </div>

      {/* Right Section: Search Input and Filter Button */}
      <div className="flex items-center gap-6">
        <div className="relative max-w-xs">
          <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black pointer-events-none w-4 h-4" />
          <Input
            type="text"
            placeholder="검색"
            className="h-[40px] w-[250px] px-9 py-2 text-body4 placeholder:text-gray-700"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TableToolbar;
