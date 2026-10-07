import Box from '@mui/material/Box';

/**
 * Scrollable monospace block for stack traces and JSON.
 */
const CodeBlock = (props) => {
  const { children, maxHeight = 420, sx } = props;

  return (
    <Box
      component="pre"
      sx={[
        (theme) => ({
          m: 0,
          p: 2,
          maxHeight,
          overflow: 'auto',
          fontFamily: 'Source Code Pro, Consolas, monospace',
          fontSize: 12.5,
          lineHeight: 1.6,
          whiteSpace: 'pre',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.background.default
              : '#f8f9fc',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
};

export default CodeBlock;
