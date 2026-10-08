import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { EMAIL_STATUS } from './constants';

// Status of an email log row; a failed one shows its error on hover.
const StatusChip = ({ status, errorMessage }) => {
  const config = EMAIL_STATUS[status];
  const chip = (
    <Chip
      label={config?.label ?? status}
      color={config?.color ?? 'default'}
      size="small"
      variant="outlined"
    />
  );

  return errorMessage ? <Tooltip title={errorMessage}>{chip}</Tooltip> : chip;
};

export default StatusChip;
