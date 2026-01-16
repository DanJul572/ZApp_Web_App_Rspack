import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { clearLocalStorage } from '@/helpers/clearLocalStorage';
import Request from '@/hooks/Request';
import { useConfig } from './ConfigProvider';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { config } = useConfig();

  const { get } = Request();

  const {
    data: userResponse,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => get(config.api.auth.me),
  });

  const logout = useMutation({
    mutationFn: () => get(config.api.auth.logout),
    mutationKey: ['auth-logout'],
    onSuccess: () => {
      setUser(null);
      clearLocalStorage();
      navigate('/login', { replace: true });
    },
  });

  const isReady = !isLoading && !isFetching;

  useEffect(() => {
    if (userResponse && isReady) {
      setUser(userResponse.data);
    }
  }, [userResponse, isReady]);

  const value = {
    isAuthenticated: !!user,
    isLoading,
    isReady,
    logout,
    refetch,
    setUser,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
