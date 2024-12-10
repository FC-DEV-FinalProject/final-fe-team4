import type { ResponseDto, VCSaveDto } from './aIParkAPI.schemas';
import { customInstance } from './axios-client';

export interface VCProcessResponse {
  id: number;
  projectId: number;
  isChecked: boolean;
  unitScript: string;
  srcAudio: string;
  genAudios: string[];
}

/**
 * VC 프로젝트 처리 및 음성 변환
 * @param vcSaveDto VC 저장 데이터
 * @param files 오디오 파일 배열 (소스 파일들 + 타겟 파일)
 * @param memberId 멤버 ID
 */
export const processVoiceConversion = async (
  vcSaveDto: VCSaveDto,
  files: File[],
  memberId: number
): Promise<VCProcessResponse[]> => {
  try {
    const formData = new FormData();

    // VCSaveDto를 JSON 문자열로 변환하여 추가
    formData.append('VCSaveRequestDto', JSON.stringify(vcSaveDto));

    // 파일들을 순서대로 추가 (소스 파일들 + 타겟 파일)
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await customInstance<ResponseDto<VCProcessResponse[]>>({
      url: '/vc/process',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      params: { memberId },
    });

    console.log('서버 원본 응답:', response);
    console.log('응답 데이터:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('VC 프로세스 실패:', error);
    throw error;
  }
};

interface VCLoadResponse {
  vcProject: {
    id: number;
    projectName: string;
  };
  vcDetails: {
    id: number;
    fileName?: string;
    unitScript?: string;
    isChecked?: boolean;
  }[];
}

/**
 * VC 프로젝트 상태를 가져옵니다.
 */
export const vcLoad = async (projectId: number): Promise<ResponseDto<VCLoadResponse>> => {
  try {
    const response = await customInstance<ResponseDto<VCLoadResponse>>({
      url: `/vc/${projectId}`,
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('VC 프로젝트 로드 실패:', error);
    throw error;
  }
};

/**
 * VC 프로젝트를 저장합니다.
 * @param data VCSaveDto 데이터
 * @param files 오디오 파일 배열 (선택적)
 */
export const saveVCProject = async (data: VCSaveDto, files?: File[]) => {
  try {
    const formData = new FormData();

    // 메타데이터를 VCSaveDto 형식에 맞게 추가
    formData.append(
      'metadata',
      JSON.stringify({
        projectId: data.projectId,
        projectName: data.projectName,
        srcFiles: data.srcFiles,
        trgFile: {
          // trgFiles가 아닌 trgFile로 변경
          localFileName: data.trgFiles?.[0]?.localFileName || null,
          s3MemberAudioMetaId: data.trgFiles?.[0]?.s3MemberAudioMetaId || null,
        },
      })
    );

    // 파일이 있는 경우 추가
    if (files?.length) {
      files.forEach((file) => {
        formData.append('file', file);
      });
    }

    const response = await customInstance<ResponseDto>({
      url: '/vc/save',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });

    return response.data;
  } catch (error) {
    console.error('VC 프로젝트 저장 실패:', error);
    throw error;
  }
};

// Response Types
export type ProcessVoiceConversionResult = NonNullable<
  Awaited<ReturnType<typeof processVoiceConversion>>
>;
export type LoadVCProjectResult = NonNullable<Awaited<ReturnType<typeof vcLoad>>>;

// VCSaveDto를 export 해야 합니다
export type { VCSaveDto } from './aIParkAPI.schemas';
