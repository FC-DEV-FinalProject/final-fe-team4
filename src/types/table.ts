export interface TableItem {
  id: string;
  text: string;
  isSelected: boolean;
  speed?: number;
  volume?: number;
  pitch?: number;
  fileName?: string;
  audioUrl?: string;
}

export interface ProjectListTableItem {
  id: string;
  order: string;
  projectName: string;
  fileName: string;
  script: string;
  projectType: 'VC' | 'TTS' | 'Concat';
  status: '진행' | '대기중' | '실패' | '완료';
  updatedAt: string;
  speed?: number;
  volume?: number;
  pitch?: number;
}

export interface VCItem extends TableItem {
  fileName: string;
  status: '대기중' | '완료' | '실패' | '진행';
  originalAudioUrl?: string;
  convertedAudioUrl?: string;
  targetVoice?: string;
  file?: File | null;
  detailId?: number | null;
  unitScript?: string;
  srcAudio?: string | null;
}

export interface ConcatTableItem extends TableItem {
  audioUrl: string;
  frontSilence: number;
  backSilence: number;
  duration: number;
  fileName: string;
  silentRegions: { start: number; end: number }[];
}

export interface ListRowProps {
  id: string;
  text: string;
  isSelected: boolean;
  onPlay: (id: string) => void;
  onSelectionChange: (id: string) => void;
  onTextChange: (id: string, newText: string) => void;
  type?: 'TTS' | 'VC' | 'Concat';
  fileName?: string;
  speed: number;
  volume: number;
  pitch: number;
  status?: '대기중' | '완료' | '실패' | '진행';
  targetVoice?: string;
  frontSilence?: number;
  backSilence?: number;
  endSilence?: number;
  originalAudioUrl?: string;
  convertedAudioUrl?: string;
}
