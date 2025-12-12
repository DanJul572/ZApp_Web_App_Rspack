import CApiUrl from '@configs/CApiUrl';
import Close from '@mui/icons-material/Close';
import Download from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { MuiFileInput } from 'mui-file-input';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFile } from '@/contexts/FileProvider';
import { downloadFile } from '@/helpers/downloadFile';
import { getFileFromBuffer } from '@/helpers/readFile';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';

const File = (props) => {
  const { label, onChange, name, disabled, value } = props;

  const request = Request();
  const translator = Translator();
  const { file, setFile } = useFile();

  const fileContent =
    file && file.length > 0 ? file.find((file) => file.name === name) : null;

  const handleChange = (file) => {
    if (file) {
      const id = `${uuidv4()}_${file.name}`;
      const newFile = {
        id: id,
        name: name,
        file: file,
      };
      setFile((prevFiles) => {
        const existingFileIndex = prevFiles.findIndex(
          (file) => file.name === newFile.name,
        );
        if (existingFileIndex !== -1) {
          const updatedFiles = [...prevFiles];
          updatedFiles[existingFileIndex] = newFile;
          return updatedFiles;
        }
        return [...prevFiles, newFile];
      });
      if (onChange) {
        onChange(id);
      }
    } else {
      setFile((prevFiles) => {
        const existingFileIndex = prevFiles.findIndex(
          (file) => file.name === name,
        );
        if (existingFileIndex !== -1) {
          const updatedFiles = [...prevFiles];
          updatedFiles.splice(existingFileIndex, 1);
          return updatedFiles;
        }
        return prevFiles;
      });
      if (onChange) {
        onChange(null);
      }
    }
  };

  const handleDownload = () => {
    downloadFile(fileContent.file);
  };

  const getFile = async () => {
    return await request.get(CApiUrl.file.download, { name: value });
  };

  const {
    data: response,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['file-input', value],
    queryFn: getFile,
    enabled: !!value,
    retry: 0,
  });

  useEffect(() => {
    if (response) {
      handleChange(getFileFromBuffer(response.data));
    }
  }, [response]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>{error.message}</Typography>;
  }

  return (
    <Box>
      <Typography>{label}</Typography>
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
            value={fileContent?.file ? fileContent.file : null}
            clearIconButtonProps={{
              title: translator('delete'),
              children: <Close />,
            }}
          />
        </Box>
        {fileContent && (
          <IconButton onClick={handleDownload}>
            <Download />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default File;
