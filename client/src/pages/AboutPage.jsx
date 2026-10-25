import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Eye, Heart, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';

function AnimCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0; const step = target / (1500 / 16);
    const t = setInterval(() => { s += step; if (s >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const milestones = [
  { value: 500, suffix: '+', label: 'Bikes Sold' },
  { value: 4.9, suffix: '★', label: 'Google Rating' },
  { value: 5, suffix: '+', label: 'Years in Business' },
  { value: 1000, suffix: '+', label: 'Happy Customers' },
];

const values = [
  { icon: Shield, title: 'Trust', desc: 'Every deal is backed by transparency and honesty.' },
  { icon: Eye, title: 'Transparency', desc: 'No hidden charges, no surprises — ever.' },
  { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is our ultimate priority.' },
  { icon: TrendingUp, title: 'Quality', desc: 'Only verified, inspected vehicles make our list.' },
];

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Saraswati Superbikes - Delhi’s Premier Motorcycle Gallery',
    description: 'Learn about Saraswati Superbikes, Delhi NCR’s best and most reliable showroom for verified pre-owned luxury superbikes and sports motorcycles.',
    mainEntity: {
      '@type': 'MotorcycleDealer',
      name: 'Saraswati Superbikes',
      address: 'T-2531, Faiz Road, Karol Bagh, New Delhi 110005',
      telephone: '+919811798761',
      priceRange: '₹₹₹₹',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '184',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-16">
      <SEO
        title="Best & Most Reliable Superbike Showroom in Delhi | About Saraswati Superbikes"
        description="Discover why Saraswati Superbikes is rated the best, most reliable and premium pre-owned superbike showroom in Delhi NCR. Karol Bagh heritage, 120-point dyno checks & verified paperwork."
        keywords="best superbike showroom delhi, reliable bike dealer delhi, premium superbike showroom karol bagh, best second hand bike dealer, reliable used superbike gallery, most trusted motorcycle dealer delhi, saraswati superbikes heritage"
        canonicalUrl="https://saraswatimotors.in/about"
        schemaJson={aboutSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="text-[#FF5500] text-xs font-black uppercase tracking-widest mb-3 block">Delhi's Landmark Heritage</span>
          <h1 className="text-4xl md:text-6xl font-black text-[#1C1C1E] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            The Best & Most Reliable <br />
            <span className="text-[#FF5500]">Superbike Studio in Delhi</span>
          </h1>
          <p className="text-[#6B6965] text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Saraswati Superbikes (Saraswati Motors) has built its premier reputation across India on uncompromising
            reliability, track-tested mechanical inspection, and 100% legal transparency.
            Based in Karol Bagh, New Delhi — we are the trusted landmark destination for collectors and enthusiasts.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">How It Started</span>
            <h2 className="text-3xl font-black text-[#1C1C1E] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Building Trust Since Day One</h2>
            <div className="space-y-4 text-[#6B6965] leading-relaxed">
              <p>
                Saraswati Motors was founded with one simple mission: to make bike buying completely transparent
                and trustworthy. In a market where buyers often feel uncertain, we set out to be different.
              </p>
              <p>
                Located in Naiwala, Karol Bagh — one of Delhi's most vibrant automotive hubs — we have served
                hundreds of satisfied customers across Delhi NCR. Every vehicle we sell undergoes a rigorous
                inspection process before it reaches our showroom floor.
              </p>
              <p>
                Our team is passionate about automobiles and even more passionate about customer satisfaction.
                We don't just sell bikes — we build relationships.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1580310614729-ccd69652491d?auto=format&fit=crop&w=1200&q=80"
                alt="Our showroom"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-[#F97316] text-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>5+</div>
              <div className="text-sm font-semibold opacity-90">Years of Trust</div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {milestones.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-[#E5E4E0] rounded-2xl p-6 text-center shadow-sm"
            >
              <div className="text-4xl font-black text-[#F97316] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <AnimCounter target={m.value} suffix={m.suffix} />
              </div>
              <div className="text-[#6B6965] text-sm">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission / Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-[#E5E4E0] rounded-2xl p-8 shadow-sm"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-black text-[#1C1C1E] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Our Mission</h3>
            <p className="text-[#6B6965] leading-relaxed">
              To provide every customer in Delhi NCR with access to thoroughly verified, fairly priced
              pre-owned bikes backed by complete transparency — making bike ownership accessible and stress-free.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#E5E4E0] rounded-2xl p-8 shadow-sm"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-black text-[#1C1C1E] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Our Vision</h3>
            <p className="text-[#6B6965] leading-relaxed">
              To become Delhi's most trusted used bike dealership — known not just for the quality of bikes
              we sell, but for the lasting relationships we build with every customer.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#1C1C1E]" style={{ fontFamily: 'Outfit, sans-serif' }}>Our Core Values</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-[#E5E4E0] rounded-2xl p-6 text-center hover:border-[#F97316]/40 hover:shadow-md transition-all shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-[#F97316]" />
                </div>
                <h4 className="text-[#1C1C1E] font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{v.title}</h4>
                <p className="text-[#6B6965] text-xs leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
