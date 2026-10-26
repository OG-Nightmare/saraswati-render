import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Compass,
  FileCheck2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Flame,
  CheckCircle,
  Sparkles,
  MapPin,
  Search,
} from 'lucide-react';

const BUYING_STEPS = [
  {
    step: '01',
    title: 'Explore Verified Inventory',
    subtitle: 'Sports Bikes, Racing Bikes & Superbikes',
    desc: 'Browse our curated collection of verified second hand bikes and superbikes online, or visit our flagship gallery in Karol Bagh, New Delhi. Filter by brand, cc category, and price.',
    icon: Compass,
    color: 'from-orange-500 to-amber-500',
  },
  {
    step: '02',
    title: 'Showroom & Dyno Inspection',
    subtitle: '120-Point Multi-Diagnostic Check',
    desc: 'Every motorcycle undergoes compression diagnostics, chassis alignment verification, genuine ECU scan, and past service history audit so you ride away with 100% confidence.',
    icon: ShieldCheck,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    step: '03',
    title: 'Transparent Paperwork & RTO',
    subtitle: 'Delhi RTO Transfer & All-India NOC',
    desc: 'We handle complete Delhi RC transfer, hypothecation NOC clearance, valid comprehensive insurance, and inter-state NOCs for buyers across India without any administrative headache.',
    icon: FileCheck2,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    step: '04',
    title: 'Pan-India Delivery or Ride Away',
    subtitle: 'Enclosed GPS-Tracked Container Delivery',
    desc: 'Ride out directly from our Karol Bagh showroom or receive your superbike at your doorstep in any Indian city via dedicated, climate-controlled hydraulic bike haulers.',
    icon: Truck,
    color: 'from-purple-500 to-pink-500',
  },
];

const POPULAR_SEARCH_HUBS = [
  { label: 'Cheap Superbikes in Delhi', link: '/inventory?maxPrice=500000' },
  { label: 'Second Hand Bikes Delhi', link: '/inventory?search=second+hand' },
  { label: 'Affordable Sports Bikes Delhi', link: '/inventory?subcategory=sports' },
  { label: 'Pre-Owned Superbikes (1000cc+)', link: '/inventory?category=superbike' },
  { label: 'Track & Racing Bikes', link: '/inventory?subcategory=sports' },
  { label: 'Middleweight Sports Bikes', link: '/inventory?subcategory=naked' },
  { label: 'Kawasaki Ninja ZX-10R & Z900', link: '/inventory?brand=Kawasaki' },
  { label: 'BMW S1000RR & M1000RR', link: '/inventory?brand=BMW' },
  { label: 'Ducati Panigale & Monster', link: '/inventory?brand=Ducati' },
  { label: 'Suzuki Hayabusa GSX-1300R', link: '/inventory?brand=Suzuki' },
  { label: 'Yamaha YZF-R1 & MT-09', link: '/inventory?brand=Yamaha' },
  { label: 'Aprilia RSV4 & RS660', link: '/inventory?brand=Aprilia' },
  { label: 'Budget Superbikes Under 5 Lakhs', link: '/inventory?maxPrice=500000' },
  { label: 'Karol Bagh Faiz Road Showroom', link: '/contact' },
];

