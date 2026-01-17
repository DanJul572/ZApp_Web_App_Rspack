import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '@/contexts/UserDataProvider';

const AuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();

  const { userData } = useUserData();

  useEffect(() => {
    if (!userData) {
      navigate('/login', { replace: true });
    }
  }, [userData]);

  return <>{children}</>;
};

export default AuthenticatedGuard;
