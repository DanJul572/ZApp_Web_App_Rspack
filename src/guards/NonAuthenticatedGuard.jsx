import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthProvider';

const NonAuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();

  const { user, isReady } = useAuth();

  useEffect(() => {
    if (user && !isReady) {
      navigate(user.afterLogin, { replace: true });
    }
  }, [user, isReady]);

  return <>{children}</>;
};

export default NonAuthenticatedGuard;
