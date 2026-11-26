import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  translations,
  type Language,
  type TranslationKey,
} from './translations';

const LANG_STORAGE_KEY = 'last_nightfall_lang';

export type TranslateFn = (
  key: TranslationKey,
  vars?: Record<string, string | number>
) => string;

interface I18nContextValue {
  language: Language;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  setLanguage: (lang: Language) => void;
  t: TranslateFn;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') {
      return saved;
    }
  } catch {
    // ignore storage read failures
  }
  return 'en';
}

export function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : `{${name}}`
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);

  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    }
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // ignore storage write failures
    }
  }, [language, dir]);

  const setLanguage = useCallback((nextLang: Language) => {
    setLanguageState(nextLang);
  }, []);

  const t = useCallback<TranslateFn>(
    (key, vars) => {
      const dict = translations[language] ?? translations.en;
      const template = dict[key] ?? translations.en[key] ?? key;
      return interpolate(template, vars);
    },
    [language]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      dir,
      isRtl: language === 'ar',
      setLanguage,
      t,
    }),
    [language, dir, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
