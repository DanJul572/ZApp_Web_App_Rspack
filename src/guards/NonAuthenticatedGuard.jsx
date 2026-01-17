import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '@/contexts/UserDataProvider';

const NonAuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();

  const { userData } = useUserData();

  useEffect(() => {
    if (userData) {
      navigate(userData.afterLogin, { replace: true });
    }
  }, [userData]);

  return <>{children}</>;
};

export default NonAuthenticatedGuard;
