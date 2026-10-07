import { newcustomInstance } from '@/api/new-axios-client';

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

export interface VCSaveRequestSrcFile {
  id: number | null;
  localFileName: string | null;
  unitScript: string;
  isChecked: boolean;
}
export interface VCSaveRequestTrgFile {
  audioType: string;
  localFileName: string | null;
  s3MemberAudioMetaId: number | null;
}

interface VCSaveRequestDto {
  projectId: number | null;
  projectName: string;
  srcFiles: VCSaveRequestSrcFile[];
  trgFiles: VCSaveRequestTrgFile[];
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
    if (vcSaveDto.projectId === null) {
      const formData = new FormData();

      // VCSaveDto를 JSON 문자열로 변환하여 추가
      formData.append('VCSaveRequestDto', JSON.stringify(vcSaveDto));

      // 파일들을 순서대로 추가 (소스 파일들 + 타겟 파일)
      files.forEach((file) => {
        formData.append('files', file);
      });

      console.log('vcSaveDto', vcSaveDto);

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
    } else {
      const currentProject = await vcLoad(vcSaveDto.projectId);

      const { vcDetailsRes } = currentProject.data;

      const currentProjectSrcFiles = vcDetailsRes.map((vcDetail) => {
        return {
          detailId: vcDetail.id,
          unitScript: vcDetail.unitScript,
          srcAudio: vcDetail.srcAudio,
        };
      });

      const updatedVCSaveDto: VCSaveRequestDto = {
        ...vcSaveDto,
        projectId: vcSaveDto.projectId,
        projectName: vcSaveDto.projectName,
        srcFiles: vcSaveDto.srcFiles.map((srcFile, index) => ({
          id: currentProjectSrcFiles[index]?.detailId || null,
          localFileName: currentProjectSrcFiles[index]?.srcAudio.split('/').pop()
            ? null
            : srcFile.localFileName,
          unitScript: srcFile.unitScript,
          isChecked: srcFile.isChecked,
        })),
        trgFiles: [
          {
            audioType: 'VC_TRG',
            localFileName: null,
            s3MemberAudioMetaId: 821,
          },
        ],
      };

      const formData = new FormData();
      formData.append('VCSaveRequestDto', JSON.stringify(updatedVCSaveDto));
      console.log('updatedVCSaveDto', updatedVCSaveDto);

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

      console.log('기존 프로젝트 처리 응답:', response);
      return Array.isArray(response.data) ? response.data : [];
    }
  } catch (error) {
    console.error('VC 프로세스 실패:', error);
    throw error;
  }
};

interface genAudios {
  id: number;
  audioUrl: string;
}

interface VCLoadSaveResponse {
  vcProjectRes: {
    id: number;
    projectName: string;
    trgAudios: {
      id: number;
      audioUrl: string;
    }[];
  };
  vcDetailsRes: {
    id: number;
    projectId: number;
    isChecked: boolean;
    unitScript: string;
    srcAudio: string | null;
    genAudios: genAudios[];
  }[];
}

interface VCAudio {
  id: number;
  audioUrl: string;
}

interface VCProject {
  id: number;
  projectName: string;
  trgAudios: VCAudio[];
}

interface VCDetail {
  id: number;
  projectId: number;
  isChecked: boolean;
  unitScript: string;
  srcAudio: string;
  genAudios: genAudios[];
}

interface VCResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    vcProjectRes: VCProject;
    vcDetailsRes: VCDetail[];
  };
}

/**
 * VC 프로젝트 상태를 가져옵니다.
 */
export const vcLoad = async (projectId: number): Promise<VCResponse> => {
  try {
    const response = await newcustomInstance.get<VCResponse>(`/vc/${projectId}`);
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
export const saveVCProject = async (
  data: VCSaveDto,
  files?: File[]
): Promise<ResponseDto<VCLoadSaveResponse>> => {
  try {
    const formData = new FormData();

    // 메타데이터 구성
    const metadata: VCSaveDto = {
      projectId: data.projectId,
      projectName: data.projectName,
      srcFiles: data.srcFiles.map((file) => ({
        detailId: file.detailId,
        localFileName: file.detailId ? null : file.localFileName,
        unitScript: file.unitScript,
        isChecked: file.isChecked,
      })),
      trgFiles: data.trgFiles?.[0]
        ? [
            {
              localFileName: data.trgFiles[0].s3MemberAudioMetaId
                ? ''
                : data.trgFiles[0].localFileName,
              s3MemberAudioMetaId: data.trgFiles[0].s3MemberAudioMetaId,
              audioType: data.trgFiles[0].audioType,
            },
          ]
        : [],
    };

    formData.append('metadata', JSON.stringify(metadata));

    // 파일 추가 로직 수정
    if (files?.length) {
      files.forEach((file) => {
        const matchingSrcFile = data.srcFiles.find(
          (srcFile) => srcFile.localFileName === file.name
        );
        if (matchingSrcFile) {
          formData.append('file', file);
        }
      });
    }

    const response = await customInstance<ResponseDto<VCLoadSaveResponse>>({
      url: '/vc/save',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

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
