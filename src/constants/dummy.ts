import { FileProgressItem } from '@/components/custom/dropdowns/FileProgressDropdown';
import { ProjectListTableItem } from '@/components/custom/tables/history/ProjectListTable';
import Ian from '@/images/avatar/ian.jpg';
import Jennie from '@/images/avatar/jennie.png';
import Jisu from '@/images/avatar/jisu.jpg';
import Lisa from '@/images/avatar/lisa.jpg';

export const PRESET_VOICES = [
  {
    id: 'voice1',
    name: '제니',
    description: '#명량함 #활발함',
    avatarUrl: Jennie,
    type: 'preset' as const,
  },
  {
    id: 'voice2',
    name: '지수',
    description: '#우아함 #청초함',
    avatarUrl: Jisu,
    type: 'preset' as const,
  },
  {
    id: 'voice3',
    name: '리사',
    description: '#원어민 #외국인',
    avatarUrl: Lisa,
    type: 'preset' as const,
  },
  {
    id: 'voice4',
    name: '이안',
    description: '#전문적인 #지적인',
    avatarUrl: Ian,
    type: 'preset' as const,
  },
  {
    id: 'voice5',
    name: '이안2',
    description: '#전문적인 #지적인',
    avatarUrl: Ian,
    type: 'preset' as const,
  },
  {
    id: 'voice6',
    name: '이안3',
    description: '#전문적인 #지적인',
    avatarUrl: Ian,
    type: 'preset' as const,
  },
  {
    id: 'voice7',
    name: '이안4',
    description: '#전문적인 #지적인',
    avatarUrl: Ian,
    type: 'preset' as const,
  },
  {
    id: 'voice8',
    name: '이안5',
    description: '#전문적인 #지적인',
    avatarUrl: Ian,
    type: 'preset' as const,
  },
];

export const dummyData: ProjectListTableItem[] = [
  {
    id: '1',
    order: '1',
    projectName: '프로젝트1 발표자료',
    fileName: '파일1.wav',
    script: '안녕하세요. 프로젝트1에 대한 발표를 시작해 보겠습니다.',
    projectType: 'TTS',
    status: '완료',
    updatedAt: '금요일 오후 7:24',
  },
];

export const fileProgressDummy: FileProgressItem[] = [
  {
    id: 1,
    name: 'text_001.txt',
    status: '진행',
    progress: 75,
    createdAt: new Date().toISOString(), // 오늘
  },
  {
    id: 2,
    name: 'text_002.txt',
    status: '진행',
    progress: 82,
    createdAt: new Date().toISOString(), // 오늘
  },
  {
    id: 3,
    name: 'text_003.txt',
    status: '대기',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 어제
  },
  {
    id: 4,
    name: 'text_004.txt',
    status: '대기',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 어제
  },
  {
    id: 5,
    name: 'text_005.txt',
    status: '실패',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 그저께
  },
  {
    id: 6,
    name: 'text_006.txt',
    status: '완료',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 일주일 전
  },
  {
    id: 7,
    name: 'text_007.txt',
    status: '완료',
    createdAt: new Date(Date.now() - 86400000 * 31).toISOString(), // 한달 전
  },
];
