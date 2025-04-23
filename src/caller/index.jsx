import Alert from '@/hook/Alert';
import Api from '@/hook/Api';
import Comp from '@/hook/Comp';
import Loader from '@/hook/Loader';
import Parameter from '@/hook/Parameter';
import Redirect from '@/hook/Redirect';
import Toaster from '@/hook/Toaster';
import Translator from '@/hook/Translator';
import Vars from '@/hook/Vars';

const Caller = () => {
  return {
    Alert: Alert(),
    Api: Api(),
    Comp: Comp(),
    Loader: Loader(),
    Parameter: Parameter(),
    Redirect: Redirect(),
    Toaster: Toaster(),
    Translator: Translator(),
    Vars: Vars(),
  };
};

export default Caller;
