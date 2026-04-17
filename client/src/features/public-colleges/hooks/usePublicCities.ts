import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { publicCityApi } from '../services/publicCityApi';

export function usePublicCities(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: queryKeys.public.cities.list(params),
    queryFn: () => publicCityApi.list(params),
  });
}
