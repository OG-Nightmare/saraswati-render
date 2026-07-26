import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Fuel, Calendar, Gauge, ArrowRight, Zap, MapPin } from 'lucide-react';

const CATEGORY_COLORS = {
  superbike: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' },
  city: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500' },
};

const SUBCATEGORY_ICONS = {
  cruiser: '🛣️',
  sports: '🏁',
  tourer: '🗺️',
  adventure: '⛰️',
  naked: '⚡',
  scooter: '🛵',
  commuter: '🏙️',
};

export default function VehicleCard({ vehicle, index = 0 }) {
  const firstImg = vehicle.images?.[0];
  const img = (firstImg && typeof firstImg === 'object' ? firstImg.url : firstImg) || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80';
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(vehicle.price);
  const catStyle = CATEGORY_COLORS[vehicle.category] || CATEGORY_COLORS.city;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="group bg-white rounded-2xl border border-[#E5E4E0] overflow-hidden hover:border-[#F97316]/40 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-64 sm:h-80 md:h-96 lg:h-[380px]">
        <img
          src={img}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading={index < 4 ? 'eager' : 'lazy'}
          fetchPriority={index < 2 ? 'high' : 'auto'}
          decoding="async"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        {vehicle.category && (
          <span className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border} backdrop-blur-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
            {vehicle.category === 'superbike' ? 'Superbike' : 'City Bike'}
          </span>
        )}

        {/* Featured badge */}
        {vehicle.featured && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#F97316] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            <Zap size={10} fill="white" />
            Featured
          </span>
        )}

        {/* Status overlay (Sold, Reserved, Booked, etc.) */}
        {vehicle.status && vehicle.status !== 'available' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className={`text-white font-black text-2xl rotate-[-20deg] border-4 px-4 py-1.5 rounded tracking-wider uppercase ${
              vehicle.status === 'sold'
                ? 'border-red-500 text-red-500 bg-red-950/25'
                : vehicle.status === 'reserved'
                ? 'border-yellow-500 text-yellow-500 bg-yellow-950/25'
                : 'border-orange-500 text-orange-500 bg-orange-950/25'
            }`}>
              {vehicle.status}
            </span>
          </div>
        )}

        {/* Price pill at bottom */}
        <div className="absolute bottom-3 left-3 bg-white text-[#1C1C1E] text-sm font-black px-3 py-1 rounded-xl shadow-md">
          {formattedPrice}
        </div>

        {/* Subcategory icon */}
        {vehicle.subcategory && (
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-lg w-9 h-9 rounded-xl flex items-center justify-center">
            {SUBCATEGORY_ICONS[vehicle.subcategory] || '🏍️'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-[#1C1C1E] font-bold text-base mb-1 group-hover:text-[#F97316] transition-colors line-clamp-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {vehicle.title}
        </h3>

        {/* Subcategory tag */}
        {vehicle.subcategory && (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-[#9C9A97] bg-[#F4F3F0] px-2 py-0.5 rounded-md mb-3 capitalize">
            {vehicle.subcategory}
          </span>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#6B6965] mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={11} className="text-[#F97316]" />
            {vehicle.year}
          </span>
          <span className="flex items-center gap-1">
            <Gauge size={11} className="text-[#F97316]" />
            {vehicle.kilometers?.toLocaleString()} km
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={11} className="text-[#F97316]" />
            {vehicle.fuelType}
          </span>
          {vehicle.registrationState && (
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-[#F97316]" />
              {vehicle.registrationState}
            </span>
          )}
        </div>

        <Link
          to={`/inventory/${vehicle._id}`}
          className="flex items-center justify-between w-full py-2.5 px-4 bg-[#F4F3F0] text-[#1C1C1E] rounded-xl text-sm font-semibold hover:bg-[#F97316] hover:text-white transition-all duration-200 group/btn"
        >
          View Details
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
