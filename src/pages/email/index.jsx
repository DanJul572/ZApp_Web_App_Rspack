import Add from '@mui/icons-material/Add';
import Email from '@mui/icons-material/Email';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import EmptyState from '@/components/page/EmptyState';
import PageHeader from '@/components/page/PageHeader';
import SectionCard from '@/components/page/SectionCard';

const EmailViewPage = () => {
  const navigate = useNavigate();

  const onCreate = () => navigate('/email/create');

  return (
    <Box>
      <PageHeader
        icon={<Email />}
        title="Email Templates"
        subtitle="Design data-driven emails and schedule their delivery"
        actions={
          <Button variant="contained" startIcon={<Add />} onClick={onCreate}>
            Create Email
          </Button>
        }
      />
      <SectionCard>
        <EmptyState
          icon={<MarkEmailRead />}
          title="No email templates to show"
          description="Create a template with the email builder to get started."
          action={
            <Button variant="outlined" startIcon={<Add />} onClick={onCreate}>
              Create Email
            </Button>
          }
        />
      </SectionCard>
    </Box>
  );
};

export default EmailViewPage;
