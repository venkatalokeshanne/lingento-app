import Head from 'next/head';

export default function SEOHead({   title = "Lingento | Learn Any Language Effectively with Smart Flashcards",
  description = "Master vocabulary in any language with our effective memorization method based on spaced repetition. Interactive flashcards, personalized learning paths, and proven techniques to accelerate your language journey.",
  keywords = "language learning, vocabulary flashcards, spaced repetition, language tutor, vocabulary builder, pronunciation practice, grammar learning, online language course",
  image = "https://lingentoo.com/og-image.jpg",
  url = "https://lingentoo.com",
  type = "website",
  structuredData = null
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Lingento" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@lingento" />
      <meta name="twitter:creator" content="@lingento" />
      
      {/* Additional SEO */}
      <meta name="language" content="English" />
      <meta name="author" content="Lingento Team" />
      <meta name="publisher" content="Lingento" />
      <meta name="copyright" content="© 2025 Lingento. All rights reserved." />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}
