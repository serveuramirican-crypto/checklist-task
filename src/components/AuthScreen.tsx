import { useState, type FormEvent } from 'react';
import { Flame, Lock, ShieldAlert, Skull, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getBrowserTimeZone } from '../game/time';
import { useI18n } from '../i18n/I18nContext';
import { formatAuthErrorMessage } from '../i18n/dynamic';
import { LanguageSwitch } from './LanguageSwitch';

interface AuthScreenProps {
  onAuthenticated?: () => void;
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [survivorName, setSurvivorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const detectedTz = getBrowserTimeZone();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const cleanName = survivorName.trim() || 'Wanderer';
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              survivor_name: cleanName,
              timezone: detectedTz,
            },
          },
        });

        if (signUpErr) throw signUpErr;

        if (data.session) {
          onAuthenticated?.();
        } else if (data.user?.identities && data.user.identities.length === 0) {
          setInfo(t('auth.existingAccountHint'));
          setMode('signin');
        } else {
          setInfo(t('auth.confirmCreated'));
          setMode('signin');
        }
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInErr) throw signInErr;
        onAuthenticated?.();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('auth.genericAuthError');
      setError(formatAuthErrorMessage(msg, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-8">
      <div className="mb-4 flex justify-end">
        <LanguageSwitch />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Start side: Survival Briefing */}
        <div className="pixel-panel flex flex-col justify-between p-6 lg:col-span-7">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
              <Flame className="h-4 w-4 shrink-0 text-orange-400" />
              {t('auth.badge')}
            </div>

            <h1 className="font-pixel text-xl leading-relaxed text-amber-300 sm:text-2xl" dir="ltr">
              {t('auth.title')}
            </h1>
            <p className="mt-2 text-sm text-slate-300">{t('auth.subtitle')}</p>

            <div className="mt-6 space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3 border border-slate-800 bg-slate-900/70 p-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <p className="font-bold text-slate-100">{t('auth.rule1Title')}</p>
                  <p className="text-slate-400">{t('auth.rule1Desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border border-slate-800 bg-slate-900/70 p-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-bold text-slate-100">{t('auth.rule2Title')}</p>
                  <p className="text-slate-400">{t('auth.rule2Desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border border-red-900/60 bg-red-950/20 p-3">
                <Skull className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  <p className="font-bold text-red-200">{t('auth.rule3Title')}</p>
                  <p className="text-red-300/80">{t('auth.rule3Desc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <span>
              {t('auth.midnightTimezone')}{' '}
              <strong className="text-slate-200" dir="ltr">
                {detectedTz}
              </strong>
            </span>
            <span>{t('auth.backedBy')}</span>
          </div>
        </div>

        {/* End side: Auth Terminal */}
        <div className="pixel-panel p-6 lg:col-span-5">
          <div className="mb-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`px-3 py-2 font-pixel text-[10px] transition ${mode === 'signin'
                ? 'border-2 border-amber-400 bg-amber-500/20 text-amber-200'
                : 'border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
            >
              {t('auth.signInTab')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setInfo(null);
              }}
              className={`px-3 py-2 font-pixel text-[10px] transition ${mode === 'signup'
                ? 'border-2 border-amber-400 bg-amber-500/20 text-amber-200'
                : 'border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
            >
              {t('auth.signUpTab')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="survivor-name"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300"
                >
                  {t('auth.survivorNameLabel')}
                </label>
                <input
                  id="survivor-name"
                  type="text"
                  maxLength={40}
                  value={survivorName}
                  onChange={(e) => setSurvivorName(e.target.value)}
                  placeholder={t('auth.survivorNamePlaceholder')}
                  className="w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-400"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                {t('auth.emailLabel')}
              </label>
              <input
                id="auth-email"
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-start text-sm text-slate-100 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                {t('auth.passwordLabel')}
              </label>
              <input
                id="auth-password"
                type="password"
                dir="ltr"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-start text-sm text-slate-100 outline-none focus:border-amber-400"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 border border-red-500/50 bg-red-950/60 p-3 text-xs text-red-200">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {info && (
              <div className="border border-emerald-500/50 bg-emerald-950/60 p-3 text-xs text-emerald-200">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="pixel-btn w-full border-amber-400 bg-amber-500/20 px-4 py-3 font-pixel text-xs text-amber-200 disabled:opacity-50"
            >
              {loading
                ? t('auth.connecting')
                : mode === 'signup'
                  ? t('auth.startDay1')
                  : t('auth.enterCamp')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
