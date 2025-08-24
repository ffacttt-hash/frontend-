import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VegaMovies - Movie Information & Reviews Platform",
    template: "%s | VegaMovies"
  },
  description: "Discover comprehensive movie information, reviews, ratings, and detailed insights on VegaMovies. Your ultimate destination for movie discovery and entertainment.",
  keywords: ["movies", "reviews", "ratings", "movie information", "entertainment", "cinema", "film database"],
  authors: [{ name: "VegaMovies Team" }],
  creator: "VegaMovies",
  publisher: "VegaMovies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'VegaMovies',
    title: 'VegaMovies - Movie Information & Reviews Platform',
    description: 'Discover comprehensive movie information, reviews, ratings, and detailed insights on VegaMovies. Your ultimate destination for movie discovery and entertainment.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VegaMovies - Movie Information Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VegaMovies - Movie Information & Reviews Platform',
    description: 'Discover comprehensive movie information, reviews, ratings, and detailed insights on VegaMovies.',
    images: ['/og-image.jpg'],
    creator: '@vegamovies',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
