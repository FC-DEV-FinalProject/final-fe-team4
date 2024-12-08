import { customInstance } from '@/api/axios-client';

export interface ConcatSaveDto {
  projectId: number | null;
  projectName: string;
  globalFrontSilenceLength: number;
  globalTotalSilenceLength: number;
  concatDetails: {
    id: number | null;
    localFileName: string;
    audioSeq: number;
    isChecked: boolean;
    unitScript: string;
    endSilence: number;
  }[];
}
// 프로젝트 기본 정보 타입
export interface ConcatProjectDto {
  id: number;
  projectName: string;
  globalFrontSilenceLength: number;
  globalTotalSilenceLength: number;
  concatAudios: Array<{
    id: number;
    audioUrl: string;
  }>;
}

// 상세 정보 타입
export interface ConcatDetailDto {
  id: number;
  audioSeq: number;
  srcUrl: string;
  unitScript: string;
  endSilence: number;
  checked: boolean;
}

// API 데이터 구조
export interface ConcatData {
  cnctProjectDto: ConcatProjectDto;
  cnctDetailDtos: ConcatDetailDto[];
}

// Save API 요청 데이터 구조
interface ConcatSaveRequest {
  concatSaveDto: ConcatSaveDto;
  file?: File[];
}

// Concat 삭제 요청 타입
interface DeleteConcatRequest {
  projectId: number;
  detailIds?: number[];
  audioIds?: number[];
}

/**
 * Concat 프로젝트 상태를 가져옵니다.
 */
export const concatLoad = async (projectId: number) => {
  try {
    const response = await customInstance<ConcatData>({
      url: `/concat/${projectId}`,
      method: 'GET',
    });

    console.log('Load API 응답:', response);
    return response;
  } catch (error) {
    console.error('Concat Load API 에러:', error);
    throw error;
  }
};
/**
 * Concat 프로젝트 상태를 저장합니다.
 */
export const concatSave = async (data: ConcatSaveRequest) => {
  try {
    const formData = new FormData();

    // 저장할 데이터 로깅
    console.log('Save API 요청 데이터:', data.concatSaveDto);

    formData.append('concatSaveDto', JSON.stringify(data.concatSaveDto));

    if (data.file && data.file.length > 0) {
      data.file.forEach((file) => {
        console.log('첨부 파일:', file.name);
        formData.append('file', file);
      });
    }

    const response = await customInstance.post('/concat/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Save API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('Concat Save API 에러:', error);
    throw error;
  }
};

/**
 * 선택된 Concat 항목들을 삭제합니다.
 */
export const deleteSelectedConcatItems = async (data: DeleteConcatRequest) => {
  try {
    const response = await customInstance.post('/concat/delete/details', data);
    console.log('삭제 응답:', response);
    return response.data;
  } catch (error) {
    console.error('Concat 항목 삭제 실패:', error);
    throw error;
  }
};

// Concat 변환 요청 타입
interface ConvertConcatAddFileRequest {
  projectId: number | null;
  projectName: string;
  globalFrontSilenceLength: number;
  globalTotalSilenceLength: number;
  concatRequestDetails: Array<{
    id: number | null;
    localFileName: string;
    audioSeq: number;
    checked: boolean;
    unitScript: string;
    endSilence: number;
  }>;
}

// audio-buffer-to-wav 함수 (필수)
function audioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numberOfChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);
  const sampleRate = audioBuffer.sampleRate;
  const channels = audioBuffer.numberOfChannels;

  // WAV 헤더 작성
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  // 오디오 데이터 작성
  const offset = 44;
  const samples = audioBuffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i] * 32768;
    view.setInt16(
      offset + i * 2,
      sample < 0 ? Math.max(-32768, sample) : Math.min(32767, sample),
      true
    );
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

interface ConvertResult {
  file: File;
  url: string;
}

export const convertMultipleAudiosAddFile = async (
  data: ConvertConcatAddFileRequest,
  files: File[]
): Promise<ConvertResult> => {
  try {
    // 무음 길이 배열 생성
    const silenceDurations = data.concatRequestDetails.map((detail) => detail.endSilence);

    // 오디오 컨텍스트 생성
    const audioContext = new AudioContext();

    // 파일들을 AudioBuffer로 변환
    const audioBuffers = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return audioContext.decodeAudioData(arrayBuffer);
      })
    );

    // 전체 길이 계산 (원본 오디오 + 무음)
    const totalLength = audioBuffers.reduce((acc, buffer, i) => {
      return acc + buffer.length + (silenceDurations[i] || 0) * audioContext.sampleRate;
    }, 0);

    // 새 버퍼 생성
    const outputBuffer = audioContext.createBuffer(
      audioBuffers[0].numberOfChannels,
      totalLength,
      audioContext.sampleRate
    );

    // 오디오 데이터 복사 및 무음 추가
    let offset = 0;
    audioBuffers.forEach((buffer, i) => {
      // 오디오 데이터 복사
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const outputData = outputBuffer.getChannelData(channel);
        const inputData = buffer.getChannelData(channel);
        outputData.set(inputData, offset);
      }
      offset += buffer.length;

      // 무음 추가
      if (silenceDurations[i] > 0) {
        const silenceSamples = silenceDurations[i] * audioContext.sampleRate;
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          const outputData = outputBuffer.getChannelData(channel);
          for (let j = 0; j < silenceSamples; j++) {
            outputData[offset + j] = 0;
          }
        }
        offset += silenceSamples;
      }
    });

    // WAV로 변환
    const wavBuffer = audioBufferToWav(outputBuffer);
    const mergedBlob = new Blob([wavBuffer], { type: 'audio/wav' });
    const mergedFile = new File([mergedBlob], 'merged.wav', { type: 'audio/wav' });

    // 오디오 컨텍스트 정리
    await audioContext.close();

    // 파일 자동 다운로드
    const url = URL.createObjectURL(mergedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = mergedFile.name;
    a.click();
    // URL.revokeObjectURL(url);
    // console.log('병합 파일:', mergedFile);
    // console.log('병합 파일 URL:', url);

    return {
      file: mergedFile,
      url: url,
    };
  } catch (error) {
    console.error('Concat 변환 실패:', error);
    throw error;
  }
};
