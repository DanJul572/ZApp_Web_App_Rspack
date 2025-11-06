import i18next from 'i18next';
import { useEffect } from 'react';

import en from '@/languages/en';
import id from '@/languages/id';

const Translator = () => {
  useEffect(() => {
    if (!i18next.isInitialized) {
      i18next.init({
        lng: process.env.REACT_APP_LANGUAGE || 'en',
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

  return (key) => {
    return i18next.isInitialized ? i18next.t(key) : key;
  };
};

export default Translator;
