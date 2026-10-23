import FileDownload from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useConfig } from '@/contexts/ConfigProvider';
import { getFileUrl } from '@/helpers/downloadFile';

// `file` berisi { id, name, path } dari kolom file pada rows
const Download = ({ file }) => {
  const { config } = useConfig();

  if (!file) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <IconButton
        component="a"
        href={getFileUrl(config, file.path)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FileDownload />
      </IconButton>
      {file.name}
    </Box>
  );
};

export default Download;
