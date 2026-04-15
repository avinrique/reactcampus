import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/features/auth/services/authApi';
import { setAccessToken } from '@/lib/axios';
import { ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import axios from 'axios';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    // Try to restore session via refresh token cookie
    axios
      .post<{ data: { accessToken: string } }>(
        '/api/v1/auth/refresh',
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        setAccessToken(data.data.accessToken);
        return authApi.me();
      })
      .then((meData) => setAuth(meData.user, meData.permissions))
      .catch(() => {
        setAccessToken(null);
        setLoading(false);
      });
  }, [setAuth, setLoading]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
        <ToastContainer />
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;
