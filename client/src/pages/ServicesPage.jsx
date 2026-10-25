import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  FileCheck2,
  Truck,
  BadgePercent,
  Flame,
  Award,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Gauge,
  Repeat,
  ShieldAlert,
  Clock,
  Zap,
} from 'lucide-react';
import SEO from '../components/SEO';

const PREMIUM_SERVICES = [
  {
    icon: Gauge,
    badge: 'Best Diagnostic Standard',
    title: '120-Point Dyno & Mechanical Inspection',
    tagline: 'The Most Reliable Superbike Health Check in Delhi',
    desc: 'Every motorcycle undergoes rigorous engine compression testing, ECU OBD-II diagnostics, chassis laser alignment, braking system micrometer checks, and a full dynamometer power curve run.',
    highlights: ['Engine Compression & Valve Clearance', 'ECU Diagnostic & Sensor Mapping', 'Chassis Laser Straightness Check', 'Dyno Horsepower & Torque Validation'],
    color: 'from-orange-500 to-amber-500',
    iconColor: 'text-[#FF5500]',
    bgIcon: 'bg-orange-500/10',
  },
  {
    icon: FileCheck2,
    badge: '100% Legal Guarantee',
    title: 'Fast & Reliable Delhi RTO RC Transfer',
    tagline: 'Guaranteed Name Transfer & All-India NOC',
    desc: 'Say goodbye to bureaucratic RTO hurdles. We handle complete ownership transfer at Delhi RTO, hypothecation termination (Form 35), police clearance, and seamless inter-state NOC dispatch.',
    highlights: ['Delhi RTO Form 29 & 30 Processing', 'Fast-Track State NOC Dispatch', 'Hypothecation (Loan) Clearance', 'Crime & Traffic Challan Verification'],
    color: 'from-blue-500 to-indigo-500',
    iconColor: 'text-blue-500',
    bgIcon: 'bg-blue-500/10',
  },
  {
    icon: Truck,
    badge: 'Premium White-Glove Care',
    title: 'Pan-India VIP Enclosed Transport',
    tagline: 'Climate-Controlled & GPS-Tracked Delivery',
    desc: 'Transport your prized machine safely to any doorstep in India. Our dedicated enclosed hydraulic transport vehicles feature pneumatic soft wheel chocks, suspension ties, and 100% transit insurance.',
    highlights: ['Enclosed Hydraulic Tail-Lift Trucks', 'Zero-Contact Soft Tie Restraints', 'Real-Time Satellite GPS Tracking', 'Comprehensive Transit Insurance Included'],
    color: 'from-emerald-500 to-teal-500',
    iconColor: 'text-emerald-500',
    bgIcon: 'bg-emerald-500/10',
  },
  {
    icon: BadgePercent,
    badge: 'Best Financing Rates',
    title: 'Premium Superbike Finance & Quick EMI',
    tagline: 'Instant Loan Approvals with Premier Banking Partners',
    desc: 'Own your dream superbike with flexible EMI tenures up to 60 months. We partner with premier banks including HDFC, ICICI, and IDFC First Bank to offer competitive interest rates starting at 8.25%.',
    highlights: ['Low Down Payment Options', 'Flexible 12 to 60 Month Tenures', 'Instant In-Showroom Pre-Approval', 'Minimal Documentation Required'],
    color: 'from-purple-500 to-pink-500',
    iconColor: 'text-purple-500',
    bgIcon: 'bg-purple-500/10',
  },
  {
    icon: Award,
    badge: 'Top Market Valuation',
    title: 'Reliable Valuation & Spot Buyout',
    tagline: 'Immediate IMPS/RTGS Payout Within 60 Minutes',
    desc: 'Looking to sell your motorcycle quickly? Get an algorithm-backed transparent valuation with zero hidden fees. We inspect on-site and transfer the complete purchase amount directly to your bank account.',
    highlights: ['Zero Commission or Brokerage', 'Doorstep Inspection Available', 'Spot Same-Day Bank Settlement', 'Instant Loan Hypothecation Payoff'],
    color: 'from-amber-500 to-orange-500',
    iconColor: 'text-amber-500',
    bgIcon: 'bg-amber-500/10',
  },
  {
    icon: Repeat,
    badge: 'Seamless Upgrade',
    title: 'Superbike Exchange & Trade-In Concierge',
    tagline: 'Upgrade Your Current Ride to a 1000cc+ Beast',
    desc: 'Trade in your middleweight or commuter motorcycle for an exotic hyperbike or track machine. We offer generous trade-in bonuses, transparent valuation, and same-day ride-away paperwork.',
    highlights: ['Generous Loyalty Trade-In Bonus', 'Accepting All Major Brands & CCs', 'Single-Window Exchange Paperwork', 'Instant Equity Credit Towards Upgrade'],
    color: 'from-cyan-500 to-blue-500',
    iconColor: 'text-cyan-500',
    bgIcon: 'bg-cyan-500/10',
  },
  {
    icon: ShieldCheck,
    badge: 'Complete Peace of Mind',
    title: 'Comprehensive Insurance & Claim Support',
    tagline: 'Zero-Depreciation Cover & Network Garage Tie-Ups',
    desc: 'Protect your superbike with policies specifically negotiated for high-performance motorcycles. Includes zero-depreciation coverage, engine protector add-ons, and 24/7 national roadside assistance.',
    highlights: ['Zero-Depreciation Superbike Cover', 'Engine & Gearbox Protection Add-on', '24/7 Pan-India Roadside Assistance', 'Cashless Repairs at Authorized Centers'],
    color: 'from-rose-500 to-red-500',
    iconColor: 'text-rose-500',
    bgIcon: 'bg-rose-500/10',
  },
  {
    icon: Sparkles,
    badge: 'Bespoke Sourcing',
    title: 'Exotic & Rare Superbike Sourcing',
    tagline: 'Custom Procurement for Collector Grade Machines',
    desc: 'Hunting for a rare Ducati Superleggera, BMW M1000RR, or Yamaha R1M? Our VIP concierge leverages an exclusive collector network across India to locate, verify, and deliver pristine machines.',
    highlights: ['Nationwide Collector Network Search', 'Single-Owner Document Verification', 'Detailed Provenance & Service Audit', 'Turnkey Doorstep Delivery'],
    color: 'from-violet-500 to-purple-500',
    iconColor: 'text-violet-500',
    bgIcon: 'bg-violet-500/10',
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Technical Inspection Standard',
    saraswati: '120-Point Multi-Diagnostic & Dyno Power Run',
    localDealers: 'Casual visual glance & basic test spin',
  },
  {
    feature: 'RTO & RC Transfer Guarantee',
    saraswati: '100% Guaranteed Official Delhi RTO Transfer & All-India NOC',
    localDealers: 'Endless broker delays, buyer assumes all legal risks',
  },
  {
    feature: 'Pan-India Transport',
    saraswati: 'Enclosed hydraulic container with GPS & full transit insurance',
    localDealers: 'Open tempo trucks with high risk of transport scratches',
  },
  {
    feature: 'Pricing & Commission',
    saraswati: 'Single transparent quote, 0% mediator commissions',
    localDealers: 'Inflated dealer markups & surprise hidden fees',
  },
  {
    feature: 'Finance & EMI Rates',
    saraswati: 'Tier-1 Banking partners (HDFC, ICICI, IDFC) starting at 8.25%',
    localDealers: 'High-interest non-banking local lenders',
  },
];