const FAQS = [
  {
    q: 'Where can I find cheap superbikes in Delhi?',
    a: 'You can find verified affordable and cheap superbikes in Delhi at Saraswati Superbikes in Karol Bagh (Faiz Road). We maintain a rotating inventory of budget-friendly pre-owned superbikes and sports bikes (ranging from Kawasaki Ninja 300/400/650 and KTM RC 390 to accessible liter-class machines under ₹5 to ₹8 Lakhs), complete with 120-point dyno diagnostics and low-cost EMI finance plans.',
  },
  {
    q: 'How to get a bike in Delhi from Saraswati Superbikes?',
    a: 'Getting your dream bike in Delhi is simple and transparent: 1. Explore our live digital inventory or walk into our Karol Bagh showroom at T-2531 Faiz Road. 2. Inspect the bike and review its 120-point mechanical and dyno diagnostic report. 3. Finalize payment via instant bank transfer, debit/credit card, or superbike finance EMI. 4. Our team handles complete Delhi RTO RC transfer or generates an outstation NOC with doorstep enclosed transport pan-India.',
  },
  {
    q: 'Why should I buy a second hand superbike or sports bike from Saraswati Superbikes?',
    a: 'Unlike unverified peer-to-peer marketplaces, Saraswati Superbikes is Delhi’s most trusted superbike gallery. Every bike in our fleet is accident-free certified, non-tampered odometer guaranteed, dyno-tested, and backed by authentic service documentation and 100% legal title clearance.',
  },
  {
    q: 'What sports bikes and racing bikes are currently popular in Delhi NCR?',
    a: 'Riders in Delhi and NCR frequently seek top-tier racing bikes such as the BMW S1000RR, Ducati Panigale V4/V2, Kawasaki Ninja ZX-10R, Yamaha YZF-R1, and Suzuki Hayabusa. For daily street riding and weekend twisties, the Kawasaki Z900, Triumph Street Triple RS, and Ducati Monster are best-sellers.',
  },
  {
    q: 'What documents are required to buy a pre-owned bike in Delhi?',
    a: 'You only need valid Government Identification (Aadhaar Card, Passport, or Voter ID), PAN Card, local or permanent address proof, and passport-size photographs. Our showroom concierge manages all Form 29, Form 30, and Delhi RTO submission paperwork on your behalf.',
  },
  {
    q: 'How does RC transfer and RTO NOC work for outstation buyers outside Delhi?',
    a: 'If you reside outside Delhi (e.g. Mumbai, Bangalore, Hyderabad, Chandigarh, or Jaipur), we obtain an official No Objection Certificate (NOC) from the Delhi RTO in your name. We then transport the motorcycle to your city in an enclosed hydraulic container along with original paperwork so you can easily register it at your local RTO.',
  },
  {
    q: 'Can I sell or exchange my existing motorcycle for an upgrade?',
    a: 'Yes! We offer a VIP Superbike Exchange & Buyback Program. Bring your current bike (sports bike, cruiser, or commuter) to our Karol Bagh showroom or submit an online valuation form on our Sell page for an instant, competitive quote and immediate trade-in credit.',
  },
];

export default function DelhiBikeSEOSection() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="py-24 bg-[#0B0F19] text-white relative overflow-hidden border-t border-slate-800">
      {/* Decorative Glow Background */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Heading Block ──────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Delhi NCR Rider's Authority
          </div>
          <h2
            className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            How to Get a Bike in Delhi <br />
            <span className="bg-gradient-to-r from-[#FF5500] via-[#FFA149] to-[#D97706] bg-clip-text text-transparent">
              Second Hand Bikes, Superbikes & Sports Machines
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
            Whether you are searching for verified cheap superbikes in Delhi, an affordable pre-owned sports bike, a track-ready racing machine,
            or an exotic hyperbike, Saraswati Superbikes in Karol Bagh provides the safest, most budget-friendly, and transparent
            buying experience in India.
          </p>
        </div>

        {/* ── 4-Step How-To Roadmap ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {BUYING_STEPS.map((s, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative hover:border-[#FF5500]/40 transition-all hover:-translate-y-1 group shadow-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-black text-slate-700 group-hover:text-[#FF5500] transition-colors font-mono">
                  {s.step}
                </span>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-md`}>
                  <s.icon size={22} />
                </div>
              </div>
              <h3 className="text-lg font-black text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {s.title}
              </h3>
              <p className="text-xs font-bold text-[#FF5500] uppercase tracking-wider mb-3">
                {s.subtitle}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Popular Search Keyword Hubs ─────────────────────────────────── */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 sm:p-10 mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Search size={20} className="text-[#FF5500]" />
                Explore Popular Superbike & Bike Searches
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Quick-access verified listings for second hand sports bikes, racing superbikes, and Karol Bagh showroom inventory.
              </p>
            </div>
            <Link
              to="/inventory"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5500] hover:text-orange-400"
            >
              View Full Gallery <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {POPULAR_SEARCH_HUBS.map((hub, idx) => (
              <Link
                key={idx}
                to={hub.link}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-[#FF5500] text-slate-300 hover:text-white border border-slate-700/80 hover:border-[#FF5500] text-xs font-semibold transition-all shadow-xs hover:shadow-orange-500/20"
              >
                {hub.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Delhi Superbike & Used Bike Buyer FAQ Accordion ────────────── */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF5500] bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full">
              Frequently Asked Questions
            </span>
            <h3
              className="text-2xl sm:text-4xl font-black text-white mt-3"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Delhi Second Hand Bike & Superbike FAQ
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Everything you need to know about buying, checking, and registering pre-owned bikes in Delhi NCR.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-colors hover:border-slate-700"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base cursor-pointer"
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
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Location & Contact Callout */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500] flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-white font-extrabold text-sm">Visit Saraswati Superbikes Showroom</p>
                <p className="text-slate-400 text-xs">T-2531, Faiz Road, Karol Bagh, New Delhi 110005 • Mon–Sat 11:30 AM – 8:30 PM</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-black text-xs px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 flex-shrink-0 uppercase tracking-wider"
            >
              Get Directions <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
