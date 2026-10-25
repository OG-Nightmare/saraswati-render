import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

export default function ContactPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    vehicleInterested: params.get('vehicle') || '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent! We\'ll contact you shortly.');
    } catch {
      toast.error('Failed to send. Please try calling us directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Saraswati Superbikes Karol Bagh Delhi',
    description: 'Visit Delhi NCR’s premier superbike showroom at T-2531 Faiz Road, Karol Bagh. Contact us for test rides, dyno inspection & pre-owned luxury motorcycle sales.',
    url: 'https://saraswatimotors.in/contact',
    mainEntity: {
      '@type': 'MotorcycleDealer',
      name: 'Saraswati Superbikes',
      url: 'https://saraswatimotors.in/',
      image: 'https://saraswatimotors.in/s_logo_metallic.png',
      telephone: '+919811798761',
      priceRange: '₹₹₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'T-2531, Faiz Road',
        addressLocality: 'Karol Bagh',
        addressRegion: 'New Delhi',
        postalCode: '110005',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 28.6507,
        longitude: 77.1983,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '11:30',
          closes: '20:30',
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-16">
      <SEO
        title="Best & Most Reliable Superbike Showroom Near Me | Contact Saraswati Superbikes Delhi"
        description="Visit Delhi NCR’s best and most reliable superbike showroom at T-2531 Faiz Road, Karol Bagh. Call +91 98117 98761 for premium test rides, instant valuation & verified pre-owned bikes."
        keywords="best bike showroom near me, superbike showroom near me, reliable bike dealer karol bagh, contact saraswati superbikes, test ride superbike delhi, most reliable bike showroom delhi, pre owned bike dealer faiz road"
        canonicalUrl="https://saraswatimotors.in/contact"
        schemaJson={contactSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#1C1C1E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Contact Saraswati Superbikes <span className="text-[#F97316]">Delhi</span>
          </h1>
          <p className="text-[#6B6965] max-w-lg mx-auto">
            Have a question about our inventory? Want to schedule a private test ride or sell your machine? We're here to assist.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center shadow-sm">
                <CheckCircle size={60} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-green-800 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Message Sent!</h3>
                <p className="text-green-700">We'll get back to you within 1-2 hours during working hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-[#F97316] hover:underline text-sm font-semibold">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#E5E4E0] rounded-2xl p-8 space-y-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#1C1C1E] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Send Us a Message</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#6B6965] text-sm mb-1.5 block font-medium">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name"
                      className="w-full bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-[#6B6965] text-sm mb-1.5 block font-medium">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-[#6B6965] text-sm mb-1.5 block font-medium">Email Address</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="email@example.com"
                    className="w-full bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors text-sm" />
                </div>
                <div>
                  <label className="text-[#6B6965] text-sm mb-1.5 block font-medium">Bike Interested In</label>
                  <input name="vehicleInterested" value={form.vehicleInterested} onChange={handleChange} placeholder="e.g., Yamaha MT-15 V2"
                    className="w-full bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors text-sm" />
                </div>
                <div>
                  <label className="text-[#6B6965] text-sm mb-1.5 block font-medium">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="Tell us what you're looking for..."
                    className="w-full bg-[#F4F3F0] border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors resize-none text-sm" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-100">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info + Map */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 space-y-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#F97316]" />
                </div>
                <div>
                  <p className="text-[#1C1C1E] font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Showroom Address</p>
                  <p className="text-[#6B6965] text-sm">1735/55, Pocket 29, Naiwala,<br />Karol Bagh, New Delhi – 110005</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-[#F97316]" />
                </div>
                <div>
                  <p className="text-[#1C1C1E] font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Phone / WhatsApp</p>
                  <a href="tel:+919811798761" className="text-[#6B6965] text-sm hover:text-[#1C1C1E] font-medium">+91 98117 98761</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-[#F97316]" />
                </div>
                <div>
                  <p className="text-[#1C1C1E] font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Showroom Hours</p>
                  <p className="text-[#6B6965] text-sm">Mon–Sat: 11:30 AM – 8:30 PM<br />Sun: By Appointment</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <a href="tel:+919811798761"
                className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-100 text-sm">
                <Phone size={16} /> Call Now
              </a>
              <a href="https://wa.me/919811798761" target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-green-100 text-sm">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-[#E5E4E0] h-56 shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=T-2531+Faiz+Road+Karol+Bagh+New+Delhi+110005&output=embed"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                title="Saraswati Superbikes Karol Bagh Showroom Location"
              />
            </div>
          </motion.div>
        </div>

        {/* Contextual Internal Navigation Links */}
        <div className="mt-14 pt-8 border-t border-[#E5E4E0] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="text-[#6B6965]">
            Looking for something specific?
          </div>
          <div className="flex flex-wrap gap-4 font-bold">
            <Link to="/inventory" className="text-[#1C1C1E] hover:text-[#F97316] transition-colors flex items-center gap-1">
              Browse Pre-Owned Superbikes <ArrowRight size={13} />
            </Link>
            <Link to="/services" className="text-[#1C1C1E] hover:text-[#F97316] transition-colors flex items-center gap-1">
              Superbike Dyno & RC Transfer Services <ArrowRight size={13} />
            </Link>
            <Link to="/sell" className="text-[#1C1C1E] hover:text-[#F97316] transition-colors flex items-center gap-1">
              Sell or Trade-In Your Bike <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
