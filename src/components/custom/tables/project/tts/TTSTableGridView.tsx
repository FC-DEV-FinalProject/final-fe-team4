import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import {
  SortableGridItem,
  SortableGridItemProps,
} from '@/components/custom/tables/project/tts/SortableGridItem';

interface TTSTableGridViewProps {
  items: SortableGridItemProps[];
  onReorder?: (startIndex: number, endIndex: number) => void;
}

export const TTSTableGridView: React.FC<TTSTableGridViewProps> = ({ items, onReorder }) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorder?.(oldIndex, newIndex);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <>
              <SortableGridItem key={item.id} {...item} />
            </>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
