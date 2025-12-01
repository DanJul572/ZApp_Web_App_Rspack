import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Box, Button, Divider, IconButton, useTheme } from '@mui/material';
import { useRef, useState } from 'react';

const Image = () => {
  const theme = useTheme();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleUpload = () => {
    if (!file) return;
    console.log('Uploading file:', file);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      alignItems="center"
      sx={{
        width: '260px',
      }}
    >
      {preview ? (
        <Box position="relative" sx={{ width: 220 }}>
          <IconButton
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { background: 'rgba(0,0,0,0.7)' },
            }}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 1,
              boxShadow: 1,
            }}
          />
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: '100%',
            height: 150,
            borderRadius: 2,
            border: `2px dashed ${theme.palette.text.disabled}`,
            color: theme.palette.text.disabled,
            fontSize: 48,
          }}
        >
          <PhotoCameraIcon fontSize="inherit" />
        </Box>
      )}

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        sx={{ width: '100%', maxWidth: 280 }}
      >
        <Button
          variant="text"
          fullWidth
          component="label"
          sx={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          Select
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>

        <Divider orientation="vertical" flexItem />

        <Button
          variant="text"
          fullWidth
          disabled={!file}
          onClick={handleUpload}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          Upload
        </Button>
      </Box>
    </Box>
  );
};

export default Image;
