// Re-export i18next instance for convenience
export { default } from './config';

// Export commonly used hooks and functions
export { useTranslation } from 'react-i18next';
export { useI18nSync } from './useI18nSync';

// Supported languages
export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  uk: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
} as const;

export type Language = keyof typeof languages;

// Available language codes
export const availableLanguages = Object.keys(languages) as Language[];
