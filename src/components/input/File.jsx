import Close from '@mui/icons-material/Close';
import Download from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { MuiFileInput } from 'mui-file-input';
import { useMemo } from 'react';
import { useConfig } from '@/contexts/ConfigProvider';
import { downloadFile, getFileUrl } from '@/helpers/downloadFile';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';

/**
 * Value berupa File yang baru dipilih, id file yang sudah tersimpan di
 * server, atau null. File baru ikut terkirim saat form disimpan.
 */
const File = (props) => {
  const { label, onChange, disabled, value } = props;

  const request = Request();
  const translator = Translator();

  const { config } = useConfig();

  const savedFileId = typeof value === 'string' ? value : null;

  const getFile = async () => {
    const response = await request.get(config.api.file.detail, {
      id: savedFileId,
    });
    return response.data;
  };

  const {
    data: savedFile,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['file-input', savedFileId],
    queryFn: getFile,
    enabled: !!savedFileId,
    retry: 0,
  });

  // MuiFileInput hanya bisa menampilkan File, jadi file yang tersimpan
  // ditampilkan lewat File kosong dengan nama yang sama
  const displayedFile = useMemo(() => {
    if (value && !savedFileId) return value;
    if (savedFileId && savedFile) {
      return new globalThis.File([], savedFile.name, { type: savedFile.type });
    }
    return null;
  }, [value, savedFileId, savedFile]);

  const handleChange = (file) => {
    onChange?.(file || null);
  };

  const handleDownload = () => {
    if (savedFileId) {
      window.open(getFileUrl(config, savedFile.path), '_blank', 'noopener');
    } else {
      downloadFile(value);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>{error.message}</Typography>;
  }

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, mb: label ? 0.75 : 0 }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: '100%',
          }}
        >
          <MuiFileInput
            disabled={disabled}
            fullWidth
            multiple={false}
            onChange={handleChange}
            value={displayedFile}
            clearIconButtonProps={{
              title: translator('delete'),
              children: <Close />,
            }}
          />
        </Box>
        {displayedFile && (
          <IconButton onClick={handleDownload}>
            <Download />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default File;
