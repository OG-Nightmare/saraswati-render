import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause, ShieldCheck, Zap, Gauge, Award, Sparkles, Flame } from 'lucide-react';

import heroDucati from '../assets/hero_ducati.webp';
import heroBmw from '../assets/hero_bmw.webp';
import heroKawasaki from '../assets/hero_kawasaki.webp';
import heroYamaha from '../assets/hero_yamaha.webp';
import heroAprilia from '../assets/hero_aprilia.webp';
import heroMvagusta from '../assets/hero_mvagusta.webp';
import api from '../lib/api';

// ── Static fallback data (shown while loading or if no featured bikes exist) ──
export const HERO_SUPERBIKES = [
  {
    id: 'ducati-v4s',
    brand: 'Ducati',
    model: 'Panigale V4 S',
    subtitle: 'Desmosedici Stradale • 1103 cc',
    tag: 'FLAGSHIP SUPERBIKE',
    power: '214 HP',
    acceleration: '2.8s (0-100)',
    topSpeed: '315 km/h',
    price: '₹28.90 Lakhs',
    image: heroDucati,
    color: '#E11D48',
    specs: { engine: '1103cc V4', torque: '124 Nm @ 10,000 RPM', weight: '174 kg' },
  },
  {
    id: 'bmw-s1000rr',
    brand: 'BMW Motorrad',
    model: 'S1000RR M Package',
    subtitle: 'ShiftCam Inline-4 • 999 cc',
    tag: 'TRACK EDITION',
    power: '207 HP',
    acceleration: '2.9s (0-100)',
    topSpeed: '303 km/h',
    price: '₹24.50 Lakhs',
    image: heroBmw,
    color: '#2563EB',
    specs: { engine: '999cc Inline-4', torque: '113 Nm @ 11,000 RPM', weight: '193 kg' },
  },
  {
    id: 'kawasaki-h2',
    brand: 'Kawasaki',
    model: 'Ninja H2 Carbon',
    subtitle: 'Supercharged Inline-4 • 998 cc',
    tag: 'SUPERCHARGED HYPERBIKE',
    power: '310 HP',
    acceleration: '2.5s (0-100)',
    topSpeed: '337 km/h',
    price: '₹38.00 Lakhs',
    image: heroKawasaki,
    color: '#16A34A',
    specs: { engine: '998cc Supercharged', torque: '141.7 Nm @ 11,000 RPM', weight: '216 kg' },
  },
  {
    id: 'yamaha-r1m',
    brand: 'Yamaha',
    model: 'YZF-R1M Carbon',
    subtitle: 'Crossplane CP4 • 998 cc',
    tag: 'MOTOGP EDITION',
    power: '200 HP',
    acceleration: '2.9s (0-100)',
    topSpeed: '299 km/h',
    price: '₹26.75 Lakhs',
    image: heroYamaha,
    color: '#0284C7',
    specs: { engine: '998cc Crossplane', torque: '113.3 Nm @ 11,500 RPM', weight: '202 kg' },
  },
  {
    id: 'aprilia-rsv4',
    brand: 'Aprilia',
    model: 'RSV4 1100 Factory',
    subtitle: 'Narrow V4 Engine • 1099 cc',
    tag: 'ITALIAN V4 FACTORY',
    power: '217 HP',
    acceleration: '2.8s (0-100)',
    topSpeed: '305 km/h',
    price: '₹27.20 Lakhs',
    image: heroAprilia,
    color: '#DC2626',
    specs: { engine: '1099cc 65° V4', torque: '125 Nm @ 10,500 RPM', weight: '179 kg' },
  },
  {
    id: 'mv-agusta',
    brand: 'MV Agusta',
    model: 'Superveloce 800',
    subtitle: 'Neo-Retro Triple • 798 cc',
    tag: 'COLLECTOR SPEC',
    power: '147 HP',
    acceleration: '3.0s (0-100)',
    topSpeed: '240 km/h',
    price: '₹22.50 Lakhs',
    image: heroMvagusta,
    color: '#D97706',
    specs: { engine: '798cc Triple', torque: '88 Nm @ 10,100 RPM', weight: '173 kg' },
  },
];

// ── Brand accent colours (used when a real API vehicle doesn't specify one) ──
const BRAND_COLORS = {
  ducati: '#E11D48',
  bmw: '#2563EB',
  kawasaki: '#16A34A',
  yamaha: '#0284C7',
  aprilia: '#DC2626',
  mv: '#D97706',
  triumph: '#6D28D9',
  harley: '#B45309',
  honda: '#DC2626',
  suzuki: '#F97316',
  ktm: '#EA580C',
};

