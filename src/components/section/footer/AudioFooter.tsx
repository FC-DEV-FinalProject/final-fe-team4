import * as React from 'react';
import { TbHistory } from 'react-icons/tb';

import AudioHistoryDialog from '@/components/custom/dialogs/AudioHistoryDialog';
import { AudioPlayer } from '@/components/custom/features/common/AudioPlayer';
import TooltipWrapper from '@/components/custom/guide/TooltipWrapper';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { AUDIO_FOOTER_TOOLTIP } from '@/constants/tooltips';
import { cn } from '@/lib/utils';
import { useTTSAudioHistoryStore } from '@/stores/TTSAudioHistory.store.ts';
import { useVCHistoryStore } from '@/stores/vc.history.store';

interface AudioFooterProps {
  audioUrl: string;
  className?: string;
  type?: 'TTS' | 'VC';
  label?: string;
}

const AudioFooter = React.forwardRef<HTMLDivElement, AudioFooterProps>(
  ({ audioUrl, className, type = 'TTS' }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const ttsHistoryItems = useTTSAudioHistoryStore((state) => state.historyItems);
    const vcHistoryItems = useVCHistoryStore((state) => state.historyItems);

    const audiohisoryItems = (
      type === 'VC'
        ? vcHistoryItems.map((item) => ({
            id: item.id,
            audioUrl: item.audioUrl,
            fileName: item.fileName,
            createdAt: item.createdAt,
          }))
        : Object.values(ttsHistoryItems)
            .flat()
            .map((item) => ({
              id: item.audioId,
              audioUrl: item.audioUrl,
              fileName: '',
              createdAt: '',
            }))
    )
      .reverse()
      .slice(0, 7);

    //!TODO TTS 오디오 히스토리 삭제 기능 추가 필요

    return (
      <div ref={ref} className={cn('flex items-center h-[92px] gap-4 bg-white', className)}>
        <div className="px-10 flex-1 min-w-0">
          <AudioPlayer audioUrl={audioUrl} className="bg-transparent w-full px-0 py-0" />
        </div>

        <Separator orientation="vertical" className="flex-shrink-0 h-[56px] mr-4" />

        {/* Dialog Trigger */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <TooltipWrapper content={AUDIO_FOOTER_TOOLTIP.FULL_HISTORY} className="history-icon">
              <button
                className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="History"
                onClick={() => setIsOpen(true)}
              >
                <TbHistory className="w-7 h-7 text-black" />
              </button>
            </TooltipWrapper>
          </DialogTrigger>

          {/* Dialog Content */}
          <AudioHistoryDialog audioHistory={audiohisoryItems} />
        </Dialog>
      </div>
    );
  }
);

AudioFooter.displayName = 'AudioFooter';

export default AudioFooter;
