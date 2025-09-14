import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import getUserData from '@/helpers/getUserData';

const NonAuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      navigate(userData.afterLogin, { replace: true });
    }
  }, [navigate, location]);

  return <>{children}</>;
};

export default NonAuthenticatedGuard;
