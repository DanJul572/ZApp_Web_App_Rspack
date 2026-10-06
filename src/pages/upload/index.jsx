import CloudUpload from '@mui/icons-material/CloudUpload';
import TableView from '@mui/icons-material/TableView';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Dropdown from '@/components/input/Dropdown';
import File from '@/components/input/File';
import PageHeader from '@/components/page/PageHeader';
import SectionCard from '@/components/page/SectionCard';
import CFieldID from '@/configs/CFieldID';
import { useConfig } from '@/contexts/ConfigProvider';
import { useFile } from '@/contexts/FileProvider';
import Alert from '@/hooks/Alert';
import Request from '@/hooks/Request';

const Step = ({ number, title, children }) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Box
      sx={{
        width: 28,
        height: 28,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 700,
        color: 'primary.main',
        backgroundColor: 'primary.100',
      }}
    >
      {number}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, lineHeight: '28px' }}>
        {title}
      </Typography>
      {children}
    </Box>
  </Box>
);

const UploadPage = () => {
  const alert = Alert();
  const request = Request();

  const { config } = useConfig();
  const { file, setFile } = useFile();

  const [moduleId, setModuleId] = useState();
  const [fileName, setFileName] = useState();

  const upload = () => {
    const url = `${config.api.import.excel}?id=${moduleId}`;
    return request.post(url, null, file);
  };

  const mutation = useMutation({
    mutationFn: upload,
    mutationKey: ['upload-data', moduleId],
    onSuccess: (res) => {
      setFile([]);
      alert.showSuccessAlert(res.message);
    },
    onError: (err) => {
      alert.showErrorAlert(err.message);
    },
  });

  const onFileChange = (value) => {
    setFileName(value);
  };

  const onModuleChange = (value) => {
    setModuleId(value);
  };

  const onSubmit = () => {
    mutation.mutate();
  };

  return (
    <Box>
      <PageHeader
        icon={<CloudUpload />}
        title="Import Data"
        subtitle="Upload an Excel file to insert rows into a module"
      />
      <Box sx={{ maxWidth: 760 }}>
        <SectionCard
          icon={<TableView />}
          title="Import Settings"
          subtitle="Choose the target module, then pick the Excel file"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Step number={1} title="Select the target module">
              <Dropdown
                label="Module"
                id={CFieldID.files.moduleId}
                onChange={onModuleChange}
                value={moduleId}
              />
            </Step>
            <Step number={2} title="Upload the Excel file">
              <File
                label="Excel File"
                onChange={onFileChange}
                name={fileName}
              />
            </Step>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 3,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              onClick={onSubmit}
              type="button"
              variant="contained"
              startIcon={<CloudUpload />}
              disabled={mutation.isPending}
              loading={mutation.isPending}
            >
              Import
            </Button>
          </Box>
        </SectionCard>
      </Box>
    </Box>
  );
};

export default UploadPage;
