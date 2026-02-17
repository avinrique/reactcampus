import api from '@/lib/axios';
import type { PaginatedResponse, ApiResponse } from '@/types/api';
import type { Course } from '@/types/course';

export const publicCourseApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<PaginatedResponse<Course>>('/public/courses', { params });
    return res.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<Course>>(`/public/courses/${slug}`);
    return res.data.data;
  },
};
