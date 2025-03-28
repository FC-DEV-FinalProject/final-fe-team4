/* eslint-disable @typescript-eslint/no-explicit-any */
import { customInstance } from './axios-client';

interface TaskResponse {
  success: boolean;
  code: number;
  message: string;
  data: Task[];
}

interface Task {
  id: number;
  projectId: number;
  projectType: string;
  taskStatus: string;
  taskData: string;
  resultMsg: string | null;
}

export const taskAPI = {
  loadTasks: async (): Promise<Task[]> => {
    try {
      const response = await customInstance.get<TaskResponse>('/task/load');

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '작업 목록 로드에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || '작업 목록 로드 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
  },
};
