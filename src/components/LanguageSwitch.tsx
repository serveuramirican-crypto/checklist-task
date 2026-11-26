import { useI18n } from '../i18n/I18nContext';

export function LanguageSwitch() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div
      className="inline-flex items-center border border-slate-700 bg-slate-900 p-0.5 text-[11px] font-bold"
      role="group"
      aria-label={t('lang.switchLabel')}
      dir="ltr"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-2 py-1 transition ${
          language === 'en'
            ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60'
            : 'text-slate-400 hover:text-slate-200 border border-transparent'
        }`}
      >
        {t('lang.en')}
      </button>
      <span className="px-0.5 text-slate-600" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={language === 'ar'}
        className={`px-2 py-1 transition ${
          language === 'ar'
            ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60'
            : 'text-slate-400 hover:text-slate-200 border border-transparent'
        }`}
      >
        {t('lang.ar')}
      </button>
    </div>
  );
}
