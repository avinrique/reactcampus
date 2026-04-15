import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { queryKeys } from '@/config/queryKeys';
import { useAuthStore } from '@/stores/authStore';

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
    retry: false,
  });
}
