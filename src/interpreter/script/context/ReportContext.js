import { useJSReport } from '@/contexts/JSReport';

/**
 * Diekspos ke script user sebagai `zreport`.
 */
const ReportContext = () => {
  const { open, download, loading } = useJSReport();
  return { open, download, loading };
};

export default ReportContext;
