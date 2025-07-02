import MuiAlert from '@/alias/MuiAlert';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import { useAlert } from '@/context/AlertProvider';
import Translator from '@/hook/Translator';
import CTheme from '@/constant/CTheme';

const Alert = () => {
  const { alert, setAlert } = useAlert();
  const translator = Translator();

  if (!alert || !alert.status) {
    return false;
  }

  return (
    <MuiAlert
      severity={alert.type || 'success'}
      action={
        <IconButton
          color="inherit"
          size={CTheme.button.size.name}
          onClick={() => setAlert(false)}
        >
          <Close fontSize={CTheme.font.size.name} />
        </IconButton>
      }
      sx={{ mb: 2 }}
    >
      {alert.message || translator('success_message')}
    </MuiAlert>
  );
};

export default Alert;
