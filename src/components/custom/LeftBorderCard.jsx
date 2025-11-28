import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { cloneElement } from 'react';

const LeftBorderCard = (props) => {
  const { title, value, color, icon } = props;

  const theme = useTheme();

  const finalTitle = title || 'Title';
  const finalValue = value || 'Value';
  const finalColor = color || theme.palette.primary.main;

  return (
    <Card
      elevation={3}
      sx={{
        borderLeft: `0.4rem solid ${finalColor}`,
        borderRadius: 2,
        height: '100%',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: finalColor,
              }}
            >
              {finalTitle}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                mt: 0.5,
              }}
            >
              {finalValue}
            </Typography>
          </Box>

          {icon && (
            <Box
              sx={{
                opacity: 0.2,
                color: theme.palette.text.primary,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              {cloneElement(icon, { sx: { fontSize: 50 } })}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeftBorderCard;
