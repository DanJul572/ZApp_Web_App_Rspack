import Add from '@mui/icons-material/Add';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Email from '@mui/icons-material/Email';
import EventRepeat from '@mui/icons-material/EventRepeat';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import Search from '@mui/icons-material/Search';
import SendOutlined from '@mui/icons-material/SendOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
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
import Confirm from '@/components/dialog/Confirm';
import ContentLoader from '@/components/loading/ContentLoader';
import EmptyState from '@/components/page/EmptyState';
import PageHeader from '@/components/page/PageHeader';
import SectionCard from '@/components/page/SectionCard';
import { useConfig } from '@/contexts/ConfigProvider';
import formatDateTime from '@/helpers/formatDateTime';
import Request from '@/hooks/Request';
import Toaster from '@/hooks/Toaster';
import getErrorMessage from './getErrorMessage';

// Matches `rowsPerPage` in the API table config.
const ROWS_PER_PAGE = 10;

const EmailViewPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const request = Request();
  const toaster = Toaster();
  const { config } = useConfig();

  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sendTarget, setSendTarget] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['emails', page, search],
    queryFn: async () => {
      const res = await request.get(config.api.email.rows, {
        page: page + 1,
        search,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    retry: 0,
  });

  useEffect(() => {
    if (isError) toaster.showErrorToast(getErrorMessage(error));
  }, [isError]);

  // Deleting the last row of a page leaves that page empty; step back one.
  useEffect(() => {
    if (page > 0 && data && data.rows.length === 0 && data.count > 0) {
      setPage(page - 1);
    }
  }, [data, page]);

  const deleteMutation = useMutation({
    mutationFn: (id) => request.post(config.api.email.delete, { id }),
    onSuccess: () => {
      toaster.showSuccessToast('Email template deleted');
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (err) => {
      toaster.showErrorToast(
        getErrorMessage(err, 'Failed to delete email template'),
      );
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id) => request.post(config.api.email.send, { id }),
    onSuccess: (res) => {
      toaster.showSuccessToast(`${res.message}. Track them in the Email Log.`);
    },
    onError: (err) => {
      toaster.showErrorToast(getErrorMessage(err, 'Failed to send the email'));
    },
  });

  const onCreate = () => navigate('/email/create');
  const onEdit = (id) => navigate(`/email/create?id=${id}`);

  const onConfirmDelete = (confirmed) => {
    if (confirmed) deleteMutation.mutate(deleteTarget.id);
    setDeleteTarget(null);
  };

  const onConfirmSend = (confirmed) => {
    if (confirmed) sendMutation.mutate(sendTarget.id);
    setSendTarget(null);
  };

  const rows = data?.rows ?? [];
  const count = data?.count ?? 0;
  const isEmpty = !isLoading && count === 0 && !search;

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
      {isEmpty ? (
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
      ) : (
        <SectionCard
          icon={<Email />}
          title="Templates"
          subtitle={`${count} template${count !== 1 ? 's' : ''}`}
          actions={
            <TextField
              placeholder="Search name, subject or recipient"
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
          {isLoading ? (
            <ContentLoader />
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Scheduler</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="textSecondary">
                            No templates match "{search}"
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {rows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.name}
                          </Typography>
                          {row.description && (
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              noWrap
                              sx={{ display: 'block' }}
                            >
                              {row.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{row.subject || '-'}</TableCell>
                        <TableCell>{row.to || '-'}</TableCell>
                        <TableCell>
                          {row.useScheduler ? (
                            <Chip
                              icon={<EventRepeat />}
                              label="Active"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          ) : (
                            <Chip label="Off" size="small" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(
                            row.updatedAt,
                            config.format.datetime.display,
                          )}
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="Send now">
                            <IconButton
                              size="small"
                              onClick={() => setSendTarget(row)}
                              disabled={sendMutation.isPending}
                              color="primary"
                            >
                              <SendOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(row.id)}
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteTarget(row)}
                              disabled={deleteMutation.isPending}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={ROWS_PER_PAGE}
                rowsPerPageOptions={[]}
              />
            </>
          )}
        </SectionCard>
      )}

      <Confirm
        open={!!deleteTarget}
        title="Delete email template"
        text={`"${deleteTarget?.name ?? ''}" and its sources, merge tags, schedule and attachments will be deleted. This cannot be undone.`}
        confirmButton="Delete"
        cancelButton="Cancel"
        onConfirm={onConfirmDelete}
      />

      <Confirm
        open={!!sendTarget}
        title="Send email now"
        text={`"${sendTarget?.name ?? ''}" will be sent to every record of its primary source. The emails are queued and their progress is shown in the Email Log.`}
        confirmButton="Send"
        cancelButton="Cancel"
        onConfirm={onConfirmSend}
      />
    </Box>
  );
};

export default EmailViewPage;
