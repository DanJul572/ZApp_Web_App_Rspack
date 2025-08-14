import { useToast } from '@/contextss/ToastProvider';

const Toaster = () => {
  const { setToast } = useToast();

  const showSuccessToast = (message) => {
    setToast({
      status: true,
      type: 'success',
      message: message,
    });
  };

  const showErrorToast = (message) => {
    setToast({
      status: true,
      type: 'error',
      message: message,
    });
  };

  const showWarningToast = (message) => {
    setToast({
      status: true,
      type: 'warning',
      message: message,
    });
  };

  const showInfoToast = (message) => {
    setToast({
      status: true,
      type: 'info',
      message: message,
    });
  };

  return {
    showErrorToast,
    showInfoToast,
    showSuccessToast,
    showWarningToast,
  };
};

export default Toaster;
