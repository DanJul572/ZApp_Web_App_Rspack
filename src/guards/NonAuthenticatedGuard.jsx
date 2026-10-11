import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import FullAppLoader from '@/components/loading/FullAppLoader';
import { useAuth } from '@/contexts/AuthProvider';
import { useUserData } from '@/contexts/UserDataProvider';

const NonAuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();

  const { userData } = useUserData();
  const { isAuthChecked } = useAuth();

  useEffect(() => {
    if (userData) {
      navigate(userData.afterLogin, { replace: true });
    }
  }, [userData]);

  if (!isAuthChecked) {
    return <FullAppLoader />;
  }

  return <>{children}</>;
};

export default NonAuthenticatedGuard;
