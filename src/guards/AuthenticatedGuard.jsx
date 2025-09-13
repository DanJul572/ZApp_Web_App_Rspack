import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

const AuthenticatedGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate, location]);

  return <>{children}</>;
};

export default AuthenticatedGuard;
