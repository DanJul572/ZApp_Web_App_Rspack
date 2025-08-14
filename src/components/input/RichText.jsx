import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SunEditor from 'suneditor-react';

import CTheme from '@/constants/CTheme';

const RichText = (props) => {
  const { label, disabled, onChange, defaultValue } = props;

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      <SunEditor
        setOptions={{
          buttonList: [
            ['font', 'fontSize', 'formatBlock'],
            [
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
            ],
            ['align', 'horizontalRule', 'list', 'table'],
            ['fontColor', 'hiliteColor'],
            ['undo', 'redo'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['link', 'image'],
            ['preview', 'print'],
            ['fullScreen', 'showBlocks', 'codeView'],
          ],
        }}
        defaultValue={defaultValue}
        disable={disabled}
        onChange={onChange}
      />
    </Box>
  );
};

export default RichText;
