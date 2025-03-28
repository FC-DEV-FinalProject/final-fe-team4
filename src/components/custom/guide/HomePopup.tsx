import { useState } from 'react';
import { TbX } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import HomeCard from '@/components/custom/cards/HomeCard';
import HomePopupBg from '@/images/home-popup-bg.svg';
import { useProjectStore } from '@/stores/project.store';

const HomePopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const addProject = useProjectStore((state) => state.addProject);

  const handleNewProject = (type: 'TTS' | 'VC' | 'Concat', route: string) => {
    addProject({
      name: '새 프로젝트',
      type: type,
    });

    navigate(route);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="relative w-full h-[428px] mt-6 p-6 rounded-xl bg-background flex-shrink-0"
      style={{
        backgroundImage: `url(${HomePopupBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-6 top-6 text-black hover:text-gray-800 transition-colors"
      >
        <TbX className="w-6 h-6" />
      </button>

      {/* Text Content */}
      <h2 className="mt-[22px] text-h3">AI 기술이 만든 스마트한 음성 솔루션</h2>
      <p className="mt-1 text-body2">오디오 작업의 새로운 경험. 지금 시작해 보세요!</p>

      {/* Cards Container */}
      <div className="absolute top-[152px] flex gap-11">
        <HomeCard
          title="Text to Speech"
          description1="텍스트 파일 업로드로"
          description2="다양한 스타일의 음성 생성"
          onClick={() => handleNewProject('TTS', '/tts')}
        />
        <HomeCard
          title="Voice Conversion"
          description1="다양한 음성 샘플을 사용하여"
          description2="원하는 음색으로 변환"
          onClick={() => handleNewProject('VC', '/vc')}
        />
        <HomeCard
          title="Concat"
          description1="다양한 오디오 파일을"
          description2="하나로 연결"
          onClick={() => handleNewProject('Concat', '/concat')}
        />
      </div>
    </div>
  );
};

export default HomePopup;
