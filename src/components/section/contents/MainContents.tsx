import FileUploadAlert, { ALERT_MESSAGES } from '@/components/custom/guide/FileUploadPopup';
import { HistoryListTable } from '@/components/custom/tables/history/HistoryListTable';
import { ProjectListTable } from '@/components/custom/tables/history/ProjectListTable';
import TableToolbar from '@/components/custom/tables/history/TableToolbar';
import { TableContents } from '@/components/custom/tables/project/common/TableContents';
import { Button } from '@/components/ui/button';
import { ProjectListTableItem, TableItem } from '@/types/table';

export interface MainContentsItem extends TableItem {
  order?: string;
  projectName?: string;
  content?: string;
  type?: 'VC' | 'TTS' | 'CONCAT';
  status?: '진행' | '대기중' | '실패' | '완료';
  createdAt?: string;
}

interface MainContentsProps {
  type: 'TTS' | 'VC' | 'CONCAT' | 'RECENT' | 'PROJECT';
  items: MainContentsItem[];
  isAllSelected: boolean;
  showAlert?: boolean;
  onCloseAlert?: () => void;
  onSelectAll: (checked?: boolean) => void;
  onSelectionChange: (id: string) => void;
  onTextChange?: (id: string, newText: string) => void;
  onDelete: () => void;
  onAdd: (newItems?: TableItem[]) => void;
  onRegenerateItem?: (id: string) => void;
  onDownloadItem?: (id: string) => void;
  onPlay: (id: string) => void;
  onPause?: (id: string) => void;
  onReorder?: (newItems: MainContentsItem[]) => void;
  currentPlayingId?: string;
  itemCount?: number;
  selectedItemsCount?: number;
  onSearch?: (searchTerm: string) => void;
  onFilter?: () => void;
}

const MainContents = ({
  type,
  items,
  isAllSelected,
  showAlert,
  onCloseAlert,
  onSelectAll,
  onSelectionChange,
  onTextChange,
  onDelete,
  onAdd,
  onRegenerateItem,
  onDownloadItem,
  onPlay,
  onPause,
  onReorder,
  currentPlayingId,
  itemCount,
  selectedItemsCount,
  onSearch,
  onFilter,
}: MainContentsProps) => {
  const getAlertMessage = () => {
    switch (type) {
      case 'VC':
        return ALERT_MESSAGES.VC_UPLOAD_REQUIRED;
      case 'CONCAT':
        return ALERT_MESSAGES.CONCAT_UPLOAD_REQUIRED;
      default:
        return '';
    }
  };

  const getButtonText = () => `${type} 생성`;

  const renderTable = () => {
    if (type === 'RECENT' || type === 'PROJECT') {
      const tableItems: ProjectListTableItem[] = items.map((item) => ({
        id: item.id,
        order: item.order || '',
        projectName: item.projectName || '',
        fileName: item.fileName || '',
        content: item.content || '',
        type: item.type || 'TTS',
        status: item.status || '대기중',
        createdAt: item.createdAt || '',
      }));

      return (
        <div className="mt-2 border rounded-md">
          <TableToolbar
            title={type === 'RECENT' ? '모든 히스토리 내역' : '모든 프로젝트'}
            count={items.length}
            selectedItemsCount={selectedItemsCount || 0}
            onDelete={onDelete}
            onSearch={onSearch!}
            onFilter={onFilter!}
          />
          <div>
            {type === 'RECENT' ? (
              <HistoryListTable
                onPlay={onPlay}
                onPause={onPause!}
                itemCount={itemCount!}
                isAllSelected={isAllSelected}
                onSelectAll={onSelectAll}
                selectedItems={items.filter((item) => item.isSelected).map((item) => item.id)}
                onSelectionChange={(id) => onSelectionChange(id)}
                items={tableItems}
                currentPlayingId={currentPlayingId}
              />
            ) : (
              <ProjectListTable
                onPlay={onPlay}
                onPause={onPause!}
                itemCount={itemCount!}
                isAllSelected={isAllSelected}
                onSelectAll={onSelectAll}
                selectedItems={items.filter((item) => item.isSelected).map((item) => item.id)}
                onSelectionChange={(id) => onSelectionChange(id)}
                items={tableItems}
                currentPlayingId={currentPlayingId}
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        {showAlert && (
          <div className="flex relative">
            <FileUploadAlert message={getAlertMessage()} onClose={onCloseAlert!} />
          </div>
        )}
        <div className={`h-[580px] mt-6 overflow-hidden`}>
          <TableContents
            items={items}
            isAllSelected={isAllSelected}
            onSelectAll={() => onSelectAll()}
            onSelectionChange={onSelectionChange}
            onTextChange={onTextChange!}
            onDelete={onDelete}
            onAdd={onAdd}
            onRegenerateItem={onRegenerateItem}
            onDownloadItem={onDownloadItem}
            onPlay={onPlay}
            onReorder={onReorder}
            type={type === 'TTS' ? undefined : type}
          />
        </div>
        <div className={`${type === 'TTS' ? 'mt-12' : 'mt-6'} text-center`}>
          <Button>{getButtonText()}</Button>
        </div>
      </>
    );
  };

  return renderTable();
};

export default MainContents;
