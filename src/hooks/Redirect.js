import { useMemo } from 'react';
import { useNavigate } from 'react-router';

export const createRedirect = (navigate) => ({
  external: (path) => {
    window.location.href = path;
  },
  externalNewTab: (path) => window.open(path, '_blank'),
  internal: (path) => navigate(path),
  prev: () => navigate(-1),
});

const Redirect = () => {
  const navigate = useNavigate();
  return useMemo(() => createRedirect(navigate), [navigate]);
};

export default Redirect;
