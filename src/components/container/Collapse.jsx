import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import MuiCollapse from '@/aliases/MuiCollapse';
import CTheme from '@/constants/CTheme';

const Collapse = (props) => {
  const { children, label, color } = props;

  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const finalColor = color || theme.palette.primary.main;

  return (
    <Box
      border={CTheme.border.size.value}
      borderColor={finalColor}
      borderRadius={1}
    >
      <Box
        borderBottom={CTheme.border.size.value}
        borderColor={finalColor}
        display="flex"
        justifyContent="space-between"
        padding={1}
        sx={{ backgroundColor: finalColor }}
      >
        <Typography
          fontSize={CTheme.font.size.value}
          fontWeight="bold"
          color={theme.palette.getContrastText(finalColor)}
        >
          {label}
        </Typography>
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
          size={CTheme.button.size.name}
          sx={{ padding: 0 }}
        >
          {open ? (
            <KeyboardArrowDown
              fontSize={CTheme.font.size.name}
              sx={{ color: theme.palette.getContrastText(finalColor) }}
            />
          ) : (
            <KeyboardArrowRight fontSize={CTheme.font.size.name} />
          )}
        </IconButton>
      </Box>
      <MuiCollapse in={open} sx={{ padding: 1 }}>
        {children}
      </MuiCollapse>
    </Box>
  );
};

export default Collapse;
