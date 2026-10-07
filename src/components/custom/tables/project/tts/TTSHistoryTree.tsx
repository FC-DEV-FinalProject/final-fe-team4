import React from 'react';

import { cn } from '@/lib/utils';
interface HistoryBranchProps {
  isFirst?: boolean;
  branchColor?: string;
  className?: string;
}

interface HistoryTreeProps<T extends { audioId: string | number }> {
  historyItems: T[];
}

const HistoryBranch: React.FC<HistoryBranchProps> = ({
  isFirst = false,
  branchColor = 'gray-700',
  className,
}) => {
  const commonStyles = {
    base: 'ml-8 w-[21px] rounded-bl-3xl border-l-2 border-l-' + branchColor,
  };

  return (
    <>
      {isFirst ? (
        <div
          className={cn(`${commonStyles.base} h-10 border-b-[0.1em]`, className)}
          aria-hidden="true"
        />
      ) : (
        <div
          className={cn(`${commonStyles.base} h-16 border-b-2 relative`, className)}
          aria-hidden="true"
        >
          <div
            className="absolute h-full w-0 border-l-2 bg-gray-300 ml-[-1.9px] -translate-y-5"
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
};

const HistoryTree = <T extends { audioId: string | number }>({
  historyItems,
}: HistoryTreeProps<T>) => {
  return (
    <div className="history-tree">
      {[...historyItems].map((hisoryItem, index) => (
        <HistoryBranch key={hisoryItem.audioId} isFirst={index === 0} />
      ))}
    </div>
  );
};

export default HistoryTree;