const FAQS = [
  {
    q: 'Why are Saraswati Superbikes services rated the best and most reliable in Delhi?',
    a: 'We combine track-grade technical precision with 100% legal transparency. Every bike is vetted with a 120-point dyno inspection, backed by single-owner verified history, and processed through authorized Delhi RTO channels. With over 1,200 successful deliveries and a 4.9★ rating, we are Delhi NCR’s premier luxury motorcycle studio.',
  },
  {
    q: 'How fast is your reliable Delhi RTO RC transfer and outstation NOC service?',
    a: 'For Delhi NCR buyers, standard RC transfer is initiated immediately upon purchase, with documentation delivered in 15-21 working days. For buyers outside Delhi, an official RTO No Objection Certificate (NOC) is expedited within 7-10 working days so you can easily register in your home state.',
  },
  {
    q: 'What is included in the premium 120-point superbike inspection?',
    a: 'Our inspection covers 4 critical pillars: 1. Engine & Powertrain (compression test, valve clearance, spark, dyno curve), 2. Frame & Suspension (laser alignment, fork seal pressure, swingarm bearings), 3. Electronics & Diagnostics (OBD-II ECU error logs, ABS/TCS sensors, battery health), 4. Legal & Documentation (chassis number forensic check, hypothecation NOC, police database audit).',
  },
  {
    q: 'How does your VIP enclosed pan-India delivery protect my superbike?',
    a: 'Unlike open transport trucks, our custom-built hydraulic trailers are completely enclosed and weatherproof. Your superbike is loaded via a soft-touch hydraulic lift, secured with pneumatic front wheel chocks and soft nylon tie-downs that never touch fairing paint. The vehicle is tracked live via GPS with full transit insurance coverage.',
  },
  {
    q: 'Can I get financing and low-EMI options for a pre-owned superbike?',
    a: 'Yes! We have official tie-ups with leading financial institutions including HDFC Bank, ICICI Bank, and IDFC First Bank. We offer customized EMI schemes with tenures from 12 to 60 months and interest rates starting from 8.25%, with pre-approvals processed in under 24 hours.',
  },
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const servicesSchema = {
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
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Best & Most Reliable Superbike Services in Delhi',
      itemListElement: PREMIUM_SERVICES.map((s) => ({
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: '0',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0',
          priceCurrency: 'INR',
          name: 'Transparent Consultation & Booking',
        },
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.desc,
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pt-24 pb-20">
      <SEO
        title="Best Superbike Services Delhi | Premium & Reliable Motorcycle Studio | Saraswati Superbikes"
        description="Ranked the best & most reliable superbike services in Delhi NCR. Premium 120-point dyno inspection, fast Delhi RTO RC transfer, lowest EMI superbike finance & Pan-India enclosed transport in Karol Bagh."
        keywords="best services, best superbike services delhi, premium bike services, reliable bike service delhi, most reliable superbike dealer, best rc transfer service delhi, premium superbike finance, reliable motorcycle inspection, best second hand bike services delhi, superbike dyno tuning karol bagh, trusted superbike workshop delhi"
        canonicalUrl="https://saraswatimotors.in/services"
        schemaJson={servicesSchema}
      />

      {/* ── 1. Hero Section: Best & Most Reliable Positioning ───────────── */}
      <section className="bg-[#090D16] text-white pt-14 pb-20 px-4 sm:px-6 relative overflow-hidden border-b border-slate-800">
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF5500]/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Award Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#FF5500]/15 border border-[#FF5500]/30 text-[#FF5500] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
          >
            <Award size={14} /> Delhi NCR's Best & Most Reliable Superbike Services
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Best, Premium & Reliable <br />
            <span className="bg-gradient-to-r from-[#FF5500] via-[#FFA149] to-[#D97706] bg-clip-text text-transparent">
              Superbike Services in Delhi
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed"
          >
            From dyno-certified technical inspections and lightning-fast Delhi RTO RC transfers to bespoke
            financing and enclosed Pan-India transport, experience the pinnacle of reliability.
          </motion.p>

          {/* 4 Trust Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
          >
            {[
              { val: '4.9 ★', lbl: 'Top Rated on Google' },
              { val: '120-Point', lbl: 'Dyno Track Inspection' },
              { val: '100% Legal', lbl: 'Guaranteed RC Transfer' },
              { val: 'Pan-India', lbl: 'Enclosed VIP Transport' },
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center shadow-lg hover:border-[#FF5500]/30 transition-all"
              >
                <div className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {metric.val}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  {metric.lbl}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. The 8 Signature Services (Deep-Dive Cards) ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200">
            Precision Solutions
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] mt-3"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Explore Our Premium Services
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered specifically for high-performance superbikes, sports machines, and discerning collectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {PREMIUM_SERVICES.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl ${s.bgIcon} flex items-center justify-center ${s.iconColor} shadow-inner`}>
                    <s.icon size={26} />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {s.title}
                </h3>
                <p className="text-xs font-bold text-[#FF5500] uppercase tracking-wider mb-3">
                  {s.tagline}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {s.desc}
                </p>

                {/* 4 Feature Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 mb-6">
                  {s.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="tel:+919811798761"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0F172A] hover:text-[#FF5500] transition-colors group"
                >
                  Book Service Consultation <ArrowRight size={14} className="text-[#FF5500] group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Why We Are Voted Delhi's Most Reliable & Best ────────────── */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              The Saraswati Edge
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black text-[#0F172A] mt-3"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Why We Are Voted Delhi's Most Reliable Studio
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              See how our transparent, verified standards compare to typical local dealers and unverified brokers.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
            <div className="grid grid-cols-12 bg-slate-900 text-white p-4 sm:p-5 text-xs font-extrabold uppercase tracking-wider">
              <div className="col-span-5 sm:col-span-4">Service Feature</div>
              <div className="col-span-4 sm:col-span-4 text-[#FF5500] flex items-center gap-1.5">
                <Sparkles size={14} /> Saraswati Superbikes
              </div>
              <div className="col-span-3 sm:col-span-4 text-slate-400">Typical Local Brokers</div>
            </div>

            <div className="divide-y divide-slate-100">
              {COMPARISON_ROWS.map((row, i) => (
                <div key={i} className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center hover:bg-slate-50/80 transition-colors">
                  <div className="col-span-5 sm:col-span-4 font-bold text-[#0F172A]">
                    {row.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-4 font-semibold text-emerald-700 flex items-start gap-1.5 pr-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{row.saraswati}</span>
                  </div>
                  <div className="col-span-3 sm:col-span-4 text-slate-500 flex items-start gap-1.5">
                    <ShieldAlert size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{row.localDealers}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Frequently Asked Questions (FAQ) ─────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full">
            Transparent Answers
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black text-[#0F172A] mt-3"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Best & Reliable Services FAQ
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Get clear, honest information about inspection, transfer timelines, and our service guarantees.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-[#0F172A] text-sm sm:text-base cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-[#FF5500] flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#FF5500]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. VIP Service Concierge Callout ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#1E293B] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-slate-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5500]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 bg-[#FF5500] text-white text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
                <PhoneCall size={14} /> VIP Concierge Hotline
              </span>
              <h2
                className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Experience Delhi's Most Reliable Superbike Service
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Connect directly with our senior technicians and RTO specialists. We provide free doorstep estimates,
                dyno consultations, and pan-India transport arrangements.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a
                href="tel:+919811798761"
                className="flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-extrabold text-sm px-8 py-4 rounded-xl shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02]"
              >
                Call Hotline: +91 98117 98761
              </a>
              <a
                href="https://wa.me/919811798761?text=Hi!%20I%20would%20like%20to%20inquire%20about%20your%20premium%20superbike%20services."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-4 rounded-xl border border-white/20 transition-all"
              >
                Chat on WhatsApp VIP Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
