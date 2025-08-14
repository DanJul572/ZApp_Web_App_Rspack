import { useLoading } from '@/contextss/LoadingProvider';

const Loader = () => {
  const { setLoading } = useLoading();

  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  return {
    hideLoading,
    showLoading,
  };
};

export default Loader;
