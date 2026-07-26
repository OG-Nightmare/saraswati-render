import { motion } from 'framer-motion';

const services = [
  { emoji: '🛒', title: 'Bike Buying', desc: 'Find the perfect pre-owned bike. We guide you through the entire purchase process with full transparency.' },
  { emoji: '💰', title: 'Bike Selling', desc: 'Get the best value for your current bike. Quick evaluation, fair pricing, instant payment.' },
  { emoji: '🔄', title: 'Exchange Offers', desc: 'Exchange your old bike for a newer one with the best deals and hassle-free processing.' },
  { emoji: '💳', title: 'Finance Assistance', desc: 'Easy EMI options with our financial partners. Low interest rates and quick approvals.' },
  { emoji: '📋', title: 'RC Transfer', desc: 'We handle all the paperwork for RC transfer to ensure a smooth and legal ownership change.' },
  { emoji: '🛡️', title: 'Insurance Renewal', desc: 'Get your bike insurance renewed at the best rates through our trusted insurance partners.' },
  { emoji: '🔍', title: 'Bike Inspection', desc: 'Thorough 50-point inspection report. Know exactly what you\'re buying before you commit.' },
  { emoji: '🛣️', title: 'Roadside Guidance', desc: 'Post-purchase support for any bike-related queries. We\'re always a call away.' },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-[#F97316] text-sm font-bold uppercase tracking-widest mb-3 block">What We Offer</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#1C1C1E] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Our Services</h1>
          <p className="text-[#6B6965] max-w-xl mx-auto">
            Everything you need for a seamless bike buying or selling experience — all under one roof.
          </p>
        </motion.div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white border border-[#E5E4E0] rounded-2xl p-7 hover:border-[#F97316]/50 hover:shadow-xl hover:shadow-orange-100 transition-all group cursor-default shadow-sm"
            >
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform inline-block">{s.emoji}</div>
              <h3 className="text-[#1C1C1E] font-bold text-lg mb-3 group-hover:text-[#F97316] transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.title}</h3>
              <p className="text-[#6B6965] text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-[#F97316] rounded-3xl p-12 text-center relative overflow-hidden"
        >
          {/* Background pattern decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white" />
            <div className="absolute -left-10 -bottom-20 w-60 h-60 rounded-full bg-white" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Need Any of These Services?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">Contact us today and our team of bike specialists will assist you immediately.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+919811798761" className="bg-white text-[#F97316] font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                📞 Call Now
              </a>
              <a href="https://wa.me/919811798761" target="_blank" rel="noreferrer"
                className="bg-white/10 border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
