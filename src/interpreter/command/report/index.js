import { useJSReport } from '@/contexts/JSReport';

const Report = () => {
  const { open, download, loading } = useJSReport();
  return {
    open: open,
    download: download,
    loading: loading,
  };
};

export default Report;
