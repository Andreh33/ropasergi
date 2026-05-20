import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'PROYECTO 1 · Primer dogma. Última calle.',
    template: '%s · PROYECTO 1',
  },
  description: 'Streetwear con códigos de lujo desde Sevilla. Edición numerada.',
  openGraph: {
    title: 'PROYECTO 1 · Primer dogma. Última calle.',
    description: 'Streetwear con códigos de lujo desde Sevilla. Edición numerada.',
    type: 'website',
    locale: 'es_ES',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-[var(--bg-void)]" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
