import FileDownload from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CApiUrl from '@/constantss/CApiUrl';
import CTheme from '@/constantss/CTheme';
import { downloadFileFromBuffer } from '@/helperss/downloadFile';
import { extractFileNames } from '@/helperss/readFile';
import Request from '@/hooks/Request';

const Download = ({ label }) => {
  const { get } = Request();

  const onDownload = () => {
    get(CApiUrl.file.download, { name: label })
      .then((res) => {
        const bufferFormat = new Uint8Array(res.data.data);
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
        <IconButton onClick={onDownload} size={CTheme.button.size.name}>
          <FileDownload />
        </IconButton>
      )}
      {extractFileNames(label)}
    </Box>
  );
};

export default Download;
