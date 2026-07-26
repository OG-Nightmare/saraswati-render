import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2, Award, ChevronRight, Star } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import heroWheelie from '../assets/hero-wheelie.jpg';
import api from '../lib/api';

// ── Testimonials Carousel ──────────────────────────────────────────────────
function TestimonialsSection({ testimonials }) {
  const [idx, setIdx] = useState(0);

  const fallbackTestimonials = [
    {
      _id: '1',
      name: 'Rohan Sharma',
      review: 'Bought a Kawasaki Z900 from Saraswati Motors. The bike was in immaculate condition, single owner with complete service history. Smooth transfer process!',
      rating: 5,
    },
    {
      _id: '2',
      name: 'Priya Verma',
      review: 'Fair pricing and completely transparent dealing. Got my Royal Enfield Meteor 350 at a great price with valid insurance. Highly recommended in Delhi!',
      rating: 5,
    },
    {
      _id: '3',
      name: 'Amit Patel',
      review: 'Sold my Honda CB350 here and bought a Ducati Panigale V2. Excellent valuation for my old bike and seamless documentation.',
      rating: 5,
    },
  ];

  const list = testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const filteredTestimonials = list.filter(t => t.rating >= 4);

  useEffect(() => {
    if (filteredTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % filteredTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [filteredTestimonials.length]);

  const t = filteredTestimonials[idx] || filteredTestimonials[0];
  if (!t) return null;

  return (
    <div className="relative max-w-3xl mx-auto px-4">
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white border border-[#E5E4E0] rounded-2xl p-8 text-center shadow-sm pt-12"
      >
        {/* Google Review Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#FFF5EE] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-[#F97316] border border-[#F97316]/10">
          <svg className="w-3.5 h-3.5 fill-[#F97316]" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.328 0-6.03-2.701-6.03-6.03s2.702-6.03 6.03-6.03c1.5 0 2.865.549 3.921 1.453l3.072-3.072C18.995 2.806 15.827 1.7 12.24 1.7 6.444 1.7 1.7 6.444 1.7 12.24s4.744 10.54 10.54 10.54c5.795 0 10.54-4.744 10.54-10.54 0-.7-.082-1.399-.24-2.075H12.24z" />
          </svg>
          Google Review
        </div>

        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: t.rating || 5 }).map((_, i) => (
            <Star key={i} size={18} className="text-[#F97316] fill-[#F97316]" />
          ))}
        </div>
        <p className="text-[#1C1C1E] text-lg leading-relaxed mb-6 italic">"{t.review}"</p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold text-xl shadow-md">
            {t.name?.[0] || 'U'}
          </div>
          <div className="text-left">
            <p className="text-[#1C1C1E] font-semibold">{t.name}</p>
            <p className="text-[#9C9A97] text-xs">Google Local Guide</p>
          </div>
        </div>
      </motion.div>
      <div className="flex justify-center gap-2 mt-5">
        {filteredTestimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'bg-[#F97316] w-6' : 'bg-[#E5E4E0] w-2'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Category Card ─────────────────────────────────────────────────────────────
function CategoryCard({ to, emoji, title, desc, count, accent, subcats }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        className={`relative rounded-3xl p-8 border-2 cursor-pointer overflow-hidden group transition-all duration-300 ${
          accent === 'red'
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100 hover:border-red-300 hover:shadow-2xl hover:shadow-red-100'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100'
        }`}
      >
        {/* Background decoration */}
        <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 ${accent === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} />

        <div className="text-5xl mb-4">{emoji}</div>
        <h3 className="text-2xl font-black text-[#1C1C1E] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
        <p className="text-[#6B6965] text-sm mb-5">{desc}</p>

        {/* Subcategory tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {subcats.map(sub => (
            <span
              key={sub}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                accent === 'red'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {sub}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-bold ${accent === 'red' ? 'text-red-600' : 'text-blue-600'}`}>
            {count === null || count === undefined ? 'Verified bikes available' : `${count} bikes available`}
          </span>
          <ArrowRight size={20} className={`group-hover:translate-x-2 transition-transform ${accent === 'red' ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [superbikesCount, setSuperbikesCount] = useState(null);
  const [cityCount, setCityCount] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      api.get('/vehicles?featured=true&limit=6'),
      api.get('/testimonials'),
      api.get('/vehicles?category=superbike&limit=1'),
      api.get('/vehicles?category=city&limit=1'),
    ]).then(([featRes, testRes, superRes, cityRes]) => {
      if (featRes.status === 'fulfilled') {
        const list = Array.isArray(featRes.value.data?.vehicles) ? featRes.value.data.vehicles : (Array.isArray(featRes.value.data) ? featRes.value.data : []);
        setFeatured(list);
      } else {
        setFeatured([]);
      }
      if (testRes.status === 'fulfilled') {
        const list = Array.isArray(testRes.value.data) ? testRes.value.data : [];
        setTestimonials(list);
      }
      if (superRes.status === 'fulfilled') {
        const count = typeof superRes.value.data?.total === 'number' ? superRes.value.data.total : (Array.isArray(superRes.value.data?.vehicles) ? superRes.value.data.vehicles.length : 9);
        setSuperbikesCount(count);
      } else {
        setSuperbikesCount(9);
      }
      if (cityRes.status === 'fulfilled') {
        const count = typeof cityRes.value.data?.total === 'number' ? cityRes.value.data.total : (Array.isArray(cityRes.value.data?.vehicles) ? cityRes.value.data.vehicles.length : 9);
        setCityCount(count);
      } else {
        setCityCount(9);
      }
    });
  }, []);

  return (
    <div className="bg-[#FAFAF8]">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FFF8F3]">
        {/* Background image — bright daylight bike */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroWheelie}
            alt="Hero background — bright motorcycle"
            className="w-full h-full object-cover scale-105 animate-[slowzoom_20s_ease-in-out_infinite_alternate]"
          />
          {/* Light gradient overlay — left side white fade for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F3] via-[#FFF8F3]/85 to-[#FFF8F3]/10" />
        </div>

        {/* Decorative speed lines */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -right-20 w-[600px] h-[2px] bg-gradient-to-l from-transparent via-[#F97316]/30 to-transparent rotate-[-8deg]" />
          <div className="absolute top-1/2 -right-20 w-[800px] h-[1px] bg-gradient-to-l from-transparent via-[#F97316]/15 to-transparent rotate-[-8deg]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#F97316]/15 border border-[#F97316]/40 text-[#F97316] text-sm font-semibold px-4 py-2 rounded-full mb-6"
            >
              🏆 Delhi's Most Trusted Bike Dealer
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black leading-[1.05] mb-5 text-[#1C1C1E]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Your Dream
              <br />
              <span className="text-[#F97316]">Bike Awaits</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[#4A4A4F] text-lg leading-relaxed mb-8 max-w-lg"
            >
              Superbikes to city cruisers — every bike verified, every price honest.
              Browse 20+ inspected bikes at Saraswati Motors, Delhi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/inventory"
                className="flex items-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] text-white font-bold px-7 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-orange-200/60 hover:-translate-y-0.5"
              >
                Browse Inventory <ArrowRight size={18} />
              </Link>
              <Link
                to="/sell"
                className="flex items-center gap-2 bg-white hover:bg-[#F4F3F0] text-[#1C1C1E] font-bold px-7 py-4 rounded-xl border border-[#E5E4E0] transition-all hover:-translate-y-0.5"
              >
                Sell Your Bike
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Value Props / Why Us ────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-[#E5E4E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 text-[#F97316]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#1C1C1E] text-base mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  100+ Point Inspection
                </h3>
                <p className="text-[#6B6965] text-sm leading-relaxed">
                  Engine, transmission, chassis, electricals — every bike is rigorously tested before listing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 text-[#F97316]">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#1C1C1E] text-base mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Verified Documents
                </h3>
                <p className="text-[#6B6965] text-sm leading-relaxed">
                  Clean RC, clear ownership history, valid insurance, zero NOC headaches guaranteed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 text-[#F97316]">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#1C1C1E] text-base mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Best Price Guarantee
                </h3>
                <p className="text-[#6B6965] text-sm leading-relaxed">
                  No hidden dealer margins. Honest market valuation whether buying or selling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Cards ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">Explore Categories</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1C1C1E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            What’s Your Ride Style?
          </h2>
          <p className="text-[#6B6965] max-w-xl mx-auto">
            Whether you crave raw track power or everyday city comfort — we’ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <CategoryCard
              to="/inventory?category=superbike"
              emoji="🏍️"
              title="Superbikes"
              desc="High-performance machines for the passionate rider. Kawasaki, BMW, Ducati, Harley-Davidson & more."
              count={superbikesCount}
              accent="red"
              subcats={['Sports', 'Cruiser', 'Adventure', 'Naked', 'Tourer']}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <CategoryCard
              to="/inventory?category=city"
              emoji="🛵"
              title="City Bikes"
              desc="Practical, efficient, and stylish — perfect for daily commutes and weekend rides around the city."
              count={cityCount}
              accent="blue"
              subcats={['Commuter', 'Cruiser', 'Sports', 'Adventure', 'Naked']}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Featured Vehicles ──────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-[#F4F3F0]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">Hand-Picked</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1C1E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Featured Bikes
            </h2>
            <p className="text-[#6B6965] max-w-xl mx-auto">
              Thoroughly inspected, competitively priced — our top picks this week.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {(() => {
              if (featured === null) {
                return Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-[#E5E4E0] rounded-2xl animate-pulse" />
                ));
              }
              const featuredList = Array.isArray(featured) ? featured : [];
              return featuredList.length
                ? featuredList.map((v, i) => <VehicleCard key={v._id} vehicle={v} index={i} />)
                : Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-80 bg-[#E5E4E0] rounded-2xl animate-pulse" />
                  ));
            })()}
          </div>
          <div className="text-center">
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 bg-[#1C1C1E] hover:bg-[#333] text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              View All Bikes <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ──────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">Customer Reviews</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1C1E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              What Riders Say
            </h2>
            <p className="text-[#6B6965] max-w-xl mx-auto">
              Real experiences from riders who found their dream bike at Saraswati Motors.
            </p>
          </div>
          <TestimonialsSection testimonials={testimonials} />
        </div>
      </section>

    </div>
  );
}
