import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, Phone, User, Bike } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

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
      {/* Header */}
      <div className="bg-[#111118] pt-10 pb-20 px-4 sm:px-6 mb-[-4rem]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">Sell Your Bike</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
              We'll Buy Your Bike
            </h1>
            <p className="text-white/50 max-w-lg">
              Get the best price for your bike. Fill in the details below and we'll contact you within 24 hours with a fair offer.
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
            <p className="font-bold text-[#1C1C1E]">Prefer to call directly?</p>
            <p className="text-[#6B6965] text-sm">Our team is available Mon–Sat, 10am–7pm</p>
          </div>
          <a
            href="tel:+919811798761"
            className="flex items-center gap-2 bg-[#1C1C1E] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#333] transition-colors whitespace-nowrap"
          >
            <Phone size={16} /> +91 98117 98761
          </a>
        </div>
      </div>
    </div>
  );
}
