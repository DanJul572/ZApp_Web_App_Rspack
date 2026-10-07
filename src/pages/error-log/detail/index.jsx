import CModuleID from '@configs/CModuleID';
import BugReport from '@mui/icons-material/BugReportOutlined';
import DataObject from '@mui/icons-material/DataObject';
import ErrorOutline from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import ContentLoader from '@/components/loading/ContentLoader';
import CodeBlock from '@/components/page/CodeBlock';
import DetailList from '@/components/page/DetailList';
import EmptyState from '@/components/page/EmptyState';
import PageHeader from '@/components/page/PageHeader';
import SectionCard from '@/components/page/SectionCard';
import { useAlert } from '@/contexts/AlertProvider';
import { useConfig } from '@/contexts/ConfigProvider';
import formatDateTime from '@/helpers/formatDateTime';
import Request from '@/hooks/Request';

const Page = () => {
  const request = Request();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { config } = useConfig();
  const { setAlert } = useAlert();

  const id = searchParams.get('id');

  const {
    data: log,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['error-log-detail', id],
    queryFn: async () => {
      const body = { moduleId: CModuleID.logError, rowId: id };
      const res = await request.get(config.api.common.detail, body);
      return res.data;
    },
    enabled: !!id,
    retry: 0,
  });

  useEffect(() => {
    if (isError) {
      setAlert({ status: true, type: 'error', message: error });
    }
  }, [isError]);

  if (isLoading) {
    return <ContentLoader />;
  }

  const onBack = () => navigate('/error-log');

  if (!log) {
    return (
      <Box>
        <PageHeader icon={<BugReport />} title="Error Log" onBack={onBack} />
        <EmptyState
          icon={<BugReport />}
          title="Error log not found"
          description="It may have been removed by the log retention cleanup."
        />
      </Box>
    );
  }

  const information = [
    { label: 'Method', value: log.method },
    { label: 'Status Code', value: log.statusCode },
    {
      label: 'Time',
      value: formatDateTime(log.createdAt, config.format.datetime.display),
    },
    { label: 'URL', value: log.url, fullWidth: true },
    { label: 'User', value: log.userName },
    { label: 'IP Address', value: log.ipAddress },
  ];

  return (
    <Box>
      <PageHeader
        icon={<BugReport />}
        title={`Error Log #${log.id}`}
        subtitle={`${log.method} ${log.url}`}
        onBack={onBack}
      />

      <SectionCard icon={<InfoOutlined />} title="Request">
        <DetailList items={information} />
      </SectionCard>

      <SectionCard icon={<ErrorOutline />} title="Message">
        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
          {log.message}
        </Typography>
      </SectionCard>

      <SectionCard
        icon={<ErrorOutline />}
        title="Stack Trace"
        subtitle={log.stack ? null : 'Not recorded for this error'}
        disablePadding
      >
        {log.stack && <CodeBlock>{log.stack}</CodeBlock>}
      </SectionCard>

      <SectionCard
        icon={<DataObject />}
        title="Request Body"
        subtitle="Passwords, tokens and secrets are masked"
        disablePadding
      >
        {log.requestBody ? (
          <CodeBlock>{JSON.stringify(log.requestBody, null, 2)}</CodeBlock>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ p: 3 }}>
            No request body
          </Typography>
        )}
      </SectionCard>
    </Box>
  );
};

export default Page;
