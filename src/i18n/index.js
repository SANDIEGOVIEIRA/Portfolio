import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationPT from './pt.json';
import translationEN from './en.json';

const resources = {
    pt: { translation: translationPT },
    en: { translation: translationEN }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pt',
        fallbackLng: 'pt',
        interpolation: { escapeValue: false }
    });

export default i18n;
