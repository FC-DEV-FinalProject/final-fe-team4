import { useEffect, useState } from 'react';

interface UseTableSelectionProps<T> {
  getCurrentPageItems: () => T[];
  onPageChange?: number;
}

interface UseTableSelectionReturn {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  isAllSelected: boolean;
  setIsAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectionChange: (id: string, checked: boolean) => void;
}

export const useTableSelection = <T extends { id: string }>({
  getCurrentPageItems,
  onPageChange,
}: UseTableSelectionProps<T>): UseTableSelectionReturn => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    setSelectedItems([]);
    setIsAllSelected(false);
  }, [onPageChange]);

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

  const handleSelectionChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
      const currentPageItems = getCurrentPageItems();
      const isAllCurrentPageSelected = currentPageItems.every(
        (item) => selectedItems.includes(item.id) || item.id === id
      );
      setIsAllSelected(isAllCurrentPageSelected);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      setIsAllSelected(false);
    }
  };

  return {
    selectedItems,
    setSelectedItems,
    isAllSelected,
    setIsAllSelected,
    handleSelectAll,
    handleSelectionChange,
  };
};
