import { useEffect } from 'react';

/**
 * SEO Component for Single Page Applications (Vite + React)
 * Dynamically updates document title, meta tags, canonical links, and JSON-LD structured data.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  schemaJson,
}) {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title;
    }

    // Helper to create or update meta tags
    const setMeta = (attr, val, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${val}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    if (title) {
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }

    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
      setMeta('name', 'twitter:image', ogImage);
    }

    // 3. Canonical Link
    const url = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (url) {
      setMeta('property', 'og:url', url);
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', url);
    }

    // 4. JSON-LD Structured Data
    let schemaScript = null;
    if (schemaJson) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-dynamic-seo', 'true');
      schemaScript.text = typeof schemaJson === 'string' ? schemaJson : JSON.stringify(schemaJson);
      document.head.appendChild(schemaScript);
    }

    return () => {
      // Clean up injected dynamic schema on route change
      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, schemaJson]);

  return null;
}
