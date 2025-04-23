import { useRouter } from 'react-router-dom';

const Redirect = () => {
  const { push, back } = useRouter();

  const internal = (path) => {
    return push(path);
  };

  const external = (path) => {
    return (window.location.href = path);
  };

  const externalNewTab = (path) => {
    return window.open(path, '_blank');
  };

  const prev = () => {
    return back();
  };

  return {
    external,
    externalNewTab,
    internal,
    prev,
  };
};

export default Redirect;
