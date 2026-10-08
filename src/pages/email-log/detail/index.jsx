import ErrorOutline from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import Preview from '@mui/icons-material/Preview';
import Replay from '@mui/icons-material/Replay';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import ContentLoader from '@/components/loading/ContentLoader';
import DetailList from '@/components/page/DetailList';
import EmptyState from '@/components/page/EmptyState';
import PageHeader from '@/components/page/PageHeader';
import SectionCard from '@/components/page/SectionCard';
import { useConfig } from '@/contexts/ConfigProvider';
import formatDateTime from '@/helpers/formatDateTime';
import Request from '@/hooks/Request';
import Toaster from '@/hooks/Toaster';
import getErrorMessage from '@/pages/email/getErrorMessage';
import { EMAIL_STATUS, EMAIL_TRIGGER, REFRESH_INTERVAL_MS } from '../constants';
import StatusChip from '../StatusChip';

const Page = () => {
  const request = Request();
  const toaster = Toaster();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { config } = useConfig();

  const id = searchParams.get('id');

  const {
    data: log,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['email-execution', id],
    queryFn: async () => {
      const res = await request.get(config.api.email.execution, { id });
      return res.data;
    },
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status === EMAIL_STATUS.onQueue.value
        ? REFRESH_INTERVAL_MS
        : false,
    retry: 0,
  });

  useEffect(() => {
    if (isError) toaster.showErrorToast(getErrorMessage(error));
  }, [isError]);

  const retryMutation = useMutation({
    mutationFn: () => request.post(config.api.email.retry, { id: Number(id) }),
    onSuccess: () => {
      toaster.showSuccessToast('Email queued again');
      queryClient.invalidateQueries({ queryKey: ['email-execution', id] });
      queryClient.invalidateQueries({ queryKey: ['email-executions'] });
    },
    onError: (err) => {
      toaster.showErrorToast(getErrorMessage(err, 'Failed to retry the email'));
    },
  });

  if (isLoading) {
    return <ContentLoader />;
  }

  const onBack = () => navigate('/email-log');

  if (!log) {
    return (
      <Box>
        <PageHeader
          icon={<MarkEmailRead />}
          title="Email Log"
          onBack={onBack}
        />
        <EmptyState icon={<MarkEmailRead />} title="Email log not found" />
      </Box>
    );
  }

  const formatTime = (value) =>
    formatDateTime(value, config.format.datetime.display);

  const information = [
    {
      label: 'Status',
      value: <StatusChip status={log.status} />,
    },
    { label: 'Template', value: log.emailName },
    { label: 'Trigger', value: EMAIL_TRIGGER[log.trigger] ?? log.trigger },
    { label: 'To', value: log.to, fullWidth: true },
    { label: 'CC', value: log.cc, fullWidth: true },
    { label: 'BCC', value: log.bcc, fullWidth: true },
    { label: 'Subject', value: log.subject, fullWidth: true },
    { label: 'Priority', value: log.priority },
    { label: 'Attempts', value: log.attempts },
    { label: 'Batch', value: log.batchId },
    { label: 'Created', value: formatTime(log.createdAt) },
    { label: 'Sent', value: formatTime(log.sentAt) },
    { label: 'Last Updated', value: formatTime(log.updatedAt) },
  ];

  const canRetry = log.status !== EMAIL_STATUS.success.value && !!log.to;

  return (
    <Box>
      <PageHeader
        icon={<MarkEmailRead />}
        title={`Email #${log.id}`}
        subtitle={log.subject || log.emailName}
        onBack={onBack}
        actions={
          canRetry && (
            <Button
              variant="outlined"
              startIcon={<Replay />}
              onClick={() => retryMutation.mutate()}
              loading={retryMutation.isPending}
            >
              Send Again
            </Button>
          )
        }
      />

      <SectionCard icon={<InfoOutlined />} title="Email">
        <DetailList items={information} />
      </SectionCard>

      {log.errorMessage && (
        <SectionCard icon={<ErrorOutline />} title="Error">
          <Typography
            variant="body2"
            color="error"
            sx={{ wordBreak: 'break-word' }}
          >
            {log.errorMessage}
          </Typography>
        </SectionCard>
      )}

      <SectionCard
        icon={<Preview />}
        title="Body"
        subtitle="Exactly as it is sent, with the merge tags replaced"
        disablePadding
      >
        {log.body ? (
          <iframe
            title="email-body"
            srcDoc={log.body}
            sandbox=""
            style={{
              width: '100%',
              minHeight: '60vh',
              border: 'none',
              display: 'block',
              backgroundColor: '#ffffff',
            }}
          />
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ p: 3 }}>
            No body
          </Typography>
        )}
      </SectionCard>
    </Box>
  );
};

export default Page;
