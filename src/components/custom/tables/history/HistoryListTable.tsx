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
          <TableHead className="pl-16 text-body3 text-black w-[150px]">유형</TableHead>
          <TableHead className="text-body3 text-black w-[110px]">프로젝트명</TableHead>
          <TableHead className="text-body3 text-black w-[120px]">파일명</TableHead>
          <TableHead className="p-0 text-body3 text-black w-[200px]">내용</TableHead>
          <TableHead className="text-body3 text-black w-[60px] text-center">상태</TableHead>
          <TableHead className="text-body3 text-black w-[80px] text-center whitespace-nowrap">
            다운로드
          </TableHead>
          <TableHead className="text-body3 text-black w-[130px]">업데이트 날짜</TableHead>
        </TableRow>
      </TableHeader>

      {/* Body */}
      <TableBody>
        {items.map((item, index) => (
          <TableRow
            key={`${item.id}-${index}`} // id와 index 조합으로 고유한 key 생성
            data-state={currentPlayingId === item.id ? 'selected' : undefined}
            className="text-body2 cursor-pointer"
            onClick={item.onClick}
          >
            <TableCell className="pl-6 w-[50px] ">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={(checked) => onSelectionChange(item.id, checked as boolean)}
                onClick={(e) => e.stopPropagation()}
              />
            </TableCell>
            <TableCell className="w-[100px] text-left">
              <div className="flex items-center gap-4">
                <PlayButton
                  isPlaying={currentPlayingId === item.id}
                  onPlay={() => onPlay(item.id)}
                  onPause={() => onPause(item.id)}
                />
                <AudioBadge type={item.projectType} />
              </div>
            </TableCell>

            <TableCell className="truncate text-left text-black">{item.projectName}</TableCell>
            <TableCell className="truncate text-left text-black">{item.fileName}</TableCell>
            <TableCell className="max-w-md p-0">
              <div className="truncate text-left text-black overflow-hidden text-ellipsis">
                {item.script}
              </div>
            </TableCell>
            <TableCell className="px-0">
              <div className="flex truncate">
                {item.unitStatus === 'SUCCESS' ||
                item.unitStatus === 'FAILURE' ||
                item.unitStatus === null ? (
                  <StatusBadge unitStatus={item.unitStatus} />
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item.id); // 다운로드 이벤트 호출
                  }}
                  aria-label="Download file"
                >
                  <TbDownload className="h-6 w-6" />
                </button>
              </div>
            </TableCell>
            <TableCell className="text-gray-700 whitespace-nowrap">{item.updatedAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
