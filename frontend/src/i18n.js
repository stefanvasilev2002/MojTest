import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import mkCommon from './locales/mk/common.json';
import alCommon from './locales/al/common.json';


i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: enCommon },
            mk: { common: mkCommon },
            al: { common: alCommon },
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
