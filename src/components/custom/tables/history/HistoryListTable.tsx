import { TbDownload } from 'react-icons/tb';

import { PlayButton } from '@/components/custom/buttons/PlayButton';
import { StatusBadge } from '@/components/custom/tables/history/RecentExportTable';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface ProjectListTableItem {
  id: string;
  order: string;
  projectName: string;
  fileName: string;
  script: string;
  projectType: 'VC' | 'TTS' | 'Concat';
  status: '진행' | '대기중' | '실패' | '완료';
  unitStatus?: 'SUCCESS' | 'FAILURE';
  updatedAt: string;
  onClick?: () => void;
}

interface HistoryListTableProps {
  items: ProjectListTableItem[];
  onPlay: (id: string) => void;
  onPause: (id: string) => void;
  onDownload: (id: string) => void;
  currentPlayingId?: string;
  isAllSelected: boolean;
  itemCount: number;
  onSelectAll: (checked: boolean) => void;
  selectedItems: string[];
  onSelectionChange: (id: string, checked: boolean) => void;
}

const AudioBadge = ({ type }: { type: 'VC' | 'TTS' | 'Concat' }) => (
  <Badge variant={type.toLowerCase() as 'vc' | 'tts' | 'concat'}>{type}</Badge>
);

export function HistoryListTable({
  items,
  onPlay,
  onPause,
  onDownload,
  currentPlayingId,
  isAllSelected,
  itemCount,
  onSelectAll,
  selectedItems,
  onSelectionChange,
}: HistoryListTableProps) {
  return (
    <Table className="table-fixed w-full">
      {/* Header */}
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="pl-6 w-[50px]">
            <Checkbox
              checked={itemCount > 0 && isAllSelected}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            />
          </TableHead>
          <TableHead className="pl-[70px] text-body3 text-black w-[180px]">유형</TableHead>
          <TableHead className="text-body3 text-black w-[160px]">프로젝트명</TableHead>
          <TableHead className="text-body3 text-black w-[200px]">파일명</TableHead>
          <TableHead className="text-body3 text-black flex-1">스크립트</TableHead>
          <TableHead className="text-body3 text-black w-[120px] text-center">상태</TableHead>
          <TableHead className="text-body3 text-black w-[120px] text-center pl-0">
            다운로드
          </TableHead>
          <TableHead className="text-body3 text-black w-[190px]">업데이트 날짜</TableHead>
        </TableRow>
      </TableHeader>

      {/* Body */}
      <TableBody>
        {items.map((item, index) => (
          <TableRow
            key={`${item.id}-${index}`}
            data-state={currentPlayingId === item.id ? 'selected' : undefined}
            className="text-body2 cursor-pointer"
            onClick={item.onClick}
          >
            <TableCell className="pl-6 w-[50px]">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={(checked) => onSelectionChange(item.id, checked as boolean)}
                onClick={(e) => e.stopPropagation()}
              />
            </TableCell>
            <TableCell className="w-[180px]">
              <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-[14px]">
                <PlayButton
                  isPlaying={currentPlayingId === item.id}
                  onPlay={() => onPlay(item.id)}
                  onPause={() => onPause(item.id)}
                  className="scale-90"
                />
                <AudioBadge type={item.projectType} />
              </div>
            </TableCell>
            <TableCell className="w-[160px] truncate text-left text-black">
              {item.projectName}
            </TableCell>
            <TableCell className="w-[200px] truncate text-left text-black">
              {item.fileName}
            </TableCell>
            <TableCell className="flex-1">
              <div className="truncate text-left text-black">{item.script}</div>
            </TableCell>
            <TableCell className="w-[120px]">
              <div className="flex justify-center">
                {item.unitStatus === 'SUCCESS' ||
                item.unitStatus === 'FAILURE' ||
                item.unitStatus === null ? (
                  <StatusBadge unitStatus={item.unitStatus} />
                ) : null}
              </div>
            </TableCell>
            <TableCell className="w-[120px] pl-0">
              <div className="flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item.id);
                  }}
                  aria-label="Download file"
                >
                  <TbDownload className="h-6 w-6" />
                </button>
              </div>
            </TableCell>
            <TableCell className="w-[190px] text-gray-700 pl-[18px]">{item.updatedAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
