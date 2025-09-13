import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import decodeToken from '@/helpers/decodeToken';

const NonAuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenDecoded = decodeToken(token);
      console.log(tokenDecoded);
      navigate(tokenDecoded.afterLogin, { replace: true });
    }
  }, [navigate, location]);

  return <>{children}</>;
};

export default NonAuthenticatedGuard;
