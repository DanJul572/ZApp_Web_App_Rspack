import Help from '@mui/icons-material/Help';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CTheme from '@/constants/CTheme';
import { validator } from '@/helpers/validator';

const ShortText = (props) => {
  const {
    label,
    onChange,
    value,
    rules,
    disabled,
    onBlur,
    placeholder,
    tooltip,
  } = props;

  const error = validator(rules, value);

  const blur = (e) => {
    if (onBlur) {
      onBlur(e.target.value);
    }
  };

  const change = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontSize={CTheme.font.size.value}>{label}</Typography>
        {tooltip && (
          <Tooltip title={tooltip} arrow placement="top">
            <Help sx={{ fontSize: CTheme.font.size.value }} />
          </Tooltip>
        )}
      </Box>
      <TextField
        disabled={disabled}
        variant="outlined"
        size={CTheme.field.size.name}
        fullWidth
        value={value || ''}
        error={error.status}
        helperText={error.message}
        onChange={change}
        onBlur={blur}
        placeholder={placeholder || null}
      />
    </Box>
  );
};

export default ShortText;
