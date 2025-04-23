import { useSearchParams } from 'react-router-dom';

const Parameter = () => {
  const searchParams = useSearchParams();

  const get = (name) => {
    return searchParams.get(name);
  };

  return { get };
};

export default Parameter;
