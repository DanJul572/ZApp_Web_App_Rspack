import { useMemo } from 'react';
import { useSetLoading } from '@/contexts/LoadingProvider';

export const createLoader = (setLoading) => ({
  hideLoading: () => setLoading(false),
  showLoading: () => setLoading(true),
});

const Loader = () => {
  const setLoading = useSetLoading();
  return useMemo(() => createLoader(setLoading), [setLoading]);
};

export default Loader;
