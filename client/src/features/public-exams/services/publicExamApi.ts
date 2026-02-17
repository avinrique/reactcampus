import api from '@/lib/axios';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { Exam } from '@/types/exam';

export const publicExamApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Exam>>('/public/exams', { params });
    return res.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<Exam>>(`/public/exams/${slug}`);
    return res.data.data;
  },
};
