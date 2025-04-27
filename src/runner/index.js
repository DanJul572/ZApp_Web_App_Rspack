import Builder from '@/builder';
import Caller from '@/caller';

import Script from '@/hook/Script';

const Runner = (props) => {
  const { isBuilder } = props;

  const ZApp = Caller();

  const ZBuilder = Builder();

  const ZSQL = (id, isOne = false, obj = null) => {
    if (!isBuilder) {
      const result = Script({ id }).val;
      if (isOne) {
        return result && result.length > 0
          ? result[0][obj].toString()
          : ZApp.Translator.t('empty_content');
      }
      return result;
    }
    return ZApp.Translator.t('empty_content');
  };

  // eslint-disable-next-line no-unused-vars
  const runFunction = (func, param = null) => {
    try {
      eval(func);
    } catch (error) {
      console.log(`Error : ${error.message}`);
      return;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getValues = (data, param = null) => {
    if (!data) return null;
    try {
      if (typeof data === 'object') {
        if (!data.isBind) return data.value;
        return data.value ? eval(data.value) : null;
      }
      return data ? eval(data) : null;
    } catch (error) {
      console.log(`Error : ${error.message}`);
    }
  };

  return { runFunction, getValues };
};

export default Runner;
