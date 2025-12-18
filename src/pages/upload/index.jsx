import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
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

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const MAX_PREVIEW = 1000;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRows([]);
    setColumns([]);
    setTotalRows(0);
    setLoading(true);
    setFile(file);

    let isFirstRow = true;
    let rowCounter = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      step: (result, _parser) => {
        rowCounter++;
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
        setTotalRows(rowCounter);
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        setLoading(false);
      },
    });
  };

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, search]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/import-csv', {
      method: 'POST',
      body: formData,
    });

    alert('File berhasil dikirim ke backend & diproses background');
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight="bold">
              Import CSV Data
            </Typography>
            <Button
              variant="contained"
              component="label"
              disabled={totalRows > 0}
            >
              Pilih File CSV
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileChange}
              />
            </Button>
            {file && (
              <Stack direction="row" spacing={4}>
                <Typography>📄 Nama File: {file.name}</Typography>
                <Typography>
                  📦 Ukuran: {(file.size / 1024 / 1024).toFixed(4)} MB
                </Typography>
                <Typography>📊 Total Data: {totalRows}</Typography>
                <Typography>👁 Preview: {rows.length}</Typography>
                <Typography>📐 Kolom: {columns.length}</Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <TextField
                label="Search data"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                variant="contained"
                color="success"
                disabled={!file}
                onClick={handleUpload}
              >
                Kirim ke Backend
              </Button>
            </Stack>
            {loading && <CircularProgress />}
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
                  {filteredRows.map((row) => (
                    <TableRow key={row[columns[0]]}>
                      {columns.map((col) => (
                        <TableCell key={col}>{row[col]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" color="text.secondary">
              * Hanya menampilkan {MAX_PREVIEW} baris pertama untuk preview
              (lazy load)
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
