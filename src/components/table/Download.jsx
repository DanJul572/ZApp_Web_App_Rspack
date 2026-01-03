import FileDownload from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useConfig } from '@/contexts/ConfigProvider';
import { downloadFileFromBuffer } from '@/helpers/downloadFile';
import { extractFileNames } from '@/helpers/readFile';
import Request from '@/hooks/Request';

const Download = ({ label }) => {
  const request = Request();

  const { config } = useConfig();

  const onDownload = () => {
    request
      .get(config.api.file.download, { name: label })
      .then((res) => {
        const bufferFormat = new Uint8Array(res.data.data.data);
        downloadFileFromBuffer(
          bufferFormat,
          extractFileNames(label),
          res.data.type,
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box display="flex" alignItems="center">
      {label && (
        <IconButton onClick={onDownload}>
          <FileDownload />
        </IconButton>
      )}
      {extractFileNames(label)}
    </Box>
  );
};

export default Download;
