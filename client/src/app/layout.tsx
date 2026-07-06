import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Poppins } from 'next/font/google';

import { JsonLd } from '@/components/seo/json-ld';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { CartProvider } from '@/components/providers/cart-provider';
import { createPageMetadata } from '@/lib/seo/metadata';
import { organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { siteConfig, absoluteUrl } from '@/lib/seo/site';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...createPageMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: '/',
  }),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: '/favicon.ico',
    apple: absoluteUrl(siteConfig.defaultOgImage),
  },
  category: 'shopping',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2D5028' },
    { media: '(prefers-color-scheme: dark)', color: '#1a3018' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-body antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <CartProvider>{children}</CartProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
