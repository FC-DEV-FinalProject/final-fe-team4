import { useState } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  getCurrentPageItems: () => T[];
  totalPages: number;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  isAllSelected: boolean;
  setIsAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectAll: (checked: boolean) => void;
}

export const usePagination = <T extends { id: string }>({
  data,
  itemsPerPage,
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    const currentPageItems = getCurrentPageItems();
    if (checked) {
      setSelectedItems((prev) => [
        ...new Set([...prev, ...currentPageItems.map((item) => item.id)]),
      ]);
      setIsAllSelected(true);
    } else {
      setSelectedItems((prev) =>
        prev.filter((id) => !currentPageItems.find((item) => item.id === id))
      );
      setIsAllSelected(false);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    getCurrentPageItems,
    totalPages,
    selectedItems,
    setSelectedItems,
    isAllSelected,
    setIsAllSelected,
    handleSelectAll,
  };
};
