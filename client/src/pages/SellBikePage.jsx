import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  CheckCircle,
  Phone,
  User,
  Bike,
  ShieldCheck,
  Banknote,
  FileText,
  ArrowRight,
  Sparkles,
  Repeat,
  MapPin,
} from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const inputCls = 'w-full bg-white border border-[#E5E4E0] text-[#1C1C1E] placeholder-[#9C9A97] px-4 py-3 rounded-xl focus:outline-none focus:border-[#F97316] transition-colors text-sm shadow-sm';
const labelCls = 'text-[#1C1C1E] text-xs font-semibold mb-1.5 block';

export default function SellBikePage() {
  const [form, setForm] = useState({
    name: '', phone: '', brand: '', model: '',
    year: new Date().getFullYear(), kilometers: '',
    askingPrice: '', description: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const sellSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Sell Your Superbike in Delhi | Instant Valuation & Spot Payout',
    description: 'Sell your pre-owned superbike or sports bike to Delhi NCR’s best and most reliable motorcycle dealer. Instant transparent valuation, spot same-day payment & guaranteed RC transfer in Karol Bagh.',
    url: 'https://saraswatimotors.in/sell',
    mainEntity: {
      '@type': 'Service',
      name: 'Pre-Owned Superbike Buyout & Trade-In Service',
      serviceType: 'Motorcycle Valuation & Spot Purchase',
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
    },
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.brand || !form.model) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await api.post('/sell-requests', fd);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-[#1C1C1E] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Request Submitted!
          </h2>
          <p className="text-[#6B6965] leading-relaxed mb-8">
            We've received your bike details. Our team will review it and contact you at <span className="font-semibold text-[#1C1C1E]">{form.phone}</span> within 24 hours.
          </p>
          <div className="bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl p-5 text-left mb-8">
            <p className="text-[#F97316] font-bold text-sm mb-2">What happens next?</p>
            <ul className="text-[#6B6965] text-sm space-y-1.5">
              <li>• Our team reviews your submission</li>
              <li>• We call you to discuss the price</li>
              <li>• Bike inspection at our showroom</li>
              <li>• Same-day payment on agreement</li>
            </ul>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[#F97316] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#EA6C10] transition-all"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <SEO
        title="Best Place to Sell Your Superbike in Delhi | Reliable Valuation & Instant Payout"
        description="Sell your superbike or sports bike to Delhi's best and most reliable motorcycle dealer. Instant transparent valuation, spot same-day payment & guaranteed RC transfer in Karol Bagh."
        keywords="best place to sell superbike delhi, reliable bike buyers delhi, sell superbike for highest price, instant payment bike valuation, sell sports bike karol bagh, best used bike valuation delhi, sell used kawasaki ducati bmw"
        canonicalUrl="https://saraswatimotors.in/sell"
        schemaJson={sellSchema}
      />
      {/* Header */}
      <div className="bg-[#111118] pt-10 pb-20 px-4 sm:px-6 mb-[-4rem]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">Delhi NCR Spot Buyout</span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Sell Your Superbike in Delhi <br />
              <span className="text-[#F97316]">Instant Valuation & Spot Payout</span>
            </h1>
            <p className="text-white/70 max-w-xl text-sm sm:text-base leading-relaxed">
              Get an honest market valuation with 0% brokerage. Instant IMPS bank transfer and 100% legal Delhi RTO RC transfer guarantee.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-[#E5E4E0] rounded-3xl shadow-xl shadow-black/5 overflow-hidden"
        >
          {/* Process steps */}
          <div className="bg-gradient-to-r from-[#F97316]/10 to-orange-50 border-b border-[#E5E4E0] px-8 py-5">
            <div className="flex gap-6 justify-center text-center">
              {[
                { n: '1', label: 'Fill Details' },
                { n: '2', label: 'We Review' },
                { n: '3', label: 'Get Paid' },
              ].map(s => (
                <div key={s.n} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#F97316] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                    {s.n}
                  </div>
                  <span className="text-sm font-semibold text-[#1C1C1E]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="text-[#1C1C1E] font-black text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <User size={18} className="text-[#F97316]" /> Your Contact Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input className={inputCls} required placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Phone Number *</label>
                  <input className={inputCls} required type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
            </div>

            <hr className="border-[#F4F3F0]" />

            {/* Bike Info */}
            <div>
              <h3 className="text-[#1C1C1E] font-black text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <Bike size={18} className="text-[#F97316]" /> Bike Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Brand *</label>
                  <input className={inputCls} required placeholder="e.g. Yamaha, KTM, Royal Enfield" value={form.brand} onChange={e => set('brand', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Model *</label>
                  <input className={inputCls} required placeholder="e.g. R15 V4, Duke 390" value={form.model} onChange={e => set('model', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Year *</label>
                  <input className={inputCls} required type="number" min="1990" max={new Date().getFullYear()} value={form.year} onChange={e => set('year', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>KM Driven</label>
                  <input className={inputCls} type="number" placeholder="e.g. 15000" value={form.kilometers} onChange={e => set('kilometers', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Your Asking Price (₹) — optional</label>
                  <input className={inputCls} type="number" placeholder="e.g. 85000" value={form.askingPrice} onChange={e => set('askingPrice', e.target.value)} />
                </div>
              </div>
            </div>

            <hr className="border-[#F4F3F0]" />

            {/* Description */}
            <div>
              <label className={labelCls}>Bike Condition / Notes</label>
              <textarea
                className={inputCls + ' resize-none'}
                rows={3}
                placeholder="Any modifications, scratches, issues or highlights..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className={labelCls}>Upload a Photo of Your Bike</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E4E0] rounded-2xl p-6 cursor-pointer hover:border-[#F97316]/50 hover:bg-orange-50/30 transition-all group">
                {preview ? (
                  <div className="relative w-full">
                    <img src={preview} alt="Preview" className="w-full max-h-56 object-cover rounded-xl" />
                    <div className="mt-3 text-center text-xs text-[#9C9A97]">Click to change photo</div>
                  </div>
                ) : (
                  <>
                    <Upload size={28} className="text-[#D4D3CF] group-hover:text-[#F97316]/60 mb-3 transition-colors" />
                    <p className="text-[#9C9A97] text-sm text-center">Click to upload a photo<br /><span className="text-xs">JPG, PNG up to 5MB</span></p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F97316] hover:bg-[#EA6C10] disabled:opacity-60 text-white font-black text-lg py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5"
            >
              {loading ? 'Submitting...' : 'Submit My Bike 🏍️'}
            </button>

            <p className="text-center text-xs text-[#9C9A97]">
              By submitting, you agree to be contacted by Saraswati Motors regarding your bike.
            </p>
          </form>
        </motion.div>

        {/* Quick contact strip */}
        <div className="mt-8 bg-white border border-[#E5E4E0] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-[#1C1C1E]">Prefer to speak directly with an appraiser?</p>
            <p className="text-[#6B6965] text-sm">Showroom specialists available Mon–Sat, 11:30 AM – 8:30 PM</p>
          </div>
          <a
            href="tel:+919811798761"
            className="flex items-center gap-2 bg-[#1C1C1E] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#333] transition-colors whitespace-nowrap"
          >
            <Phone size={16} /> +91 98117 98761
          </a>
        </div>

        {/* ── Why Sell Your Superbike to Us ── */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <span className="text-[#F97316] text-xs font-bold uppercase tracking-widest block mb-2">Dealership Guarantee</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1E]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Why Sell to Saraswati Superbikes?
            </h2>
            <p className="text-[#6B6965] text-sm max-w-lg mx-auto mt-2">
              Avoid casual test-riders, scam brokers, and endless price bargaining. Sell directly to Delhi NCR’s premier superbike gallery.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 text-[#F97316]">
                <Banknote size={24} />
              </div>
              <h3 className="font-bold text-[#1C1C1E] text-base mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Instant Spot IMPS / RTGS Payout
              </h3>
              <p className="text-[#6B6965] text-xs sm:text-sm leading-relaxed">
                Once the 60-point inspection is concluded and terms are agreed upon, 100% of the funds are transferred directly into your bank account before you hand over keys.
              </p>
            </div>

            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-[#1C1C1E] text-base mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                100% Guaranteed RTO Ownership Transfer
              </h3>
              <p className="text-[#6B6965] text-xs sm:text-sm leading-relaxed">
                We handle official Delhi RTO Form 29, Form 30, and outstation NOC paperwork. You receive an official legal handover undertaking indemnifying you from future liabilities.
              </p>
            </div>

            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-[#1C1C1E] text-base mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Doorstep Inspection in Delhi NCR
              </h3>
              <p className="text-[#6B6965] text-xs sm:text-sm leading-relaxed">
                Can't ride to Karol Bagh? Our certified superbike technicians can visit your residence across Delhi, Gurgaon, Noida, or Faridabad for an on-site physical evaluation.
              </p>
            </div>

            <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-[#1C1C1E] text-base mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Zero Brokerage or Listing Fees
              </h3>
              <p className="text-[#6B6965] text-xs sm:text-sm leading-relaxed">
                Unlike online portals or third-party intermediaries, we buy directly from you into our showroom inventory. Zero hidden fees, zero commission deductions.
              </p>
            </div>
          </div>
        </div>

        {/* ── Documents Required Section ── */}
        <div className="mt-12 bg-white border border-[#E5E4E0] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316]">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1C1C1E]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Documents Required to Sell a Superbike in Delhi
              </h3>
              <p className="text-[#6B6965] text-xs">Ensure you have the following ready for rapid same-day closure</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#1C1C1E]">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#F97316] mt-2 flex-shrink-0" />
              <div>
                <strong>Original Registration Certificate (RC)</strong>
                <p className="text-[#6B6965] text-xs mt-0.5">Physical smart card or paper book issued by the RTO.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#F97316] mt-2 flex-shrink-0" />
              <div>
                <strong>Active Insurance Policy</strong>
                <p className="text-[#6B6965] text-xs mt-0.5">Valid comprehensive or third-party motorcycle cover.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#F97316] mt-2 flex-shrink-0" />
              <div>
                <strong>Government ID & PAN Card</strong>
                <p className="text-[#6B6965] text-xs mt-0.5">Aadhaar Card, Passport, or Voter ID matching the RC.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#F97316] mt-2 flex-shrink-0" />
              <div>
                <strong>Loan NOC / Hypothecation Form 35 (if financed)</strong>
                <p className="text-[#6B6965] text-xs mt-0.5">Bank closure letter if the loan has been repaid.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Trade-In Upgrade Banner & Internal Links ── */}
        <div className="mt-12 bg-gradient-to-r from-[#111118] to-[#1A1A24] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[#F97316] text-xs font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
              <Repeat size={14} /> Trade-In & Upgrade
            </span>
            <h3 className="text-xl sm:text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Want to Trade Up to a 1000cc+ Machine?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md">
              Apply your current motorcycle's valuation directly towards any Ducati, BMW, Kawasaki, or Yamaha from our verified fleet.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/inventory"
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20"
            >
              Browse Fleet <ArrowRight size={14} />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider border border-white/10"
            >
              VIP Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
