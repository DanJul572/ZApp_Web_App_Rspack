import { useState } from 'react';
import File from '@/components/input/File';

const { Box } = require('@mui/material');

const UploadPage = () => {
  const [fileName, setFileName] = useState();

  const onChange = (value) => {
    setFileName(value);
  };

  return (
    <Box>
      <File label="Excel File" onChange={onChange} name={fileName} />
    </Box>
  );
};

export default UploadPage;
