import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const AuthContainer = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
    } else {
      navigate('/module', { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthContainer;
