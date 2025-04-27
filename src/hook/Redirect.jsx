import { useNavigate } from 'react-router';

const Redirect = () => {
  const navigate = useNavigate();

  const internal = (path) => {
    return navigate(path);
  };

  const external = (path) => {
    window.location.href = path;
  };

  const externalNewTab = (path) => {
    return window.open(path, '_blank');
  };

  const prev = () => {
    return navigate(-1);
  };

  return {
    external,
    externalNewTab,
    internal,
    prev,
  };
};

export default Redirect;
