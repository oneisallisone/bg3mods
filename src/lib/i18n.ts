import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../public/locales/en/common.json';
import zh from '../../public/locales/zh/common.json';
import ja from '../../public/locales/ja/common.json';
import ko from '../../public/locales/ko/common.json';

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    ja: { translation: ja },
    ko: { translation: ko },
  },
});

export default i18next;