import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Dropdown from '@/components/input/Dropdown';
import File from '@/components/input/File';
import CFieldID from '@/configs/CFieldID';
import { useConfig } from '@/contexts/ConfigProvider';
import { useFile } from '@/contexts/FileProvider';
import Alert from '@/hooks/Alert';
import Request from '@/hooks/Request';

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Dropdown
        label="Module"
        id={CFieldID.files.moduleId}
        onChange={onModuleChange}
        value={moduleId}
      />
      <File label="Excel File" onChange={onFileChange} name={fileName} />
      <Button
        onClick={onSubmit}
        type="button"
        variant="contained"
        disabled={mutation.isPending}
        loading={mutation.isPending}
      >
        Save
      </Button>
    </Box>
  );
};

export default UploadPage;
