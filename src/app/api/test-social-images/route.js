import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lingentoo.com';
  
  const imagesToTest = [
    'og-image.svg',
    'twitter-image.svg',
    'favicon.svg'
  ];
  
  const results = [];
  
  for (const image of imagesToTest) {
    try {
      const imageUrl = `${baseUrl}/${image}`;
      const response = await fetch(imageUrl, { method: 'HEAD' });
      results.push({
        image,
        url: imageUrl,
        status: response.status,
        accessible: response.ok,
        contentType: response.headers.get('content-type')
      });
    } catch (error) {
      results.push({
        image,
        url: `${baseUrl}/${image}`,
        status: 'ERROR',
        accessible: false,
        error: error.message
      });
    }
  }
  
  return NextResponse.json({
    message: 'Social media image accessibility test',
    baseUrl,
    results,
    summary: {
      total: results.length,
      accessible: results.filter(r => r.accessible).length,
      failed: results.filter(r => !r.accessible).length
    }
  });
}
