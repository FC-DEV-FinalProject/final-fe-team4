import { TbChevronRight, TbCircleFilled, TbDownload } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { PlayButton } from '@/components/custom/buttons/PlayButton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RecentExportTableItem {
  id: string;
  order: string;
  projectName: string;
  fileName: string;
  content: string;
  type: 'VC' | 'TTS' | 'CONCAT';
  status: '진행' | '대기중' | '실패' | '완료';
  createdAt: string;
}

interface RecentExportTableProps {
  readonly items: RecentExportTableItem[];
  readonly onPlay: (id: string) => void;
  readonly onPause: (id: string) => void;
  readonly currentPlayingId?: string;
}
const StatusBadge = (status: '진행' | '대기중' | '실패' | '완료') => {
  const variantMap = {
    진행: 'progress',
    대기중: 'waiting',
    실패: 'failed',
    완료: 'completed',
  } as const;

  return (
    <div className="flex justify-start">
      <Badge variant={variantMap[status]}>
        <TbCircleFilled className="w-2 h-2 mr-2" />
        {status}
      </Badge>
    </div>
  );
};

export function RecentExportTable({
  items,
  onPlay,
  onPause,
  currentPlayingId,
}: RecentExportTableProps) {
  const navigate = useNavigate();
  const AudioBadge = (type: 'VC' | 'TTS' | 'CONCAT') => {
    const variant = type.toLowerCase() as 'vc' | 'tts' | 'concat';
    return <Badge variant={variant}>{type}</Badge>;
  };

  return (
    <div className="pt-6 h-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h3 className="text-h3">최근 내보내기</h3>
        <p
          onClick={() => navigate('/Historys')}
          className="text-black text-body2 flex items-center gap-1 cursor-pointer"
        >
          전체보기
          <TbChevronRight className="w-6 h-6" />
        </p>
      </div>
      <Table>
        <TableHeader className="border-t">
          <TableRow>
            <TableHead className="pl-[74px] bg-gray-50 font-bold text-gray-900">순서</TableHead>
            <TableHead className="bg-gray-50 font-bold text-gray-900">
              <div className="flex flex-col gap-2">
                <span>유형</span>
              </div>
            </TableHead>
            <TableHead className="bg-gray-50 font-bold text-gray-900">프로젝트명</TableHead>
            <TableHead className="bg-gray-50 font-bold text-gray-900">파일명</TableHead>
            <TableHead className="bg-gray-50 font-bold text-gray-900">내용</TableHead>
            <TableHead className="bg-gray-50 font-bold text-gray-900">상태</TableHead>
            <TableHead className="bg-gray-50 font-bold text-gray-900 pl-9">다운로드</TableHead>
            <TableHead className="pl-[60px] bg-gray-50 font-bold text-gray-900">
              업데이트 날짜
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.slice(0, 5).map((item) => (
            <TableRow
              key={item.id}
              data-state={currentPlayingId === item.id ? 'selected' : undefined}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-9">
                  <PlayButton
                    isPlaying={currentPlayingId === item.id}
                    onPlay={() => onPlay(item.id)}
                    onPause={() => onPause(item.id)}
                  />
                  {item.order}
                </div>
              </TableCell>
              <TableCell>{AudioBadge(item.type)}</TableCell>
              <TableCell>{item.projectName}</TableCell>
              <TableCell>{item.fileName}</TableCell>
              <TableCell className="max-w-md pr-0 truncate">{item.content}</TableCell>
              <TableCell className="pl-0">
                <div className="flex">{StatusBadge(item.status)}</div>
              </TableCell>
              <TableCell>
                <div className="flex justify-start pl-8">
                  <button
                    onClick={() => console.log('다운로드:', item.id)}
                    aria-label="Download file"
                  >
                    <TbDownload className="h-6 w-6" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-gray-700 pl-[60px]">{item.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
