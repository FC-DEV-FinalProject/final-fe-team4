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
  updatedAt: string;
  onClick?: () => void;
}

interface ProjectListTableProps {
  items: ProjectListTableItem[];

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

export function ProjectListTable({
  items,
  currentPlayingId,
  isAllSelected,
  itemCount,
  onSelectAll,
  selectedItems,
  onSelectionChange,
}: ProjectListTableProps) {
  return (
    <Table>
      {/* Header */}
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="pl-6 w-[50px]">
            <Checkbox
              checked={itemCount > 0 && isAllSelected}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
              onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
            />
          </TableHead>

          <TableHead className="text-body3 text-black w-[80px]">유형</TableHead>
          <TableHead className="text-body3 text-black w-[150px]">프로젝트명</TableHead>
          <TableHead className="text-body3 text-black w-[300px]">스크립트</TableHead>
          <TableHead className="pl-6 text-body3 text-black w-[150px]">업데이트 날짜</TableHead>
        </TableRow>
      </TableHeader>

      {/* Body */}
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.id}
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
            <TableCell className="w-[80px] text-left">
              <div className="flex items-center ">
                <AudioBadge type={item.projectType} />
              </div>
            </TableCell>
            <TableCell className="text-black w-[150px] text-left ">{item.projectName}</TableCell>
            <TableCell className="max-w-[300px] truncate text-left text-black">
              {item.script}
            </TableCell>
            <TableCell className="pl-[26px] w-[150px] text-gray-500">{item.updatedAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
