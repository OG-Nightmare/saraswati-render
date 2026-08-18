import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Flame } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/inventory', label: 'Superbike Fleet' },
  { to: '/services', label: 'VIP Services' },
  { to: '/about', label: 'Our Legacy' },
  { to: '/contact', label: 'Showroom' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const isHomePage = window.location.pathname === '/';

      if (isHomePage) {
        // Header stays HIDDEN during top frame & intro scroll (< 650px)
        // Header FADES IN ONLY AFTER the intro animation section has been scrolled down (currentY >= 650px)
        if (currentY >= 650) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      } else {
        setVisible(true);
      }

      setScrolled(currentY > 20);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -8,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out pointer-events-${visible ? 'auto' : 'none'} ${
          scrolled
            ? 'py-3 bg-white/20 backdrop-blur-2xl shadow-sm shadow-slate-900/5 border-b border-sky-200/30 text-[#0F172A]'
            : 'py-4 bg-white/15 backdrop-blur-xl border-b border-sky-100/25 text-[#0F172A]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#FF5500] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-white/40">
              <span className="text-white text-xl font-black tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>S</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="text-[#0F172A]">SARASWATI</span>
                <span className="text-[#FF5500]">SUPERBIKES</span>
              </span>
              <div className="text-[10px] text-[#475569] font-extrabold -mt-1 tracking-widest uppercase flex items-center gap-1">
                <Flame size={10} className="text-[#D97706]" /> Luxury Pre-Owned Gallery
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links (Transparent Frosted Glass Pills - No Solid Color) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/30 backdrop-blur-xl border border-white/50 p-1.5 rounded-2xl shadow-xs">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-[#0F172A] shadow-md'
                      : 'text-[#0F172A] hover:text-[#FF5500] hover:bg-white/50'
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
              className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A] bg-white/40 hover:bg-white/70 border border-white/60 px-3.5 py-2.5 rounded-xl transition-all shadow-xs backdrop-blur-md"
            >
              <Phone size={14} className="text-[#FF5500]" />
              +91 98117 98761
            </a>
            <Link
              to="/sell"
              className="text-xs font-black uppercase tracking-wider bg-[#FF5500] text-white px-5 py-2.5 rounded-xl hover:bg-[#E04B00] transition-all shadow-lg shadow-orange-500/25 hover:scale-[1.02]"
            >
              Sell Superbike
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-[#0F172A] p-2 rounded-xl hover:bg-white/40"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-white/30 backdrop-blur-3xl text-[#0F172A] flex flex-col pt-24 px-6 shadow-2xl"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-extrabold uppercase tracking-wider py-3.5 px-5 rounded-2xl transition-colors ${
                      isActive ? 'text-white bg-[#0F172A]' : 'text-[#0F172A] hover:bg-white/60'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <a
                href="tel:+919811798761"
                className="text-lg font-bold py-3.5 px-5 rounded-2xl text-[#475569] bg-white/50"
                onClick={() => setMobileOpen(false)}
              >
                📞 Hotline: +91 98117 98761
              </a>
            </nav>
            <div className="mt-8 px-2 flex flex-col gap-3">
              <Link
                to="/sell"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-[#FF5500] text-white font-extrabold uppercase tracking-wider py-4 rounded-2xl text-base shadow-xl"
              >
                Sell Your Superbike
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
