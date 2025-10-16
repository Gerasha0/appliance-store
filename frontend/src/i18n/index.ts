export { default } from './config';

export { useTranslation } from 'react-i18next';
export { useI18nSync } from './useI18nSync';

export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  uk: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
} as const;

export type Language = keyof typeof languages;

export const availableLanguages = Object.keys(languages) as Language[];