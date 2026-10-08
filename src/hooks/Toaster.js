import { useMemo } from 'react';
import { useSetToast } from '@/contexts/ToastProvider';

export const createToaster = (setToast) => {
  const show = (type) => (message) => {
    setToast({
      status: true,
      type: type,
      message: message,
    });
  };

  return {
    showErrorToast: show('error'),
    showInfoToast: show('info'),
    showSuccessToast: show('success'),
    showWarningToast: show('warning'),
  };
};

const Toaster = () => {
  const setToast = useSetToast();
  return useMemo(() => createToaster(setToast), [setToast]);
};

export default Toaster;
