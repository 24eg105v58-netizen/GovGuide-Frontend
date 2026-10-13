import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import teTranslation from './locales/te.json';
import hiTranslation from './locales/hi.json';

const savedLang = localStorage.getItem('govguide_language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      te: { translation: teTranslation },
      hi: { translation: hiTranslation },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already prevents XSS
    },
  });

export default i18n;
