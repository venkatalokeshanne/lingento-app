// Enhanced metadata for home page - optimized for WhatsApp and social sharing
export const homeMetadata = {
  title: "Lingento | Learn Any Language Effectively with Smart Flashcards",
  description: "Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards, personalized learning paths, and proven techniques to accelerate your language learning journey.",
  keywords: [
    "language learning",
    "vocabulary flashcards", 
    "spaced repetition",
    "learn languages online",
    "vocabulary builder",
    "language study app",
    "flashcard app",
    "multilingual education",
    "pronunciation practice",
    "grammar learning",
    "language mastery",
    "interactive flashcards",
    "personalized learning",
    "AI language learning"
  ].join(", "),
  authors: [{ name: "Lingento Team" }],
  creator: "Lingento",
  publisher: "Lingento",
  metadataBase: new URL('https://lingentoo.com'),
  alternates: {
    canonical: 'https://lingentoo.com',
    languages: {
      'en-US': 'https://lingentoo.com',
      'fr-FR': 'https://lingentoo.com/fr',
    },
  },  openGraph: {
    title: "Lingento | Learn Any Language Effectively with Smart Flashcards",
    description: "Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards, personalized learning paths, and proven techniques to accelerate your language learning journey.",
    url: 'https://lingentoo.com',
    siteName: 'Lingento',
    images: [
      {
        url: 'https://lingentoo.com/og-image.png',
        secureUrl: 'https://lingentoo.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lingento - Learn Languages with Smart Flashcards - Home Page',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lingento | Learn Any Language Effectively with Smart Flashcards",
    description: "Master vocabulary in multiple languages with spaced repetition and interactive flashcards. Start your language learning journey today!",
    site: '@lingento',
    creator: '@lingento',
    images: ['https://lingentoo.com/og-image.png'],
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
  category: 'education',
  classification: 'language learning platform',
  referrer: 'origin-when-cross-origin',
};

// Function to generate Open Graph meta tags for any page
export function generateOpenGraphTags(pageMetadata) {
  return {
    'og:title': pageMetadata.title,
    'og:description': pageMetadata.description,    'og:image': pageMetadata.openGraph?.images?.[0]?.url || 'https://lingentoo.com/og-image.png',
    'og:image:secure_url': pageMetadata.openGraph?.images?.[0]?.secureUrl || pageMetadata.openGraph?.images?.[0]?.url || 'https://lingentoo.com/og-image.png',
    'og:image:type': pageMetadata.openGraph?.images?.[0]?.type || 'image/png',
    'og:image:width': pageMetadata.openGraph?.images?.[0]?.width || '1200',
    'og:image:height': pageMetadata.openGraph?.images?.[0]?.height || '630',
    'og:image:alt': pageMetadata.openGraph?.images?.[0]?.alt || 'Lingento - Learn Languages with Smart Flashcards',
    'og:url': pageMetadata.openGraph?.url || 'https://lingentoo.com',
    'og:type': pageMetadata.openGraph?.type || 'website',
    'og:site_name': pageMetadata.openGraph?.siteName || 'Lingento',
    'og:locale': pageMetadata.openGraph?.locale || 'en_US',
  };
}
