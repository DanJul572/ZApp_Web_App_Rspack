import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useState } from 'react';

import CTheme from '@/configs/CTheme';

const Code = (props) => {
  const { label, value, onChange, disabled, withOptions } = props;

  const languages = [
    {
      label: 'JS',
      value: 'js',
    },
    {
      label: 'SQL',
      value: 'sql',
    },
  ];

  const [activeLanguange, setActiveLanguange] = useState('js');

  const handleChange = (evn) => {
    if (onChange) {
      onChange(evn.target.value);
    }
  };

  return (
    <Box>
      <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
      {withOptions && (
        <Stack direction="row" spacing={1} marginY={1}>
          {languages.map((language) => {
            return (
              <Chip
                color={
                  activeLanguange === language.value ? 'primary' : 'default'
                }
                key={language.value}
                label={language.label}
                onClick={() => setActiveLanguange(language.value)}
                size={CTheme.button.size.name}
                variant="outlined"
              />
            );
          })}
        </Stack>
      )}
      <CodeEditor
        data-color-mode="dark"
        disabled={disabled}
        language={activeLanguange}
        onChange={handleChange}
        padding={15}
        placeholder="Write here..."
        style={{
          borderRadius: 3,
          fontSize: CTheme.font.size.value,
          fontFamily: 'Consolas',
        }}
        value={value}
      />
    </Box>
  );
};

export default Code;
