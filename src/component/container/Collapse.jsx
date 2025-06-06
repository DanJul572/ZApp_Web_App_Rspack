import { useState } from 'react';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import MuiCollapse from '@/alias/MuiCollapse';

import CTheme from '@/constant/CTheme';

const Collapse = (props) => {
  const { children, label, color } = props;

  const theme = useTheme();

  const [open, setOpen] = useState(true);

  const finalColor = color || theme.palette.primary.main;

  return (
    <Box borderColor={finalColor} borderRadius={1}>
      <Box
        borderColor={finalColor}
        display="flex"
        justifyContent="space-between"
        padding={1}
        sx={{ backgroundColor: finalColor }}
      >
        <Typography
          fontWeight="bold"
          color={theme.palette.getContrastText(finalColor)}
        >
          {label}
        </Typography>
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
          sx={{ padding: 0 }}
        >
          {open ? (
            <KeyboardArrowDown
              sx={{ color: theme.palette.getContrastText(finalColor) }}
            />
          ) : (
            <KeyboardArrowRight />
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
