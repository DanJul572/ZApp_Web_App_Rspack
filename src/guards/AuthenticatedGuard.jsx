import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import FullAppLoader from '@/components/loading/FullAppLoader';
import { useAuth } from '@/contexts/AuthProvider';
import { useUserData } from '@/contexts/UserDataProvider';

const AuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();

  const { userData } = useUserData();
  const { isAuthChecked } = useAuth();

  useEffect(() => {
    if (isAuthChecked && !userData) {
      navigate('/login', { replace: true });
    }
  }, [isAuthChecked, userData]);

  if (!isAuthChecked) {
    return <FullAppLoader />;
  }

  if (!userData) {
    return null;
  }

  return <>{children}</>;
};

export default AuthenticatedGuard;
