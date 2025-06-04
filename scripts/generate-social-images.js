/**
 * Simple script to generate placeholder social media images
 * In a real production environment, you would use a proper image generation service
 * like Puppeteer, Canvas API, or external services like Bannerbear
 */

const fs = require('fs');
const path = require('path');

// Simple SVG template for social media images
const createSVGImage = (title, description, bgColor = '#4f46e5', textColor = '#ffffff') => {
  return `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad1)"/>
  
  <!-- Logo/Brand -->
  <circle cx="100" cy="100" r="40" fill="${textColor}" opacity="0.9"/>
  <text x="100" y="110" text-anchor="middle" fill="${bgColor}" font-family="Arial, sans-serif" font-size="32" font-weight="bold">L</text>
  <circle cx="130" cy="80" r="8" fill="#fbbf24"/>
  
  <!-- Main Title -->
  <text x="60" y="280" fill="${textColor}" font-family="Arial, sans-serif" font-size="48" font-weight="bold">
    <tspan x="60" dy="0">${title.substring(0, 30)}</tspan>
    ${title.length > 30 ? `<tspan x="60" dy="60">${title.substring(30, 60)}</tspan>` : ''}
  </text>
  
  <!-- Description -->
  <text x="60" y="400" fill="${textColor}" font-family="Arial, sans-serif" font-size="24" opacity="0.9">
    <tspan x="60" dy="0">${description.substring(0, 50)}</tspan>
    ${description.length > 50 ? `<tspan x="60" dy="35">${description.substring(50, 100)}</tspan>` : ''}
  </text>
  
  <!-- Brand Name -->
  <text x="60" y="550" fill="${textColor}" font-family="Arial, sans-serif" font-size="28" font-weight="bold" opacity="0.8">lingentoo.com</text>
  
  <!-- Decorative Elements -->
  <circle cx="950" cy="150" r="80" fill="${textColor}" opacity="0.1"/>
  <circle cx="1050" cy="300" r="60" fill="${textColor}" opacity="0.1"/>
  <circle cx="1100" cy="500" r="40" fill="${textColor}" opacity="0.1"/>
</svg>
  `.trim();
};

// Image configurations
const images = [  {
    filename: 'og-home.jpg',
    title: 'Lingento Language Learning',
    description: 'Master vocabulary with smart flashcards'
  },
  {
    filename: 'twitter-image.jpg',
    title: 'Lingento Language Learning',
    description: 'Master vocabulary with smart flashcards'
  },
  {
    filename: 'og-vocabulary.jpg',
    title: 'Vocabulary Builder',
    description: 'Spaced repetition flashcards & adaptive learning'
  },
  {
    filename: 'twitter-vocabulary.jpg',
    title: 'Vocabulary Builder',
    description: 'Spaced repetition flashcards & adaptive learning'
  },
  {
    filename: 'og-flashcards.jpg',
    title: 'Interactive Flashcards',
    description: 'Smart spaced repetition algorithm'
  },
  {
    filename: 'twitter-flashcards.jpg',
    title: 'Interactive Flashcards',
    description: 'Smart spaced repetition algorithm'
  },{
    filename: 'og-learning-path.jpg',
    title: 'Language Learning Path',
    description: 'AI-powered curriculum & progress tracking'
  },
  {
    filename: 'twitter-learning-path.jpg',
    title: 'Language Learning Path',
    description: 'AI-powered curriculum & progress tracking'
  },
  {
    filename: 'og-reading-writing.jpg',    title: 'Reading & Writing',
    description: 'Interactive exercises & practice'
  },
  {
    filename: 'twitter-reading-writing.jpg',
    title: 'Reading & Writing',
    description: 'Interactive exercises & practice'
  },  {
    filename: 'og-quiz.jpg',
    title: 'AI-Powered Language Quiz',
    description: 'Adaptive testing & progress tracking'
  },
  {
    filename: 'twitter-quiz.jpg',
    title: 'AI-Powered Language Quiz',
    description: 'Adaptive testing & progress tracking'
  },
  {
    filename: 'og-pricing.jpg',
    title: 'Lingento Pricing Plans',
    description: 'Choose your language learning journey'
  },
  {
    filename: 'twitter-pricing.jpg',
    title: 'Lingento Pricing Plans',
    description: 'Choose your language learning journey'
  },
  {
    filename: 'og-faq.jpg',
    title: 'Lingento FAQ',
    description: 'Frequently asked questions'
  },
  {
    filename: 'twitter-faq.jpg',
    title: 'Lingento FAQ',
    description: 'Frequently asked questions'
  },  {
    filename: 'og-about.jpg',
    title: 'About Lingento',
    description: 'Revolutionizing language learning'
  },
  {
    filename: 'twitter-about.jpg',
    title: 'About Lingento',
    description: 'Revolutionizing language learning'
  },  {
    filename: 'og-blog.jpg',
    title: 'Lingento Blog',
    description: 'Language learning tips & insights'
  },
  {
    filename: 'twitter-blog.jpg',
    title: 'Lingento Blog',
    description: 'Language learning tips & insights'
  },  {
    filename: 'og-resources.jpg',
    title: 'Learning Resources',
    description: 'Grammar guides, vocabulary lists & more'
  },
  {
    filename: 'twitter-resources.jpg',
    title: 'Learning Resources',
    description: 'Grammar guides, vocabulary lists & more'
  },  {
    filename: 'og-learn-vocabulary.jpg',
    title: 'Learn Vocabulary',
    description: 'Master 10,000+ words with spaced repetition'
  },
  {
    filename: 'twitter-learn-vocabulary.jpg',
    title: 'Learn Vocabulary',
    description: 'Master 10,000+ words with spaced repetition'
  }
];

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating social media images...');

// Generate SVG files (these would normally be converted to JPG)
images.forEach(image => {
  const svgContent = createSVGImage(image.title, image.description);
  const filePath = path.join(publicDir, image.filename.replace('.jpg', '.svg'));
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated: ${image.filename.replace('.jpg', '.svg')}`);
});

console.log('\nNote: In production, convert these SVG files to JPG format using:');
console.log('- Sharp library (Node.js)');
console.log('- ImageMagick');
console.log('- Online converters');
console.log('- Or use a service like Bannerbear, Placid, or Cloudinary');

console.log('\nSocial media images generated successfully!');
