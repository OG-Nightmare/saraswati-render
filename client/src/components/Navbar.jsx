import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-white/95 backdrop-blur-md shadow-sm shadow-black/5 border-b border-[#E5E4E0]'
            : 'py-5 bg-white/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
              <span className="text-white text-lg font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>S</span>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="text-[#F97316]">Saraswati</span>
                <span className="text-[#1C1C1E]"> Motors</span>
              </span>
              <div className="text-[10px] text-[#9C9A97] font-medium -mt-0.5 tracking-wide">Premium Pre-Owned Bikes</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-[#F97316] bg-orange-50'
                      : 'text-[#6B6965] hover:text-[#1C1C1E] hover:bg-[#F4F3F0]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919811798761"
              className="flex items-center gap-2 text-sm text-[#6B6965] hover:text-[#1C1C1E] transition-colors font-medium"
            >
              <Phone size={14} className="text-[#F97316]" />
              +91 98117 98761
            </a>
            <Link
              to="/sell"
              className="text-sm bg-[#F97316] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#EA6C10] transition-all shadow-md shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5"
            >
              Sell Your Bike
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-[#1C1C1E] p-2 rounded-lg hover:bg-[#F4F3F0]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-xl font-bold py-3 px-4 rounded-xl transition-colors ${isActive ? 'text-[#F97316] bg-orange-50' : 'text-[#1C1C1E] hover:bg-[#F4F3F0]'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <a
                href="tel:+919811798761"
                className="text-xl font-bold py-3 px-4 rounded-xl text-[#6B6965]"
                onClick={() => setMobileOpen(false)}
              >
                📞 +91 98117 98761
              </a>
            </nav>
            <div className="mt-6 px-4 flex flex-col gap-3">
              <Link
                to="/sell"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-[#F97316] text-white font-bold py-4 rounded-xl text-lg shadow-md"
              >
                Sell Your Bike
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
