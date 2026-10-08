import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import Replay from '@mui/icons-material/Replay';
import Search from '@mui/icons-material/Search';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ContentLoader from '@/components/loading/ContentLoader';
import PageHeader from '@/components/page/PageHeader';
import SectionCard from '@/components/page/SectionCard';
import { useConfig } from '@/contexts/ConfigProvider';
import formatDateTime from '@/helpers/formatDateTime';
import Request from '@/hooks/Request';
import Toaster from '@/hooks/Toaster';
import getErrorMessage from '@/pages/email/getErrorMessage';
import { EMAIL_STATUS, EMAIL_TRIGGER, REFRESH_INTERVAL_MS } from './constants';
import StatusChip from './StatusChip';

// Matches `rowsPerPage` in the API table config.
const ROWS_PER_PAGE = 10;

const TABS = [
  { value: '', label: 'All', countKey: 'all' },
  ...Object.values(EMAIL_STATUS).map((status) => ({
    value: status.value,
    label: status.label,
    countKey: status.value,
  })),
];

const Page = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const request = Request();
  const toaster = Toaster();
  const { config } = useConfig();

  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['email-executions', status, page, search],
    queryFn: async () => {
      const res = await request.get(config.api.email.executions, {
        page: page + 1,
        status,
        search,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      query.state.data?.counts?.onQueue > 0 ? REFRESH_INTERVAL_MS : false,
    retry: 0,
  });

  useEffect(() => {
    if (isError) toaster.showErrorToast(getErrorMessage(error));
  }, [isError]);

  const retryMutation = useMutation({
    mutationFn: (id) => request.post(config.api.email.retry, { id }),
    onSuccess: () => {
      toaster.showSuccessToast('Email queued again');
      queryClient.invalidateQueries({ queryKey: ['email-executions'] });
    },
    onError: (err) => {
      toaster.showErrorToast(getErrorMessage(err, 'Failed to retry the email'));
    },
  });

  const onChangeTab = (_, value) => {
    setStatus(value);
    setPage(0);
  };

  const onDetail = (id) => navigate(`/email-log/detail?id=${id}`);

  const rows = data?.rows ?? [];
  const counts = data?.counts ?? {};

  return (
    <Box>
      <PageHeader
        icon={<MarkEmailRead />}
        title="Email Log"
        subtitle="Every email built from a template, from queue to delivery"
      />
      <SectionCard
        title="Emails"
        subtitle={
          counts.onQueue > 0
            ? `${counts.onQueue} on queue, refreshing automatically`
            : null
        }
        actions={
          <TextField
            placeholder="Search template, recipient or subject"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ width: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        }
        disablePadding
      >
        <Tabs
          value={status}
          onChange={onChangeTab}
          sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.countKey}
              value={tab.value}
              label={`${tab.label} (${counts[tab.countKey] ?? 0})`}
              sx={{ minHeight: 44, fontSize: 13 }}
            />
          ))}
        </Tabs>

        {isLoading ? (
          <ContentLoader />
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Template</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Trigger</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Sent</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          No emails to show
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.id}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>
                          {row.emailName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <Typography variant="body2" noWrap>
                          {row.to || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 240 }}>
                        <Typography variant="body2" noWrap>
                          {row.subject || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {EMAIL_TRIGGER[row.trigger] ?? row.trigger}
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          status={row.status}
                          errorMessage={row.errorMessage}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {formatDateTime(
                          row.createdAt,
                          config.format.datetime.display,
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {formatDateTime(
                          row.sentAt,
                          config.format.datetime.display,
                        ) ?? '-'}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title="Detail">
                          <IconButton
                            size="small"
                            onClick={() => onDetail(row.id)}
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {row.status !== EMAIL_STATUS.success.value &&
                          row.to && (
                            <Tooltip title="Send again">
                              <IconButton
                                size="small"
                                onClick={() => retryMutation.mutate(row.id)}
                                disabled={retryMutation.isPending}
                              >
                                <Replay fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data?.count ?? 0}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={ROWS_PER_PAGE}
              rowsPerPageOptions={[]}
            />
          </>
        )}
      </SectionCard>
    </Box>
  );
};

export default Page;
