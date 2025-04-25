import { useSearchParams } from 'react-router';

const Parameter = () => {
  const [searchParams] = useSearchParams();

  const get = (name) => {
    return searchParams.get(name);
  };

  return { get };
};

export default Parameter;
