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
interface DeleteResponse {
  success: boolean;
  code: number;
  message: string;
  data: string;
}
interface ConcatSaveResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    cnctProjectDto: ConcatProjectDto;
    cnctDetailDtos: ConcatDetailDto[];
  };
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
export const concatSave = async (data: ConcatSaveRequest): Promise<ConcatSaveResponse> => {
  try {
    if (data.concatSaveDto.projectId === null) {
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
      const { data: responseData } = await customInstance.post<any, { data: ConcatSaveResponse }>(
        '/concat/save',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Save API 응답:', responseData);
      return responseData;
    } else {
      const formData = new FormData();
      // 저장할 데이터 로깅
      console.log('Save API 요청 데이터:', data.concatSaveDto);

      const loadResponse = await concatLoad(data.concatSaveDto.projectId);
      const { cnctDetailDtos } = loadResponse.data;

      const newConcatDetails = data.concatSaveDto.concatDetails.filter((newDetail) => {
        return !cnctDetailDtos.some((oldDetail) => oldDetail.id === newDetail.id);
      });

      const newConcatSaveDto = {
        ...data.concatSaveDto,
        concatDetails: newConcatDetails,
      };
      console.log('새로운 concatSaveDto:', newConcatSaveDto);
      formData.append('concatSaveDto', JSON.stringify(newConcatSaveDto));

      if (data.file && data.file.length > 0) {
        data.file.forEach((file) => {
          console.log('첨부 파일:', file.name);
          formData.append('file', file);
        });
      }
      const { data: responseData } = await customInstance.post<any, { data: ConcatSaveResponse }>(
        '/concat/save',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Save API 응답:', responseData);
      return responseData;
    }
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
    const response = await customInstance.post<any, DeleteResponse>('/concat/delete/details', data);
    console.log('삭제 응답:', response);
    return {
      success: response.code === 0,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    console.error('Concat 항목 삭제 실패:', error);
    throw error;
  }
};
interface ConcatRequestDetail {
  id: number | null;
  localFileName: string | null;
  audioSeq: number;
  checked: boolean;
  unitScript: string;
  endSilence: number;
}
interface ConcatRequestDto {
  projectId: number | null;
  projectName: string;
  globalFrontSilenceLength: number;
  globalTotalSilenceLength: number;
  concatRequestDetails: ConcatRequestDetail[];
}
interface ConvertConcatRequest {
  concatRequestDto: ConcatRequestDto;
  files: File[];
}
/**
 * 오디오 파일들을 병합합니다.
 */
export const convertMultipleAudios = async (data: ConvertConcatRequest) => {
  try {
    const formData = new FormData();
    formData.append('concatRequestDto', JSON.stringify(data.concatRequestDto));
    data.files.forEach((file, _index) => {
      formData.append('files', file);
    });
    const response = await customInstance.post('/concat/convert/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('병합 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('Concat 변환 실패:', error);
    throw error;
  }
};
