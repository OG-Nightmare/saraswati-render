import fs from 'fs';
import path from 'path';
import process from 'node:process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender] dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

const routes = [
  {
    route: 'inventory',
    title: 'Cheap Superbikes in Delhi, Second Hand & Pre-Owned Superbikes | Saraswati Superbikes',
    description: "Explore Delhi NCR's best verified collection of cheap superbikes in Delhi, budget second hand sports bikes, and pre-owned superbikes in Karol Bagh. 120-point dyno inspected with easy EMI.",
    canonical: 'https://saraswatimotors.in/inventory',
    keywords: 'cheap superbikes in delhi, cheap superbikes, affordable superbikes delhi, budget superbikes karol bagh, best second hand bikes, premium superbikes delhi, reliable used bikes karol bagh, best sports bikes delhi, racing bikes, how to get a bike in delhi, reliable bike dealer delhi',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Cheap Superbikes & Pre-Owned Superbikes Fleet in Delhi',
      description: 'Explore Delhi NCR premier verified collection of cheap superbikes, budget sports bikes and pre-owned luxury motorcycles at Saraswati Superbikes in Karol Bagh.',
      url: 'https://saraswatimotors.in/inventory',
      provider: {
        '@type': 'MotorcycleDealer',
        name: 'Saraswati Superbikes',
        url: 'https://saraswatimotors.in/',
        telephone: '+919811798761'
      }
    }
  },
  {
    route: 'services',
    title: 'Best Superbike Services Delhi | Premium & Reliable Motorcycle Studio | Saraswati Superbikes',
    description: 'Ranked the best & most reliable superbike services in Delhi NCR. Premium 120-point dyno inspection, fast Delhi RTO RC transfer, lowest EMI superbike finance & Pan-India enclosed transport in Karol Bagh.',
    canonical: 'https://saraswatimotors.in/services',
    keywords: 'best services, best superbike services delhi, premium bike services, reliable bike service delhi, most reliable superbike dealer, best rc transfer service delhi, premium superbike finance, reliable motorcycle inspection, best second hand bike services delhi, superbike dyno tuning karol bagh, trusted superbike workshop delhi',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Superbike Services & Motorcycle Dealership Solutions',
      provider: {
        '@type': 'MotorcycleDealer',
        name: 'Saraswati Superbikes',
        url: 'https://saraswatimotors.in/',
        telephone: '+919811798761',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'T-2531, Faiz Road',
          addressLocality: 'Karol Bagh',
          addressRegion: 'New Delhi',
          postalCode: '110005',
          addressCountry: 'IN'
        }
      },
      areaServed: {
        '@type': 'Country',
        name: 'India'
      }
    }
  },
  {
    route: 'about',
    title: 'Best & Most Reliable Superbike Showroom in Delhi | About Saraswati Superbikes',
    description: 'Discover why Saraswati Superbikes is rated the best, most reliable and premium pre-owned superbike showroom in Delhi NCR. Karol Bagh heritage, 120-point dyno checks & verified paperwork.',
    canonical: 'https://saraswatimotors.in/about',
    keywords: 'best superbike showroom delhi, reliable bike dealer delhi, premium superbike showroom karol bagh, best second hand bike dealer, reliable used superbike gallery, most trusted motorcycle dealer delhi, saraswati superbikes heritage',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Saraswati Superbikes - Delhi’s Premier Motorcycle Gallery',
      description: 'Learn about Saraswati Superbikes, Delhi NCR’s best and most reliable showroom for verified pre-owned luxury superbikes and sports motorcycles.',
      url: 'https://saraswatimotors.in/about',
      mainEntity: {
        '@type': 'MotorcycleDealer',
        name: 'Saraswati Superbikes',
        url: 'https://saraswatimotors.in/',
        image: 'https://saraswatimotors.in/s_logo_metallic.png',
        telephone: '+919811798761',
        priceRange: '₹₹₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'T-2531, Faiz Road',
          addressLocality: 'Karol Bagh',
          addressRegion: 'New Delhi',
          postalCode: '110005',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 28.6507,
          longitude: 77.1983
        }
      }
    }
  },
  {
    route: 'contact',
    title: 'Best & Most Reliable Superbike Showroom Near Me | Contact Saraswati Superbikes Delhi',
    description: 'Visit Delhi NCR’s best and most reliable superbike showroom at T-2531 Faiz Road, Karol Bagh. Call +91 98117 98761 for premium test rides, instant valuation & verified pre-owned bikes.',
    canonical: 'https://saraswatimotors.in/contact',
    keywords: 'best bike showroom near me, superbike showroom near me, reliable bike dealer karol bagh, contact saraswati superbikes, test ride superbike delhi, most reliable bike showroom delhi, pre owned bike dealer faiz road',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Saraswati Superbikes Karol Bagh Delhi',
      description: 'Visit Delhi NCR’s premier superbike showroom at T-2531 Faiz Road, Karol Bagh. Contact us for test rides, dyno inspection & pre-owned luxury motorcycle sales.',
      url: 'https://saraswatimotors.in/contact',
      mainEntity: {
        '@type': 'MotorcycleDealer',
        name: 'Saraswati Superbikes',
        url: 'https://saraswatimotors.in/',
        image: 'https://saraswatimotors.in/s_logo_metallic.png',
        telephone: '+919811798761',
        priceRange: '₹₹₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'T-2531, Faiz Road',
          addressLocality: 'Karol Bagh',
          addressRegion: 'New Delhi',
          postalCode: '110005',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 28.6507,
          longitude: 77.1983
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '11:30',
            closes: '20:30'
          }
        ]
      }
    }
  },
  {
    route: 'sell',
    title: 'Best Place to Sell Your Superbike in Delhi | Reliable Valuation & Instant Payout',
    description: 'Sell your superbike or sports bike to Delhi\'s best and most reliable motorcycle dealer. Instant transparent valuation, spot same-day payment & guaranteed RC transfer in Karol Bagh.',
    canonical: 'https://saraswatimotors.in/sell',
    keywords: 'best place to sell superbike delhi, reliable bike buyers delhi, sell superbike for highest price, instant payment bike valuation, sell sports bike karol bagh, best used bike valuation delhi, sell used kawasaki ducati bmw',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Sell Your Superbike in Delhi | Instant Valuation & Spot Payout',
      description: 'Sell your pre-owned superbike or sports bike to Delhi NCR’s best and most reliable motorcycle dealer. Instant transparent valuation, spot same-day payment & guaranteed RC transfer in Karol Bagh.',
      url: 'https://saraswatimotors.in/sell',
      mainEntity: {
        '@type': 'Service',
        name: 'Pre-Owned Superbike Buyout & Trade-In Service',
        serviceType: 'Motorcycle Valuation & Spot Purchase',
        provider: {
          '@type': 'MotorcycleDealer',
          name: 'Saraswati Superbikes',
          url: 'https://saraswatimotors.in/',
          telephone: '+919811798761',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'T-2531, Faiz Road',
            addressLocality: 'Karol Bagh',
            addressRegion: 'New Delhi',
            postalCode: '110005',
            addressCountry: 'IN'
          }
        },
        areaServed: {
          '@type': 'Country',
          name: 'India'
        }
      }
    }
  }
];

