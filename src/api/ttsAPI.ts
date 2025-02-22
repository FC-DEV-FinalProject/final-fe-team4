import { ResponseDto, TTSDetailDto, TTSSaveDto } from '@/api/aIParkAPI.schemas';
import { customInstance } from '@/api/axios-client';

/**
 * TTS 프로젝트를 저장합니다.
 * @param data: TTSSaveDto
 * @returns Promise<TTSSpecificResponse>
 */
export const saveTTSProject = async (data: TTSSaveDto) => {
  try {
    console.log('보낸 데이터:', data);

    const response = await customInstance.post('/tts/save', data);
    console.log('서버 응답:', response.data);

    if (response.data?.data.ttsProject) {
      console.log('TTS 프로젝트 저장 성공:', response.data);
      return response.data.data; // 서버 응답 데이터 반환
    } else {
      console.error('TTS 프로젝트 저장 실패: 응답 데이터 없음');
      return null;
    }
  } catch (error) {
    console.error('TTS 프로젝트 저장 요청 오류:', error);
    throw error;
  }
};

/**
 * TTS 프로젝트 상태를 가져옵니다.
 * @summary TTS 상태 로드
 */
export const ttsLoad = async (projectId: number) => {
  try {
    const response = await customInstance({
      url: `/tts/${projectId}`,
      method: 'GET',
    });
    if (response.data) {
      console.log('TTS 프로젝트 로드 성공:', response.data);
      return response;
    } else {
      throw new Error('TTS 프로젝트 로드 실패');
    }
  } catch (error) {
    console.error('TTS 프로젝트 로드 오류:', error);
    throw error;
  }
};

export interface VoiceStyle {
  id: number;
  country: string;
  languageCode: string;
  voiceType: string;
  voiceName: string;
  gender: 'male' | 'female';
  personality: string;
  label: string;
}

const languageCodeMap = {
  female: '여성',
  male: '남성',
};

export interface voiceStyleData {
  value: number;
  label: string;
  gender: 'male' | 'female';
}

/**
 * TTS에 적용할 음원 보이스 값들을 가져옵니다.
 * @summary all voice
 * @param language: string
 */
export const loadVoiceStyleOptions = async (language: string): Promise<voiceStyleData[]> => {
  try {
    const response = await customInstance({ url: `/voice-style`, method: 'GET' });
    const seen = new Set();
    return response.data.voiceStyleDto
      .filter((v: VoiceStyle) => v.country === language)
      .map((v: VoiceStyle) => {
        const label = `#${languageCodeMap[v.gender]} #${v.personality} `;
        if (seen.has(label)) {
          return null;
        }
        seen.add(label);
        return {
          value: v.id,
          label: label,
          gender: v.gender,
        };
      })
      .filter((v: voiceStyleData | null) => v !== null)
      .sort((a: voiceStyleData) => (a!.gender === 'female' ? -1 : 1));
  } catch (error) {
    console.error('Error loading voice style options:', error);
    throw error;
  }
};

/**
 * TTS에 적용할 가능한음원 언어 값들을 가져옵니다.
 * @summary all voice language
 */
export const loadVoiceLanguageOptions = async (): Promise<ResponseDto<Set<string>>> => {
  try {
    const response = await customInstance({ url: `/voice-style`, method: 'GET' });
    const countries = new Set(
      response.data.voiceStyleDto
        .map((v: VoiceStyle) => v.country)
        .sort((a: string, b: string) => a.localeCompare(b, 'ko'))
    );
    return { ...response.data, data: countries };
  } catch (error) {
    console.error('Error loading voice language options:', error);
    throw error;
  }
};

export interface TTSConvertRequestDto {
  fullScript: string;
  globalPitch: number;
  globalSpeed: number;
  globalVoiceStyleId: number;
  globalVolume: number;
  memberId?: number;
  projectId: number;
  projectName?: string;
  ttsDetails: TTSDetailDto[];
}

/**
 * 주어진 텍스트 목록을 Google TTS API를 사용하여 음성 파일로 변환합니다.
 * @summary TTS 배치 변환
 */
export const convertBatchTexts = async (TTSConvertRequest: TTSConvertRequestDto) => {
  try {
    console.log('convertBatchTexts 보낸 데이터:', TTSConvertRequest);
    const response = await customInstance({
      url: `/tts/convert/batch`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: TTSConvertRequest,
    });
    if (!response.data) {
      console.error('TTS 배치 변환 실패:', response.data);
      throw new Error('TTS 배치 변환 실패');
    }
    return ttsLoad(TTSConvertRequest.projectId);
  } catch (error) {
    console.error('TTS 배치 변환 오류:', error);
    throw error;
  }
};
