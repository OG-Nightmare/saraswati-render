import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Share2, Rss, Video, ArrowUp, Flame, ShieldCheck } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/inventory', label: 'Superbike Inventory' },
  { to: '/inventory?category=superbike', label: '1000cc+ Hyperbikes' },
  { to: '/services', label: 'VIP Services & Transport' },
  { to: '/about', label: 'Showroom Heritage' },
  { to: '/contact', label: 'Book Test Ride' },
];

const superbikeBrands = [
  { label: 'Ducati Panigale & Monster' },
  { label: 'BMW S1000RR & M1000RR' },
  { label: 'Kawasaki Ninja H2 & Z900' },
  { label: 'Yamaha YZF-R1M & MT-09' },
  { label: 'Aprilia RSV4 & Tuono' },
  { label: 'MV Agusta Superveloce' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-300">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#FF5500] to-[#D97706] rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <span className="text-white text-xl font-black" style={{ fontFamily: 'Syne, sans-serif' }}>S</span>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <span className="text-white">SARASWATI</span>
                  <span className="text-[#FF5500]">SUPERBIKES</span>
                </span>
                <div className="text-[10px] text-[#FF5500] font-extrabold tracking-widest uppercase -mt-1">
                  Premier Pre-Owned Superbike Gallery
                </div>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Delhi's landmark destination for verified pre-owned luxury superbikes and hyperbikes. Every machine dyno-inspected, legally clear, and delivered pan-India.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#FF5500] mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-xs leading-relaxed">
                  T-2531 , Faiz Road,<br />
                  Karol Bagh , New Delhi 110005
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#FF5500] flex-shrink-0" />
                <a href="tel:+919811798761" className="text-slate-300 text-xs hover:text-[#FF5500] font-bold transition-colors">
                  +91 98117 98761
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#FF5500] flex-shrink-0" />
                <a href="mailto:info@saraswatimotors.in" className="text-slate-300 text-xs hover:text-[#FF5500] transition-colors">
                  info@saraswatimotors.in
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-white font-extrabold mb-5 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Flame size={14} className="text-[#FF5500]" /> Showroom
            </h4>
            <ul className="space-y-3 text-xs">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Flagship Brands */}
          <div>
            <h4 className="text-white font-extrabold mb-5 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#D97706]" /> Featured Marques
            </h4>
            <ul className="space-y-3 text-xs">
              {superbikeBrands.map((b, idx) => (
                <li key={idx} className="text-slate-400">
                  {b.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Hours & Guarantee */}
          <div>
            <h4 className="text-white font-extrabold mb-5 text-xs uppercase tracking-widest">
              Gallery Hours
            </h4>
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Mon – Sat:</span>
                <span className="font-bold text-white">11:30 AM – 8:30 PM</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Sun:</span>
                <span className="font-bold text-[#FF5500]">By Appointment</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center">
              <span className="text-[11px] font-bold text-[#FF5500] block uppercase tracking-wider">
                Pan-India Enclosed Transport
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-slate-800 bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} Saraswati Superbikes. All rights reserved. • Karol Bagh, New Delhi</span>
            <span>•</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-[#FF5500] transition-colors font-medium">
              Admin Portal
            </Link>
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-[#FF5500] transition-colors group font-bold"
          >
            Back to top
            <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform text-[#FF5500]" />
          </button>
        </div>

      </div>
    </footer>
  );
}
