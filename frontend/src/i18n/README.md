# Internationalization (i18n) Setup

This project uses `react-i18next` for internationalization with support for English (en) and Ukrainian (uk) languages.

## Features

- ✅ Automatic language detection from browser/localStorage
- ✅ Language persistence in localStorage
- ✅ Sync with Redux store (uiSlice.locale)
- ✅ Fallback to English if translation is missing
- ✅ Development debug mode
- ✅ Accessibility (updates HTML lang attribute)

## Configuration

The i18n configuration is located in `src/i18n/config.ts` and includes:

- **Language Detector**: Automatically detects user language from localStorage, browser settings, or HTML tag
- **Languages**: English (en) and Ukrainian (uk)
- **localStorage Key**: `locale`
- **Fallback Language**: English (en)

## Usage

### In Components

```tsx
import { useTranslation } from '@/i18n';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('common.loading')}</p>
      <button onClick={() => i18n.changeLanguage('uk')}>
        Switch to Ukrainian
      </button>
    </div>
  );
}
```

### Sync with Redux Store

Use the `useI18nSync` hook in your root component to keep i18n and Redux store in sync:

```tsx
import { useI18nSync } from '@/i18n';

function App() {
  useI18nSync(); // Syncs i18n with Redux uiSlice.locale
  
  return <YourApp />;
}
```

### Change Language Programmatically

```tsx
import { useTranslation } from '@/i18n';
import { useAppDispatch, setLocale } from '@/store';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const changeLanguage = (lang: 'en' | 'uk') => {
    i18n.changeLanguage(lang); // Updates i18n
    dispatch(setLocale(lang));  // Updates Redux store
    // localStorage is updated automatically
  };

  return (
    <button onClick={() => changeLanguage('uk')}>
      Українська
    </button>
  );
}
```

## Translation Files

Translation files are located in `src/i18n/locales/`:

- `en.json` - English translations
- `uk.json` - Ukrainian translations

### Translation Keys Structure

```json
{
  "common": {
    "appName": "Appliance Store",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Login",
    "logout": "Logout"
  },
  "nav": {
    "dashboard": "Dashboard"
  }
}
```

### Adding New Translations

1. Add the key to both `en.json` and `uk.json`
2. Use the key in your component: `t('category.key')`

## Available Languages

```typescript
import { languages, availableLanguages } from '@/i18n';

// languages object:
{
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  uk: { name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' }
}

// availableLanguages array:
['en', 'uk']
```

## TypeScript Support

All i18n functionality is fully typed. Use the exported types:

```typescript
import { Language } from '@/i18n';

const currentLang: Language = 'en'; // Type-safe!
```

