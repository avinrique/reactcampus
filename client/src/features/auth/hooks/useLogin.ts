import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/useToast';
import { setAccessToken } from '@/lib/axios';
import type { LoginRequest } from '@/types/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const toast = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      const meData = await authApi.me();
      setAuth(meData.user, meData.permissions);
      toast.success('Login successful');
      navigate('/admin');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
}
