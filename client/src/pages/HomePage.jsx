import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  ChevronRight,
  Star,
  Zap,
  Flame,
  Truck,
  FileCheck,
  BadgeDollarSign,
  PhoneCall,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

import ScrollIntroHero from '../components/ScrollIntroHero';
import PhotoShuffleHero from '../components/PhotoShuffleHero';
import SuperbikeShowcase from '../components/SuperbikeShowcase';
import VehicleCard from '../components/VehicleCard';
import FeaturedReels from '../components/FeaturedReels';
import api from '../lib/api';

// ── Superbike Manufacturers Marquee ──────────────────────────────────────
const MARQUEE_BRANDS = [
  { name: 'DUCATI', icon: '🇮🇹' },
  { name: 'BMW MOTORRAD', icon: '🇩🇪' },
  { name: 'KAWASAKI', icon: '🇯🇵' },
  { name: 'YAMAHA', icon: '🇯🇵' },
  { name: 'APRILIA', icon: '🇮🇹' },
  { name: 'MV AGUSTA', icon: '🇮🇹' },
  { name: 'TRIUMPH', icon: '🇬🇧' },
  { name: 'HARLEY-DAVIDSON', icon: '🇺🇸' },
  { name: 'HONDA BIGWING', icon: '🇯🇵' },
  { name: 'SUZUKI', icon: '🇯🇵' },
];

