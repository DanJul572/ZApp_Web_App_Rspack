import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { MuiFileInput } from 'mui-file-input';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Close from '@mui/icons-material/Close';
import Download from '@mui/icons-material/Download';

import { useFile } from '@/context/FileProvider';

import { downloadFile } from '@/helper/downloadFile';
import { getFileFromBuffer } from '@/helper/readFile';

import Request from '@/hook/Request';
import Translator from '@/hook/Translator';

import CApiUrl from '@/constant/CApiUrl';
import CTheme from '@/constant/CTheme';

const File = (props) => {
  const { label, onChange, name, disabled, value } = props;

  const { get } = Request();
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
    return await get(CApiUrl.file.download, { name: value });
  };

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['file-input', value],
    queryFn: getFile,
    enabled: !!value,
    retry: 0,
  });

  useEffect(() => {
    if (data) {
      handleChange(getFileFromBuffer(data));
    }
  }, [data]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>{error.message}</Typography>;
  }

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%">
        <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
        <MuiFileInput
          disabled={disabled}
          fullWidth
          multiple={false}
          onChange={handleChange}
          size={CTheme.field.size.name}
          value={fileContent?.file ? fileContent.file : null}
          clearIconButtonProps={{
            title: translator('delete'),
            children: <Close fontSize={CTheme.font.size.name} />,
          }}
        />
      </Box>
      {fileContent && (
        <IconButton size={CTheme.button.size.name} onClick={handleDownload}>
          <Download />
        </IconButton>
      )}
    </Box>
  );
};

export default File;
