# WhatsApp Link Preview Troubleshooting Guide

## Why WhatsApp might not show previews:

1. **SVG Images**: WhatsApp sometimes has issues with SVG files
   - Solution: Convert og-image.svg to og-image.png (1200x630px)
   - Update metadata to use PNG instead

2. **Cache Issues**: WhatsApp caches link previews aggressively
   - Solution: Clear WhatsApp cache or wait 24-48 hours
   - Use different URL parameters to force refresh

3. **HTTPS Required**: WhatsApp requires HTTPS for link previews
   - Your site needs to be deployed with SSL certificate
   - localhost won't work for WhatsApp testing

## Testing Steps:

1. **Deploy your site** to production (Vercel, Netlify, etc.)
2. **Test with Facebook Debugger**: https://developers.facebook.com/tools/debug/
   - WhatsApp uses similar parsing as Facebook
3. **Test with Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **Clear WhatsApp cache**: 
   - Android: Settings > Storage > Clear Cache
   - iOS: Delete and reinstall WhatsApp

## Quick Fix for PNG Image:

1. Open og-image.svg in a browser
2. Take a screenshot or use browser dev tools to export as PNG
3. Resize to exactly 1200x630 pixels
4. Save as og-image.png in public folder
5. Update metadata to use PNG instead of SVG

## Updated Metadata (use PNG):

```javascript
openGraph: {
  images: [
    {
      url: 'https://lingentoo.com/og-image.png', // Changed from .svg
      width: 1200,
      height: 630,
      alt: 'Lingento - Learn Languages with Smart Flashcards',
      type: 'image/png', // Changed from svg+xml
    },
  ],
},
```
