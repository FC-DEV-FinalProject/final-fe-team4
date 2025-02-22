import React from 'react';
import { TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight } from 'react-icons/tb';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
            className={cn(
              'w-8 h-8 border rounded-md',
              currentPage === i ? 'bg-gray-100 border-gray-300 font-medium' : 'hover:bg-gray-50'
            )}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent className="gap-3.5 p-7">
        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(1)}
            className={cn(
              'w-8 h-8 p-0 border rounded-md hover:bg-gray-50',
              currentPage === 1 && 'pointer-events-none opacity-50'
            )}
          >
            <TbChevronsLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={cn(
              'w-8 h-8 p-0 border rounded-md hover:bg-gray-50',
              currentPage === 1 && 'pointer-events-none opacity-50'
            )}
          >
            <TbChevronLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={cn(
              'w-8 h-8 p-0 border rounded-md hover:bg-gray-50',
              currentPage === totalPages && 'pointer-events-none opacity-50'
            )}
          >
            <TbChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            className={cn(
              'w-8 h-8 p-0 border rounded-md hover:bg-gray-50',
              currentPage === totalPages && 'pointer-events-none opacity-50'
            )}
          >
            <TbChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationFooter;
