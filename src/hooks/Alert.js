import { useAlert } from '@/contextss/AlertProvider';

const Alert = () => {
  const { setAlert } = useAlert();

  const showSuccessAlert = (message) => {
    setAlert({
      status: true,
      type: 'success',
      message: message,
    });
  };

  const showErrorAlert = (message) => {
    setAlert({
      status: true,
      type: 'error',
      message: message,
    });
  };

  const showWarningAlert = (message) => {
    setAlert({
      status: true,
      type: 'warning',
      message: message,
    });
  };

  const showInfoAlert = (message) => {
    setAlert({
      status: true,
      type: 'info',
      message: message,
    });
  };

  const hideAlert = () => {
    setAlert(false);
  };

  return {
    hideAlert,
    showErrorAlert,
    showInfoAlert,
    showSuccessAlert,
    showWarningAlert,
  };
};

export default Alert;
