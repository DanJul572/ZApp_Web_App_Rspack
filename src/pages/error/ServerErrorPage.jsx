import ReportProblem from '@mui/icons-material/ReportProblem';
import StatusPage from '@/components/page/StatusPage';

const ServerErrorPage = () => {
  return (
    <StatusPage
      code="500"
      color="error"
      icon={<ReportProblem />}
      title="Internal Server Error"
      description="Something went wrong on our server. We are working to fix it. Please try again later."
    />
  );
};

export default ServerErrorPage;
