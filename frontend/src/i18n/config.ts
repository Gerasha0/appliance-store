import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import uk from './locales/uk.json';

const resources = {
  en: {
    translation: en,
  },
  uk: {
    translation: uk,
  },
};

// Configure language detector
const languageDetectorOptions = {
  // Order and from where user language should be detected
  order: ['localStorage', 'navigator', 'htmlTag'],

  // Keys or params to lookup language from
  lookupLocalStorage: 'locale',

  // Cache user language
  caches: ['localStorage'],

  // Optional set cookie options
  excludeCacheFor: ['cimode'],
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    // Language detector options
    detection: languageDetectorOptions,

    interpolation: {
      escapeValue: false, // React already safes from xss
    },

    react: {
      useSuspense: true,
    },
  });

// Save language to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('locale', lng);
  // Also update HTML lang attribute for accessibility
  document.documentElement.lang = lng;
});

export default i18n;
