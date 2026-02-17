import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { publicFormApi } from '../services/publicFormApi';

export function usePublicForm(slug: string) {
  return useQuery({
    queryKey: queryKeys.public.forms.detail(slug),
    queryFn: () => publicFormApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useSubmitForm(slug: string) {
  return useMutation({
    mutationFn: (data: Record<string, any>) => publicFormApi.submit(slug, data),
  });
}
