import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { useSensor, useSensors } from '@dnd-kit/core';
import { PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';

import { ConcatListRow } from '../concat/ConcatListRow';
import { TTSListRow } from '../tts/TTSListRow';
import { VCListRow } from '../vc/VCListRow';
import { ConcatTableHeader, TTSTableHeader, VCTableHeader } from './TableHeader';

interface ListRowProps {
  id: string;
  text: string;
  isSelected: boolean;
  onPlay: (id: string) => void;
  onSelectionChange: (id: string) => void;
  onTextChange: (id: string, newText: string) => void;
  type?: 'TTS' | 'VC' | 'Concat';
  fileName?: string;
  speed: number;
  volume: number;
  pitch: number;
  convertedAudioUrl?: string;
  originalAudioUrl?: string;
  status?: '대기중' | '완료' | '실패' | '진행';
  targetVoice?: string;
  frontSilence?: number;
  backSilence?: number;
  endSilence?: number;
}

interface TableListViewProps {
  rows: ListRowProps[];
  onSelectionChange: (id: string) => void;
  onTextChange: (id: string, newText: string) => void;
  type?: 'TTS' | 'VC' | 'Concat';
  onReorder?: (startIndex: number, endIndex: number) => void;
}

export const TableListView: React.FC<TableListViewProps> = ({
  rows,
  onSelectionChange,
  onTextChange,
  type = 'TTS',
  onReorder,
}) => {
  const renderHeader = () => {
    switch (type) {
      case 'TTS':
        return <TTSTableHeader />;
      case 'VC':
        return <VCTableHeader />;
      case 'Concat':
        return <ConcatTableHeader />;
    }
  };

  const renderRow = (row: ListRowProps) => {
    switch (type) {
      case 'TTS':
        return (
          <TTSListRow {...row} onSelectionChange={onSelectionChange} onTextChange={onTextChange} />
        );
      case 'VC':
        return (
          <VCListRow {...row} onSelectionChange={onSelectionChange} onTextChange={onTextChange} />
        );
      case 'Concat':
        return (
          <ConcatListRow
            {...row}
            onSelectionChange={onSelectionChange}
            onTextChange={onTextChange}
          />
        );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorder?.(oldIndex, newIndex);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <div className="w-full mx-auto relative">
      {renderHeader()}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
          {rows.map((row) => (
            <React.Fragment key={row.id}>{renderRow(row)}</React.Fragment>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
