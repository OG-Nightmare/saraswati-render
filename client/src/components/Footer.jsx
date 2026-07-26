import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Share2, Rss, Video, ArrowUp } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/inventory', label: 'All Bikes' },
  { to: '/inventory?category=superbike', label: 'Superbikes' },
  { to: '/inventory?category=city', label: 'City Bikes' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const superbikeLinks = [
  { to: '/inventory?category=superbike&subcategory=sports', label: '🏁 Sports' },
  { to: '/inventory?category=superbike&subcategory=cruiser', label: '🛣️ Cruiser' },
  { to: '/inventory?category=superbike&subcategory=adventure', label: '⛰️ Adventure' },
  { to: '/inventory?category=superbike&subcategory=naked', label: '⚡ Naked' },
  { to: '/inventory?category=superbike&subcategory=tourer', label: '🗺️ Tourer' },
];

const cityLinks = [
  { to: '/inventory?category=city&subcategory=commuter', label: '🏙️ Commuter' },
  { to: '/inventory?category=city&subcategory=cruiser', label: '🛣️ Cruiser' },
  { to: '/inventory?category=city&subcategory=sports', label: '🏁 Sports' },
  { to: '/inventory?category=city&subcategory=adventure', label: '⛰️ Adventure' },
  { to: '/inventory?category=city&subcategory=naked', label: '⚡ Naked' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#111118] border-t border-white/5">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — spans 2 cols on large */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center shadow-md shadow-orange-900/30">
                <span className="text-white text-lg font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>S</span>
              </div>
              <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="text-[#F97316]">Saraswati</span>
                <span className="text-white"> Motors</span>
              </span>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Delhi's most trusted pre-owned motorcycle dealership. Every bike verified. Every price transparent. Every customer satisfied.
            </p>

            {/* Social */}
            <div className="flex gap-2 mb-6">
              {[
                { href: 'https://instagram.com', Icon: Share2, label: 'Instagram' },
                { href: 'https://facebook.com', Icon: Rss, label: 'Facebook' },
                { href: 'https://youtube.com', Icon: Video, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#F97316] hover:border-[#F97316]/40 hover:bg-[#F97316]/10 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Contact info */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#F97316] mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-xs leading-relaxed">1735/55, Pocket 29, Naiwala,<br />Karol Bagh, New Delhi — 110005</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[#F97316] flex-shrink-0" />
                <a href="tel:+919811798761" className="text-white/50 text-xs hover:text-white transition-colors">+91 98117 98761</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-[#F97316] flex-shrink-0" />
                <a href="mailto:info@saraswatimotors.in" className="text-white/50 text-xs hover:text-white transition-colors">info@saraswatimotors.in</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/50 text-sm hover:text-[#F97316] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Superbikes */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">Superbikes</h4>
            <ul className="space-y-2.5">
              {superbikeLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/50 text-sm hover:text-[#F97316] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* City Bikes */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest">City Bikes</h4>
            <ul className="space-y-2.5">
              {cityLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/50 text-sm hover:text-[#F97316] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Hours */}
            <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
              <p className="font-semibold text-white mb-1.5">⏰ Working Hours</p>
              <p className="text-white/50">Mon – Sat: 9 AM – 7 PM</p>
              <p className="text-white/50">Sun: 10 AM – 4 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Saraswati Motors. All rights reserved. · Made with 🧡 in Delhi
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-white/30 hover:text-[#F97316] transition-colors group"
          >
            Back to top
            <ArrowUp size={13} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
