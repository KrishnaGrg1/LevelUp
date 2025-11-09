import type { Metadata } from 'next';
import './globals.css';
import { ToastWrapper } from '@/components/ToasterWrapper';
import Providers from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'LevelUp - Gamify Your Learning',
  description: 'Level up your skills through gamified learning experiences',
  icons: {
    icon: [
      {
        url: '/companylogo.jpeg',
        type: 'image/jpeg',
        sizes: '192x192',
      },
      {
        url: '/companylogo1.jpeg',
        type: 'image/jpeg',
        sizes: '192x192',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {/* <Toaster position="bottom-right" /> */}
          <ToastWrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}
