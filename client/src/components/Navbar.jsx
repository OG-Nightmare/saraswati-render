import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Tag, Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';

const navLinks = [
  { to: '/', label: 'HOME' },
  { to: '/inventory', label: 'SUPERBIKE FLEET' },
  { to: '/services', label: 'VIP SERVICES' },
  { to: '/about', label: 'OUR LEGACY' },
  { to: '/contact', label: 'SHOWROOM' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTranslucent, setIsTranslucent] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [showNavbar, setShowNavbar] = useState(!isHome);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Smooth scroll transition & visibility:
  // On homepage: hidden on initial landing (scrollY === 0), glides in as user starts scrolling (> 25px)
  // When scrolling past the video hero onto white/light background sections, become frosted translucent glass
  useEffect(() => {
    const isHomepage = location.pathname === '/';
    let ticking = false;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const shouldShow = isHomepage ? scrollY > 25 : true;
      const shouldTranslucent = isHomepage ? scrollY > window.innerHeight * 1.82 : scrollY > 30;

      setShowNavbar(prev => (prev !== shouldShow ? shouldShow : prev));
      setIsTranslucent(prev => (prev !== shouldTranslucent ? shouldTranslucent : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          y: showNavbar ? 0 : -100,
          opacity: showNavbar ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-6 pt-0 pointer-events-auto"
      >
        <div
          className={`max-w-[1440px] mx-auto rounded-b-2xl sm:rounded-b-3xl px-4 sm:px-7 flex items-center justify-between transition-all duration-500 ease-out border-x border-b ${
            isTranslucent
              ? 'py-2 sm:py-2.5 bg-[#07090E]/60 backdrop-blur-xl md:backdrop-blur-2xl border-[#FF5500]/30 shadow-[0_10px_35px_rgba(0,0,0,0.35)]'
              : 'py-2.5 sm:py-3 bg-[#07090E]/95 backdrop-blur-2xl border-[#FF5500]/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)]'
          }`}
        >
          {/* Left: Official Brand Logo & Wordmark */}
          <BrandLogo size={42} />

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? isTranslucent
                        ? 'text-white bg-black/50 border border-white/20 shadow-inner'
                        : 'text-white bg-[#121622] border border-white/15 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <>
                        {/* Glowing orange underline & centered neon dot as in photo */}
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Phone Hotline & Sell Superbike CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Phone Hotline Pill */}
            <a
              href="tel:+919811798761"
              className={`flex items-center gap-2.5 border hover:border-white/30 text-white font-extrabold text-xs px-4 py-2 rounded-full transition-all shadow-sm ${
                isTranslucent
                  ? 'bg-black/50 border-white/20 hover:bg-black/70'
                  : 'bg-black/60 border-white/15 hover:bg-black/90'
              }`}
            >
              <Phone size={13} className="text-[#FF5500] fill-[#FF5500]" />
              <span className="tracking-wide">+91 98117 98761</span>
            </a>

            {/* Subtle Divider */}
            <div className="w-[1px] h-5 bg-white/20 mx-0.5 hidden lg:block" />

            {/* Sell Superbike Orange Action Button */}
            <Link
              to="/sell"
              className="flex items-center gap-2 bg-gradient-to-r from-[#FF5500] to-[#FF4500] hover:brightness-110 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] flex-shrink-0"
            >
              <Tag size={14} className="text-white flex-shrink-0" />
              <span>SELL YOUR SUPERBIKE</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} className="text-[#FF5500]" /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#07090E]/95 backdrop-blur-3xl text-white flex flex-col pt-24 px-6 border-b border-[#FF5500]/40 shadow-2xl"
          >
            <nav className="flex flex-col gap-2.5 pt-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-extrabold uppercase tracking-wider py-3.5 px-5 rounded-2xl transition-all ${
                      isActive
                        ? 'text-white bg-[#121622] border border-[#FF5500]/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <a
                href="tel:+919811798761"
                className="flex items-center gap-3 text-sm font-bold py-3.5 px-5 rounded-2xl text-slate-200 bg-black/60 border border-white/10 mt-2"
              >
                <Phone size={16} className="text-[#FF5500] fill-[#FF5500]" />
                +91 98117 98761
              </a>
            </nav>

            <div className="mt-6">
              <Link
                to="/sell"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-[#FF5500] to-[#FF4500] text-white font-extrabold uppercase tracking-wider py-4 rounded-xl text-sm shadow-xl shadow-orange-500/25"
              >
                <Tag size={16} />
                Sell Your Superbike
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
