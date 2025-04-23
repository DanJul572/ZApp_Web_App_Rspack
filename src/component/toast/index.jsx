import { forwardRef } from 'react';

import { useToast } from '@/context/ToastProvider';

import MuiAlert from '@/alias/MuiAlert';
import Snackbar from '@mui/material/Snackbar';

import Translator from '@/hook/Translator';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = () => {
  const { toast, setToast } = useToast();

  const { t } = Translator();

  const handleClose = () => setToast(false);

  const renderToast = () => {
    if (!toast || !toast.status) return false;

    return (
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={toast.type || 'success'}
          sx={{ width: '100%' }}
        >
          {toast.message || t('success_message')}
        </Alert>
      </Snackbar>
    );
  };

  return renderToast();
};

export default Toast;
