import { useSearchParams } from 'react-router';
import { readState } from '@/helpers/createStore';

/** API query string di atas store berisi URLSearchParams. */
export const createParameter = (store, read = readState) => ({
  get: (name) => read(store, (searchParams) => searchParams.get(name)),
});

const Parameter = () => {
  const [searchParams] = useSearchParams();

  const get = (name) => {
    return searchParams.get(name);
  };

  return { get };
};

export default Parameter;
