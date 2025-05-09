import { useMutation, useQuery } from '@tanstack/react-query';
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
  const { t } = Translator();
  const { file, setFile } = useFile();

  const fileContent =
    file && file.length > 0 ? file.find((file) => file.name === name) : null;

  const { isLoading } = useQuery({
    queryKey: ['download-file', value],
    queryFn: async () => {
      const res = await get(CApiUrl.file.download, { name: value });
      return res ? getFileFromBuffer(res) : null;
    },
    enabled: !!value,
  });

  const downloadMutation = useMutation({
    mutationFn: (fileContent) => downloadFile(fileContent.file),
    onError: (err) => {
      console.log('Download failed:', err);
    },
  });

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
    if (fileContent) {
      downloadMutation.mutate(fileContent);
    }
  };

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
            title: t('delete'),
            children: <Close fontSize={CTheme.font.size.name} />,
          }}
        />
      </Box>
      {fileContent && (
        <IconButton
          size={CTheme.button.size.name}
          onClick={handleDownload}
          disabled={isLoading}
        >
          <Download />
        </IconButton>
      )}
    </Box>
  );
};

export default File;
