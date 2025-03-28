import React from 'react';
import { TbSettings } from 'react-icons/tb';

import { ApplyButton, ResetChangesButton } from '@/components/custom/buttons/IconButton';
import { StateController } from '@/components/custom/features/common/StateController';
import { useConcatStore } from '@/stores/concat.store';

interface ConcatSidebarProps {
  frontSilence: number;
  totalSilence: number;
  onApplySettings: (frontSilence: number, totalSilence: number, message?: string) => void;
}

const ConcatSidebar: React.FC<ConcatSidebarProps> = ({ onApplySettings }) => {
  const { silenceSettings, setSilenceSettings, applySilenceToSelected, reset } = useConcatStore();

  const handleApply = () => {
    applySilenceToSelected();
    onApplySettings(silenceSettings.frontSilence, silenceSettings.fileSilence);
  };

  const handleReset = () => {
    reset();
    onApplySettings(0, 0, '설정이 초기화되었습니다.');
  };

  return (
    <aside className="relative w-[276px] min-h-full border-l p-6">
      <div className="flex items-center mb-8 gap-2">
        <TbSettings className="h-6 w-6" />
        <div className="text-body1">Concat 옵션 설정</div>
      </div>

      <div className="flex flex-col gap-6">
        <StateController
          label="맨 앞 무음 추가"
          value={silenceSettings.frontSilence}
          unit=""
          min={0}
          max={10}
          step={0.1}
          onChange={(value) => setSilenceSettings({ frontSilence: value })}
        />
        <StateController
          label="맨 뒤 무음 추가"
          value={silenceSettings.backSilence}
          unit=""
          min={0}
          max={10}
          step={0.1}
          onChange={(value) => setSilenceSettings({ backSilence: value })}
        />
        <StateController
          label="오디오 파일 간 무음"
          value={silenceSettings.fileSilence}
          unit=""
          min={0}
          max={10}
          step={0.1}
          onChange={(value) => setSilenceSettings({ fileSilence: value })}
        />
      </div>

      <div className="absolute bottom-0 flex flex-col gap-4 mb-[102px]">
        <ApplyButton onClick={handleApply} />
        <ResetChangesButton onClick={handleReset} />
      </div>
    </aside>
  );
};

export default ConcatSidebar;
