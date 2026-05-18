import { Bebas_Neue, Space_Mono, Sora } from 'next/font/google';
import './globals.css';
import ClientLayout from '../components/ClientLayout';

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

export const metadata = {
  title: 'IES JUST Student Chapter',
  description: 'Industrial Electronics Society — JUST Student Chapter',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceMono.variable} ${sora.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0A0A0A] text-white antialiased min-h-screen selection:bg-[#F57C00] selection:text-[#0A0A0A]">
        <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[size:100%_4px]"></div>
        <div className="fixed inset-0 pointer-events-none z-[-1] bg-[linear-gradient(rgba(30,136,229,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(30,136,229,0.04)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
