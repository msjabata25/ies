import { Bebas_Neue, Space_Mono, Sora } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import type { Metadata } from 'next';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

const sora = Sora({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: 'IES JUST Student Chapter',
  description: 'Industrial Electronics Society — JUST Student Chapter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceMono.variable} ${sora.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-white antialiased min-h-screen selection:bg-primary selection:text-surface">
        <div className="fixed inset-0 pointer-events-none z-[-1] bg-grid"></div>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
