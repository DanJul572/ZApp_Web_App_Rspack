import { useMemo } from 'react';
import { useSetAlert } from '@/contexts/AlertProvider';

export const createAlert = (setAlert) => {
  const show = (type) => (message) => {
    setAlert({
      status: true,
      type: type,
      message: message,
    });
  };

  return {
    hideAlert: () => setAlert(false),
    showErrorAlert: show('error'),
    showInfoAlert: show('info'),
    showSuccessAlert: show('success'),
    showWarningAlert: show('warning'),
  };
};

const Alert = () => {
  const setAlert = useSetAlert();
  return useMemo(() => createAlert(setAlert), [setAlert]);
};

export default Alert;
