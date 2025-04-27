import { useEffect } from 'react';

import i18next from 'i18next';

import en from '@/language/en';
import id from '@/language/id';

const Translator = () => {
  useEffect(() => {
    if (!i18next.isInitialized) {
      i18next.init({
        lng: 'en',
        debug: false,
        resources: {
          en: {
            translation: en,
          },
          id: {
            translation: id,
          },
        },
      });
    }
  }, []);

  const t = (key) => {
    return i18next.isInitialized ? i18next.t(key) : key;
  };

  return {
    t,
  };
};

export default Translator;
