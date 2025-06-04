import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
import Navigation from "@/components/Navigation";
import PWAComponents from "@/components/PWAComponents";
import TutorialManager from "@/components/TutorialManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lingento | Learn French Effectively with Smart Flashcards",
  description: "Master French vocabulary with an effective memorization method based on spaced repetition. Interactive flashcards, personalized learning paths, and proven techniques to accelerate your French language journey.",
  keywords: "learn French, French vocabulary, flashcards, spaced repetition, language learning, French tutor, vocabulary builder, French pronunciation, French grammar, online French course",
  authors: [{ name: "Lingento Team" }],
  creator: "Lingento",
  publisher: "Lingento",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lingentoo.com'),
  alternates: {
    canonical: 'https://lingentoo.com',
    languages: {
      'en-US': 'https://lingentoo.com',
      'fr-FR': 'https://lingentoo.com/fr',
    },
  },
  openGraph: {
    title: "Lingento | Learn French Effectively with Smart Flashcards",
    description: "Master French vocabulary with an effective memorization method based on spaced repetition. Interactive flashcards and personalized learning paths.",
    url: 'https://lingentoo.com',
    siteName: 'Lingento',
    images: [
      {
        url: 'https://lingentoo.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lingento - Learn French with Smart Flashcards',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lingento | Learn French Effectively with Smart Flashcards",
    description: "Master French vocabulary with spaced repetition and interactive flashcards. Start your French learning journey today!",
    site: '@lingento',
    creator: '@lingento',
    images: ['https://lingentoo.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lingento",
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Lingento",
    "url": "https://lingentoo.com",
    "description": "Master French vocabulary with an effective memorization method based on spaced repetition. Interactive flashcards and personalized learning paths.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Lingento Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lingento",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lingentoo.com/icons/icon-512x512.png"
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="canonical" href="https://lingentoo.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta httpEquiv="content-language" content="en-us" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <UserPreferencesProvider>
              <TutorialManager>
                <PWAComponents />
                <Navigation />
                <main className="min-h-screen pt-16">
                  {children}
                </main>
              </TutorialManager>
            </UserPreferencesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