// ── Testimonials Carousel ──────────────────────────────────────────────────
function TestimonialsSection({ testimonials }) {
  const [idx, setIdx] = useState(0);

  const fallbackTestimonials = [
    {
      _id: '1',
      name: 'Rohan Sharma',
      bikeBought: 'Kawasaki Ninja Z900',
      review: 'Bought a Kawasaki Z900 from Saraswati Superbikes. The bike was in immaculate condition, single owner with complete service history and dyno record. Smooth transfer process!',
      rating: 5,
    },
    {
      _id: '2',
      name: 'Priya Verma',
      bikeBought: 'Ducati Monster 821',
      review: 'Fair pricing and completely transparent dealing. Got my Ducati Monster with valid insurance and 100% verified documentation. Highly recommended superbike gallery in Delhi!',
      rating: 5,
    },
    {
      _id: '3',
      name: 'Amit Patel',
      bikeBought: 'Ducati Panigale V2',
      review: 'Sold my Honda CB350 here and upgraded to a Ducati Panigale V2. Excellent valuation for my trade-in and seamless enclosed delivery right to my home.',
      rating: 5,
    },
  ];

  const list = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % list.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [list.length]);

  const t = list[idx] || list[0];
  if (!t) return null;

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 text-center shadow-xl pt-14"
      >
        {/* Google Verified Review Badge */}
        <div className="absolute top-4 right-4 sm:right-6 flex items-center gap-1.5 bg-[#FFF4ED] text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full text-[#FF5500] border border-[#FF5500]/20 shadow-xs">
          <svg className="w-4 h-4 fill-[#FF5500]" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.328 0-6.03-2.701-6.03-6.03s2.702-6.03 6.03-6.03c1.5 0 2.865.549 3.921 1.453l3.072-3.072C18.995 2.806 15.827 1.7 12.24 1.7 6.444 1.7 1.7 6.444 1.7 12.24s4.744 10.54 10.54 10.54c5.795 0 10.54-4.744 10.54-10.54 0-.7-.082-1.399-.24-2.075H12.24z" />
          </svg>
          Verified Owner Review
        </div>

        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: t.rating || 5 }).map((_, i) => (
            <Star key={i} size={20} className="text-[#F59E0B] fill-[#F59E0B]" />
          ))}
        </div>

        <p className="text-[#0F172A] text-lg sm:text-xl font-medium leading-relaxed mb-8 italic">
          "{t.review}"
        </p>

        <div className="flex items-center justify-center gap-3">
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#D97706] flex items-center justify-center text-white font-black text-xl shadow-lg">
            {t.name?.[0] || 'U'}
          </div>
          <div className="text-left">
            <p className="text-[#0F172A] font-extrabold text-base">{t.name}</p>
            <p className="text-[#FF5500] text-xs font-bold">
              {t.bikeBought || 'Superbike Collector'} • Delhi NCR
            </p>
          </div>
        </div>
      </motion.div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2.5 mt-6">
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-[#FF5500] w-8' : 'bg-[#E2E8F0] w-2.5'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    Promise.allSettled([
      api.get('/vehicles?featured=true&limit=6'),
      api.get('/testimonials'),
    ]).then(([featRes, testRes]) => {
      if (featRes.status === 'fulfilled') {
        const list = Array.isArray(featRes.value.data?.vehicles)
          ? featRes.value.data.vehicles
          : Array.isArray(featRes.value.data)
            ? featRes.value.data
            : [];
        setFeatured(list);
      } else {
        setFeatured([]);
      }
      if (testRes.status === 'fulfilled') {
        const list = Array.isArray(testRes.value.data) ? testRes.value.data : [];
        setTestimonials(list);
      }
    });
  }, []);

  const filteredVehicles =
    activeCategory === 'all'
      ? featured || []
      : (featured || []).filter((v) =>
        activeCategory === 'superbike'
          ? v.category === 'superbike'
          : v.subcategory === activeCategory
      );

  return (
    <div className="bg-[#FAFAFC] min-h-screen">

      {/* ── 0. Dark Scroll-Driven Intro Hero ────────────────────────────── */}
      <ScrollIntroHero />

      {/* ── 1. 6-Photo Shuffle Hero Section ───────────────────────────── */}
      <PhotoShuffleHero />

      {/* ── 2. Superbike Marquee Ticker ──────────────────────────────────── */}
      <div className="bg-[#0F172A] py-4 overflow-hidden border-y border-slate-800 shadow-md">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
            <div key={i} className="flex items-center gap-3 text-white text-xs font-black tracking-widest uppercase">
              <span className="text-base">{brand.icon}</span>
              <span className="text-slate-200">{brand.name}</span>
              <span className="text-[#FF5500] font-mono text-sm ml-4">•</span>
            </div>
          ))}
        </div>
      </div>


      {/* ── 4. Featured Superbike Reels (Full-Width Alternating 5-Reel Showcase) ── */}
      <section className="py-20 sm:py-24 md:py-28 max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6 border-b border-[#E2E8F0]/60 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#FF5500] mb-3">
              <Sparkles size={16} /> Verified Gallery Showcase
            </div>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Featured <span className="text-gradient-orange">Reels</span>
            </h2>
          </div>
        </div>

        {/* Full-Width 5-Reel Alternating Showcase */}
        <FeaturedReels />

        <div className="mt-16 md:mt-24 text-center">
          <Link
            to="/inventory"
            className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold uppercase tracking-wider text-xs px-9 py-4.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.03]"
          >
            Explore Complete Superbike Fleet <ArrowRight size={16} className="text-[#FF5500]" />
          </Link>
        </div>
      </section>

      {/* ── 5. Why Choose Saraswati Superbikes (4 Pillars) ─────────────── */}
      <section className="py-20 bg-gradient-to-b from-[#F3F4F6] to-white relative border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200">
              The Saraswati Standard
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black text-[#0F172A] mt-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Why Collectors & Enthusiasts Trust Us
            </h2>
            <p className="text-sm text-[#64748B] mt-3">
              We specialize strictly in verified, accident-free, high-performance superbikes with full transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                color: 'text-[#FF5500]',
                bg: 'bg-orange-50',
                title: '120-Point Track Inspection',
                desc: 'Every superbike undergoes complete engine compression, chassis alignment, and electronics diagnostic testing.',
              },
              {
                icon: Truck,
                color: 'text-[#2563EB]',
                bg: 'bg-blue-50',
                title: 'Pan-India VIP Delivery',
                desc: 'Enclosed hydraulic truck transport right to your doorstep anywhere in India with real-time GPS tracking.',
              },
              {
                icon: FileCheck,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                title: 'Guaranteed RC & Legal Transfer',
                desc: '100% clear title documentation, zero hypothecation hassle, and hassle-free state transfer support.',
              },
              {
                icon: BadgeDollarSign,
                color: 'text-[#D97706]',
                bg: 'bg-amber-50',
                title: 'Transparent Superbike Valuation',
                desc: 'Fair market trade-in prices with immediate payout and buyback assurance for future upgrades.',
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${pillar.bg} flex items-center justify-center mb-6`}>
                  <pillar.icon size={28} className={pillar.color} />
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials Carousel ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#D97706] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
              Rider Experiences
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black text-[#0F172A] mt-3"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Words From Superbike Owners
            </h2>
          </div>
          <TestimonialsSection testimonials={testimonials} />
        </div>
      </section>

      {/* ── 7. VIP Concierge & Trade-In CTA ────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#1E293B] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-slate-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5500]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 bg-[#FF5500] text-white text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
                <PhoneCall size={14} /> VIP Superbike Concierge
              </span>
              <h2
                className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Selling or Upgrading Your Superbike?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Get instant valuation, hassle-free pickup, and top market price for your Ducati, BMW, Kawasaki, or Yamaha superbike.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link
                to="/sell"
                className="flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-extrabold text-sm px-8 py-4 rounded-xl shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02]"
              >
                Get Free Superbike Valuation <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+919811798761"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-4 rounded-xl border border-white/20 transition-all"
              >
                Call Hotline: +91 98117 98761
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
