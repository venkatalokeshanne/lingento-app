/**
 * Comprehensive Metadata Validation Script
 * Tests all Open Graph, Twitter Card, and structured data implementation
 */

const validateMetadata = () => {
  console.log('🔍 Starting comprehensive metadata validation...\n');
  
  // Get all meta tags
  const metaTags = document.querySelectorAll('meta');
  const linkTags = document.querySelectorAll('link');
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  
  // Required Open Graph properties according to the protocol
  const requiredOGProperties = [
    'og:title',
    'og:type', 
    'og:image',
    'og:url'
  ];
  
  // Enhanced Open Graph properties for better social sharing
  const enhancedOGProperties = [
    'og:description',
    'og:site_name',
    'og:locale',
    'og:image:secure_url',
    'og:image:type',
    'og:image:width',
    'og:image:height',
    'og:image:alt'
  ];
  
  // Twitter Card properties
  const twitterProperties = [
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'twitter:site'
  ];
  
  let results = {
    ogRequired: {},
    ogEnhanced: {},
    twitter: {},
    structured: [],
    errors: [],
    warnings: []
  };
  
  // Check Open Graph tags
  console.log('📋 Checking Open Graph metadata...');
  
  metaTags.forEach(tag => {
    const property = tag.getAttribute('property') || tag.getAttribute('name');
    const content = tag.getAttribute('content');
    
    if (property && property.startsWith('og:')) {
      if (requiredOGProperties.includes(property)) {
        results.ogRequired[property] = content;
      }
      if (enhancedOGProperties.includes(property)) {
        results.ogEnhanced[property] = content;
      }
    }
    
    if (property && property.startsWith('twitter:')) {
      results.twitter[property] = content;
    }
  });
  
  // Validate required Open Graph properties
  console.log('\n✅ Required Open Graph Properties:');
  requiredOGProperties.forEach(prop => {
    if (results.ogRequired[prop]) {
      console.log(`  ✓ ${prop}: ${results.ogRequired[prop]}`);
    } else {
      console.log(`  ❌ ${prop}: MISSING`);
      results.errors.push(`Missing required property: ${prop}`);
    }
  });
  
  // Validate enhanced Open Graph properties
  console.log('\n🎯 Enhanced Open Graph Properties:');
  enhancedOGProperties.forEach(prop => {
    if (results.ogEnhanced[prop]) {
      console.log(`  ✓ ${prop}: ${results.ogEnhanced[prop]}`);
    } else {
      console.log(`  ⚠️ ${prop}: Missing (recommended for better sharing)`);
      results.warnings.push(`Missing recommended property: ${prop}`);
    }
  });
  
  // Validate Twitter Card properties
  console.log('\n🐦 Twitter Card Properties:');
  twitterProperties.forEach(prop => {
    if (results.twitter[prop]) {
      console.log(`  ✓ ${prop}: ${results.twitter[prop]}`);
    } else {
      console.log(`  ❌ ${prop}: MISSING`);
      results.errors.push(`Missing Twitter property: ${prop}`);
    }
  });
  
  // Check image accessibility
  console.log('\n🖼️ Image Validation:');
  const ogImage = results.ogRequired['og:image'] || results.ogEnhanced['og:image'];
  const ogImageAlt = results.ogEnhanced['og:image:alt'];
  
  if (ogImage) {
    console.log(`  ✓ Image URL: ${ogImage}`);
    
    // Check if it's using HTTPS
    if (ogImage.startsWith('https://')) {
      console.log('  ✓ Using HTTPS');
    } else {
      console.log('  ⚠️ Not using HTTPS - may cause issues with secure sites');
      results.warnings.push('Image not using HTTPS');
    }
    
    // Check image format
    if (ogImage.includes('.png') || ogImage.includes('.jpg') || ogImage.includes('.jpeg')) {
      console.log('  ✓ Using recommended image format (PNG/JPG)');
    } else if (ogImage.includes('.svg')) {
      console.log('  ⚠️ Using SVG - may not work with all platforms (WhatsApp prefers PNG/JPG)');
      results.warnings.push('SVG images may not work with all social platforms');
    }
    
    if (ogImageAlt) {
      console.log(`  ✓ Alt text provided: ${ogImageAlt}`);
    } else {
      console.log('  ⚠️ No alt text provided for accessibility');
      results.warnings.push('Missing image alt text');
    }
  }
  
  // Check structured data
  console.log('\n📊 Structured Data:');
  if (structuredData.length > 0) {
    structuredData.forEach((script, index) => {
      try {
        const data = JSON.parse(script.textContent);
        console.log(`  ✓ Schema ${index + 1}: ${data['@type'] || 'Unknown type'}`);
        results.structured.push(data);
      } catch (error) {
        console.log(`  ❌ Schema ${index + 1}: Invalid JSON`);
        results.errors.push(`Invalid structured data JSON in script ${index + 1}`);
      }
    });
  } else {
    console.log('  ⚠️ No structured data found');
    results.warnings.push('No structured data found');
  }
  
  // Check canonical URL
  console.log('\n🔗 SEO Elements:');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    console.log(`  ✓ Canonical URL: ${canonical.href}`);
  } else {
    console.log('  ⚠️ No canonical URL found');
    results.warnings.push('Missing canonical URL');
  }
  
  // Check meta description
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    const descLength = description.content.length;
    console.log(`  ✓ Meta description: ${descLength} characters`);
    if (descLength < 120 || descLength > 160) {
      console.log('  ⚠️ Description length not optimal (120-160 chars recommended)');
      results.warnings.push('Meta description length not optimal');
    }
  } else {
    console.log('  ❌ No meta description found');
    results.errors.push('Missing meta description');
  }
  
  // Summary
  console.log('\n📈 SUMMARY:');
  console.log(`  ✅ Required OG properties: ${Object.keys(results.ogRequired).length}/${requiredOGProperties.length}`);
  console.log(`  🎯 Enhanced OG properties: ${Object.keys(results.ogEnhanced).length}/${enhancedOGProperties.length}`);
  console.log(`  🐦 Twitter properties: ${Object.keys(results.twitter).length}/${twitterProperties.length}`);
  console.log(`  📊 Structured data schemas: ${results.structured.length}`);
  console.log(`  ❌ Errors: ${results.errors.length}`);
  console.log(`  ⚠️ Warnings: ${results.warnings.length}`);
  
  if (results.errors.length === 0) {
    console.log('\n🎉 All required metadata is present!');
  } else {
    console.log('\n❌ Issues found:');
    results.errors.forEach(error => console.log(`    - ${error}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️ Recommendations:');
    results.warnings.forEach(warning => console.log(`    - ${warning}`));
  }
  
  return results;
};

// WhatsApp-specific validation
const validateWhatsAppCompatibility = () => {
  console.log('\n💬 WhatsApp Compatibility Check:');
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  
  let whatsappScore = 0;
  let maxScore = 4;
  
  if (ogTitle && ogTitle.content) {
    console.log('  ✓ Title will be displayed');
    whatsappScore++;
  } else {
    console.log('  ❌ No title - link will show as plain URL');
  }
  
  if (ogDescription && ogDescription.content) {
    console.log('  ✓ Description will be displayed');
    whatsappScore++;
  } else {
    console.log('  ❌ No description - limited preview');
  }
  
  if (ogImage && ogImage.content) {
    console.log('  ✓ Image will be displayed');
    whatsappScore++;
    
    // Check image format for WhatsApp
    if (ogImage.content.includes('.png') || ogImage.content.includes('.jpg')) {
      console.log('  ✓ Image format compatible with WhatsApp');
    } else {
      console.log('  ⚠️ Image format may not work with WhatsApp (use PNG/JPG)');
    }
  } else {
    console.log('  ❌ No image - text-only preview');
  }
  
  if (ogUrl && ogUrl.content) {
    console.log('  ✓ URL is properly set');
    whatsappScore++;
  } else {
    console.log('  ❌ No URL specified');
  }
  
  console.log(`\n💬 WhatsApp Preview Score: ${whatsappScore}/${maxScore}`);
  
  if (whatsappScore === maxScore) {
    console.log('🎉 Perfect WhatsApp compatibility!');
  } else if (whatsappScore >= 3) {
    console.log('👍 Good WhatsApp compatibility');
  } else {
    console.log('⚠️ Limited WhatsApp preview - consider adding missing metadata');
  }
};

// Test image accessibility
const testImageAccessibility = async (imageUrl) => {
  console.log(`\n🔍 Testing image accessibility: ${imageUrl}`);
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    if (response.ok) {
      console.log('  ✅ Image is accessible');
      console.log(`  📏 Response status: ${response.status}`);
      
      const contentType = response.headers.get('content-type');
      if (contentType) {
        console.log(`  🎨 Content-Type: ${contentType}`);
      }
      
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeKB = Math.round(contentLength / 1024);
        console.log(`  📦 Size: ${sizeKB} KB`);
        
        if (sizeKB > 5000) {
          console.log('  ⚠️ Large image size - may slow down preview loading');
        }
      }
    } else {
      console.log(`  ❌ Image not accessible (${response.status})`);
    }
  } catch (error) {
    console.log(`  ❌ Error accessing image: ${error.message}`);
  }
};

// Main validation function
const runFullValidation = async () => {
  console.log('🚀 LINGENTO METADATA VALIDATION\n');
  console.log('='.repeat(50));
  
  const results = validateMetadata();
  validateWhatsAppCompatibility();
  
  // Test image accessibility if we have an image URL
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && ogImage.content) {
    await testImageAccessibility(ogImage.content);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Validation complete!');
  console.log('\nTo test your links:');
  console.log('1. Facebook Debugger: https://developers.facebook.com/tools/debug/');
  console.log('2. Twitter Card Validator: https://cards-dev.twitter.com/validator');
  console.log('3. LinkedIn Inspector: https://www.linkedin.com/post-inspector/');
  console.log('4. WhatsApp: Share the link in a chat to test');
  
  return results;
};

// Auto-run if script is loaded
if (typeof window !== 'undefined') {
  // Make functions available globally for manual testing
  window.validateMetadata = validateMetadata;
  window.validateWhatsAppCompatibility = validateWhatsAppCompatibility;
  window.testImageAccessibility = testImageAccessibility;
  window.runFullValidation = runFullValidation;
  
  console.log('🛠️ Metadata validation tools loaded!');
  console.log('Run runFullValidation() to test your metadata');
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateMetadata,
    validateWhatsAppCompatibility,
    testImageAccessibility,
    runFullValidation
  };
}
