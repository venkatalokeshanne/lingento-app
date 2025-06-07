import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
import Navigation from "@/components/Navigation";
import PWAComponents from "@/components/PWAComponents";
import PWADebugLoader from "@/components/PWADebugLoader";
import TutorialManager from "@/components/TutorialManager";
import MobileZoomPrevention from "@/components/MobileZoomPrevention";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lingento | Learn Any Language Effectively with Smart Flashcards",
  description: "Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards, personalized learning paths, and proven techniques to accelerate your language learning journey.",
  keywords: "language learning, vocabulary builder, flashcards, spaced repetition, learn languages, multilingual education, pronunciation practice, grammar learning, online language course",
  authors: [{ name: "Lingento Team" }],
  creator: "Lingento",
  publisher: "Lingento",  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lingentoo.com'),
  alternates: {
    canonical: 'https://lingentoo.com',    languages: {
      'en-US': 'https://lingentoo.com',
      'fr-FR': 'https://lingentoo.com/fr',
    },
  },
  icons: {
    icon: [
      { url: '/icon', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' }
    ],
  },  // Enhanced Open Graph metadata for better social sharing
  openGraph: {
    title: "Lingento | Learn Any Language Effectively with Smart Flashcards",
    description: "Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards and personalized learning paths.",
    url: 'https://lingentoo.com',
    siteName: 'Lingento',
    images: [
      {
        url: 'https://lingentoo.com/og-image.png',
        secureUrl: 'https://lingentoo.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lingento - Learn Languages with Smart Flashcards',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Enhanced Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: "Lingento | Learn Any Language Effectively with Smart Flashcards",
    description: "Master vocabulary in multiple languages with spaced repetition and interactive flashcards. Start your language learning journey today!",
    site: '@lingento',
    creator: '@lingento',
    images: ['https://lingentoo.com/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
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
    "description": "Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards and personalized learning paths.",
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
  };  return (
    <html lang="en">      <head>        {/* Essential meta tags for WhatsApp and other social platforms */}
        <meta property="og:title" content="Lingento | Learn Any Language Effectively with Smart Flashcards" />
        <meta property="og:description" content="Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards and personalized learning paths." />
        <meta property="og:image" content="https://lingentoo.com/og-image.png" />
        <meta property="og:image:secure_url" content="https://lingentoo.com/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Lingento - Learn Languages with Smart Flashcards" />
        <meta property="og:url" content="https://lingentoo.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Lingento" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="fr_FR" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lingento" />
        <meta name="twitter:creator" content="@lingento" />
        <meta name="twitter:title" content="Lingento | Learn Any Language Effectively with Smart Flashcards" />
        <meta name="twitter:description" content="Master vocabulary in multiple languages with spaced repetition and interactive flashcards. Start your language learning journey today!" />
        <meta name="twitter:image" content="https://lingentoo.com/og-image.png" />
        <meta name="twitter:image:alt" content="Lingento - Learn Languages with Smart Flashcards" />
        
        {/* Additional meta tags for better compatibility */}
        <meta name="title" content="Lingento | Learn Any Language Effectively with Smart Flashcards" />
        <meta name="description" content="Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards, personalized learning paths, and proven techniques to accelerate your language learning journey." />
        <meta name="image" content="https://lingentoo.com/og-image.svg" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Lingento Team" />
        <meta name="keywords" content="language learning, vocabulary builder, flashcards, spaced repetition, learn languages, multilingual education, pronunciation practice, grammar learning, online language course" />
        <link rel="canonical" href="https://lingentoo.com" />
        
        {/* Additional Open Graph properties for richer content */}
        <meta property="og:determiner" content="the" />
        <meta property="article:author" content="Lingento Team" />
        <meta property="article:publisher" content="Lingento" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head><body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MobileZoomPrevention />
        <AuthProvider>
          <ThemeProvider>
            <UserPreferencesProvider>
              <TutorialManager>
                <PWAComponents />
                <PWADebugLoader />
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
