import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LAST NIGHTFALL — Survival Daily Checklist',
  description: 'Gamified 2D Survival Daily Checklist & Quest System',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23090c10'/%3E%3Crect x='6' y='2' width='4' height='3' fill='%23facc15'/%3E%3Crect x='5' y='5' width='6' height='4' fill='%23f97316'/%3E%3Crect x='4' y='9' width='8' height='3' fill='%23ea580c'/%3E%3Crect x='3' y='12' width='10' height='2' fill='%2378350f'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: '#090c10',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#090c10] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
