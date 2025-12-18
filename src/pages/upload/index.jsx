import Archive from '@mui/icons-material/Archive';
import Dataset from '@mui/icons-material/Dataset';
import Description from '@mui/icons-material/Description';
import Save from '@mui/icons-material/Save';
import Upload from '@mui/icons-material/Upload';
import ViewColumn from '@mui/icons-material/ViewColumn';
import Visibility from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Papa from 'papaparse';
import { useMemo, useState } from 'react';
import Alert from '@/hooks/Alert';

export default function UploadPage() {
  const alert = Alert();

  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const MAX_PREVIEW = 1000;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRows([]);
    setColumns([]);
    setLoading(true);
    setFile(file);

    let isFirstRow = true;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      step: (result, _parser) => {
        if (isFirstRow) {
          setColumns(result.meta.fields || []);
          isFirstRow = false;
        }
        setRows((prev) => {
          if (prev.length < MAX_PREVIEW) {
            return [...prev, result.data];
          }
          return prev;
        });
      },
      complete: () => {
        setLoading(false);
      },
      error: (err) => {
        alert.showErrorAlert(err.toString());
        setLoading(false);
      },
    });
  };

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    } else if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else if (kb >= 1) {
      return `${kb.toFixed(2)} KB`;
    } else {
      return `${bytes.toFixed(2)} Bytes`;
    }
  }

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    console.log('formData', formData);

    alert.showSuccessAlert('Success.');
  };

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, search]);

  return (
    <Box>
      <Typography fontSize={20} fontWeight="bold">
        Upload CSV
      </Typography>
      <Box sx={{ marginBlock: 2 }}>
        {file && (
          <Stack direction="row" spacing={4}>
            <Typography variant="caption" color="text.secondary">
              <Description
                sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }}
              />
              File: {file.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <Archive
                sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }}
              />
              Size: {formatFileSize(file.size)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <Dataset
                sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }}
              />
              Rows: {rows.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <Visibility
                sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }}
              />
              Preview: {rows.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <ViewColumn
                sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }}
              />
              Columns: {columns.length}
            </Typography>
          </Stack>
        )}
      </Box>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <TextField
              placeholder="Search..."
              size="small"
              value={search}
              disabled={rows.length <= 0}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Box>
            <IconButton
              variant="contained"
              component="label"
              disabled={loading}
              loading={loading}
            >
              <Upload />
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileChange}
              />
            </IconButton>
            <IconButton
              variant="contained"
              color="primary"
              disabled={!file}
              onClick={handleUpload}
            >
              <Save />
            </IconButton>
          </Box>
        </Stack>
        {rows.length <= 0 && (
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No data to display.
            </Typography>
          </Box>
        )}
        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => {
                const rowKey = Object.values(row).join('|');
                return (
                  <TableRow key={rowKey}>
                    {columns.map((col) => (
                      <TableCell key={col}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
