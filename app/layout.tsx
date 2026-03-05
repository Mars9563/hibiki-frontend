import type { Metadata } from 'next';
import { VT323, Inter } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/providers/toast-provider';

const pressStart = VT323({
  variable: '--font-ui',
  weight: '400',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-chat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hibiki',
  description: 'Messages that resonate across languages.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${inter.variable} antialiased`}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
