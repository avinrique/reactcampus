import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { DynamicForm, FormSubmission } from '@/types/form';

export const publicFormApi = {
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<DynamicForm>>(`/public/forms/${slug}`);
    return res.data.data;
  },
  submit: async (slug: string, data: Record<string, any>) => {
    const res = await api.post<ApiResponse<FormSubmission>>(`/public/forms/${slug}/submit`, data);
    return res.data.data;
  },
};
