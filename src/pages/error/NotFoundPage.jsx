import TravelExplore from '@mui/icons-material/TravelExplore';
import StatusPage from '@/components/page/StatusPage';

const NotFoundPage = () => {
  return (
    <StatusPage
      code="404"
      icon={<TravelExplore />}
      title="Oops! The page you are looking for was not found."
      description="It seems this page is unavailable or may have been moved."
    />
  );
};

export default NotFoundPage;
