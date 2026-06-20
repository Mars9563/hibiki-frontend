import type { Metadata } from 'next';
import { Press_Start_2P, Fira_Code } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/providers/toast-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const pressStart = Press_Start_2P({
  variable: '--font-ui',
  weight: '400',
  subsets: ['latin'],
});

const firaCode = Fira_Code({
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${pressStart.variable} ${firaCode.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
