import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Calendar, Gauge, Fuel, Settings, Users, Shield, MapPin, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../lib/api';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then(r => setVehicle(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full" />
    </div>
  );

  if (!vehicle) return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-[#1C1C1E] mb-4">Vehicle not found</h2>
      <Link to="/inventory" className="text-[#F97316] hover:underline">← Back to Inventory</Link>
    </div>
  );

  const rawImages = vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'];
  const images = rawImages.map(img => img && typeof img === 'object' ? img.url : img);
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(vehicle.price);
  const waMsg = encodeURIComponent(`Hi! I'm interested in the ${vehicle.title} (₹${vehicle.price.toLocaleString()}) listed on Saraswati Motors.`);

  const specs = [
    { icon: Calendar, label: 'Year', value: vehicle.year },
    { icon: Gauge, label: 'KM Driven', value: `${vehicle.kilometers?.toLocaleString()} km` },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
    { icon: Users, label: 'Ownership', value: `${vehicle.ownership} Owner` },
    { icon: MapPin, label: 'Reg. State', value: vehicle.registrationState },
    { icon: Shield, label: 'Insurance', value: vehicle.insuranceStatus },
  ];

  const vehicleSchema = vehicle ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${vehicle.year} ${vehicle.title}`,
    description: vehicle.description || `Pre-owned ${vehicle.title} in Delhi Karol Bagh. ${vehicle.kilometers?.toLocaleString()} km, ${vehicle.ownership} owner, dyno tested with verified RC transfer.`,
    image: images[0],
    brand: {
      '@type': 'Brand',
      name: vehicle.brand || 'Superbike'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: vehicle.price,
      availability: vehicle.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      seller: {
        '@type': 'MotorcycleDealer',
        name: 'Saraswati Superbikes',
        telephone: '+919811798761'
      }
    }
  } : null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24">
      {vehicle && (
        <SEO
          title={`${vehicle.year} ${vehicle.title} For Sale in Delhi | Saraswati Superbikes`}
          description={`Verified pre-owned ${vehicle.year} ${vehicle.title} in Delhi NCR. ${vehicle.kilometers?.toLocaleString()} km, ${vehicle.ownership} owner, dyno-tested with clear legal papers & Karol Bagh showroom delivery.`}
          keywords={`${vehicle.brand} second hand delhi, ${vehicle.title} used delhi, second hand bikes, superbikes, sports bikes, racing bikes`}
          canonicalUrl={`https://saraswatimotors.in/inventory/${id}`}
          ogImage={images[0]}
          schemaJson={vehicleSchema}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Breadcrumb */}
        <Link to="/inventory" className="inline-flex items-center gap-2 text-[#6B6965] hover:text-[#1C1C1E] mb-6 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Inventory
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left — Gallery + Info */}
          <div>
            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E5E4E0] mb-4 cursor-pointer shadow-md group h-80 md:h-[480px]" onClick={() => setModalOpen(true)}>
              {/* Image Transition wrapper */}
              <motion.img
                key={imgIdx}
                src={images[imgIdx]}
                alt={vehicle.title}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full h-full object-cover"
              />

              {/* Gradient edge overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 pointer-events-none" />

              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1C1C1E] hover:bg-[#F97316] hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 z-10">
                    <ChevronLeft size={22} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1C1C1E] hover:bg-[#F97316] hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 z-10">
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Floating indicators */}
              <div className="absolute top-4 left-4 bg-[#1C1C1E]/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full shadow-md z-10">
                Premium Verified
              </div>

              <div className="absolute bottom-4 right-4 bg-[#1c1c1e]/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md z-10">
                📷 {imgIdx + 1} / {images.length} · Click to zoom
              </div>
            </div>

            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 px-1 scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-22 h-16 rounded-xl overflow-hidden border-2 transition-all relative ${
                      i === imgIdx
                        ? 'border-[#F97316] scale-105 shadow-md shadow-orange-100'
                        : 'border-[#E5E4E0] opacity-70 hover:opacity-100 hover:border-[#F97316]/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="mt-8 bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm">
                <h3 className="text-[#1C1C1E] font-bold text-lg mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>About This Vehicle</h3>
                <p className="text-[#6B6965] leading-relaxed text-sm">{vehicle.description}</p>
              </div>
            )}

            {/* Features */}
            {vehicle.features?.length > 0 && (
              <div className="mt-5 bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm">
                <h3 className="text-[#1C1C1E] font-bold text-lg mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Features & Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map(f => (
                    <span key={f} className="bg-[#F4F3F0] border border-[#E5E4E0] text-[#6B6965] text-sm px-3 py-1.5 rounded-xl font-medium">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Notes */}
            {vehicle.sellerNotes && (
              <div className="mt-5 bg-[#F97316]/5 border border-[#F97316]/20 rounded-2xl p-6">
                <h3 className="text-[#F97316] font-bold mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>📝 Seller Notes</h3>
                <p className="text-[#6B6965] text-sm leading-relaxed">{vehicle.sellerNotes}</p>
              </div>
            )}
          </div>

          {/* Right — Sticky Sidebar */}
          <div className="lg:sticky lg:top-28 h-fit space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${vehicle.category === 'superbike' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                  {vehicle.category === 'superbike' ? '🏍 Superbike' : '🏙️ City Bike'}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 font-semibold">✓ Verified</span>
                {vehicle.status && vehicle.status !== 'available' && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-extrabold uppercase border ${
                    vehicle.status === 'sold'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : vehicle.status === 'reserved'
                      ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                      : 'bg-orange-50 text-orange-600 border-orange-200'
                  }`}>
                    {vehicle.status}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-[#1C1C1E] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{vehicle.title}</h1>
              <div className="text-3xl font-black text-[#F97316] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>{formattedPrice}</div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {specs.map(spec => (
                  <div key={spec.label} className="bg-[#F4F3F0] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#6B6965] text-xs mb-1">
                      <spec.icon size={11} className="text-[#F97316]" />
                      {spec.label}
                    </div>
                    <div className="text-[#1C1C1E] text-sm font-semibold">{spec.value}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href="tel:+919811798761"
                  className="flex items-center justify-center gap-2 w-full bg-[#F97316] hover:bg-[#EA6C10] text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-100 hover:shadow-orange-200 hover:-translate-y-0.5"
                >
                  <Phone size={18} />
                  Call Dealer
                </a>
                <a
                  href={`https://wa.me/919811798761?text=${waMsg}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-green-100 hover:shadow-green-200 hover:-translate-y-0.5"
                >
                  <MessageCircle size={18} />
                  WhatsApp Inquiry
                </a>
                <Link
                  to={`/contact?vehicle=${encodeURIComponent(vehicle.title)}`}
                  className="flex items-center justify-center gap-2 w-full border border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white font-bold py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  Book Test Ride
                </Link>
              </div>
            </motion.div>

            {/* Dealership Info */}
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-5 shadow-sm">
              <h4 className="text-[#1C1C1E] font-bold mb-3 flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>🏪 Saraswati Motors</h4>
              <p className="text-[#6B6965] text-xs leading-relaxed mb-3">
                1735/55, Pocket 29, Naiwala,<br />Karol Bagh, New Delhi – 110005
              </p>
              <p className="text-[#9C9A97] text-xs font-medium">Mon–Sat: 9AM–7PM | Sun: 10AM–4PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#111118]/95 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <img src={images[imgIdx]} alt={vehicle.title} className="max-w-full max-h-full object-contain rounded-xl" onClick={e => e.stopPropagation()} />
          <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-white text-2xl font-bold w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">✕</button>
        </div>
      )}
    </div>
  );
}
