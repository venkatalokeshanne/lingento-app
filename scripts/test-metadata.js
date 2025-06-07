// Test script to verify Open Graph metadata
// Run this in your browser console on localhost:3000

console.log('=== LINGENTO METADATA TEST ===');

// Check if meta tags exist
const ogTitle = document.querySelector('meta[property="og:title"]');
const ogDescription = document.querySelector('meta[property="og:description"]');
const ogImage = document.querySelector('meta[property="og:image"]');
const ogUrl = document.querySelector('meta[property="og:url"]');
const twitterCard = document.querySelector('meta[name="twitter:card"]');

console.log('Open Graph Title:', ogTitle ? ogTitle.content : 'NOT FOUND');
console.log('Open Graph Description:', ogDescription ? ogDescription.content : 'NOT FOUND');
console.log('Open Graph Image:', ogImage ? ogImage.content : 'NOT FOUND');
console.log('Open Graph URL:', ogUrl ? ogUrl.content : 'NOT FOUND');
console.log('Twitter Card:', twitterCard ? twitterCard.content : 'NOT FOUND');

// Test if image is accessible
if (ogImage) {
  const img = new Image();
  img.onload = () => console.log('✅ OG Image loads successfully');
  img.onerror = () => console.log('❌ OG Image failed to load');
  img.src = ogImage.content;
}

// List all meta tags for debugging
console.log('\n=== ALL META TAGS ===');
const allMeta = document.querySelectorAll('meta');
allMeta.forEach(meta => {
  if (meta.property && meta.property.startsWith('og:')) {
    console.log(`${meta.property}: ${meta.content}`);
  }
  if (meta.name && meta.name.startsWith('twitter:')) {
    console.log(`${meta.name}: ${meta.content}`);
  }
});
