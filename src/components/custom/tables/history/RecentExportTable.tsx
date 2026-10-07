import { useCallback, useEffect, useState } from 'react';
import { TbChevronRight, TbCircleFilled, TbDownload } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { fetchProjectByType, fetchRecentExports } from '@/api/workspaceAPI';
import { PlayButton } from '@/components/custom/buttons/PlayButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface RecentExportTableItem {
  metaId: number;
  id: number;
  projectName: string;
  fileName: string;
  content: string;
  type: 'VC' | 'TTS' | 'Concat';
  unitStatus?: string;
  createdAt: string;
  url?: string;
}

interface StatusBadgeProps {
  unitStatus: 'SUCCESS' | 'FAILURE';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ unitStatus }) => {
  const variantMap = {
    FAILURE: 'failed',
    SUCCESS: 'completed',
    NONE: 'failed',
  } as const;

  const textMap = {
    FAILURE: '실패',
    SUCCESS: '완료',
    NONE: '상태없음',
  } as const;

  const status = unitStatus === null ? 'NONE' : unitStatus;

  return (
    <div className="flex justify-start whitespace-nowrap">
      <Badge variant={variantMap[status] || 'failed'} className="whitespace-nowrap">
        <TbCircleFilled className="w-2 h-2 mr-2" />
        {textMap[status]}
      </Badge>
    </div>
  );
};

export function RecentExportTable() {
  const navigate = useNavigate();
  const [items, setItems] = useState<RecentExportTableItem[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentPlayingKey, setCurrentPlayingKey] = useState<string | null>(null); // projectId와 metaId 조합으로 관리
  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    variant: 'default' | 'destructive';
  }>({
    visible: false,
    message: '',
    variant: 'default',
  });

  const AudioBadge = useCallback((type: 'VC' | 'TTS' | 'Concat') => {
    const variant = type.toLowerCase() as 'vc' | 'tts' | 'concat';
    return <Badge variant={variant}>{type}</Badge>;
  }, []);

  // 최근 내보내기 내역 호출
  useEffect(() => {
    const loadRecentExports = async () => {
      try {
        const data = await fetchRecentExports();
        if (!data || data.length === 0) {
          return;
        }
        setItems(data); // 매핑된 데이터를 그대로 설정
      } catch (err) {
        console.error(err);
      }
    };

    loadRecentExports();
  }, []);

  const handleProjectClick = async (projectId: number, projectType: 'TTS' | 'VC' | 'CONCAT') => {
    try {
      const response = await fetchProjectByType(projectId, projectType);
      console.log('프로젝트 데이터:', response.data);

      // 프로젝트 타입에 따른 경로 생성
      const path = `/${projectType.toLowerCase()}/${projectId}`;

      // 상세 페이지로 이동
      navigate(path, { state: response.data });
    } catch (error) {
      console.error('프로젝트 로드 중 오류 발생:', error);
      setAlert({
        visible: true,
        message: '프로젝트 로드 중 오류가 발생했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });

      setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
    }
  };

  const handlePlay = (projectId: number, metaId: number, url: string) => {
    const key = `${projectId}-${metaId}`;
    if (currentPlayingKey === key) {
      handlePause();
      return;
    }

    if (audio) {
      audio.pause();
      setAudio(null);
    }

    const newAudio = new Audio(url);
    newAudio.crossOrigin = 'anonymous';
    newAudio.play();
    setAudio(newAudio);
    setCurrentPlayingKey(key);

    console.log('재생 시작:', key);
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    setCurrentPlayingKey(null);
    console.log('재생 멈춤');
  };

  const isPlaying = (projectId: number, metaId: number) => {
    return currentPlayingKey === `${projectId}-${metaId}`;
  };

  const handleDownload = (url: string, fileName: string) => {
    if (!url) {
      setAlert({
        visible: true,
        message: '다운로드할 파일이 없습니다.',
        variant: 'destructive',
      });

      setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
      return;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('다운로드 실패');
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(blobUrl);
        setAlert({
          visible: true,
          message: `${fileName} 다운로드가 완료되었습니다.`,
          variant: 'default',
        });

        setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
      })
      .catch((error) => {
        console.error('다운로드 중 오류 발생:', error);
        setAlert({
          visible: true,
          message: '다운로드 중 문제가 발생했습니다.',
          variant: 'destructive',
        });

        // 알림 자동 제거
        setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
      });
  };

  return (
    <div className="pt-6 h-auto">
      {alert.visible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert variant={alert.variant}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h3 className="text-h3">최근 내보내기</h3>
        <p
          onClick={() => navigate('/History')}
          className="text-black text-body2 flex items-center gap-1 cursor-pointer"
        >
          전체보기
          <TbChevronRight className="w-6 h-6" />
        </p>
      </div>
      <Table className="table-fixed w-full">
        <TableHeader className="bg-gray-50 border-t">
          <TableRow>
            <TableHead className="pl-[70px] text-body3 text-black w-[180px]">유형</TableHead>
            <TableHead className="text-body3 text-black w-[160px]">프로젝트명</TableHead>
            <TableHead className="text-body3 text-black w-[200px]">파일명</TableHead>
            <TableHead className="text-body3 text-black flex-1">스크립트</TableHead>
            <TableHead className="text-body3 text-black w-[100px] text-center">상태</TableHead>
            <TableHead className="text-body3 text-black w-[140px] text-center">다운로드</TableHead>
            <TableHead className="text-body3 text-black w-[160px] pr-4">업데이트 날짜</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-b">
          {items.map((item, index) => {
            const metaId = item.metaId ?? `meta-${index}`;
            const projectId = item.id ?? `project-${index}`;
            const key = `${projectId}-${metaId}`;
            const playing = isPlaying(projectId, metaId);

            return (
              <TableRow
                key={key}
                data-state={playing ? 'selected' : undefined}
                onClick={() =>
                  handleProjectClick(projectId, item.type.toUpperCase() as 'TTS' | 'VC' | 'CONCAT')
                }
                className="cursor-pointer"
              >
                <TableCell className="w-[180px]">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-[14px]"
                  >
                    <PlayButton
                      isPlaying={playing}
                      onPlay={() => handlePlay(projectId, metaId, item.url || '')}
                      onPause={() => handlePause()}
                      className="scale-90"
                    />
                    {AudioBadge(item.type)}
                  </div>
                </TableCell>
                <TableCell className="w-[160px] truncate text-left text-black">
                  {item.projectName}
                </TableCell>
                <TableCell className="w-[200px] truncate text-left text-black">
                  {item.fileName}
                </TableCell>
                <TableCell className="flex-1">
                  <div className="truncate text-left text-black">{item.content}</div>
                </TableCell>
                <TableCell className="w-[100px]">
                  <div className="flex justify-center">
                    {item.unitStatus === 'SUCCESS' ||
                    item.unitStatus === 'FAILURE' ||
                    item.unitStatus === null ? (
                      <StatusBadge unitStatus={item.unitStatus} />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="w-[140px]">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item.url || '', item.fileName);
                      }}
                      aria-label="Download file"
                    >
                      <TbDownload className="h-6 w-6" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 w-[160px] pl-[30px] pr-4">
                  {item.createdAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