let generated = 0;

routes.forEach((item) => {
  let html = template;

  // Title tag
  html = html.replace(/<title>.*?<\/title>/i, `<title>${item.title}</title>`);
  html = html.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/i, `<meta name="title" content="${item.title}" />`);

  // Meta description
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${item.description}" />`);

  // Canonical link
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${item.canonical}" />`);

  // Keywords
  if (item.keywords) {
    html = html.replace(/<meta\s+name="keywords"\s+content=".*?"\s*\/?>/i, `<meta name="keywords" content="${item.keywords}" />`);
  }

  // Open Graph
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${item.title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${item.description}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${item.canonical}" />`);

  // Twitter
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${item.title}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${item.description}" />`);
  html = html.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${item.canonical}" />`);

  // Inject route-specific structured data
  if (item.schema) {
    const schemaTag = `\n    <!-- Route Structured Data -->\n    <script type="application/ld+json" data-route-schema="true">\n    ${JSON.stringify(item.schema, null, 2)}\n    </script>\n  </head>`;
    html = html.replace('</head>', schemaTag);
  }

  const targetDir = path.join(distDir, item.route);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
  generated++;
  console.log(`[prerender] Generated static HTML for /${item.route} -> ${targetFile}`);
});

console.log(`[prerender] Successfully generated ${generated} static route files.`);
