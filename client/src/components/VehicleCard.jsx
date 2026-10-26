import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Fuel, Calendar, Gauge, ArrowRight, Zap, MapPin, ShieldCheck, Flame } from 'lucide-react';
import { optimizeImageUrl } from '../lib/imageOptimizer';

function VehicleCardComponent({ vehicle, index = 0 }) {
  const firstImg = vehicle.images?.[0];
  const rawImg = (firstImg && typeof firstImg === 'object' ? firstImg.url : firstImg) || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80';
  const img = optimizeImageUrl(rawImg, 700);
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(vehicle.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      className="group bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden hover:border-[#FF5500]/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-60 sm:h-72 w-full bg-[#0F172A]">
        <img
          src={img}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
        />

        {/* Dynamic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Category & Status Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
            {vehicle.category === 'superbike' ? 'Track Verified Superbike' : 'Verified Ride'}
          </span>
          {vehicle.featured && (
            <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md">
              <Zap size={11} fill="white" /> Featured
            </span>
          )}
        </div>

        {/* Status Overlay (Sold, Booked) */}
        {vehicle.status && vehicle.status !== 'available' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="text-white font-black text-xl tracking-widest uppercase border-4 border-red-500 text-red-500 bg-red-950/40 px-4 py-1.5 rounded-xl rotate-[-12deg]">
              {vehicle.status}
            </span>
          </div>
        )}


        {/* Floating Price Tag */}
        <div className="absolute bottom-3 left-3 bg-[#FF5500] text-white text-sm font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {formattedPrice}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            <span>{vehicle.brand || 'Luxury Deal'}</span>
            <span className="text-[#FF5500] flex items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
          </div>

          <h3 className="text-[#0F172A] font-extrabold text-lg group-hover:text-[#FF5500] transition-colors line-clamp-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {vehicle.title}
          </h3>
        </div>

        {/* Specs Pill Grid */}
        <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl text-center text-xs">
          <div>
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Year</span>
            <span className="font-extrabold text-[#0F172A]">{vehicle.year}</span>
          </div>
          <div className="border-x border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">KM Run</span>
            <span className="font-extrabold text-[#0F172A]">{vehicle.kilometers ? `${(vehicle.kilometers / 1000).toFixed(1)}k` : 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Engine</span>
            <span className="font-extrabold text-[#0F172A] truncate block">{vehicle.displacement || vehicle.fuelType || 'Petrol'}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/inventory/${vehicle._id}`}
          className="flex items-center justify-between w-full py-3 px-4 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#FF5500] transition-all duration-300 shadow-md group/btn"
        >
          <span>Explore Superbike</span>
          <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

const VehicleCard = memo(VehicleCardComponent);
export default VehicleCard;

