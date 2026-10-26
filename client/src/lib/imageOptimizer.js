/**
 * Image URL Optimization Utility
 * Automatically injects responsive compression parameters for Cloudinary & Unsplash:
 * - f_auto: Serves modern formats (WebP/AVIF)
 * - q_auto: Intelligent compression saving ~70-85% file size
 * - w_...: Downscales 4K raw photos to appropriate screen sizes
 */
export function optimizeImageUrl(url, width = 800) {
  if (!url || typeof url !== 'string') return url;

  // Cloudinary CDN optimization
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/f_auto') || url.includes('/w_')) {
      return url;
    }
    return url.replace('/upload/', `/upload/f_auto,q_auto:good,w_${width},c_limit/`);
  }

  // Unsplash CDN optimization
  if (url.includes('images.unsplash.com')) {
    if (url.includes('auto=format')) return url;
    return `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=${width}&q=80`;
  }

  return url;
}
