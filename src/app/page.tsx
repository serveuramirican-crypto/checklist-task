'use client';

import dynamic from 'next/dynamic';
import { I18nProvider } from '../i18n/I18nContext';

const App = dynamic(() => import('../App').then((mod) => mod.App), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center font-pixel text-xs text-amber-300">
      INITIALIZING SURVIVAL PROTOCOL...
    </div>
  ),
});

export default function HomePage() {
  return (
    <I18nProvider>
      <App />
    </I18nProvider>
  );
}
