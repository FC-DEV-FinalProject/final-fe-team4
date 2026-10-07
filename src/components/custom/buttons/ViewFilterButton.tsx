import React from 'react';
import { TbCategory, TbList } from 'react-icons/tb';

import { cn } from '@/lib/utils';

interface ViewButtonProps {
  label: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  position: 'left' | 'right';
  ariaLabel: string;
}

interface ViewButtonGroupProps {
  isListView: boolean;
  onViewChange: (isListView: boolean) => void;
}

const ViewButton: React.FC<ViewButtonProps> = ({
  label,
  isSelected,
  onClick,
  position,
  ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'flex items-center justify-center p-1 transition-colors border w-8 h-8',
        position === 'left' ? 'rounded-l-sm' : 'rounded-r-sm',
        isSelected ? 'bg-blue-50 border-blue-600 text-blue-600' : 'border-gray-300 text-gray-700'
      )}
    >
      {label}
    </button>
  );
};

const ViewButtonGroup: React.FC<ViewButtonGroupProps> = ({ isListView, onViewChange }) => {
  return (
    <div className="flex">
      <ViewButton
        label={<TbList size={24} />}
        isSelected={isListView}
        onClick={() => onViewChange(true)}
        position="left"
        ariaLabel="list"
      />
      <ViewButton
        label={<TbCategory size={24} />}
        isSelected={!isListView}
        onClick={() => onViewChange(false)}
        position="right"
        ariaLabel="grid"
      />
    </div>
  );
};

export default ViewButtonGroup;
