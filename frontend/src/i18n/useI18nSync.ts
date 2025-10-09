// Hook to sync i18n with Redux store
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector, setLocale } from '@/store';

export const useI18nSync = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const localeFromStore = useAppSelector(state => state.ui.locale);

  // Sync i18n language with Redux store
  useEffect(() => {
    if (i18n.language !== localeFromStore) {
      i18n.changeLanguage(localeFromStore);
    }
  }, [localeFromStore, i18n]);

  // Sync Redux store with i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (lng !== localeFromStore) {
        dispatch(setLocale(lng as 'en' | 'uk'));
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [dispatch, i18n, localeFromStore]);
};

