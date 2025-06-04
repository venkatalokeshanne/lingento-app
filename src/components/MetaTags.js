import Head from 'next/head';

export default function MetaTags({ 
  title = "Lingento | Learn Any Language Effectively with Smart Flashcards",
  description = "Master vocabulary in multiple languages with an effective memorization method based on spaced repetition. Interactive flashcards and personalized learning paths.",
  image = "/og-image.svg",
  url = "https://lingentoo.com"
}) {
  const fullImageUrl = image.startsWith('http') ? image : `https://lingentoo.com${image}`;
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Lingento" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@lingento" />
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Head>
  );
}
