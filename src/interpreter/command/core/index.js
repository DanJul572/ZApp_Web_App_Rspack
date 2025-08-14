import Alert from '@/hooks/Alert';
import FormData from '@/hooks/FormData';
import Loader from '@/hooks/Loader';
import Parameter from '@/hooks/Parameter';
import Redirect from '@/hooks/Redirect';
import Toaster from '@/hooks/Toaster';
import Translator from '@/hooks/Translator';
import UIStore from '@/hooks/UIStore';

const Core = () => {
  return {
    alert: Alert(),
    uiStore: UIStore(),
    loader: Loader(),
    parameter: Parameter(),
    redirect: Redirect(),
    toaster: Toaster(),
    translator: Translator(),
    formData: FormData(),
  };
};

export default Core;
