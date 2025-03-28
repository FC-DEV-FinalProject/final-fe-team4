import { Export, Project, workspacesResponse } from '@/api/aIParkAPI.schemas';
import { customInstance } from '@/api/axios-client';
import { concatLoad } from '@/api/concatAPI';
import { ttsLoad } from '@/api/ttsAPI';
import { vcLoad } from '@/api/vcAPI';
import { RecentExportTableItem } from '@/components/custom/tables/history/RecentExportTable';
import { formatUpdatedAt } from '@/utils/dateUtils';

// 프로젝트 목록
export const fetchProjects = async (
  page: number,
  size: number,
  keyword: string = ''
): Promise<{ content: Project[]; totalPages: number; totalElements: number }> => {
  try {
    const response = await customInstance.get('/workspace/projects', {
      params: { page, size, keyword },
    });

    console.log('API 전체 응답:', response.data);

    // 응답에서 data 필드 추출
    const data = response.data;

    console.log('API 전체 응답:', response.data);
    console.log('API 부분 응답:', data);
    console.log('프로젝트 데이터:', data.content);
    console.log('총 페이지 수:', data.totalPages);

    // 데이터 검증
    if (!data || !Array.isArray(data.content) || typeof data.totalPages !== 'number') {
      throw new Error('API 응답 데이터가 예상과 다릅니다.');
    }

    // 반환
    return {
      content: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
    };
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw new Error('API 요청 실패');
  }
};

// 프로젝트 삭제
export const deleteProject = async (projectIds: number[]) => {
  try {
    const response = await customInstance.delete('/workspace/delete/project', {
      data: projectIds, // 요청 본문에 ID 배열 전달
    });
    console.log('프로젝트 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    throw error;
  }
};

// 최근 프로젝트 5개
export const fetchRecentProjects = async (): Promise<Project[]> => {
  try {
    const response = await customInstance.get<workspacesResponse>('/workspace/project-list');
    console.log('최근 프로젝트 데이터:', response.data);

    return response.data.map((project) => ({
      projectId: project.id, // id를 projectId로 매핑
      projectType: project.type, // type을 projectType으로 매핑
      projectName: project.name, // name을 projectName으로 매핑
      script: project.script || '작성된 내용이 없습니다.', // script 기본값 처리
      updatedAt: project.updatedAt,
      createdAt: project.createdAt,
      projectStatus: project.status,
    }));
  } catch (error) {
    console.error('최근 프로젝트 조회 실패:', error);
    throw new Error('최근 프로젝트 조회에 실패했습니다.');
  }
};

// 프로젝트 클릭시 로드 호출
export const fetchProjectByType = async (
  projectId: number,
  projectType: 'TTS' | 'VC' | 'CONCAT'
) => {
  try {
    switch (projectType) {
      case 'TTS':
        return await ttsLoad(projectId);
      case 'VC':
        return await vcLoad(projectId);
      case 'CONCAT':
        return await concatLoad(projectId);
      default:
        throw new Error('Invalid project type');
    }
  } catch (error) {
    console.error(`프로젝트 로드 실패 [${projectType}]:`, error);
    throw error;
  }
};

// 히스토리 목록
export const fetchExports = async (
  page: number,
  size: number,
  keyword: string = ''
): Promise<{ content: Export[]; totalPages: number; totalElements: number }> => {
  try {
    const response = await customInstance.get('/workspace/exports', {
      params: { page, size, keyword },
    });

    console.log('API 전체 응답:', response.data);

    // 응답에서 data 필드 추출
    const data = response.data;

    console.log('내보내기 데이터:', data.content);
    console.log('총 페이지 수:', data.totalPages);
    console.log('총 데이터 수:', data.totalElements);

    // 데이터 검증
    if (
      !data ||
      !Array.isArray(data.content) ||
      typeof data.totalPages !== 'number' ||
      typeof data.totalElements !== 'number'
    ) {
      throw new Error('API 응답 데이터가 예상과 다릅니다.');
    }

    // 반환
    return {
      content: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
    };
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw new Error('API 요청 실패');
  }
};

export const fetchRecentExports = async (): Promise<RecentExportTableItem[]> => {
  try {
    const response = await customInstance.get<{
      success: boolean;
      code: number;
      message: string;
      data: Export[];
    }>('/workspace/export-list');

    // 응답 전체 출력
    console.log('API 응답 전체:', response);

    const data = response.data;

    if (!data || !Array.isArray(data)) {
      throw new Error('API 응답에서 데이터를 찾을 수 없습니다.');
    }

    // 데이터 매핑
    const mappedData = data.map((item, index) => ({
      id: item.projectId,
      metaId: item.metaId || index,
      projectName: item.projectName,
      type: item.projectType as 'VC' | 'TTS' | 'Concat',
      content: item.script || '작성된 내용이 없습니다.',
      fileName: item.fileName,
      url: item.url || '',
      unitStatus:
        item.unitStatus === 'SUCCESS' || item.unitStatus === 'FAILURE' ? item.unitStatus : null,
      createdAt: formatUpdatedAt(item.createAt),
    }));

    console.log('매핑된 데이터:', mappedData);

    return mappedData;
  } catch (error) {
    console.error('최근 내보내기 목록 조회 실패:', error);
    throw new Error('최근 내보내기 목록 조회에 실패했습니다.');
  }
};

// 내보내기 오디오 삭제
export const deleteExportProject = async (mataId: number[]) => {
  try {
    const response = await customInstance.delete('/workspace/delete/export', {
      data: mataId, // 요청 본문에 ID 배열 전달
    });
    console.log('프로젝트 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    throw error;
  }
};
