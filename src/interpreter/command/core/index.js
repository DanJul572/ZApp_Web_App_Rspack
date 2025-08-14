import Alert from '@/hook/Alert';
import Api from '@/hook/Api';
import FormData from '@/hook/FormData';
import Loader from '@/hook/Loader';
import Parameter from '@/hook/Parameter';
import Redirect from '@/hook/Redirect';
import Toaster from '@/hook/Toaster';
import Translator from '@/hook/Translator';
import UIStore from '@/hook/UIStore';

const Core = () => {
  return {
    alert: Alert(),
    api: Api(),
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
