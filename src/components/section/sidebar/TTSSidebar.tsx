import { useCallback, useEffect, useState } from 'react';
import { TbWorld } from 'react-icons/tb';

import { loadVoiceLanguageOptions, loadVoiceStyleOptions, voiceStyleData } from '@/api/ttsAPI';
import { ApplyButton, ResetChangesButton } from '@/components/custom/buttons/IconButton';
import { StateController } from '@/components/custom/features/common/StateController';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select } from '@/components/ui/select';
import { GOOGLE_TTS_CONFIG } from '@/constants/googleTTSConfig';
import { useTTSStore } from '@/stores/tts.store';

const TTSSidebar: React.FC = () => {
  const {
    speed,
    volume,
    pitch,
    language,
    style,
    setField,
    cleanUpAllItems,
    isModified,
    isAllConfigured,
    applyToSelected,
  } = useTTSStore();

  const [voiceStyleList, setVoiceStyleList] = useState<voiceStyleData[]>([]);
  const [voiceLanguageList, setVoiceLanguageLists] = useState<string[]>([]);

  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    variant: 'default' | 'destructive';
  }>({
    visible: false,
    message: '',
    variant: 'default',
  });
  const showAlert = useCallback((message: string, variant: 'default' | 'destructive') => {
    setAlert({ visible: true, message, variant });
    setTimeout(() => setAlert({ visible: false, message: '', variant: 'default' }), 2000);
  }, []);

  useEffect(() => {
    // 목소리 언어 옵션 로드
    const fetchVoiceLanguageOptions = async () => {
      const response = await loadVoiceLanguageOptions();
      setVoiceLanguageLists(Array.from(response.data || []));
    };
    fetchVoiceLanguageOptions();
  }, []);

  useEffect(() => {
    setField('style', '');
    if (!language) {
      return;
    }
    const fetchTTSVoiceOptions = async () => {
      const response = await loadVoiceStyleOptions(language);
      setVoiceStyleList(Array.from(response) || []);
    };
    fetchTTSVoiceOptions();
  }, [language, setField]);

  return (
    <aside className="w-[276px] min-h-full border-l p-6">
      {alert.visible && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50">
          <Alert variant={alert.variant}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-8">TTS 옵션 설정</h2>

      {/* 언어 선택 */}
      <div className="mb-8">
        <label htmlFor="language" className="block text-sm font-bold mb-2">
          언어
        </label>
        <Select
          id="language"
          value={language}
          onValueChange={(value) => setField('language', value)}
          items={
            voiceLanguageList.map((languageOption) => ({
              value: languageOption,
              label: languageOption,
            })) || []
          }
          icon={<TbWorld className="h-5 w-5" />}
          placeholder="-"
        />
      </div>

      {/* 스타일 선택 */}
      <div>
        <label htmlFor="voice-style" className="block text-sm font-bold mb-2">
          스타일
        </label>
        <Select
          id="voice-style"
          value={style}
          onValueChange={(value) => setField('style', value)}
          items={
            voiceStyleList.map((option) => ({
              value: String(option.value),
              label: option.label,
            })) || []
          }
          placeholder="-"
        />
      </div>

      <hr className="my-8" />

      {/* 속도 */}
      <div className="mb-6">
        <StateController
          label="속도"
          value={speed}
          unit="x"
          min={GOOGLE_TTS_CONFIG.SPEED.MIN}
          max={GOOGLE_TTS_CONFIG.SPEED.MAX}
          step={GOOGLE_TTS_CONFIG.SPEED.STEP}
          onChange={(value) => setField('speed', value)}
        />
      </div>
      {/* 볼륨 */}
      <div className="mb-6">
        <StateController
          label="볼륨"
          value={volume}
          unit=" dB"
          min={GOOGLE_TTS_CONFIG.VOLUME.MIN}
          max={GOOGLE_TTS_CONFIG.VOLUME.MAX}
          step={GOOGLE_TTS_CONFIG.VOLUME.STEP}
          onChange={(value) => setField('volume', value)}
        />
      </div>

      {/* 피치 */}
      <div className="mb-12">
        <StateController
          label="피치"
          value={pitch}
          unit=""
          min={GOOGLE_TTS_CONFIG.PITCH.MIN}
          max={GOOGLE_TTS_CONFIG.PITCH.MAX}
          step={GOOGLE_TTS_CONFIG.PITCH.STEP}
          onChange={(value) => setField('pitch', value)}
        />
      </div>

      {/* 적용 버튼들 */}
      <div className="flex flex-col gap-4">
        <ApplyButton
          onClick={() => applyToSelected(showAlert)}
          className={isAllConfigured ? '' : `pointer-events-none opacity-50 cursor-not-allowed`}
        />

        <ResetChangesButton
          onClick={cleanUpAllItems}
          className={isModified ? '' : `pointer-events-none opacity-50 cursor-not-allowed`}
        />
      </div>
    </aside>
  );
};

export default TTSSidebar;
