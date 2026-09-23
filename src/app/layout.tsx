import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'Kaveri Crest Coffee',
    template: '%s | Kaveri Crest',
  },
  description: 'Premium coffee powder and blends crafted for everyday coffee lovers.',
  keywords: ['coffee', 'arabica', 'filter coffee', 'premium coffee', 'coffee online india'],
  openGraph: {
    title: 'Kaveri Crest Coffee',
    description: 'Premium coffee powder and blends crafted for everyday coffee lovers.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: 'Kaveri Crest',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaveri Crest Coffee',
    description: 'Premium coffee powder and blends crafted for everyday coffee lovers.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
