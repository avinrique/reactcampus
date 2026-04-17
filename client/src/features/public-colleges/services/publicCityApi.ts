import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { City } from '@/types/city';

export const publicCityApi = {
  list: async (params: Record<string, any> = {}) => {
    const res = await api.get<ApiResponse<City[]>>('/public/cities', { params });
    return res.data.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse<City>>(`/public/cities/${slug}`);
    return res.data.data;
  },
};
