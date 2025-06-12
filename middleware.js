import { NextResponse } from 'next/server';

export function middleware(request) {
  // Force HTTPS redirect
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host');
  
  // Check if request is HTTP (not HTTPS)
  if (forwardedProto === 'http' && host === 'lingentoo.com') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url, { status: 301 });
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
