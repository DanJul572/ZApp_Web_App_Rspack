import CModuleID from '@configs/CModuleID';
import CompareArrows from '@mui/icons-material/CompareArrows';
import History from '@mui/icons-material/History';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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

const actionColor = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'error',
};

const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

const Page = () => {
  const request = Request();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { config } = useConfig();
  const { setAlert } = useAlert();

  const [showUnchanged, setShowUnchanged] = useState(false);

  const id = searchParams.get('id');
  const datetimeFormat = config.format.datetime.display;

  const {
    data: audit,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['audit-trail-detail', id],
    queryFn: async () => {
      const body = { moduleId: CModuleID.auditTrail, rowId: id };
      const res = await request.get(config.api.common.detail, body);
      return res.data;
    },
    enabled: !!id,
    retry: 0,
  });

  // Columns of the audited module, used for field labels and field order.
  const { data: columns } = useQuery({
    queryKey: ['table-columns', audit?.moduleId],
    queryFn: () =>
      request.get(config.api.common.columns, { id: audit.moduleId }),
    enabled: !!audit?.moduleId,
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

  const onBack = () => navigate('/audit-trail');

  if (!audit) {
    return (
      <Box>
        <PageHeader icon={<History />} title="Audit Trail" onBack={onBack} />
        <EmptyState
          icon={<History />}
          title="Audit record not found"
          description="It may have been removed by the log retention cleanup."
        />
      </Box>
    );
  }

  const fieldOrder = (columns?.data || []).map((column) => column.accessorKey);
  const fieldLabels = Object.fromEntries(
    (columns?.data || []).map((column) => [column.accessorKey, column.header]),
  );

  const sortByFieldOrder = (rows) => {
    const position = (field) => {
      const index = fieldOrder.indexOf(field);
      return index === -1 ? fieldOrder.length : index;
    };
    return [...rows].sort((a, b) => position(a.field) - position(b.field));
  };

  const isUpdate = audit.action === 'UPDATE';
  const changes = audit.changes || [];
  const changedFields = changes.map((change) => change.field);

  const getRows = () => {
    if (isUpdate && !showUnchanged) {
      return sortByFieldOrder(changes.map((c) => ({ ...c, changed: true })));
    }

    if (isUpdate) {
      const fields = new Set([
        ...Object.keys(audit.oldData || {}),
        ...Object.keys(audit.newData || {}),
      ]);
      return sortByFieldOrder(
        [...fields].map((field) => ({
          field,
          oldValue: audit.oldData?.[field],
          newValue: audit.newData?.[field],
          changed: changedFields.includes(field),
        })),
      );
    }

    const snapshot = audit.newData || audit.oldData || {};
    return sortByFieldOrder(
      Object.entries(snapshot).map(([field, value]) => ({
        field,
        newValue: value,
      })),
    );
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return (
        <Typography variant="body2" color="textDisabled">
          —
        </Typography>
      );
    }

    if (typeof value === 'object') {
      return (
        <CodeBlock maxHeight={240} sx={{ p: 1, borderRadius: 1 }}>
          {JSON.stringify(value, null, 2)}
        </CodeBlock>
      );
    }

    if (typeof value === 'string' && isoDateTimePattern.test(value)) {
      return formatDateTime(value, datetimeFormat);
    }

    return String(value);
  };

  const highlight = (row, paletteKey) => (theme) =>
    row.changed
      ? { backgroundColor: alpha(theme.palette[paletteKey].main, 0.08) }
      : {};

  const rows = getRows();

  const valueHeader = audit.action === 'DELETE' ? 'Deleted Value' : 'Value';

  const information = [
    {
      label: 'Action',
      value: (
        <Chip
          size="small"
          label={audit.action}
          color={actionColor[audit.action] || 'default'}
          variant="outlined"
        />
      ),
    },
    { label: 'Module', value: audit.moduleName },
    { label: 'Row ID', value: audit.rowId },
    { label: 'User', value: audit.userName },
    { label: 'Time', value: formatDateTime(audit.createdAt, datetimeFormat) },
    { label: 'IP Address', value: audit.ipAddress },
    { label: 'User Agent', value: audit.userAgent, fullWidth: true },
  ];

  return (
    <Box>
      <PageHeader
        icon={<History />}
        title={`Audit Trail #${audit.id}`}
        subtitle={`${audit.moduleName} · Row ${audit.rowId}`}
        onBack={onBack}
      />

      <SectionCard icon={<InfoOutlined />} title="Information">
        <DetailList items={information} />
      </SectionCard>

      <SectionCard
        icon={<CompareArrows />}
        title={isUpdate ? 'Changes' : 'Data'}
        subtitle={
          isUpdate
            ? `${changes.length} field(s) changed`
            : `Row data at the time of ${audit.action.toLowerCase()}`
        }
        disablePadding
        actions={
          isUpdate && (
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={showUnchanged}
                  onChange={(event) => setShowUnchanged(event.target.checked)}
                />
              }
              label={
                <Typography variant="body2">Show unchanged fields</Typography>
              }
            />
          )
        }
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '24%' }}>Field</TableCell>
                {isUpdate ? (
                  <>
                    <TableCell sx={{ width: '38%' }}>Before</TableCell>
                    <TableCell sx={{ width: '38%' }}>After</TableCell>
                  </>
                ) : (
                  <TableCell>{valueHeader}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.field} sx={{ verticalAlign: 'top' }}>
                  <TableCell>
                    <Typography variant="body2">
                      {fieldLabels[row.field] || row.field}
                    </Typography>
                    {fieldLabels[row.field] && (
                      <Typography variant="caption" color="textSecondary">
                        {row.field}
                      </Typography>
                    )}
                  </TableCell>
                  {isUpdate && (
                    <TableCell sx={highlight(row, 'error')}>
                      {formatValue(row.oldValue)}
                    </TableCell>
                  )}
                  <TableCell sx={isUpdate ? highlight(row, 'success') : {}}>
                    {formatValue(row.newValue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </SectionCard>
    </Box>
  );
};

export default Page;
