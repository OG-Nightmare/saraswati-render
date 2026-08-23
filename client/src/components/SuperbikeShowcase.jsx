import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, ArrowRight, Gauge, Activity, Flame, Cpu, Award } from 'lucide-react';
import { HERO_SUPERBIKES, vehicleToHeroBike } from './PhotoShuffleHero';
import api from '../lib/api';

export default function SuperbikeShowcase() {
  const [bikes, setBikes] = useState(HERO_SUPERBIKES);
  const [selectedId, setSelectedId] = useState(HERO_SUPERBIKES[0].id);

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
          const mapped = list.map(vehicleToHeroBike);
          setBikes(mapped);
          setSelectedId(mapped[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const bike = bikes.find((b) => b.id === selectedId) || bikes[0];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Subtle Grid & Lighting */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5500] mb-2">
              <Flame size={16} /> Interactive Telemetry & Spec Studio
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Pure Engineering. <span className="text-gradient-orange">Unmatched Performance.</span>
            </h2>
          </div>
          <p className="text-sm text-[#64748B] max-w-md">
            Compare track-tested specs, power-to-weight ratios, and acceleration metrics of our pre-owned flagship superbikes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
          {bikes.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#0F172A] text-white shadow-lg shadow-slate-900/20 scale-[1.02]'
                    : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.brand} {item.model}
              </button>
            );
          })}
        </div>

        {/* Spotlight Display Box */}
        <div className="bg-[#FAF5F0] rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
          
          {/* Left Spec Bars */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                {bike.tag}
              </span>
              <h3 className="text-3xl font-black text-[#0F172A] mt-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {bike.brand} {bike.model}
              </h3>
              <p className="text-xs text-[#64748B] mt-1 font-medium">{bike.subtitle}</p>
            </div>

            {/* Spec Meters */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#0F172A] mb-1">
                  <span>Horsepower Output</span>
                  <span className="text-[#FF5500] font-mono">{bike.power}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    key={bike.id + '-hp'}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (parseInt(bike.power) / 320) * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#0F172A] mb-1">
                  <span>0 - 100 km/h Acceleration</span>
                  <span className="text-[#D97706] font-mono">{bike.acceleration}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    key={bike.id + '-acc'}
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#0F172A] mb-1">
                  <span>Top Speed Benchmark</span>
                  <span className="text-emerald-600 font-mono">{bike.topSpeed}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    key={bike.id + '-ts'}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (parseInt(bike.topSpeed) / 350) * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] flex items-center gap-2.5">
                <Cpu className="text-[#FF5500]" size={18} />
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Engine Config</span>
                  <span className="text-xs font-extrabold text-[#0F172A]">{bike.specs.engine}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] flex items-center gap-2.5">
                <Activity className="text-[#D97706]" size={18} />
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Max Torque</span>
                  <span className="text-xs font-extrabold text-[#0F172A]">{bike.specs.torque}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/inventory"
                className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md"
              >
                Inquire Model <ArrowRight size={14} />
              </Link>
              <span className="text-sm font-bold text-[#FF5500]" style={{ fontFamily: 'Space Grotesk, monospace' }}>
                Est. Price: {bike.price}
              </span>
            </div>
          </div>

          {/* Right Image Showcase Card */}
          <div className="lg:col-span-7 relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-xl border-2 border-white group">
            <AnimatePresence mode="wait">
              <motion.img
                key={bike.id}
                src={bike.image}
                alt={bike.model}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full font-semibold border border-white/20">
                <ShieldCheck size={14} className="text-emerald-400" /> Saraswati 120-Point Track Verified
              </span>
              <span className="bg-[#FF5500] font-bold px-3 py-1.5 rounded-full shadow-md">
                Karol Bagh Showroom
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
