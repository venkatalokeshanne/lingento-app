'use client';

import Head from 'next/head';

export default function SocialMetaTags({ 
  title = "Lingento | Learn Any Language Effectively with Smart Flashcards",
  description = "Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards and personalized learning paths.",
  image = "/og-image.svg",
  url = "https://lingentoo.com",
  type = "website",
  imageWidth = "1200",
  imageHeight = "630",
  imageAlt = "Lingento - Learn Languages with Smart Flashcards",
  siteName = "Lingento",
  locale = "en_US",
  imageType = "image/svg+xml"
}) {
  const fullImageUrl = image.startsWith('http') ? image : `https://lingentoo.com${image}`;
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="image" content={fullImageUrl} />
      
      {/* Open Graph / Facebook - Enhanced with all properties */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:secure_url" content={fullImageUrl} />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="fr_FR" />
      
      {/* Twitter - Enhanced */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:image:alt" content={imageAlt} />
      <meta property="twitter:site" content="@lingento" />
      <meta property="twitter:creator" content="@lingento" />
      
      {/* LinkedIn */}
      <meta property="linkedin:card" content="summary_large_image" />
      <meta property="linkedin:title" content={title} />
      <meta property="linkedin:description" content={description} />
      <meta property="linkedin:image" content={fullImageUrl} />
      
      {/* Additional tags for better crawling */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Structured Data for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Lingento",
            "url": url,
            "description": description,
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Any",
            "image": fullImageUrl,
            "author": {
              "@type": "Organization",
              "name": "Lingento Team"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </Head>
  );
}
