import { useState } from 'react';
import { TbFileDatabase, TbFileMusic, TbFileTypography } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useProjectStore } from '@/stores/project.store';

const features = [
  {
    title: 'Text to Speech',
    description: (
      <>
        텍스트를 업로드하고 원하는 스타일과
        <br />
        목소리로 음성을 생성해 보세요.
      </>
    ),
    icon: TbFileTypography,
    bgColor: 'bg-green-50',
    route: '/tts', // TTS 경로 추가
  },
  {
    title: 'Voice Conversion',
    description: (
      <>
        다양한 음성 샘플을 사용하여
        <br />
        파일의 음색을 자유롭게 바꾸어 보세요.
      </>
    ),
    icon: TbFileMusic,
    bgColor: 'bg-pink-50',
    route: '/vc',
  },
  {
    title: 'Concat',
    description: (
      <>
        여러 오디오를 하나로 연결하며, 자유롭게 무음
        <br />
        구간을 조절해 완성도 높은 파일을 만들어 보세요.
      </>
    ),
    icon: TbFileDatabase,
    bgColor: 'bg-yellow-50',
    route: '/concat',
  },
];

const CreateProjectDialogContent = () => {
  const navigate = useNavigate();
  const addProject = useProjectStore((state) => state.addProject);
  const [projectName] = useState('새 프로젝트');

  const handleNewProject = (type: 'TTS' | 'VC' | 'Concat', route: string) => {
    addProject({
      name: projectName,
      type: type,
    });
    navigate(route);
  };

  return (
    <DialogContent className="max-w-[1168px] max-h-[673px]">
      <DialogTitle className="sr-only">새 프로젝트 생성</DialogTitle>
      <h2 className="py-[76px] text-h2 text-black flex justify-center">
        새 프로젝트 작업을 시작해 보세요!
      </h2>
      <div className="flex justify-center gap-6 mt-10 mb-14">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-[344px] p-6 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.11)] cursor-pointer hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-shadow duration-300"
            onClick={() =>
              handleNewProject(
                feature.title === 'Text to Speech'
                  ? 'TTS'
                  : feature.title === 'Voice Conversion'
                    ? 'VC'
                    : 'Concat',
                feature.route
              )
            }
          >
            <div
              className={`mt-9 w-[72px] h-[72px] ${feature.bgColor} flex items-center justify-center rounded-md mx-auto mb-6`}
            >
              <feature.icon className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-h4 text-black text-center mb-12">{feature.title}</h3>
            <p className="text-body4 text-center text-black mb-10">{feature.description}</p>
          </div>
        ))}
      </div>
    </DialogContent>
  );
};

export default CreateProjectDialogContent;