function getBrandColor(brand = '') {
  const lower = brand.toLowerCase();
  for (const [key, color] of Object.entries(BRAND_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return '#FF5500';
}

// ── Convert an API vehicle object to the hero display shape ──────────────────
export function vehicleToHeroBike(v) {
  const firstImg = v.images?.[0];
  const imgUrl =
    (firstImg && typeof firstImg === 'object' ? firstImg.url : firstImg) ||
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80';

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v.price || 0);

  const displacement = v.displacement || v.fuelType || '';
  const subtitle = [v.year, displacement].filter(Boolean).join(' • ');

  const categoryTag =
    v.category === 'superbike'
      ? 'FLAGSHIP SUPERBIKE'
      : v.subcategory === 'sports'
      ? 'TRACK EDITION'
      : v.subcategory === 'cruiser'
      ? 'TOURING ICON'
      : v.subcategory === 'adventure'
      ? 'ADVENTURE'
      : 'VERIFIED SUPERBIKE';

  const formatWeight = (w) => {
    if (!w) return '—';
    const str = String(w).trim();
    if (!str) return '—';
    return str.toLowerCase().includes('kg') ? str : `${str} kg`;
  };

  return {
    id: v._id,
    _vehicleId: v._id,          // keep the real ID for linking to detail page
    brand: v.brand || 'Unknown',
    model: v.title || v.model || 'Superbike',
    subtitle: subtitle || 'Premium Superbike',
    tag: categoryTag,
    power: v.power || '—',
    acceleration: v.acceleration || '—',
    topSpeed: v.topSpeed || '—',
    price: formattedPrice,
    image: imgUrl,
    color: getBrandColor(v.brand),
    specs: {
      engine: displacement || '—',
      torque: v.torque || '—',
      weight: formatWeight(v.weight),
    },
  };
}

export default function PhotoShuffleHero() {
  const [bikes, setBikes] = useState(HERO_SUPERBIKES);   // starts with fallback
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  // ── Fetch featured bikes from the API on mount ───────────────────────────
  useEffect(() => {
    api
      .get('/vehicles?featured=true&limit=10&status=available')
      .then((res) => {
        const list = Array.isArray(res.data?.vehicles)
          ? res.data.vehicles
          : Array.isArray(res.data)
          ? res.data
          : [];
        if (list.length > 0) {
          setBikes(list.map(vehicleToHeroBike));
          setCurrentIdx(0);
        }
        // If list is empty, the static fallback already in state is kept
      })
      .catch(() => {
        // Network / auth error — silently keep the static fallback
      });
  }, []);

  const activeBike = bikes[currentIdx] || bikes[0];


  // Auto-shuffle effect
  useEffect(() => {
    if (!isAutoplay) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIdx((prev) => (prev + 1) % bikes.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplay, bikes.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIdx((prev) => (prev + 1) % bikes.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIdx((prev) => (prev - 1 + bikes.length) % bikes.length);
  };

  const handleSelect = (index) => {
    setDirection(index > currentIdx ? 1 : -1);
    setCurrentIdx(index);
  };

  return (
    <section id="featured-showcase" className="relative min-h-[92vh] pt-28 pb-12 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FAF5F0] via-[#FAFAFC] to-[#F3F4F6]">
      {/* Dynamic Background Glow ambient spotlight based on active bike brand color */}
      <div
        className="absolute -top-40 right-0 w-[650px] h-[650px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-1000 ease-out"
        style={{ backgroundColor: activeBike.color }}
      />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#FF5500]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Bar Banner / Trust Line */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5500]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#475569]">
              Delhi's Gallery for Verified Cheap, Budget & Luxury Superbikes
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#0F172A]">
            <span className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1 rounded-full shadow-xs">
              <Zap size={14} className="text-[#FF5500]" /> Budget & Flagship Bikes
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1 rounded-full shadow-xs">
              <ShieldCheck size={14} className="text-[#16A34A]" /> 100% Dyno Inspected
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1 rounded-full shadow-xs hidden sm:flex">
              <Award size={14} className="text-[#D97706]" /> Pan-India VIP Transport
            </span>
          </div>
        </div>
      </div>

      {/* Hero Body: Grid of Text HUD & Photo Shuffle */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* Left Column: Model Telemetry HUD & Details */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBike.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Tag & Brand Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xs text-white"
                  style={{ backgroundColor: activeBike.color }}
                >
                  {activeBike.tag}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg">
                  {activeBike.brand}
                </span>
              </div>

              {/* Title & Headline */}
              <div>
                <h2
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.02] text-[#0F172A]"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {activeBike.model}
                </h2>
                <p className="text-sm font-semibold tracking-wide text-[#64748B] mt-2 flex items-center gap-2">
                  <Sparkles size={15} className="text-[#D97706]" />
                  {activeBike.subtitle}
                </p>
              </div>

              {/* Telemetry Stats Pill Grid */}
              <div className="grid grid-cols-3 gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div className="text-center border-r border-[#E2E8F0] pr-2">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    <Zap size={12} className="text-[#FF5500]" /> Max Power
                  </div>
                  <div className="text-xl font-black text-[#0F172A]" style={{ fontFamily: 'Space Grotesk, monospace' }}>
                    {activeBike.power}
                  </div>
                </div>

                <div className="text-center border-r border-[#E2E8F0] pr-2">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    <Gauge size={12} className="text-[#D97706]" /> 0-100 km/h
                  </div>
                  <div className="text-xl font-black text-[#0F172A]" style={{ fontFamily: 'Space Grotesk, monospace' }}>
                    {activeBike.acceleration}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    <Flame size={12} className="text-[#FF5500]" /> Top Speed
                  </div>
                  <div className="text-xl font-black text-[#0F172A]" style={{ fontFamily: 'Space Grotesk, monospace' }}>
                    {activeBike.topSpeed}
                  </div>
                </div>
              </div>

              {/* Pricing & Call to Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-xs uppercase font-bold text-[#64748B] tracking-wider block">Pre-Owned Valuation</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FF5500]" style={{ fontFamily: 'Space Grotesk, monospace' }}>
                    {activeBike.price}
                  </span>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <Link
                    to="/inventory"
                    className="flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:-translate-y-0.5"
                  >
                    View All Bikes <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-bold px-5 py-3.5 rounded-xl border border-[#CBD5E1] transition-all hover:-translate-y-0.5"
                  >
                    Book Test Drive
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Main Photo Showcase & Shuffle Card */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px]">
          
          {/* Main Photo Shuffle Frame */}
          <div className="relative w-full h-[360px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#0F172A] group">
            
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={activeBike.id}
                src={activeBike.image}
                alt={`${activeBike.brand} ${activeBike.model}`}
                initial={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Gradient Overlay for photo readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/20 to-transparent pointer-events-none" />

            {/* Floating Top Right Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified In-Stock • Karol Bagh Gallery
            </div>

            {/* Floating Specs HUD Overlay bottom left */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between text-white">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5500] bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md">
                  {activeBike.specs.engine}
                </span>
                <p className="text-xs text-slate-200 font-medium">
                  {activeBike.specs.torque} • Weight: {activeBike.specs.weight}
                </p>
              </div>

              {/* Prev / Next Manual Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#0F172A] flex items-center justify-center transition-all shadow-md active:scale-95"
                  aria-label="Previous Superbike"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white flex items-center justify-center transition-all shadow-md active:scale-95"
                  aria-label="Next Superbike"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Auto Play Progress Line */}
            {isAutoplay && (
              <motion.div
                key={`progress-${currentIdx}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5.5, ease: 'linear' }}
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#FF5500] to-[#D97706] z-30"
              />
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: 6 Choice Photo Selection Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full mt-8">
        <div className="bg-white/90 backdrop-blur-xl border border-[#E2E8F0] p-3 sm:p-4 rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                SELECT PHOTO SHUFFLE ({currentIdx + 1}/{bikes.length})
              </span>
              <span className="text-[11px] text-[#64748B]">Click any bike to switch photo</span>
            </div>

            {/* Autoplay Pause / Play Toggle */}
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-2.5 py-1 rounded-lg transition-colors"
            >
              {isAutoplay ? (
                <>
                  <Pause size={12} className="text-[#FF5500]" /> Pause Shuffle
                </>
              ) : (
                <>
                  <Play size={12} className="text-[#16A34A]" /> Auto Shuffle
                </>
              )}
            </button>
          </div>

          {/* Thumbnail Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {bikes.map((bike, idx) => {
              const isActive = idx === currentIdx;
              return (
                <button
                  key={bike.id}
                  onClick={() => handleSelect(idx)}
                  className={`relative flex flex-col items-center p-1.5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden group ${
                    isActive
                      ? 'border-[#FF5500] bg-orange-50/50 shadow-md scale-[1.02]'
                      : 'border-transparent hover:border-[#CBD5E1] bg-[#F8FAFC]'
                  }`}
                >
                  <div className="relative w-full h-14 sm:h-16 rounded-lg overflow-hidden mb-1">
                    <img
                      src={bike.image}
                      alt={bike.model}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-[#FF5500]/20 border-2 border-[#FF5500] rounded-lg" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-[#0F172A] truncate w-full text-center">
                    {bike.brand}
                  </span>
                  <span className="text-[9px] text-[#64748B] truncate w-full text-center font-medium">
                    {bike.model}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}
