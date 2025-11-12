import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ToastWrapper } from '@/components/ToasterWrapper';
import Providers from '@/components/providers/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = localFont({
  src: [
    {
      path: '../../public/font/spaceGrotesk/SpaceGrotesk-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/font/spaceGrotesk/SpaceGrotesk-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/font/spaceGrotesk/SpaceGrotesk-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/font/spaceGrotesk/SpaceGrotesk-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/font/spaceGrotesk/SpaceGrotesk-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-space-grotesk',
  display: 'swap',
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className={inter.className}>
        <Providers>
          {/* <Toaster position="bottom-right" /> */}
          <ToastWrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}
