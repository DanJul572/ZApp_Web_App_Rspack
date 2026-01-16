import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthProvider';

const AuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();

  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!user && isReady) {
      navigate('/login', { replace: true });
    }
  }, [user, isReady]);

  return <>{children}</>;
};

export default AuthenticatedGuard;
