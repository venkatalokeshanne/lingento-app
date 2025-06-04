export const metadata = {
  title: "About Lingento | Language Learning Made Simple",
  description: "Learn about Lingento's mission to make language learning accessible and effective. Discover our AI-powered spaced repetition system and join thousands of successful learners.",
  keywords: "about Lingento, language learning platform, spaced repetition method, language learning technology, vocabulary mastery",
  openGraph: {
    title: "About Lingento | Language Learning Made Simple",
    description: "Learn about Lingento's mission to make language learning accessible and effective through AI-powered spaced repetition.",
    url: "https://lingentoo.com/about",
  },
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Lingento",            "description": "Learn about Lingento's mission to make language learning accessible and effective through AI-powered spaced repetition.",
            "url": "https://lingentoo.com/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "Lingento",
              "description": "AI-powered language learning platform using spaced repetition",
              "url": "https://lingentoo.com",
              "foundingDate": "2024",
              "mission": "To make language learning accessible, effective, and enjoyable for everyone"
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About Lingento
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Lingento is revolutionizing language learning through scientifically-proven spaced repetition and AI-powered personalization.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We believe that learning a new language should be accessible, effective, and enjoyable for everyone. Our platform combines cutting-edge technology with proven learning methodologies to help you master vocabulary in just 5 minutes a day.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Why Spaced Repetition Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Spaced repetition is a learning technique that involves reviewing information at increasing intervals. This method has been scientifically proven to improve long-term retention by up to 200% compared to traditional study methods.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Join Our Community
            </h2>            <p className="text-gray-600 dark:text-gray-300 mb-6">
              With over 2,500 active learners and a 4.9/5 rating, Lingento has helped thousands of people achieve their language learning goals. Whether you're a beginner or looking to expand your vocabulary, our platform adapts to your learning pace and style.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
