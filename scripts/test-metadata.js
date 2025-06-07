// Enhanced test script to verify Open Graph metadata
// Run this in your browser console on localhost:3000

console.log('=== LINGENTO ENHANCED METADATA TEST ===');
console.log('🚀 Testing Open Graph Protocol compliance...\n');

// Enhanced metadata checking function
const checkMetadata = () => {
  // Required Open Graph properties
  const requiredProps = ['og:title', 'og:type', 'og:image', 'og:url'];
  const enhancedProps = [
    'og:description', 'og:site_name', 'og:locale', 
    'og:image:secure_url', 'og:image:type', 'og:image:width', 
    'og:image:height', 'og:image:alt'
  ];
  const twitterProps = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];

  console.log('📋 Required Open Graph Properties:');
  requiredProps.forEach(prop => {
    const meta = document.querySelector(`meta[property="${prop}"]`);
    if (meta) {
      console.log(`✅ ${prop}: ${meta.content}`);
    } else {
      console.log(`❌ ${prop}: NOT FOUND`);
    }
  });

  console.log('\n🎯 Enhanced Open Graph Properties:');
  enhancedProps.forEach(prop => {
    const meta = document.querySelector(`meta[property="${prop}"]`);
    if (meta) {
      console.log(`✅ ${prop}: ${meta.content}`);
    } else {
      console.log(`⚠️ ${prop}: Missing (recommended)`);
    }
  });

  console.log('\n🐦 Twitter Card Properties:');
  twitterProps.forEach(prop => {
    const meta = document.querySelector(`meta[name="${prop}"], meta[property="${prop}"]`);
    if (meta) {
      console.log(`✅ ${prop}: ${meta.content}`);
    } else {
      console.log(`❌ ${prop}: NOT FOUND`);
    }
  });

  // Test image accessibility
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    console.log('\n🖼️ Image Accessibility Test:');
    console.log(`📍 Image URL: ${ogImage.content}`);
    
    const img = new Image();
    img.onload = () => {
      console.log('✅ OG Image loads successfully');
      console.log(`📏 Image dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
    };
    img.onerror = () => console.log('❌ OG Image failed to load');
    img.src = ogImage.content;

    // Check if using HTTPS and proper format
    if (ogImage.content.startsWith('https://')) {
      console.log('✅ Using HTTPS');
    } else {
      console.log('⚠️ Not using HTTPS');
    }

    if (ogImage.content.includes('.png') || ogImage.content.includes('.jpg')) {
      console.log('✅ WhatsApp-compatible format');
    } else {
      console.log('⚠️ May not work with WhatsApp (use PNG/JPG)');
    }
  }

  // Check structured data
  console.log('\n📊 Structured Data:');
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  console.log(`Found ${structuredData.length} structured data schemas`);
  structuredData.forEach((script, index) => {
    try {
      const data = JSON.parse(script.textContent);
      console.log(`✅ Schema ${index + 1}: ${data['@type']} - Valid JSON`);
    } catch (error) {
      console.log(`❌ Schema ${index + 1}: Invalid JSON`);
    }
  });
};

// Run the enhanced check
checkMetadata();

// WhatsApp compatibility check
console.log('\n💬 WhatsApp Compatibility:');
const whatsappCheck = () => {
  const title = document.querySelector('meta[property="og:title"]');
  const description = document.querySelector('meta[property="og:description"]');
  const image = document.querySelector('meta[property="og:image"]');
  const url = document.querySelector('meta[property="og:url"]');
  
  let score = 0;
  if (title?.content) { console.log('✅ Title present'); score++; }
  if (description?.content) { console.log('✅ Description present'); score++; }
  if (image?.content) { console.log('✅ Image present'); score++; }
  if (url?.content) { console.log('✅ URL present'); score++; }
  
  console.log(`\n📊 WhatsApp Score: ${score}/4`);
  if (score === 4) console.log('🎉 Perfect WhatsApp compatibility!');
};

whatsappCheck();

console.log('\n=== TEST COMPLETE ===');
console.log('💡 For more detailed testing, copy the enhanced validation script from scripts/validate-metadata.js');
