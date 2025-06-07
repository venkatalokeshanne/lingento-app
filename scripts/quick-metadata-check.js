/**
 * Quick Metadata Check - Simplified validation for development
 * Copy and paste this into browser console for quick metadata testing
 */

(() => {
  console.clear();
  console.log('🔍 QUICK METADATA CHECK\n');
  
  // Essential Open Graph checks
  const getMetaContent = (property) => {
    const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
    return meta ? meta.content : null;
  };
  
  const checks = [
    { property: 'og:title', label: 'Title' },
    { property: 'og:description', label: 'Description' },
    { property: 'og:image', label: 'Image' },
    { property: 'og:url', label: 'URL' },
    { property: 'og:type', label: 'Type' },
    { property: 'twitter:card', label: 'Twitter Card' },
  ];
  
  console.log('📋 Essential Properties:');
  checks.forEach(({ property, label }) => {
    const value = getMetaContent(property);
    if (value) {
      console.log(`✅ ${label}: ${value}`);
    } else {
      console.log(`❌ ${label}: MISSING`);
    }
  });
  
  // Quick image check
  const ogImage = getMetaContent('og:image');
  if (ogImage) {
    console.log('\n🖼️ Image Analysis:');
    console.log(`📍 URL: ${ogImage}`);
    console.log(`🔒 HTTPS: ${ogImage.startsWith('https://') ? '✅' : '❌'}`);
    console.log(`📱 WhatsApp Compatible: ${ogImage.includes('.png') || ogImage.includes('.jpg') ? '✅' : '⚠️'}`);
  }
  
  // Structured data check
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  console.log(`\n📊 Structured Data: ${structuredData.length} schemas found`);
  
  // Quick summary
  const missingCount = checks.filter(({ property }) => !getMetaContent(property)).length;
  console.log(`\n📈 Summary: ${checks.length - missingCount}/${checks.length} essential properties present`);
  
  if (missingCount === 0) {
    console.log('🎉 All essential metadata present!');
  } else {
    console.log(`⚠️ ${missingCount} properties missing - check above`);
  }
  
  console.log('\n💡 For full validation, run: runFullValidation()');
})();
