import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { clearLocalStorage } from '@/helpers/clearLocalStorage';
import Request from '@/hooks/Request';
import { useConfig } from './ConfigProvider';
import { useUserData } from './UserDataProvider';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const { setUserData } = useUserData(null);
  const { config } = useConfig();

  // False until the first session check against the API has finished, so the
  // guards don't treat "not fetched yet" as "not logged in" on a page refresh.
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const { get } = Request();

  const {
    data: userResponse,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => get(config.api.auth.me),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useMutation({
    mutationFn: () => get(config.api.auth.logout),
    mutationKey: ['auth-logout'],
    onSuccess: () => {
      setUserData(null);
      clearLocalStorage();
      navigate('/login', { replace: true });
    },
  });

  const isReady = !isLoading && !isFetching;

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (userResponse) {
      setUserData(userResponse.data);
    }

    setIsAuthChecked(true);
  }, [userResponse, isReady]);

  const value = {
    isLoading,
    isReady,
    isAuthChecked,
    logout,
    refetch,
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
