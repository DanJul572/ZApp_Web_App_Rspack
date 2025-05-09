import FileDownload from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { useMutation } from '@tanstack/react-query';

import { downloadFileFromBuffer } from '@/helper/downloadFile';
import { extractFileNames } from '@/helper/readFile';
import Request from '@/hook/Request';

import CApiUrl from '@/constant/CApiUrl';
import CTheme from '@/constant/CTheme';

const Download = ({ label }) => {
  const { get } = Request();

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const res = await get(CApiUrl.file.download, { name: label });
      const bufferFormat = new Uint8Array(res.data.data);
      downloadFileFromBuffer(
        bufferFormat,
        extractFileNames(label),
        res.data.type,
      );
    },
    onError: (error) => {
      console.error('Download failed:', error);
    },
  });

  return (
    <Box display="flex" alignItems="center">
      {label && (
        <IconButton
          onClick={() => downloadMutation.mutate()}
          size={CTheme.button.size.name}
          disabled={downloadMutation.isPending}
        >
          <FileDownload />
        </IconButton>
      )}
      {extractFileNames(label)}
    </Box>
  );
};

export default Download;
