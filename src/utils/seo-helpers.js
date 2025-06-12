// SEO helper functions for ensuring proper HTTPS and canonical URLs

/**
 * Ensures all URLs are HTTPS and properly formatted
 * @param {string} path - The path to convert to absolute HTTPS URL
 * @returns {string} - Properly formatted HTTPS URL
 */
export function ensureHttpsUrl(path) {
  const baseUrl = 'https://lingentoo.com';
  
  // Handle relative paths
  if (path.startsWith('/')) {
    return `${baseUrl}${path}`;
  }
  
  // Handle full URLs that might be HTTP
  if (path.startsWith('http://')) {
    return path.replace('http://', 'https://');
  }
  
  // Handle HTTPS URLs or other protocols
  if (path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }
  
  // Handle relative paths without leading slash
  return `${baseUrl}/${path}`;
}

/**
 * Generates canonical link tag for any page
 * @param {string} path - The current page path
 * @returns {object} - Metadata object with canonical URL
 */
export function generateCanonicalMeta(path) {
  return {
    alternates: {
      canonical: ensureHttpsUrl(path),
    },
  };
}

/**
 * Generates robots meta tags to prevent HTTP indexing issues
 * @param {boolean} noindex - Whether to prevent indexing
 * @param {boolean} nofollow - Whether to prevent following links
 * @returns {object} - Robots metadata
 */
export function generateRobotsMeta(noindex = false, nofollow = false) {
  const robots = [];
  
  if (noindex) robots.push('noindex');
  else robots.push('index');
  
  if (nofollow) robots.push('nofollow');
  else robots.push('follow');
  
  // Always add directives to prevent HTTP caching issues
  robots.push('max-snippet:-1');
  robots.push('max-image-preview:large');
  robots.push('max-video-preview:-1');
  
  return {
    robots: robots.join(', '),
  };
}

/**
 * Complete SEO metadata with HTTPS enforcement
 * @param {object} pageMetadata - Page-specific metadata
 * @param {string} currentPath - Current page path
 * @returns {object} - Complete metadata object
 */
export function generateSEOMetadata(pageMetadata, currentPath) {
  return {
    ...pageMetadata,
    ...generateCanonicalMeta(currentPath),
    ...generateRobotsMeta(),
    metadataBase: new URL('https://lingentoo.com'),
  };
}
